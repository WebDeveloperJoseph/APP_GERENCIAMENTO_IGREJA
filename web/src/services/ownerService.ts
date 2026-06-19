import { api, unwrapApiData } from "@/services/api";
import type { OwnerChurch, OwnerSubscriptionsResult, ServiceResult, ApiEnvelope } from "@/types";

async function fetchOwnerChurches(): Promise<OwnerChurch[]> {
  const { data } = await api.get<ApiEnvelope<OwnerChurch[]> | OwnerChurch[]>(
    "/owner/churches",
  );
  return unwrapApiData(data);
}

async function fetchOwnerDashboard() {
  const { data } = await api.get("/owner/dashboard");
  return unwrapApiData(data);
}

async function fetchOwnerMembers() {
  const { data } = await api.get("/owner/members");
  return unwrapApiData(data);
}

async function fetchOwnerTransactions() {
  const { data } = await api.get("/owner/transactions");
  return unwrapApiData(data);
}

async function createOwnerChurch(payload: Partial<Record<string, unknown>>) {
  const { data } = await api.post("/owner/churches", payload);
  return unwrapApiData(data);
}

export const ownerService = {
  async dashboard() {
    return fetchOwnerDashboard();
  },
  async members() {
    return fetchOwnerMembers();
  },
  async transactions() {
    return fetchOwnerTransactions();
  },
  async subscriptions() {
    const { data } = await api.get<ApiEnvelope<OwnerSubscriptionsResult> | OwnerSubscriptionsResult>(
      "/owner/subscriptions",
    );
    return unwrapApiData(data);
  },
  async create(payload: Partial<Record<string, unknown>>) {
    return createOwnerChurch(payload);
  },
  async list() {
    const result = await this.listWithSource();
    return result.data;
  },

  async listWithSource(): Promise<ServiceResult<OwnerChurch[]>> {
    try {
      return {
        data: await fetchOwnerChurches(),
        source: "api",
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Falha ao buscar igrejas do owner.";
      console.error("Erro ao buscar owner churches:", error);
      return {
        data: [],
        source: "api",
        error: message,
      };
    }
  },
};
