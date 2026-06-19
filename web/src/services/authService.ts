import { api, clearSession, saveSession, unwrapApiData } from "@/services/api";
import type { ApiEnvelope, ChurchLead, Member } from "@/types";

type LoginTokenResponse = {
  token: string;
  member: Member & {
    churchId?: string | null;
  };
};

type LoginCookieResponse = {
  member: Member & {
    churchId?: string | null;
  };
  csrfToken?: string;
};

export const authService = {
  async login(email: string, password: string) {
    try {
      const { data } = await api.post<
        | ApiEnvelope<LoginTokenResponse | LoginCookieResponse>
        | LoginTokenResponse
        | LoginCookieResponse
      >("/auth/login", {
        email,
        password,
      });

      const session = unwrapApiData(data);

      // If backend returns token, persist it; otherwise rely on cookie-based auth and persist user only
      if (session && "token" in session && session.token) {
        saveSession(session.token, session.member?.churchId, session.member);
      } else if (session && "member" in session && session.member) {
        // cookie-based auth: token is HttpOnly, so store only user info locally
        saveSession(null, session.member.churchId, session.member);
      }

      return session;
    } catch (err) {
      // Detect common CORS/credentials misconfiguration
      const message = err instanceof Error ? err.message : String(err);
      if (
        message.includes("Failed to fetch") ||
        message.includes("Network Error")
      ) {
        throw new Error(
          "Erro de rede/CORS. Verifique se o backend permite requests do frontend e as configurações de CORS.",
        );
      }

      // Provide a helpful message when preflight fails due to wildcard origin with credentials
      if (
        message.includes("credentials") ||
        message.includes("Access-Control-Allow-Origin")
      ) {
        throw new Error(
          "Falha CORS: o backend não deve usar '*' em 'Access-Control-Allow-Origin' quando solicitações com credenciais são usadas. Ajuste CORS no servidor.",
        );
      }

      throw err;
    }
  },

  async me() {
    const { data } = await api.get<ApiEnvelope<Member> | Member>("/auth/me");
    return unwrapApiData(data);
  },

  async updateProfile(payload: {
    name: string;
    email: string;
    phone?: string;
    birthDate?: string | null;
    photoUrl?: string | null;
  }) {
    const { data } = await api.patch<ApiEnvelope<Member> | Member>(
      "/auth/profile",
      payload,
    );
    return unwrapApiData(data);
  },

  async changePassword(payload: { oldPassword: string; newPassword: string }) {
    const { data } = await api.patch("/auth/change-password", payload);
    return data as { success?: boolean; message?: string; data?: unknown };
  },

  async registerChurch(payload: ChurchLead) {
    const { data } = await api.post("/churches", payload);
    return data as { success?: boolean; message?: string; data?: unknown };
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      // ensure local session cleaned even if network fails
      clearSession();
    }
  },
};
