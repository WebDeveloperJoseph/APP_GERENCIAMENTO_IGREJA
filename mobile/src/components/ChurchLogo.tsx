import { Image, StyleSheet, Text, View } from "react-native";

import {
  churchTheme,
  colors,
  radii,
  spacing,
  typography,
} from "@/theme";

interface ChurchLogoProps {
  compact?: boolean;
  showTagline?: boolean;
}

export function ChurchLogo({
  compact = false,
  showTagline = false,
}: ChurchLogoProps) {
  return (
    <View style={styles.container}>
      {churchTheme.logo ? (
        <Image
          resizeMode="contain"
          source={churchTheme.logo}
          style={[styles.image, compact && styles.compactImage]}
        />
      ) : (
        <View style={[styles.mark, compact && styles.compactMark]}>
          <View style={styles.globe}>
            <View style={styles.globeLineHorizontal} />
            <View style={styles.globeLineVertical} />
          </View>
          <View style={styles.crossVertical} />
          <View style={styles.crossHorizontal} />
          <Text style={styles.markLetters}>{churchTheme.shortName}</Text>
        </View>
      )}

      <Text style={[styles.name, compact && styles.compactName]}>
        {churchTheme.churchName}
      </Text>
      {showTagline ? (
        <Text style={styles.tagline}>{churchTheme.tagline}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  image: {
    width: 128,
    height: 128,
    borderRadius: radii.xl,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  compactImage: {
    width: 72,
    height: 72,
  },
  mark: {
    width: 96,
    height: 96,
    position: "relative",
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: radii.xl,
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.primaryLight,
  },
  compactMark: {
    width: 68,
    height: 68,
    transform: [{ scale: 0.9 }],
    marginBottom: spacing.xs,
  },
  globe: {
    position: "absolute",
    top: 13,
    left: 24,
    width: 49,
    height: 49,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: radii.pill,
    backgroundColor: colors.infoLight,
  },
  globeLineHorizontal: {
    position: "absolute",
    top: 20,
    left: 0,
    width: 49,
    height: 2,
    backgroundColor: colors.primary,
    opacity: 0.38,
  },
  globeLineVertical: {
    position: "absolute",
    top: 0,
    left: 21,
    width: 2,
    height: 49,
    backgroundColor: colors.primary,
    opacity: 0.38,
  },
  crossVertical: {
    position: "absolute",
    top: 11,
    right: 18,
    width: 5,
    height: 25,
    borderRadius: 2,
    backgroundColor: colors.secondary,
  },
  crossHorizontal: {
    position: "absolute",
    top: 18,
    right: 11,
    width: 19,
    height: 5,
    borderRadius: 2,
    backgroundColor: colors.secondary,
  },
  markLetters: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: 2,
  },
  name: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: 0.5,
  },
  compactName: {
    fontSize: typography.fontSize.lg,
  },
  tagline: {
    maxWidth: 280,
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    textAlign: "center",
    marginTop: spacing.xs,
  },
});
