import { Ionicons } from "@expo/vector-icons";
import { Href, router, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme/colors";

type IconName = keyof typeof Ionicons.glyphMap;

interface NavigationItem {
  label: string;
  icon: IconName;
  activeIcon: IconName;
  href: Href;
  path: string;
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
          const iconColor = isActive
              ? colors.surface
              : "#829AC6";

          return (
            <Pressable
              key={item.path}
              accessibilityRole="tab"
              accessibilityState={{
                selected: isActive,
              }}
              disabled={isActive}
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
});
