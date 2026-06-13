import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Href, router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme/colors";
import { MemberRole } from "@/types/member";

type IconName = keyof typeof Ionicons.glyphMap;

interface NavigationItem {
  label: string;
  icon: IconName;
  activeIcon: IconName;
  href: Href;
  path: string;
  allowedRoles?: MemberRole[];
}

const navigationItems: NavigationItem[] = [
  {
    label: "Inicio",
    icon: "home-outline",
    activeIcon: "home",
    href: "/home",
    path: "/home",
  },
  {
    label: "Membros",
    icon: "people-outline",
    activeIcon: "people",
    href: "/members",
    path: "/members",
    allowedRoles: ["ADMIN", "TESOUREIRO", "VOLUNTARIO", "PASTOR"],
  },
  {
    label: "Eventos",
    icon: "calendar-outline",
    activeIcon: "calendar",
    href: "/events",
    path: "/events",
  },
  {
    label: "Financeiro",
    icon: "wallet-outline",
    activeIcon: "wallet",
    href: "/transactions",
    path: "/transactions",
    allowedRoles: ["ADMIN", "TESOUREIRO"],
  },
  {
    label: "Mais",
    icon: "ellipsis-horizontal-circle-outline",
    activeIcon: "ellipsis-horizontal-circle",
    href: "/more",
    path: "/more",
  },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState<MemberRole | null>(null);

  useEffect(() => {
    async function loadRole() {
      const storedMember = await AsyncStorage.getItem("@app_icb:member");

      if (storedMember) {
        setRole(JSON.parse(storedMember).role);
      }
    }

    loadRole();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      <View style={styles.items}>
        {navigationItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          const isAllowed =
            !item.allowedRoles ||
            (role ? item.allowedRoles.includes(role) : false);
          const iconColor = !isAllowed
            ? "#435A87"
            : isActive
              ? colors.surface
              : "#829AC6";

          return (
            <Pressable
              key={item.path}
              accessibilityRole="tab"
              accessibilityState={{
                selected: isActive,
                disabled: !isAllowed,
              }}
              disabled={!isAllowed || isActive}
              onPress={() => router.replace(item.href)}
              style={styles.item}
            >
              <View style={[styles.iconFrame, isActive && styles.activeFrame]}>
                <Ionicons
                  color={iconColor}
                  name={isActive ? item.activeIcon : item.icon}
                  size={20}
                />
              </View>
              <Text
                numberOfLines={1}
                style={[
                  styles.label,
                  isActive && styles.activeText,
                  !isAllowed && styles.disabledText,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: colors.primary,
    paddingTop: 7,
    paddingHorizontal: 8,
    backgroundColor: colors.primaryDark,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  items: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  iconFrame: {
    minWidth: 34,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
  },
  activeFrame: {
    backgroundColor: "rgba(255,255,255,0.13)",
  },
  label: {
    color: "#829AC6",
    fontSize: 9,
    fontWeight: "600",
    marginTop: 3,
  },
  activeText: {
    color: colors.surface,
    fontWeight: "800",
  },
  disabledText: {
    color: "#435A87",
  },
});
