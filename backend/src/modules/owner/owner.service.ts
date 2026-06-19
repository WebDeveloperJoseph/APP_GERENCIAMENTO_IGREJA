import { prisma } from "../../database";

class OwnerService {
  async dashboard() {
    const [churchesCount, trialChurches, membersCount, activeSubscriptions, recentChurches] =
      await Promise.all([
        prisma.church.count(),
        prisma.subscription.count({ where: { status: "TRIALING" } }),
        prisma.member.count(),
        prisma.subscription.findMany({
          where: { status: "ACTIVE" },
          select: { plan: { select: { priceCents: true } } },
        }),
        prisma.church.findMany({
          orderBy: {
            createdAt: "desc",
          },
          take: 8,
          include: {
            subscription: { include: { plan: true } },
            _count: {
              select: {
                members: true,
                events: true,
                transactions: true,
              },
            },
          },
        }),
      ]);

    const mrrCents = activeSubscriptions.reduce(
      (total, item) => total + item.plan.priceCents,
      0,
    );

    return {
      activeChurches: churchesCount,
      trialChurches,
      mrr: mrrCents / 100,
      monthlyRevenue: mrrCents / 100,
      churn: 0,
      openTickets: 0,
      membersCount,
      recentChurches: recentChurches.map((church) => this.mapChurch(church)),
    };
  }

  async churches() {
    return prisma.church.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        subscription: { include: { plan: true } },
        _count: {
          select: {
            members: true,
            events: true,
            transactions: true,
          },
        },
        members: {
          where: {
            role: "ADMIN",
          },
          select: {
            id: true,
            name: true,
            email: true,
          },
          take: 1,
        },
      },
    }).then((churches) => churches.map((church) => this.mapChurch(church)));
  }

  async subscriptions() {
    const subscriptions = await prisma.subscription.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        church: { select: { id: true, name: true, slug: true } },
        plan: true,
      },
    });

    const summary = subscriptions.reduce(
      (acc, subscription) => {
        acc.total += 1;
        acc[subscription.status] += 1;
        if (subscription.status === "ACTIVE") {
          acc.mrrCents += subscription.plan.priceCents;
        }
        return acc;
      },
      { total: 0, TRIALING: 0, ACTIVE: 0, PAST_DUE: 0, PAUSED: 0, CANCELED: 0, mrrCents: 0 },
    );

    return { summary: { ...summary, mrr: summary.mrrCents / 100 }, subscriptions };
  }

  async members() {
    return prisma.member.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isSuperAdmin: true,
        isActive: true,
        churchId: true,
        createdAt: true,
      },
      take: 100,
    });
  }

  async transactions() {
    return prisma.transaction.findMany({
      orderBy: { date: "desc" },
      take: 200,
      include: {
        member: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async createChurch(payload: any) {
    const { churchName, email, phone, city, state, responsibleName, password } =
      payload;

    // Reuse existing ChurchesService logic where possible
    const { ChurchesService } = require("../churches/churches.service");
    const service = new ChurchesService();

    return service.create({
      churchName,
      email,
      phone,
      city,
      state,
      responsibleName,
      password,
    });
  }

  private mapChurch(church: any) {
    const statusMap: Record<string, string> = {
      TRIALING: "Em teste",
      ACTIVE: "Ativa",
      PAST_DUE: "Atrasada",
      PAUSED: "Pausada",
      CANCELED: "Cancelada",
    };
    const admin = church.members?.[0];

    return {
      id: church.id,
      name: church.name,
      slug: church.slug,
      city: church.city ?? "Não informado",
      state: church.state,
      admin: admin?.name ?? "Sem administrador",
      adminEmail: admin?.email ?? null,
      plan: church.subscription?.plan?.name ?? "Sem plano",
      status: statusMap[church.subscription?.status] ?? "Sem assinatura",
      renewalDate:
        church.subscription?.currentPeriodEnd ?? church.subscription?.trialEndsAt ?? null,
      counts: church._count,
      createdAt: church.createdAt,
    };
  }
}

export { OwnerService };
