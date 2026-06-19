import { api, unwrapApiData } from "@/services/api";
import type { ApiEnvelope, DashboardSummary, Transaction } from "@/types";

type BackendSummary = {
  totalMembers?: number;
  totalEntradas?: number;
  totalSaidas?: number;
  saldo?: number;
  totalDizimos?: number;
  totalOfertas?: number;
  latestTransactions?: Transaction[];
};

function normalizeSummary(summary: BackendSummary): DashboardSummary {
  return {
    totalMembers: summary.totalMembers ?? 0,
    activeVolunteers: 0,
    upcomingEvents: 0,
    monthlyIncome: summary.totalEntradas ?? 0,
    pendingExpenses: summary.totalSaidas ?? 0,
    monthlyBirthdays: 0,
    source: "api",
  };
}

export const dashboardService = {
  async summary() {
    try {
      const { data } = await api.get<
        ApiEnvelope<BackendSummary> | BackendSummary
      >("/reports/summary");
      return normalizeSummary(unwrapApiData(data));
    } catch {
      console.error("Erro ao buscar resumo do dashboard da API");
      return normalizeSummary({});
    }
  },

  async rawSummary() {
    try {
      const { data } = await api.get<
        ApiEnvelope<BackendSummary> | BackendSummary
      >("/reports/summary");
      return unwrapApiData(data);
    } catch {
      return null;
    }
  },

  async composeFromFallbacks() {
    return {
      summary: normalizeSummary({}),
      members: [],
      events: [],
      transactions: [],
    };
  },
};
