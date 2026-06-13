import { PropsWithChildren } from "react";
import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { colors, spacing } from "@/theme";

interface ScreenContainerProps extends PropsWithChildren {
  contentStyle?: StyleProp<ViewStyle>;
  maxWidth?: number;
  scrollable?: boolean;
  scrollViewProps?: ScrollViewProps;
}

export function ScreenContainer({
  children,
  contentStyle,
  maxWidth = 680,
  scrollable = true,
  scrollViewProps,
}: ScreenContainerProps) {
  const content = (
    <View style={[styles.content, { maxWidth }, contentStyle]}>
      {children}
    </View>
  );

  if (!scrollable) {
    return <View style={styles.screen}>{content}</View>;
  }

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={styles.scrollContent}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...scrollViewProps}
    >
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    width: "100%",
  },
});
