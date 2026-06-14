import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { Href, router } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getRandomVerse } from "@/constants/verses";
import { api } from "@/services/api";
import { colors, radii, spacing, typography } from "@/theme";

const MINIMUM_DISPLAY_TIME = 6000;

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function getInitialRoute() {
  const token = await AsyncStorage.getItem("@app_icb:token");

  if (!token) {
    return "/login" as const;
  }

  try {
    const response = await api.get("/auth/me");
    const member = response.data.data;

    await AsyncStorage.setItem(
      "@app_icb:member",
      JSON.stringify(member),
    );

    return member.mustChangePassword
      ? ("/change-password" as const)
      : ("/home" as const);
  } catch {
    await AsyncStorage.multiRemove([
      "@app_icb:token",
      "@app_icb:member",
    ]);
    return "/login" as const;
  }
}

async function getNotificationRoute() {
  const response = await Notifications.getLastNotificationResponseAsync();
  const route = response?.notification.request.content.data?.route;

  if (typeof route !== "string") {
    return null;
  }

  await Notifications.clearLastNotificationResponseAsync();
  return route as Href;
}

export function AppLoadingScreen() {
  const insets = useSafeAreaInsets();
  const verse = useMemo(() => getRandomVerse(), []);

  useEffect(() => {
    let isMounted = true;

    async function prepareApp() {
      const [, destination, notificationRoute] = await Promise.all([
        wait(MINIMUM_DISPLAY_TIME),
        getInitialRoute(),
        getNotificationRoute(),
      ]);

      if (isMounted) {
        const canOpenNotification =
          destination === "/home" && notificationRoute;

        router.replace(
          canOpenNotification ? notificationRoute : (destination as Href),
        );
      }
    }

    void prepareApp();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <LinearGradient
      colors={["#020A24", "#082F73", "#041334", "#010617"]}
      locations={[0, 0.36, 0.72, 1]}
      style={[
        styles.screen,
        {
          paddingTop: insets.top + spacing.xl,
          paddingBottom: insets.bottom + spacing.xxl,
        },
      ]}
    >
      <View style={styles.glow} />

      <View style={styles.content}>
        <View style={styles.logoFrame}>
          <Image
            source={require("../../assets/images/igreja-connect-icon.png")}
            style={styles.logo}
          />
        </View>

        <Text style={styles.title}>Palavra do Dia</Text>
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerDiamond} />
          <View style={styles.dividerLine} />
        </View>

        <Text style={styles.verse}>{verse.text}</Text>
        <Text style={styles.reference}>{verse.reference}</Text>

        <View style={styles.loading}>
          <ActivityIndicator color="#64B5F6" size="large" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    top: "12%",
    alignSelf: "center",
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: "rgba(30, 101, 255, 0.18)",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxl,
  },
  logoFrame: {
    width: 176,
    height: 176,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(100, 181, 246, 0.75)",
    borderRadius: radii.xl,
    backgroundColor: colors.surface,
    shadowColor: "#208AEF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.75,
    shadowRadius: 24,
    elevation: 14,
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  title: {
    color: colors.surface,
    fontSize: 30,
    fontWeight: typography.fontWeight.extraBold,
    marginTop: spacing.xxxl,
    textAlign: "center",
  },
  divider: {
    width: "82%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(100, 181, 246, 0.7)",
  },
  dividerDiamond: {
    width: 10,
    height: 10,
    marginHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    transform: [{ rotate: "45deg" }],
  },
  verse: {
    maxWidth: 520,
    color: colors.surface,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 29,
    textAlign: "center",
  },
  reference: {
    color: "#64B5F6",
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
    marginTop: spacing.lg,
  },
  loading: {
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.xxxl,
  },
  loadingText: {
    color: colors.surface,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
});
