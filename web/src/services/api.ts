import axios, { AxiosError } from "axios";

const TOKEN_KEY = "igreja_connect_token";
const CHURCH_ID_KEY = "igreja_connect_church_id";
const USER_KEY = "igreja_connect_user";
const LEGACY_USER_KEY = "@IgrejaConnect:user";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ??
    (import.meta.env.DEV
      ? "http://localhost:3333"
      : "https://app-gerenciamento-igreja.onrender.com"),
  timeout: 15000,
});

// Enable credentials only when configured. The backend must allow credentials
// (Access-Control-Allow-Credentials: true) and must not use wildcard origin.
const useCredentials =
  (import.meta.env.VITE_API_USE_CREDENTIALS ?? "false") === "true";
api.defaults.withCredentials = useCredentials;

// In-memory token reduces exposure to XSS compared to always reading localStorage.
let inMemoryToken: string | null = null;

export function setInMemoryToken(token?: string | null) {
  inMemoryToken = token ?? null;
}

function getCookie(name: string) {
  const pattern = new RegExp(`(?:^|; )${name}=([^;]*)`);
  const match = document.cookie.match(pattern);
  return match ? decodeURIComponent(match[1]) : null;
}

api.interceptors.request.use((config) => {
  const token = inMemoryToken ?? localStorage.getItem(TOKEN_KEY);
  const churchId = localStorage.getItem(CHURCH_ID_KEY);
  const method = (config.method ?? "get").toLowerCase();
  const isUnsafeMethod =
    method === "post" ||
    method === "put" ||
    method === "patch" ||
    method === "delete";

  if (token) {
    // ensure header exists and is a string
    if (!config.headers) config.headers = {} as any;
    config.headers.Authorization = `Bearer ${String(token)}`;
  }

  if (churchId) {
    if (!config.headers) config.headers = {} as any;
    config.headers["x-church-id"] = String(churchId);
  }

  if (useCredentials && isUnsafeMethod) {
    const csrfToken = getCookie("igreja_csrf");
    if (csrfToken) {
      if (!config.headers) config.headers = {} as any;
      config.headers["x-csrf-token"] = csrfToken;
    }
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
      clearSession();
    }

    return Promise.reject(new Error(message));
  },
);

export function saveSession(
  token?: string | null,
  churchId?: string | null,
  user?: unknown,
) {
  // store token in-memory to reduce exposure to XSS; persist to localStorage when available
  if (token) {
    setInMemoryToken(token);
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    setInMemoryToken(null);
    localStorage.removeItem(TOKEN_KEY);
  }

  if (churchId) {
    localStorage.setItem(CHURCH_ID_KEY, churchId);
  } else {
    localStorage.removeItem(CHURCH_ID_KEY);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem("igreja_connect_validated", "1");
    localStorage.removeItem(LEGACY_USER_KEY);
  } else {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("igreja_connect_validated");
    localStorage.removeItem(LEGACY_USER_KEY);
  }
}

export function clearSession() {
  setInMemoryToken(null);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CHURCH_ID_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("igreja_connect_validated");
  // Notify listeners that session was cleared so UI can react (redirect to login, etc.)
  try {
    window.dispatchEvent(new CustomEvent("session:cleared"));
  } catch (e) {
    // no-op in non-browser environments
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getChurchId() {
  return localStorage.getItem(CHURCH_ID_KEY);
}

export function getStoredUser<T>() {
  const rawUser = localStorage.getItem(USER_KEY);
  const legacyRawUser = localStorage.getItem(LEGACY_USER_KEY);

  if (!rawUser && !legacyRawUser) {
    return null;
  }

  try {
    if (rawUser) {
      return JSON.parse(rawUser) as T;
    }

    // Backward compatibility: migrate legacy key automatically.
    const parsed = JSON.parse(legacyRawUser as string) as T;
    localStorage.setItem(USER_KEY, JSON.stringify(parsed));
    localStorage.removeItem(LEGACY_USER_KEY);
    return parsed;
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
