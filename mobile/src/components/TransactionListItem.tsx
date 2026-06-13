import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "@/theme";
import { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  formatDate,
  getTransactionCategoryLabel,
} from "@/utils/transaction";

interface TransactionListItemProps {
  transaction: Transaction;
  onPress: () => void;
}

export function TransactionListItem({
  transaction,
  onPress,
}: TransactionListItemProps) {
  const isIncome = transaction.type === "ENTRADA";
  const typeColor = isIncome ? colors.success : colors.danger;
  const typeBackground = isIncome ? colors.successLight : colors.dangerLight;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.symbol, { backgroundColor: typeBackground }]}>
        <Text style={[styles.symbolText, { color: typeColor }]}>
          {isIncome ? "+" : "-"}
        </Text>
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.category}>
          {transaction.description ||
            getTransactionCategoryLabel(transaction.category)}
        </Text>
        <Text style={styles.date}>
          {getTransactionCategoryLabel(transaction.category)} |{" "}
          {formatDate(transaction.date)}
        </Text>
      </View>

      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: typeColor }]}>
          {isIncome ? "+ " : "- "}
          {formatCurrency(transaction.value)}
        </Text>
        <Text style={[styles.arrow, { color: typeColor }]}>{"\u203A"}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9EDF5",
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.card,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  pressed: {
    opacity: 0.72,
  },
  symbol: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    marginRight: spacing.md,
  },
  symbolText: {
    fontSize: 22,
    fontWeight: typography.fontWeight.extraBold,
  },
  content: {
    flex: 1,
  },
  category: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.extraBold,
  },
  date: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 4,
  },
  valueContainer: {
    alignItems: "flex-end",
    marginLeft: spacing.sm,
  },
  value: {
    fontSize: 12,
    fontWeight: typography.fontWeight.extraBold,
  },
  arrow: {
    fontSize: 18,
    lineHeight: 18,
    marginTop: 2,
  },
});
