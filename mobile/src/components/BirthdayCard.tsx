import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "@/theme";
import { BirthdayMember, formatBirthdayDay } from "@/utils/birthdayUtils";
import { getMemberInitials, getMemberRoleLabel } from "@/utils/member";

interface BirthdayCardProps {
  member: BirthdayMember;
}

export function BirthdayCard({ member }: BirthdayCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.dayBadge}>
        <Text style={styles.day}>{formatBirthdayDay(member.birthdayDay)}</Text>
        <Text style={styles.dayLabel}>DIA</Text>
      </View>

      <View style={styles.avatar}>
        {member.photoUrl ? (
          <Image source={{ uri: member.photoUrl }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarText}>{getMemberInitials(member.name)}</Text>
        )}
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {member.name}
        </Text>
        <Text style={styles.role}>{getMemberRoleLabel(member.role)}</Text>
        {member.phone ? (
          <View style={styles.phoneRow}>
            <Ionicons
              color={colors.textMuted}
              name="call-outline"
              size={14}
            />
            <Text style={styles.phone}>{member.phone}</Text>
          </View>
        ) : null}
      </View>

      <Ionicons color={colors.secondary} name="gift-outline" size={25} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 94,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.card,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  dayBadge: {
    width: 48,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    marginRight: spacing.sm,
    backgroundColor: colors.secondaryLight,
  },
  day: {
    color: colors.secondary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.extraBold,
  },
  dayLabel: {
    color: colors.secondary,
    fontSize: 8,
    fontWeight: typography.fontWeight.extraBold,
  },
  avatar: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 24,
    marginRight: spacing.md,
    backgroundColor: colors.primaryLight,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.extraBold,
  },
  content: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.extraBold,
  },
  role: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    marginTop: 3,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  phone: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
  },
});
