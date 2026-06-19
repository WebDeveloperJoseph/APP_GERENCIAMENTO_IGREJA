import { prisma } from "../../database";
import { AppError } from "../../errors/AppError";

type AsaasEntity = Record<string, unknown> & { id?: string; externalReference?: string | null };
type AsaasEvent = {
  id?: string;
  event?: string;
  payment?: AsaasEntity;
  subscription?: AsaasEntity;
  checkout?: AsaasEntity;
  [key: string]: unknown;
};

function parseDate(value: unknown) {
  if (typeof value !== "string" || !value) return null;
  const date = new Date(value.length === 10 ? `${value}T12:00:00.000Z` : value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function invoiceStatus(event: string) {
  if (event === "PAYMENT_CONFIRMED") return "CONFIRMED" as const;
  if (event === "PAYMENT_RECEIVED") return "RECEIVED" as const;
  if (event === "PAYMENT_OVERDUE") return "OVERDUE" as const;
  if (event.includes("REFUND")) return "REFUNDED" as const;
  if (event === "PAYMENT_DELETED" || event === "PAYMENT_BANK_SLIP_CANCELLED") return "CANCELED" as const;
  return "PENDING" as const;
}

export class AsaasWebhookService {
  async receive(payload: AsaasEvent) {
    if (!payload.id || !payload.event) throw new AppError("Evento Asaas inválido.", 400);

    let billingEvent = await prisma.billingEvent.findUnique({
      where: { gateway_externalId: { gateway: "ASAAS", externalId: payload.id } },
    });
    if (billingEvent?.status === "PROCESSED") return { duplicate: true };
    if (!billingEvent) {
      billingEvent = await prisma.billingEvent.upsert({
        where: { gateway_externalId: { gateway: "ASAAS", externalId: payload.id } },
        update: {},
        create: { gateway: "ASAAS", externalId: payload.id, type: payload.event, payload: payload as any },
      });
      if (billingEvent.status === "PROCESSED") return { duplicate: true };
    }

    try {
      await this.process(payload);
      await prisma.billingEvent.update({
        where: { id: billingEvent.id },
        data: { status: "PROCESSED", processedAt: new Date(), attempts: { increment: 1 }, lastError: null },
      });
      return { duplicate: false };
    } catch (error) {
      await prisma.billingEvent.update({
        where: { id: billingEvent.id },
        data: {
          status: "FAILED",
          attempts: { increment: 1 },
          lastError: error instanceof Error ? error.message.slice(0, 1000) : "Erro desconhecido",
        },
      });
      throw error;
    }
  }

  private async process(payload: AsaasEvent) {
    const event = payload.event!;
    const entity = payload.subscription ?? payload.payment ?? payload.checkout;
    if (!entity) return;

    const externalSubscriptionId =
      payload.subscription?.id ??
      (typeof payload.payment?.subscription === "string" ? payload.payment.subscription : undefined);
    const reference = entity.externalReference;
    const [localSubscriptionId, planId] = typeof reference === "string" ? reference.split(":") : [];

    const subscription = localSubscriptionId
      ? await prisma.subscription.findUnique({ where: { id: localSubscriptionId } })
      : externalSubscriptionId
        ? await prisma.subscription.findFirst({ where: { externalSubscriptionId } })
        : null;
    if (!subscription) return;

    const subscriptionData: Record<string, unknown> = {};
    if (externalSubscriptionId) subscriptionData.externalSubscriptionId = externalSubscriptionId;
    if (typeof entity.customer === "string") subscriptionData.externalCustomerId = entity.customer;
    const nextDueDate = parseDate(entity.nextDueDate);
    if (nextDueDate) subscriptionData.currentPeriodEnd = nextDueDate;
    if (planId) {
      const plan = await prisma.plan.findUnique({ where: { id: planId }, select: { id: true } });
      if (plan) subscriptionData.planId = plan.id;
    }
    if (event === "SUBSCRIPTION_INACTIVATED" || event === "SUBSCRIPTION_DELETED") {
      subscriptionData.status = "CANCELED";
    } else if (event === "SUBSCRIPTION_CREATED" || event === "SUBSCRIPTION_UPDATED") {
      subscriptionData.status = entity.status === "INACTIVE" ? "CANCELED" : "ACTIVE";
    } else if (event === "PAYMENT_CONFIRMED" || event === "PAYMENT_RECEIVED") {
      subscriptionData.status = "ACTIVE";
    } else if (event === "PAYMENT_OVERDUE") {
      subscriptionData.status = "PAST_DUE";
    }
    if (Object.keys(subscriptionData).length) {
      await prisma.subscription.update({ where: { id: subscription.id }, data: subscriptionData });
    }

    if (payload.payment?.id) {
      const value = typeof payload.payment.value === "number" ? payload.payment.value : 0;
      await prisma.invoice.upsert({
        where: { gateway_externalId: { gateway: "ASAAS", externalId: payload.payment.id } },
        update: {
          status: invoiceStatus(event),
          paidAt: event === "PAYMENT_CONFIRMED" || event === "PAYMENT_RECEIVED" ? new Date() : undefined,
          invoiceUrl: typeof payload.payment.invoiceUrl === "string" ? payload.payment.invoiceUrl : undefined,
        },
        create: {
          subscriptionId: subscription.id,
          gateway: "ASAAS",
          externalId: payload.payment.id,
          status: invoiceStatus(event),
          valueCents: Math.round(value * 100),
          billingType: typeof payload.payment.billingType === "string" ? payload.payment.billingType : null,
          dueDate: parseDate(payload.payment.dueDate),
          paidAt: event === "PAYMENT_CONFIRMED" || event === "PAYMENT_RECEIVED" ? new Date() : null,
          invoiceUrl: typeof payload.payment.invoiceUrl === "string" ? payload.payment.invoiceUrl : null,
        },
      });
    }
  }
}
