import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { useState } from "react";

import { colors, radii, spacing, typography } from "@/theme";

interface AppInputProps extends TextInputProps {
  label: string;
  leftIcon?: string;
  rightLabel?: string;
  onRightPress?: () => void;
}

export function AppInput({
  label,
  leftIcon,
  rightLabel,
  onRightPress,
  style,
  onBlur,
  onFocus,
  ...props
}: AppInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, isFocused && styles.focusedInput]}>
        {leftIcon ? (
          <View style={styles.iconContainer}>
            <Text style={styles.leftIcon}>{leftIcon}</Text>
          </View>
        ) : null}

        <TextInput
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          style={[styles.input, style]}
          {...props}
        />

        {rightLabel && onRightPress ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={onRightPress}
            style={styles.rightAction}
          >
            <Text style={styles.rightLabel}>{rightLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  inputContainer: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.card,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    minHeight: 50,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: typography.fontSize.md,
  },
  iconContainer: {
    width: 48,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: colors.border,
    backgroundColor: colors.primaryLight,
  },
  leftIcon: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.extraBold,
  },
  rightAction: {
    minHeight: 50,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  rightLabel: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  focusedInput: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
    elevation: 2,
  },
});
