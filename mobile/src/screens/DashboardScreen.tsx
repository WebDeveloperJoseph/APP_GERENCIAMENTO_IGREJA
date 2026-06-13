import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BottomNavigation } from "@/components/BottomNavigation";
import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { PieChart } from "@/components/charts/PieChart";
import { FilterChip } from "@/components/FilterChip";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SummaryCard } from "@/components/SummaryCard";
import { api } from "@/services/api";
import { colors } from "@/theme/colors";
import { Transaction } from "@/types/transaction";
import {
  buildDashboardData,
  DashboardCategoryFilter,
  DashboardPeriod,
  filterDashboardTransactions,
} from "@/utils/dashboard";
import { formatCurrency } from "@/utils/formatCurrency";

interface ChartCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const periodOptions: { label: string; value: DashboardPeriod }[] = [
  { label: "7 dias", value: "SETE_DIAS" },
  { label: "30 dias", value: "TRINTA_DIAS" },
  { label: "Este mês", value: "MES" },
  { label: "Este ano", value: "ANO" },
  { label: "Tudo", value: "TUDO" },
];

const categoryOptions: {
  label: string;
  value: DashboardCategoryFilter;
}[] = [
  { label: "Todas", value: "TODAS" },
  { label: "Dízimo", value: "DIZIMO" },
  { label: "Oferta", value: "OFERTA" },
  { label: "Outras", value: "OUTRAS" },
];

function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>{title}</Text>
      <Text style={styles.chartDescription}>{description}</Text>
      <View style={styles.chartContent}>{children}</View>
    </View>
  );
}

export function DashboardScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [period, setPeriod] = useState<DashboardPeriod>("MES");
  const [category, setCategory] =
    useState<DashboardCategoryFilter>("TODAS");
  const [isLoading, setIsLoading] = useState(true);

  const filteredTransactions = useMemo(
    () => filterDashboardTransactions(transactions, period, category),
    [category, period, transactions],
  );
  const dashboardData = useMemo(
    () => buildDashboardData(filteredTransactions, period),
    [filteredTransactions, period],
  );

  useEffect(() => {
    async function loadTransactions() {
      try {
        const response = await api.get("/transactions");
        setTransactions(response.data.data);
      } catch (error: any) {
        console.log(
          "ERRO AO CARREGAR DASHBOARD:",
          error.response?.data || error.message,
        );

        Alert.alert(
          "Erro",
          error.response?.data?.message ||
            "Não foi possível carregar os gráficos.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadTransactions();
  }, []);

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Dashboard" />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>Carregando gráficos...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Período</Text>
            <ScrollView
              horizontal
              contentContainerStyle={styles.filterRow}
              showsHorizontalScrollIndicator={false}
            >
              {periodOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  onPress={() => setPeriod(option.value)}
                  selected={period === option.value}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Categoria</Text>
            <ScrollView
              horizontal
              contentContainerStyle={styles.filterRow}
              showsHorizontalScrollIndicator={false}
            >
              {categoryOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  onPress={() => setCategory(option.value)}
                  selected={category === option.value}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.summaryGrid}>
            <SummaryCard
              backgroundColor={colors.successLight}
              label="Entradas"
              symbol="+"
              symbolColor={colors.success}
              value={formatCurrency(dashboardData.totalIncome)}
            />
            <SummaryCard
              backgroundColor={colors.dangerLight}
              label="Saídas"
              symbol="-"
              symbolColor={colors.danger}
              value={formatCurrency(dashboardData.totalExpense)}
            />
            <SummaryCard
              backgroundColor="#EEF4FD"
              label="Saldo"
              symbol="="
              symbolColor="#3778D4"
              value={formatCurrency(dashboardData.balance)}
            />
          </View>

          {filteredTransactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>
                Nenhum dado para estes filtros
              </Text>
              <Text style={styles.emptyText}>
                Altere o período ou a categoria para visualizar os gráficos.
              </Text>
            </View>
          ) : (
            <>
              <ChartCard
                description="Evolução do saldo no período selecionado"
                title="Saldo"
              >
                <LineChart data={dashboardData.balanceLine} />
              </ChartCard>

              <ChartCard
                description="Comparação entre entradas e saídas"
                title="Movimentação financeira"
              >
                <BarChart data={dashboardData.monthlyBars} />
              </ChartCard>

              <ChartCard
                description="Participação das categorias no período"
                title="Distribuição por categoria"
              >
                <PieChart data={dashboardData.categoryData} />
              </ChartCard>
            </>
          )}
        </ScrollView>
      )}

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
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
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
  filterSection: {
    gap: 8,
  },
  filterTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
  filterRow: {
    gap: 8,
    paddingRight: 16,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  emptyContainer: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 30,
    paddingVertical: 42,
    backgroundColor: colors.surface,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 6,
  },
  chartCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    backgroundColor: colors.surface,
  },
  chartTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  chartDescription: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  chartContent: {
    marginTop: 18,
  },
});
