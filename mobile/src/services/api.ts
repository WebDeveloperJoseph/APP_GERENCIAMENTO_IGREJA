import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError, create, InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { router } from "expo-router";
import { Platform } from "react-native";

function getDevelopmentHost() {
  if (Platform.OS === "web" && globalThis.location?.hostname) {
    return globalThis.location.hostname;
  }

  const expoHost = Constants.expoConfig?.hostUri?.split(":")[0];

  return expoHost || "localhost";
}

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.trim() ||
  `http://${getDevelopmentHost()}:3333`;

export const api = create({
  baseURL: API_BASE_URL,
  // Servicos gratuitos do Render podem levar mais de 30 segundos para despertar.
  timeout: 60000,
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  retryCount?: number;
}

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@app_icb:token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

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

    if (status === 401 && !isLoginRequest) {
      await AsyncStorage.multiRemove([
        "@app_icb:token",
        "@app_icb:member",
      ]);
      router.replace("/");
    }

    return Promise.reject(error);
  },
);
