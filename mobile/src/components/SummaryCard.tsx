import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "@/theme";

interface SummaryCardProps {
  label: string;
  value: string;
  symbol: string;
  backgroundColor: string;
  symbolColor: string;
}

export function SummaryCard({
  label,
  value,
  symbol,
  backgroundColor,
  symbolColor,
}: SummaryCardProps) {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={[styles.symbol, { backgroundColor: `${symbolColor}18` }]}>
        <Text style={[styles.symbolText, { color: symbolColor }]}>{symbol}</Text>
      </View>

      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: 150,
    flex: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
    minHeight: 122,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  symbol: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.sm,
    marginBottom: spacing.md,
  },
  symbolText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.extraBold,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
  },
  value: {
    color: colors.text,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.extraBold,
  },
});
