import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "@/theme";
import { Member } from "@/types/member";
import { getMemberInitials, getMemberRoleLabel } from "@/utils/member";

interface MemberListItemProps {
  member: Member;
  onPress: () => void;
  metadata?: string;
  disabled?: boolean;
}

export function MemberListItem({
  member,
  onPress,
  metadata,
  disabled = false,
}: MemberListItemProps) {
  const isActive = member.isActive !== false;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.avatar}>
        {member.photoUrl ? (
          <Image source={{ uri: member.photoUrl }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarText}>{getMemberInitials(member.name)}</Text>
        )}
        <View
          style={[
            styles.statusDot,
            !isActive && styles.inactiveStatusDot,
          ]}
        />
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {member.name}
        </Text>
        <Text numberOfLines={1} style={styles.role}>
          {metadata || getMemberRoleLabel(member.role)}
        </Text>
      </View>

      <View
        style={[
          styles.statusBadge,
          !isActive && styles.inactiveStatusBadge,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            !isActive && styles.inactiveStatusText,
          ]}
        >
          {isActive ? "Ativo" : "Inativo"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9EDF5",
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
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
  disabled: {
    opacity: 0.55,
  },
  avatar: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
    marginRight: spacing.md,
    backgroundColor: colors.primaryLight,
  },
  avatarText: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.extraBold,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 23,
    resizeMode: "cover",
  },
  statusDot: {
    position: "absolute",
    right: 0,
    bottom: 1,
    width: 11,
    height: 11,
    borderWidth: 2,
    borderColor: colors.surface,
    borderRadius: 6,
    backgroundColor: colors.success,
  },
  inactiveStatusDot: {
    backgroundColor: colors.textMuted,
  },
  content: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.extraBold,
  },
  role: {
    color: colors.primary,
    fontSize: 11,
    marginTop: 3,
  },
  statusBadge: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    marginLeft: spacing.sm,
    backgroundColor: colors.successLight,
  },
  inactiveStatusBadge: {
    backgroundColor: colors.background,
  },
  statusText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: typography.fontWeight.extraBold,
  },
  inactiveStatusText: {
    color: colors.textMuted,
  },
});
