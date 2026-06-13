import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";

import { colors } from "@/theme/colors";
import { formatCurrency } from "@/utils/formatCurrency";

interface PieChartItem {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartItem[];
}

const size = 190;
const radius = 82;
const center = size / 2;

function polarToCartesian(angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;

  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  };
}

function createArcPath(startAngle: number, endAngle: number) {
  const start = polarToCartesian(endAngle);
  const end = polarToCartesian(startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${center} ${center}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export function PieChart({ data }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const slices = data.reduce<
    (PieChartItem & { startAngle: number; endAngle: number })[]
  >((result, item) => {
    const startAngle = result.at(-1)?.endAngle ?? 0;
    const angle = total > 0 ? (item.value / total) * 360 : 0;

    return [
      ...result,
      {
        ...item,
        startAngle,
        endAngle: startAngle + angle,
      },
    ];
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <Svg height={size} width={size}>
          <G>
            {slices.map((item) => {
              const angle = item.endAngle - item.startAngle;

              if (angle >= 359.99) {
                return (
                  <Circle
                    cx={center}
                    cy={center}
                    fill={item.color}
                    key={item.label}
                    r={radius}
                  />
                );
              }

              return (
                <Path
                  d={createArcPath(item.startAngle, item.endAngle)}
                  fill={item.color}
                  key={item.label}
                />
              );
            })}
            <Circle
              cx={center}
              cy={center}
              fill={colors.surface}
              r={42}
            />
          </G>
        </Svg>

        <View style={styles.total}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text numberOfLines={1} style={styles.totalValue}>
            {formatCurrency(total)}
          </Text>
        </View>
      </View>

      <View style={styles.legend}>
        {data.map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: item.color }]}
            />
            <Text style={styles.legendLabel}>{item.label}</Text>
            <Text style={styles.legendValue}>
              {total > 0 ? Math.round((item.value / total) * 100) : 0}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 16,
  },
  chart: {
    width: size,
    height: size,
    alignItems: "center",
    justifyContent: "center",
  },
  total: {
    position: "absolute",
    width: 82,
    alignItems: "center",
  },
  totalLabel: {
    color: colors.textMuted,
    fontSize: 10,
  },
  totalValue: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
  },
  legend: {
    width: "100%",
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 3,
    marginRight: 8,
  },
  legendLabel: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 12,
  },
  legendValue: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
});
