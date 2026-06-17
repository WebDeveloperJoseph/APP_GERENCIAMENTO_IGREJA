import axios, { AxiosError } from "axios";

const TOKEN_KEY = "igreja_connect_token";
const CHURCH_ID_KEY = "igreja_connect_church_id";
const USER_KEY = "igreja_connect_user";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ??
    "https://app-gerenciamento-igreja.onrender.com",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  const churchId = localStorage.getItem(CHURCH_ID_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (churchId) {
    config.headers["x-church-id"] = churchId;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ?? "Nao foi possivel conectar ao servidor.";

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }

    return Promise.reject(new Error(message));
  },
);

export function saveSession(token: string, churchId?: string | null, user?: unknown) {
  localStorage.setItem(TOKEN_KEY, token);

  if (churchId) {
    localStorage.setItem(CHURCH_ID_KEY, churchId);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CHURCH_ID_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getChurchId() {
  return localStorage.getItem(CHURCH_ID_KEY);
}

export function getStoredUser<T>() {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as T;
  } catch {
    return null;
  }
}

export function unwrapApiData<T>(payload: T | { data: T }) {
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }

  return payload as T;
}
