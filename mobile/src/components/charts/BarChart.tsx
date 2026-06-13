import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";

interface BarChartItem {
  label: string;
  income: number;
  expense: number;
}

interface BarChartProps {
  data: BarChartItem[];
}

const maxBarHeight = 130;

export function BarChart({ data }: BarChartProps) {
  const maxValue = Math.max(
    ...data.flatMap((item) => [item.income, item.expense]),
    1,
  );

  return (
    <View>
      <View style={styles.chart}>
        {data.map((item) => (
          <View key={item.label} style={styles.group}>
            <View style={styles.bars}>
              <View
                style={[
                  styles.bar,
                  styles.incomeBar,
                  {
                    height: Math.max(
                      (item.income / maxValue) * maxBarHeight,
                      item.income > 0 ? 3 : 0,
                    ),
                  },
                ]}
              />
              <View
                style={[
                  styles.bar,
                  styles.expenseBar,
                  {
                    height: Math.max(
                      (item.expense / maxValue) * maxBarHeight,
                      item.expense > 0 ? 3 : 0,
                    ),
                  },
                ]}
              />
            </View>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.incomeBar]} />
          <Text style={styles.legendText}>Entradas</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.expenseBar]} />
          <Text style={styles.legendText}>Saídas</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    height: 160,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 4,
  },
  group: {
    flex: 1,
    alignItems: "center",
  },
  bars: {
    height: maxBarHeight,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 3,
  },
  bar: {
    width: 10,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  incomeBar: {
    backgroundColor: colors.success,
  },
  expenseBar: {
    backgroundColor: colors.danger,
  },
  label: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 7,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 14,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  legendText: {
    color: colors.textMuted,
    fontSize: 11,
  },
});
