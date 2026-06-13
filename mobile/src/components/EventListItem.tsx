import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "@/theme";
import { ChurchEvent } from "@/types/event";
import { formatEventTime } from "@/utils/event";

interface EventListItemProps {
  event: ChurchEvent;
  onPress: () => void;
}

export function EventListItem({ event, onPress }: EventListItemProps) {
  const startDate = new Date(event.startDate);
  const day = String(startDate.getDate()).padStart(2, "0");
  const month = new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(startDate)
    .replace(".", "")
    .toUpperCase();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      {event.coverImageUrl ? (
        <Image source={{ uri: event.coverImageUrl }} style={styles.coverImage} />
      ) : (
        <View style={styles.dateBadge}>
          <Text style={styles.day}>{day}</Text>
          <Text style={styles.month}>{month}</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.title}>
            {event.title}
          </Text>
          {!event.isPublic ? (
            <Text style={styles.privateBadge}>INTERNO</Text>
          ) : null}
        </View>
        <View style={styles.metaRow}>
          <Ionicons color={colors.primary} name="time-outline" size={13} />
          <Text style={styles.time}>
            {formatEventTime(event.startDate)} as{" "}
            {formatEventTime(event.endDate)}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons color={colors.textMuted} name="location-outline" size={13} />
          <Text numberOfLines={1} style={styles.location}>
            {event.location || "Local nao informado"}
          </Text>
        </View>
      </View>

      <Ionicons
        color={colors.textMuted}
        name="chevron-forward"
        size={19}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.card,
  },
  pressed: {
    opacity: 0.8,
  },
  dateBadge: {
    width: 62,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: radii.md,
    marginRight: spacing.md,
    backgroundColor: colors.secondaryLight,
  },
  coverImage: {
    width: 62,
    height: 62,
    borderRadius: radii.md,
    marginRight: spacing.md,
    resizeMode: "cover",
  },
  day: {
    color: colors.secondary,
    fontSize: 23,
    fontWeight: typography.fontWeight.extraBold,
  },
  month: {
    color: colors.primaryDark,
    fontSize: 10,
    fontWeight: typography.fontWeight.extraBold,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  title: {
    flexShrink: 1,
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.extraBold,
  },
  privateBadge: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: typography.fontWeight.extraBold,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 3,
    backgroundColor: colors.background,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
  },
  time: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  location: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 11,
  },
});
