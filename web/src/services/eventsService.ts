import { api, unwrapApiData } from "@/services/api";
import type { ApiEnvelope, EventItem, ServiceResult } from "@/types";

async function fetchEvents(): Promise<EventItem[]> {
  const { data } = await api.get<ApiEnvelope<EventItem[]> | EventItem[]>(
    "/events",
  );
  return unwrapApiData(data);
}

export const eventsService = {
  async list() {
    const result = await this.listWithSource();
    return result.data;
  },

  async listWithSource(): Promise<ServiceResult<EventItem[]>> {
    try {
      return {
        data: await fetchEvents(),
        source: "api",
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha ao buscar eventos.";
      console.error("Erro ao buscar eventos da API:", error);
      return {
        data: [],
        source: "api",
        error: message,
      };
    }
  },

  async create(payload: Partial<EventItem>) {
    const { data } = await api.post<ApiEnvelope<EventItem> | EventItem>(
      "/events",
      payload,
    );
    return unwrapApiData(data);
  },
};
