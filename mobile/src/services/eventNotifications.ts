import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { api } from "@/services/api";

const PUSH_TOKEN_KEY = "@app_icb:expo_push_token";
const CHANNEL_ID = "church-events";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

async function prepareNotificationPermission() {
  if (Platform.OS === "web" || !Device.isDevice) {
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Eventos da igreja",
      description: "Avisos sobre novos eventos cadastrados no aplicativo.",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 150, 250],
      sound: "default",
    });
  }

  const currentPermission = await Notifications.getPermissionsAsync();

  if (currentPermission.granted) {
    return true;
  }

  const requestedPermission = await Notifications.requestPermissionsAsync();
  return requestedPermission.granted;
}

export async function registerDeviceForPushNotifications() {
  const hasPermission = await prepareNotificationPermission();

  if (!hasPermission) {
    return null;
  }

  const projectId =
    Constants.easConfig?.projectId ??
    Constants.expoConfig?.extra?.eas?.projectId;

  if (!projectId) {
    throw new Error("Project ID do Expo nao encontrado.");
  }

  const pushToken = (
    await Notifications.getExpoPushTokenAsync({ projectId })
  ).data;

  await api.post("/notifications/register", {
    token: pushToken,
    platform: Platform.OS,
  });
  await AsyncStorage.setItem(PUSH_TOKEN_KEY, pushToken);

  return pushToken;
}

export async function unregisterDeviceFromPushNotifications() {
  const pushToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);

  if (!pushToken) {
    return;
  }

  try {
    await api.delete("/notifications/register", {
      data: {
        token: pushToken,
      },
    });
  } finally {
    await AsyncStorage.removeItem(PUSH_TOKEN_KEY);
  }
}
