import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";

export default function RootLayout() {
  useEffect(() => {
    // 🔑 Blindagem total: Se for Expo Go, nem tenta executar nada de notificação
    const isExpoGo = Constants.executionEnvironment === "storeClient";

    if (isExpoGo || Platform.OS === "web") {
      console.log("ℹ️ Push Notifications desativadas no Expo Go.");
      return;
    }

    // Só carrega o código nativo se NÃO for Expo Go
    async function setupListener() {
      try {
        const Notifications = require("expo-notifications");
        const subscription =
          Notifications.addNotificationResponseReceivedListener(
            (response: any) => {
              const route = response.notification.request.content.data?.route;
              if (typeof route === "string") {
                const { router } = require("expo-router");
                router.push(route);
              }
            },
          );
        return subscription;
      } catch (e) {
        return null;
      }
    }

    let sub: any;
    setupListener().then((s) => (sub = s));

    return () => sub?.remove?.();
  }, []);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
