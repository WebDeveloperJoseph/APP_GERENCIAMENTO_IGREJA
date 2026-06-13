import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BottomNavigation } from "@/components/BottomNavigation";
import { ScreenContainer } from "@/components/ScreenContainer";
import { WeeklyEventsCarousel } from "@/components/WeeklyEventsCarousel";
import { api } from "@/services/api";
import { syncEventsWithDeviceCalendar } from "@/services/calendarSync";
import { churchTheme, colors, radii, spacing, typography } from "@/theme";
import { ChurchEvent } from "@/types/event";
import { MemberRole } from "@/types/member";

interface StoredMember {
  id: string;
  name: string;
  email: string | null;
  role: MemberRole;
  isSuperAdmin?: boolean;
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: Href;
  color?: string;
  disabled?: boolean;
}

function QuickAction({
  title,
  description,
  icon,
  href,
  color = colors.primary,
  disabled = false,
}: QuickActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => router.push(href)}
      style={({ pressed }) => [
        styles.actionCard,
        disabled && styles.restrictedAction,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View style={[styles.actionIcon, { borderColor: color }]}>
        <Ionicons color={color} name={icon} size={20} />
      </View>
      <View style={styles.actionText}>
        <Text numberOfLines={1} style={styles.actionTitle}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.actionDescription}>
          {disabled ? "Acesso restrito" : description}
        </Text>
      </View>
    </Pressable>
  );
}

export function HomeScreen() {
  const [member, setMember] = useState<StoredMember | null>(null);
  const [featuredEvents, setFeaturedEvents] = useState<ChurchEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [storedMember, eventsResponse] = await Promise.all([
          AsyncStorage.getItem("@app_icb:member"),
          api.get("/events"),
        ]);

        if (storedMember) {
          setMember(JSON.parse(storedMember));
        }

        const events = eventsResponse.data.data as ChurchEvent[];
        const now = new Date();
        const startOfWeek = new Date(now);
        const weekDay = (now.getDay() + 6) % 7;
        startOfWeek.setDate(now.getDate() - weekDay);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        const upcomingEvents = events.filter(
          (event) => new Date(event.endDate).getTime() >= now.getTime(),
        );
        const weeklyEvents = upcomingEvents.filter(
          (event) =>
            new Date(event.startDate) < endOfWeek &&
            new Date(event.endDate) >= startOfWeek,
        );

        setFeaturedEvents(
          weeklyEvents.length > 0 ? weeklyEvents : upcomingEvents.slice(0, 3),
        );
        void syncEventsWithDeviceCalendar(events).catch((calendarError) => {
          console.log("ERRO AO SINCRONIZAR CALENDARIO:", calendarError);
        });
      } catch (error: any) {
        console.log(
          "ERRO AO CARREGAR HOME:",
          error.response?.data || error.message,
        );

        Alert.alert(
          "Erro",
          error.response?.data?.message ||
            "Nao foi possivel carregar as informacoes da Home.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadHomeData();
  }, []);

  async function handleLogout() {
    await AsyncStorage.removeItem("@app_icb:token");
    await AsyncStorage.removeItem("@app_icb:member");
    router.replace("/");
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>Carregando inicio...</Text>
      </View>
    );
  }

  const firstName = member?.name?.trim().split(" ")[0] || "usuario";
  return (
    <View style={styles.screen}>
      <ScreenContainer contentStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityLabel="Abrir mais opcoes"
            onPress={() => router.push("/more")}
            style={styles.topButton}
          >
            <Text style={styles.menuIcon}>{"\u2630"}</Text>
          </Pressable>
          <Text style={styles.brandTitle}>{churchTheme.churchName}</Text>
          <Pressable
            accessibilityLabel="Sair"
            onPress={handleLogout}
            style={styles.topButton}
          >
            <Text style={styles.logoutText}>Sair</Text>
          </Pressable>
        </View>

        <View style={styles.greetingRow}>
          <View style={styles.greetingText}>
            <Text style={styles.greetingTitle}>Ola, {firstName}!</Text>
            <Text style={styles.greetingSubtitle}>
              Que bom ter voce por aqui.
            </Text>
          </View>
          <View style={styles.logoFrame}>
            {churchTheme.logo ? (
              <Image source={churchTheme.logo} style={styles.logo} />
            ) : (
              <Text style={styles.logoFallback}>ICB</Text>
            )}
          </View>
        </View>

        {featuredEvents.length > 0 ? (
          <WeeklyEventsCarousel events={featuredEvents} />
        ) : (
          <Pressable
            onPress={() => router.push("/events")}
            style={styles.emptyEventCard}
          >
            <Text style={styles.emptyEventTitle}>Confira a agenda da igreja</Text>
            <Text style={styles.emptyEventText}>Novos eventos em breve</Text>
          </Pressable>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Acesso rapido</Text>
        </View>

        <View style={styles.actionsGrid}>
          <QuickAction
            description="Ver e gerenciar"
            href="/members"
            icon="people-outline"
            title="Membros"
          />
          <QuickAction
            color={colors.secondary}
            description="Proximos eventos"
            href="/events"
            icon="calendar-outline"
            title="Eventos"
          />
          <QuickAction
            description="Entradas e saidas"
            href="/transactions"
            icon="wallet-outline"
            title="Financeiro"
          />
          <QuickAction
            color={colors.secondary}
            description="Graficos e numeros"
            href="/dashboard"
            icon="bar-chart-outline"
            title="Relatorios"
          />
          <QuickAction
            description="Bens da igreja"
            href="/patrimonio"
            icon="business-outline"
            title="Patrimonio"
          />
          <QuickAction
            color={colors.secondary}
            description="Perfil e opcoes"
            href="/more"
            icon="grid-outline"
            title="Mais"
          />
        </View>
      </ScreenContainer>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.md,
  },
  topBar: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topButton: {
    width: 64,
    minHeight: 44,
    justifyContent: "center",
  },
  menuIcon: {
    color: colors.text,
    fontSize: 25,
  },
  logoutText: {
    color: colors.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.extraBold,
    textAlign: "right",
  },
  brandTitle: {
    color: colors.text,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.extraBold,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.xl,
  },
  greetingText: {
    flex: 1,
  },
  greetingTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.extraBold,
  },
  greetingSubtitle: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    marginTop: spacing.xs,
  },
  logoFrame: {
    width: 66,
    height: 66,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: radii.pill,
    padding: 3,
    backgroundColor: colors.surface,
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: radii.pill,
  },
  logoFallback: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.extraBold,
    textAlign: "center",
    marginTop: 18,
  },
  emptyEventCard: {
    minHeight: 160,
    justifyContent: "center",
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    backgroundColor: colors.primary,
  },
  emptyEventTitle: {
    color: colors.surface,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.extraBold,
  },
  emptyEventText: {
    color: "#79C6FF",
    fontSize: typography.fontSize.sm,
    marginTop: spacing.sm,
  },
  eventCard: {
    minHeight: 220,
    overflow: "hidden",
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    backgroundColor: colors.primary,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 7,
  },
  eventBackgroundImage: {
    borderRadius: radii.xl,
  },
  eventOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(4, 31, 87, 0.72)",
  },
  eventGlow: {
    position: "absolute",
    right: -55,
    bottom: -55,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(100, 184, 246, 0.28)",
  },
  eventEyebrow: {
    color: "#79C6FF",
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: 0.8,
  },
  eventTitle: {
    maxWidth: "88%",
    color: colors.surface,
    fontSize: 24,
    fontWeight: typography.fontWeight.extraBold,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  eventInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  eventInfoIcon: {
    width: 22,
    color: "#79C6FF",
    fontSize: 12,
    fontWeight: typography.fontWeight.extraBold,
  },
  eventInfoText: {
    flex: 1,
    color: colors.surface,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  eventButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    backgroundColor: colors.secondary,
  },
  eventButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.extraBold,
  },
  eventButtonArrow: {
    color: colors.surface,
    fontSize: 18,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.extraBold,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  actionCard: {
    width: "48%",
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    backgroundColor: colors.card,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  restrictedAction: {
    opacity: 0.45,
  },
  actionIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderRadius: radii.md,
    marginRight: spacing.sm,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.extraBold,
  },
  actionDescription: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 3,
  },
  pressed: {
    opacity: 0.72,
  },
});
