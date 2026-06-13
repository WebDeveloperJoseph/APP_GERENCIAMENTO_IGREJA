import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href, router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BottomNavigation } from "@/components/BottomNavigation";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { colors, radii, spacing, typography } from "@/theme";
import { MemberRole } from "@/types/member";

interface MenuItemProps {
  title: string;
  description: string;
  symbol: string;
  href: Href;
  disabled?: boolean;
}

function MenuItem({
  title,
  description,
  symbol,
  href,
  disabled,
}: MenuItemProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => router.push(href)}
      style={({ pressed }) => [
        styles.item,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View style={styles.symbol}>
        <Text style={styles.symbolText}>{symbol}</Text>
      </View>
      <View style={styles.itemText}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

export function MoreScreen() {
  const [role, setRole] = useState<MemberRole | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("@app_icb:member").then((storedMember) => {
      if (storedMember) {
        setRole(JSON.parse(storedMember).role);
      }
    });
  }, []);

  const canAccessManagement = role === "ADMIN" || role === "TESOUREIRO";

  async function handleLogout() {
    await AsyncStorage.removeItem("@app_icb:token");
    await AsyncStorage.removeItem("@app_icb:member");
    router.replace("/");
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Mais" />
      <ScreenContainer contentStyle={styles.content}>
        <Text style={styles.sectionTitle}>Gestão</Text>
        <View style={styles.menu}>
          <MenuItem
            description="Indicadores e relatórios da igreja"
            disabled={!canAccessManagement}
            href="/dashboard"
            symbol="▥"
            title="Painel"
          />
          <MenuItem
            description="Bens e recursos patrimoniais"
            disabled={!canAccessManagement}
            href="/patrimonio"
            symbol="◇"
            title="Patrimônio"
          />
        </View>

        <Text style={styles.sectionTitle}>Conta</Text>
        <View style={styles.menu}>
          <MenuItem
            description="Atualize sua senha de acesso"
            href="/change-password"
            symbol="S"
            title="Alterar senha"
          />
        </View>
        <Pressable onPress={handleLogout} style={styles.logout}>
          <Text style={styles.logoutText}>Sair do aplicativo</Text>
        </Pressable>
      </ScreenContainer>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 36,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.xl,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.extraBold,
    marginBottom: spacing.md,
  },
  menu: {
    gap: spacing.sm,
    marginBottom: spacing.xxxl,
  },
  item: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    backgroundColor: colors.card,
  },
  symbol: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    marginRight: spacing.md,
    backgroundColor: colors.primaryLight,
  },
  symbolText: {
    color: colors.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.extraBold,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  itemDescription: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
  },
  arrow: {
    color: colors.primary,
    fontSize: 26,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.72,
  },
  logout: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radii.md,
    backgroundColor: colors.card,
  },
  logoutText: {
    color: colors.danger,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
});
