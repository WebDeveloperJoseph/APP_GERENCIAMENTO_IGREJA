import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "axios";
import Constants from "expo-constants";
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
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@app_icb:token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
