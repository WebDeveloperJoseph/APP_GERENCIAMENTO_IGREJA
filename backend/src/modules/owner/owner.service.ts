import { prisma } from "../../database";

class OwnerService {
  async dashboard() {
    const [churchesCount, membersCount, transactionsAggregate, recentChurches] =
      await Promise.all([
        prisma.church.count(),
        prisma.member.count(),
        prisma.transaction.aggregate({
          _sum: {
            value: true,
          },
        }),
        prisma.church.findMany({
          orderBy: {
            createdAt: "desc",
          },
          take: 8,
          include: {
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

    return {
      activeChurches: churchesCount,
      trialChurches: 0,
      mrr: 0,
      monthlyRevenue: transactionsAggregate._sum.value ?? 0,
      churn: 0,
      openTickets: 0,
      membersCount,
      recentChurches,
    };
  }

  async churches() {
    return prisma.church.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
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
    });
  }
}

export { OwnerService };
