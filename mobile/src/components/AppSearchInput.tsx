import { StyleSheet, Text, TextInput, View } from "react-native";

import { colors, radii, spacing, typography } from "@/theme";

interface AppSearchInputProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}

export function AppSearchInput({
  value,
  onChangeText,
  placeholder,
}: AppSearchInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.symbol}>⌕</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
  },
  symbol: {
    color: colors.textMuted,
    fontSize: 20,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: typography.fontSize.sm,
    paddingVertical: 10,
  },
});
