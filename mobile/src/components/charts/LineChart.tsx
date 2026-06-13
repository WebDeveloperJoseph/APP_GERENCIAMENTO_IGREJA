import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Polyline } from "react-native-svg";

import { colors } from "@/theme/colors";

interface LineChartPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineChartPoint[];
  color?: string;
}

const chartWidth = 320;
const chartHeight = 150;
const horizontalPadding = 18;
const verticalPadding = 18;

export function LineChart({
  data,
  color = colors.primary,
}: LineChartProps) {
  const maxValue = Math.max(...data.map((item) => Math.abs(item.value)), 1);
  const usableWidth = chartWidth - horizontalPadding * 2;
  const usableHeight = chartHeight - verticalPadding * 2;

  const points = data.map((item, index) => {
    const x =
      horizontalPadding +
      (index * usableWidth) / Math.max(data.length - 1, 1);
    const normalizedValue = (item.value + maxValue) / (maxValue * 2);
    const y =
      chartHeight - verticalPadding - normalizedValue * usableHeight;

    return { ...item, x, y };
  });

  return (
    <View>
      <View style={styles.chartContainer}>
        <Svg
          height={chartHeight}
          preserveAspectRatio="none"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          width="100%"
        >
          <Line
            stroke={colors.border}
            strokeDasharray="4 4"
            strokeWidth="1"
            x1={horizontalPadding}
            x2={chartWidth - horizontalPadding}
            y1={chartHeight / 2}
            y2={chartHeight / 2}
          />
          <Polyline
            fill="none"
            points={points.map((point) => `${point.x},${point.y}`).join(" ")}
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
          {points.map((point) => (
            <Circle
              cx={point.x}
              cy={point.y}
              fill={colors.surface}
              key={point.label}
              r="4"
              stroke={color}
              strokeWidth="2"
            />
          ))}
        </Svg>
      </View>

      <View style={styles.labels}>
        {data.map((item) => (
          <Text key={item.label} style={styles.label}>
            {item.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    width: "100%",
    overflow: "hidden",
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  label: {
    color: colors.textMuted,
    fontSize: 10,
  },
});
