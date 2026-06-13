import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "@/theme";
import { Asset } from "@/types/asset";
import { getAssetStatusLabel } from "@/utils/asset";
import { formatCurrency } from "@/utils/formatCurrency";

interface AssetListItemProps {
  asset: Asset;
  onPress: () => void;
}

export function AssetListItem({ asset, onPress }: AssetListItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      {asset.imageUrl ? (
        <Image source={{ uri: asset.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.symbol}>
          <Ionicons color={colors.primary} name="cube-outline" size={25} />
        </View>
      )}

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {asset.name}
        </Text>
        <Text numberOfLines={1} style={styles.metadata}>
          {asset.category}
          {asset.location ? ` | ${asset.location}` : ""}
        </Text>
        <Text style={styles.status}>{getAssetStatusLabel(asset.status)}</Text>
      </View>

      <View style={styles.valueContainer}>
        <Text style={styles.value}>{formatCurrency(asset.value)}</Text>
        <Ionicons
          color={colors.textMuted}
          name="chevron-forward"
          size={18}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 86,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.72,
  },
  symbol: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    marginRight: spacing.md,
    backgroundColor: colors.primaryLight,
  },
  image: {
    width: 54,
    height: 54,
    borderRadius: radii.md,
    marginRight: spacing.md,
    resizeMode: "cover",
  },
  content: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  metadata: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 3,
  },
  status: {
    alignSelf: "flex-start",
    color: colors.primary,
    fontSize: 10,
    fontWeight: typography.fontWeight.extraBold,
    textTransform: "uppercase",
    marginTop: 5,
  },
  valueContainer: {
    alignItems: "flex-end",
    gap: 4,
    marginLeft: spacing.sm,
  },
  value: {
    color: colors.navy,
    fontSize: 13,
    fontWeight: typography.fontWeight.extraBold,
  },
});
