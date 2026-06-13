import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@/theme";

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  actionLabel?: string;
  onActionPress?: () => void;
}

export function ScreenHeader({
  title,
  onBack,
  actionLabel,
  onActionPress,
}: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            onPress={onBack}
            style={styles.iconButton}
          >
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>
        ) : null}
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={[styles.side, styles.rightSide]}>
        {actionLabel && onActionPress ? (
          <Pressable
            accessibilityRole="button"
            onPress={onActionPress}
            style={styles.actionButton}
          >
            <Text style={styles.actionLabel}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.primary,
  },
  side: {
    width: 76,
    alignItems: "flex-start",
  },
  rightSide: {
    alignItems: "flex-end",
  },
  title: {
    flex: 1,
    color: colors.surface,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.extraBold,
    textAlign: "center",
  },
  iconButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    color: colors.surface,
    fontSize: 34,
    lineHeight: 36,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actionLabel: {
    color: colors.surface,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.extraBold,
  },
});
