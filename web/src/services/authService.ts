import { api, saveSession, unwrapApiData } from "@/services/api";
import type { ApiEnvelope, ChurchLead, Member } from "@/types";

type LoginResponse = {
  token: string;
  member: Member & {
    churchId?: string | null;
  };
};

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    saveSession(data.token, data.member.churchId, data.member);
    return data;
  },

  async me() {
    const { data } = await api.get<ApiEnvelope<Member> | Member>("/auth/me");
    return unwrapApiData(data);
  },

  async registerChurch(payload: ChurchLead) {
    const { data } = await api.post("/churches", payload);
    return data as { success?: boolean; message?: string; data?: unknown };
  },
};
