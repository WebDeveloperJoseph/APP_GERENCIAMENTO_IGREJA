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
    const { data } = await api.post<ApiEnvelope<LoginResponse> | LoginResponse>("/auth/login", {
      email,
      password,
    });
    const session = unwrapApiData(data);

    saveSession(session.token, session.member.churchId, session.member);
    return session;
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
