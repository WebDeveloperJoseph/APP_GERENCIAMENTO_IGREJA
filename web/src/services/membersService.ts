import { api, unwrapApiData } from "@/services/api";
import type { ApiEnvelope, Member, ServiceResult } from "@/types";

async function fetchMembers(): Promise<Member[]> {
  const { data } = await api.get<ApiEnvelope<Member[]> | Member[]>("/members");
  return unwrapApiData(data);
}

export const membersService = {
  async list() {
    const result = await this.listWithSource();
    return result.data;
  },

  async listWithSource(): Promise<ServiceResult<Member[]>> {
    try {
      return {
        data: await fetchMembers(),
        source: "api",
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha ao buscar membros.";
      console.error("Erro ao buscar membros da API:", error);
      return {
        data: [],
        source: "api",
        error: message,
      };
    }
  },

  async create(payload: Partial<Member> & { password?: string }) {
    const { data } = await api.post<ApiEnvelope<Member> | Member>(
      "/members",
      payload,
    );
    return unwrapApiData(data);
  },

  async update(id: string, payload: Partial<Member>) {
    const { data } = await api.put<ApiEnvelope<Member> | Member>(
      `/members/${id}`,
      payload,
    );
    return unwrapApiData(data);
  },

  async remove(id: string) {
    await api.delete(`/members/${id}`);
  },
};
