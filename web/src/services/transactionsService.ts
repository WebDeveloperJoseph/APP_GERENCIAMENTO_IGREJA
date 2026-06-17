import { mockTransactions } from "@/data/mockData";
import { api, unwrapApiData } from "@/services/api";
import type { ApiEnvelope, ServiceResult, Transaction } from "@/types";

async function fetchTransactions(): Promise<Transaction[]> {
  const { data } = await api.get<ApiEnvelope<Transaction[]> | Transaction[]>(
    "/transactions",
  );
  return unwrapApiData(data);
}

export const transactionsService = {
  async list() {
    const result = await this.listWithSource();
    return result.data;
  },

  async listWithSource(): Promise<ServiceResult<Transaction[]>> {
    try {
      return {
        data: await fetchTransactions(),
        source: "api",
      };
    } catch (error) {
      return {
        data: mockTransactions,
        source: "mock",
        error:
          error instanceof Error
            ? error.message
            : "Falha ao buscar movimentacoes.",
      };
    }
  },

  async create(payload: Partial<Transaction>) {
    const { data } = await api.post<ApiEnvelope<Transaction> | Transaction>(
      "/transactions",
      payload,
    );
    return unwrapApiData(data);
  },
};
