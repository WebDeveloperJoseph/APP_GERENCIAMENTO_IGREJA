import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"; // 🔑 Mudança aqui: importamos o objeto padrão 'axios'
import Constants from "expo-constants";
import { Href, router } from "expo-router";
import { Platform } from "react-native";

function getDevelopmentHost() {
  if (Platform.OS === "web" && globalThis.location?.hostname) {
    return globalThis.location.hostname;
  }

  const expoHost = Constants.expoConfig?.hostUri?.split(":")[0];

  return expoHost || "localhost";
}

// export const API_BASE_URL = "http://192.168.1.101:3333";
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.trim() ||
  `http://${getDevelopmentHost()}:3333`;

// 🔑 Correção: Usando o padrão oficial axios.create() para garantir o isolamento da instância
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  retryCount?: number;
}

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("@app_icb:token");

    if (token) {
      // 🔑 Garante que o objeto headers exista e injeta de forma compatível com Axios moderno
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const isLoginRequest = config?.url?.includes("/auth/login") === true;

    const isSafeRequest =
      config?.method?.toLowerCase() === "get" || isLoginRequest;

    const isTemporaryFailure =
      !error.response ||
      error.code === "ECONNABORTED" ||
      status === 502 ||
      status === 503 ||
      status === 504;

    // Lógica de Retry para falhas de rede ou instabilidade (ex: despertar o Render)
    if (
      config &&
      isSafeRequest &&
      isTemporaryFailure &&
      (config.retryCount ?? 0) < 2
    ) {
      config.retryCount = (config.retryCount ?? 0) + 1;
      await new Promise((resolve) =>
        setTimeout(resolve, 1200 * config.retryCount!),
      );
      return api.request(config);
    }

    // 🔑 Se retornar 401 e não for a tela de login, limpa e redireciona
    if (status === 401 && !isLoginRequest) {
      console.warn(
        "⚠️ Sessão expirada ou token inválido. Redirecionando para o login...",
      );
      await AsyncStorage.multiRemove(["@app_icb:token", "@app_icb:member"]);
      router.replace("/login" as Href);
    }

    return Promise.reject(error);
  },
);
