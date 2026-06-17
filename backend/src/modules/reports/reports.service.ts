import { prisma } from "../../database";
import { AppError } from "../../errors/AppError";

interface SummaryFiltersDTO {
  churchId: string; // 🔑 Obrigatório para garantir o isolamento Multi-tenant
  month?: number;
  year?: number;
}

class ReportsService {
  async summary({ churchId, month, year }: SummaryFiltersDTO) {
    if (month && (month < 1 || month > 12)) {
      throw new AppError("Mês inválido. Use um valor entre 1 e 12.", 400);
    }

    if (year && year < 2000) {
      throw new AppError("Ano inválido.", 400);
    }

    const currentDate = new Date();

    const selectedMonth = month ?? currentDate.getMonth() + 1;
    const selectedYear = year ?? currentDate.getFullYear();

    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 1);

    // 🔑 Filtro base de data combinado com o Tenant da igreja
    const transactionDateFilter = {
      churchId,
      date: {
        gte: startDate,
        lt: endDate,
      },
    };

    // 🔑 Contagem isolada de membros daquela igreja específica
    const totalMembers = await prisma.member.count({
      where: { churchId },
    });

    const totalEntradasResult = await prisma.transaction.aggregate({
      where: {
        churchId,
        type: "ENTRADA",
      },
      _sum: {
        value: true,
      },
    });

    const totalSaidasResult = await prisma.transaction.aggregate({
      where: {
        churchId,
        type: "SAIDA",
      },
      _sum: {
        value: true,
      },
    });

    const totalDizimosResult = await prisma.transaction.aggregate({
      where: {
        churchId,
        category: "DIZIMO",
      },
      _sum: {
        value: true,
      },
    });

    const totalOfertasResult = await prisma.transaction.aggregate({
      where: {
        churchId,
        category: "OFERTA",
      },
      _sum: {
        value: true,
      },
    });

    const latestTransactions = await prisma.transaction.findMany({
      where: {
        ...transactionDateFilter,
      },
      orderBy: {
        date: "desc",
      },
      take: 5,
      include: {
        member: true,
      },
    });

    const totalEntradas = totalEntradasResult._sum.value ?? 0;
    const totalSaidas = totalSaidasResult._sum.value ?? 0;
    const totalDizimos = totalDizimosResult._sum.value ?? 0;
    const totalOfertas = totalOfertasResult._sum.value ?? 0;

    const saldo = totalEntradas - totalSaidas;

    return {
      period: {
        month: selectedMonth,
        year: selectedYear,
        startDate,
        endDate,
      },
      totalMembers,
      totalEntradas,
      totalSaidas,
      saldo,
      totalDizimos,
      totalOfertas,
      latestTransactions,
    };
  }
}

export { ReportsService };
