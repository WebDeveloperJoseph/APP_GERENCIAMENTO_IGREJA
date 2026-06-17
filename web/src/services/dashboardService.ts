import {
  mockDashboardSummary,
  mockEvents,
  mockMembers,
  mockTransactions,
} from "@/data/mockData";
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
    totalMembers: summary.totalMembers ?? mockDashboardSummary.totalMembers,
    activeVolunteers: mockDashboardSummary.activeVolunteers,
    upcomingEvents: mockDashboardSummary.upcomingEvents,
    monthlyIncome: summary.totalEntradas ?? mockDashboardSummary.monthlyIncome,
    pendingExpenses: summary.totalSaidas ?? mockDashboardSummary.pendingExpenses,
    monthlyBirthdays: mockDashboardSummary.monthlyBirthdays,
    source: "api",
  };
}

export const dashboardService = {
  async summary() {
    try {
      const { data } = await api.get<ApiEnvelope<BackendSummary> | BackendSummary>(
        "/reports/summary",
      );
      return normalizeSummary(unwrapApiData(data));
    } catch {
      return mockDashboardSummary;
    }
  },

  async rawSummary() {
    try {
      const { data } = await api.get<ApiEnvelope<BackendSummary> | BackendSummary>(
        "/reports/summary",
      );
      return unwrapApiData(data);
    } catch {
      return null;
    }
  },

  async composeFromFallbacks() {
    return {
      summary: mockDashboardSummary,
      members: mockMembers,
      events: mockEvents,
      transactions: mockTransactions,
    };
  },
};
