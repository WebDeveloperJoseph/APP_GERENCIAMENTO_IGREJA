import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "@/theme";
import { ChurchEvent } from "@/types/event";
import { getMonthLabel } from "@/utils/event";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

interface EventCalendarProps {
  events: ChurchEvent[];
  month: Date;
  onChangeMonth: (offset: number) => void;
  onSelectDay: (day: number | null) => void;
  selectedDay: number | null;
}

export function EventCalendar({
  events,
  month,
  onChangeMonth,
  onSelectDay,
  selectedDay,
}: EventCalendarProps) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstWeekDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const today = new Date();
  const eventDays = new Set(
    events.map((event) => new Date(event.startDate).getDate()),
  );
  const cells = Array.from(
    { length: firstWeekDay + daysInMonth },
    (_, index) => (index < firstWeekDay ? null : index - firstWeekDay + 1),
  );

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Mes anterior"
          onPress={() => onChangeMonth(-1)}
          style={styles.monthButton}
        >
          <Ionicons color={colors.primary} name="chevron-back" size={22} />
        </Pressable>
        <Pressable onPress={() => onSelectDay(null)}>
          <Text style={styles.monthLabel}>{getMonthLabel(month)}</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Proximo mes"
          onPress={() => onChangeMonth(1)}
          style={styles.monthButton}
        >
          <Ionicons color={colors.primary} name="chevron-forward" size={22} />
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {weekDays.map((day, index) => (
          <Text key={`${day}-${index}`} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {cells.map((day, index) => {
          const isToday =
            day === today.getDate() &&
            monthIndex === today.getMonth() &&
            year === today.getFullYear();
          const isSelected = day === selectedDay;

          return (
            <Pressable
              key={`${day ?? "empty"}-${index}`}
              disabled={!day}
              onPress={() => onSelectDay(day)}
              style={[
                styles.dayCell,
                isToday && styles.todayCell,
                isSelected && styles.selectedCell,
              ]}
            >
              {day ? (
                <>
                  <Text
                    style={[
                      styles.dayText,
                      isToday && styles.todayText,
                      isSelected && styles.selectedText,
                    ]}
                  >
                    {day}
                  </Text>
                  {eventDays.has(day) ? (
                    <View
                      style={[
                        styles.eventDot,
                        isSelected && styles.selectedEventDot,
                      ]}
                    />
                  ) : null}
                </>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  monthButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
  },
  monthLabel: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.extraBold,
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: spacing.xs,
  },
  weekDay: {
    width: "14.285%",
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: typography.fontWeight.extraBold,
    textAlign: "center",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.285%",
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.pill,
  },
  todayCell: {
    backgroundColor: colors.primaryLight,
  },
  selectedCell: {
    backgroundColor: colors.primary,
  },
  dayText: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  todayText: {
    color: colors.primary,
  },
  selectedText: {
    color: colors.surface,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
    backgroundColor: colors.secondary,
  },
  selectedEventDot: {
    backgroundColor: colors.surface,
  },
});
