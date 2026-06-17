import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { api } from "@/services/api";

const PUSH_TOKEN_KEY = "@app_icb:expo_push_token";

// 🔑 Criamos um objeto MOCK (falso) para quando o Expo Go proibir o carregamento real
const mockNotifications = {
  setNotificationHandler: () => {},
  getPermissionsAsync: async () => ({ granted: false }),
  requestPermissionsAsync: async () => ({ granted: false }),
  getExpoPushTokenAsync: async () => ({ data: "" }),
  addNotificationResponseReceivedListener: () => ({ remove: () => {} }),
  AndroidNotificationPriority: { HIGH: 0 },
  AndroidImportance: { HIGH: 0 },
};

function getNotifications() {
  const isExpoGo = Constants.executionEnvironment === "storeClient";

  // Se for Expo Go ou ambiente não suportado, retorna o objeto vazio/mock
  if (!Device.isDevice || Platform.OS === "web" || isExpoGo) {
    return mockNotifications;
  }

  // Só tenta carregar o real se não estiver no Expo Go
  try {
    return require("expo-notifications");
  } catch (e) {
    return mockNotifications;
  }
}

async function setupNotificationHandler() {
  const Notifications = getNotifications();
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
  });
}

setupNotificationHandler();

export async function registerDeviceForPushNotifications() {
  const Notifications = getNotifications();
  // ... resto do seu código que usa Notifications ...
  return null;
}

export async function unregisterDeviceFromPushNotifications() {
  await AsyncStorage.removeItem(PUSH_TOKEN_KEY);
}
