import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppSearchInput } from "@/components/AppSearchInput";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ScreenHeader } from "@/components/ScreenHeader";
import { TransactionListItem } from "@/components/TransactionListItem";
import { api } from "@/services/api";
import { colors, radii, spacing, typography } from "@/theme";
import { ReportSummary } from "@/types/report";
import { Transaction, TransactionType } from "@/types/transaction";
import { formatCurrency } from "@/utils/formatCurrency";
import { getTransactionCategoryLabel } from "@/utils/transaction";
import {
  canManageFinance,
  CurrentUserAccess,
  getCurrentUserAccess,
} from "@/utils/permissions";

type TransactionFilter = "TODAS" | TransactionType;

interface FinanceShortcutProps {
  label: string;
  symbol: string;
  color: string;
  onPress: () => void;
}

function FinanceShortcut({
  label,
  symbol,
  color,
  onPress,
}: FinanceShortcutProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.shortcut,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.shortcutIcon, { borderColor: color }]}>
        <Text style={[styles.shortcutIconText, { color }]}>{symbol}</Text>
      </View>
      <Text style={styles.shortcutLabel}>{label}</Text>
    </Pressable>
  );
}

export function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TransactionFilter>("TODAS");
  const [isLoading, setIsLoading] = useState(true);
  const [access, setAccess] = useState<CurrentUserAccess | null>(null);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesType =
        filter === "TODAS" || transaction.type === filter;
      const matchesSearch =
        !normalizedSearch ||
        getTransactionCategoryLabel(transaction.category)
          .toLowerCase()
          .includes(normalizedSearch) ||
        transaction.description?.toLowerCase().includes(normalizedSearch) ||
        transaction.member?.name.toLowerCase().includes(normalizedSearch);

      return matchesType && matchesSearch;
    });
  }, [filter, search, transactions]);

  useFocusEffect(
    useCallback(() => {
      async function loadTransactions() {
        try {
          setIsLoading(true);

          const [transactionsResponse, summaryResponse, currentAccess] = await Promise.all([
            api.get("/transactions"),
            api.get("/reports/summary"),
            getCurrentUserAccess(),
          ]);

          setTransactions(transactionsResponse.data.data);
          setSummary(summaryResponse.data.data);
          setAccess(currentAccess);
        } catch (error: any) {
          console.log(
            "ERRO AO BUSCAR FINANCEIRO:",
            error.response?.data || error.message,
          );

          Alert.alert(
            "Erro",
            error.response?.data?.message ||
              "Nao foi possivel carregar o financeiro.",
          );
        } finally {
          setIsLoading(false);
        }
      }

      loadTransactions();
    }, []),
  );

  const periodLabel = summary
    ? new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
      }).format(new Date(summary.period.year, summary.period.month - 1, 1))
    : "mes atual";

  const listHeader = (
    <View>
      <View style={styles.summaryCard}>
        <View style={styles.summaryGlow} />
        <Text style={styles.summaryEyebrow}>RESUMO DO MES</Text>
        <Text style={styles.summaryPeriod}>{periodLabel}</Text>

        <View style={styles.summaryValues}>
          <View style={styles.summaryColumn}>
            <Text style={styles.summaryLabel}>Entradas</Text>
            <Text style={[styles.summaryValue, styles.incomeValue]}>
              {formatCurrency(summary?.totalEntradas ?? 0)}
            </Text>
          </View>
          <View style={styles.summaryColumn}>
            <Text style={styles.summaryLabel}>Saidas</Text>
            <Text style={[styles.summaryValue, styles.expenseValue]}>
              {formatCurrency(summary?.totalSaidas ?? 0)}
            </Text>
          </View>
        </View>

        <View style={styles.balanceDivider} />
        <Text style={styles.summaryLabel}>Saldo</Text>
        <Text style={styles.balanceValue}>
          {formatCurrency(summary?.saldo ?? 0)}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Atalhos</Text>
      <View style={styles.shortcutsGrid}>
        <FinanceShortcut
          color={colors.success}
          label="Entradas"
          onPress={() => setFilter("ENTRADA")}
          symbol="+"
        />
        <FinanceShortcut
          color={colors.danger}
          label="Saidas"
          onPress={() => setFilter("SAIDA")}
          symbol="-"
        />
        <FinanceShortcut
          color={colors.primary}
          label="Todos"
          onPress={() => {
            setFilter("TODAS");
            setSearch("");
          }}
          symbol="T"
        />
        <FinanceShortcut
          color={colors.primary}
          label="Relatorios"
          onPress={() => router.push("/dashboard")}
          symbol="R"
        />
        <FinanceShortcut
          color={colors.secondary}
          label="Dizimos"
          onPress={() => setSearch("Dizimo")}
          symbol="D"
        />
        {canManageFinance(access) ? (
          <FinanceShortcut
            color={colors.secondary}
            label="Nova"
            onPress={() => router.push("/transactions/create")}
            symbol="+"
          />
        ) : null}
      </View>

      <View style={styles.movementsHeader}>
        <Text style={styles.sectionTitle}>Ultimas movimentacoes</Text>
        <Text style={styles.movementsCount}>
          {filteredTransactions.length} registros
        </Text>
      </View>

      <AppSearchInput
        onChangeText={setSearch}
        placeholder="Buscar movimentacao..."
        value={search}
      />

      <View style={styles.filters}>
        {[
          { label: "Todas", value: "TODAS" as const },
          { label: "Entradas", value: "ENTRADA" as const },
          { label: "Saidas", value: "SAIDA" as const },
        ].map((option) => {
          const isSelected = filter === option.value;

          return (
            <Pressable
              key={option.value}
              onPress={() => setFilter(option.value)}
              style={[
                styles.filter,
                isSelected && styles.selectedFilter,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  isSelected && styles.selectedFilterText,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        actionLabel={canManageFinance(access) ? "+ Nova" : undefined}
        onActionPress={
          canManageFinance(access)
            ? () => router.push("/transactions/create")
            : undefined
        }
        title="Financeiro"
      />

      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>Carregando financeiro...</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={[
              styles.list,
              filteredTransactions.length === 0 && styles.emptyList,
            ]}
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={listHeader}
            renderItem={({ item }) => (
              <TransactionListItem
                onPress={() =>
                  router.push({
                    pathname: "/transactions/[id]",
                    params: { id: item.id },
                  })
                }
                transaction={item}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Nenhuma movimentacao encontrada.
              </Text>
            }
          />
        )}
      </View>
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
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  summaryCard: {
    minHeight: 190,
    overflow: "hidden",
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
    backgroundColor: colors.primaryDark,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  summaryGlow: {
    position: "absolute",
    right: -35,
    top: -45,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(49,120,198,0.30)",
  },
  summaryEyebrow: {
    color: "#64B5F6",
    fontSize: 11,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: 0.7,
  },
  summaryPeriod: {
    color: "rgba(255,255,255,0.72)",
    fontSize: typography.fontSize.sm,
    marginTop: 3,
    textTransform: "capitalize",
  },
  summaryValues: {
    flexDirection: "row",
    marginTop: spacing.xl,
  },
  summaryColumn: {
    flex: 1,
  },
  summaryLabel: {
    color: "#8EABD7",
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  summaryValue: {
    fontSize: 19,
    fontWeight: typography.fontWeight.extraBold,
    marginTop: 3,
  },
  incomeValue: {
    color: "#33E27C",
  },
  expenseValue: {
    color: "#FF4D5F",
  },
  balanceDivider: {
    height: 1,
    marginVertical: spacing.md,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  balanceValue: {
    color: "#64B5F6",
    fontSize: 22,
    fontWeight: typography.fontWeight.extraBold,
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.extraBold,
  },
  shortcutsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
  shortcut: {
    width: "31.5%",
    minHeight: 86,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.sm,
    backgroundColor: colors.surface,
  },
  shortcutIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderRadius: radii.md,
  },
  shortcutIconText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.extraBold,
  },
  shortcutLabel: {
    color: colors.text,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  movementsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  movementsCount: {
    color: colors.textMuted,
    fontSize: 10,
  },
  filters: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  filter: {
    flex: 1,
    alignItems: "center",
    borderRadius: radii.pill,
    paddingVertical: 9,
    backgroundColor: colors.surface,
  },
  selectedFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  selectedFilterText: {
    color: colors.surface,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingText: {
    color: colors.textMuted,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: "center",
    paddingVertical: spacing.xxl,
  },
  pressed: {
    opacity: 0.72,
  },
});
