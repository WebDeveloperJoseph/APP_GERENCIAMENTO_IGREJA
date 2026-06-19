import { prisma } from "../../database";
import { AppError } from "../../errors/AppError";
import { AsaasGateway } from "./asaas.gateway";

function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export class BillingService {
  async overview(churchId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { churchId },
      include: { plan: true, invoices: { orderBy: { createdAt: "desc" }, take: 20 } },
    });
    const plans = await prisma.plan.findMany({ where: { isActive: true }, orderBy: { priceCents: "asc" } });
    return { subscription, plans, gatewayConfigured: Boolean(process.env.ASAAS_API_KEY) };
  }

  async createCheckout(churchId: string, planId: string) {
    if (!planId) throw new AppError("Selecione um plano.", 400);

    const [subscription, plan, admin] = await Promise.all([
      prisma.subscription.findUnique({ where: { churchId } }),
      prisma.plan.findFirst({ where: { id: planId, isActive: true } }),
      prisma.member.findFirst({
        where: { churchId, role: "ADMIN", isActive: true },
        select: { name: true, email: true, phone: true },
      }),
    ]);
    if (!subscription) throw new AppError("Assinatura da igreja não encontrada.", 404);
    if (!plan) throw new AppError("Plano não encontrado ou inativo.", 404);

    const nextDueDate =
      subscription.status === "TRIALING" && subscription.trialEndsAt && subscription.trialEndsAt > new Date()
        ? subscription.trialEndsAt
        : new Date(Date.now() + 24 * 60 * 60 * 1000);
    const externalReference = `${subscription.id}:${plan.id}`;
    const checkout = await new AsaasGateway().createRecurringCheckout({
      externalReference,
      planName: plan.name,
      description: plan.description,
      priceCents: plan.priceCents,
      cycle: plan.billingInterval,
      nextDueDate: toDateOnly(nextDueDate),
      customer: admin
        ? { name: admin.name, email: admin.email ?? undefined, phone: admin.phone ?? undefined }
        : undefined,
    });

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { gateway: "ASAAS" },
    });
    return checkout;
  }
}
