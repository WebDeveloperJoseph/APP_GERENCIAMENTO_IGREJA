import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { colors, radii, spacing, typography } from "@/theme";
import { ChurchEvent } from "@/types/event";
import { formatEventDate, formatEventTime } from "@/utils/event";

interface WeeklyEventsCarouselProps {
  events: ChurchEvent[];
}

export function WeeklyEventsCarousel({
  events,
}: WeeklyEventsCarouselProps) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - spacing.xl * 2, 640);
  const listRef = useRef<FlatList<ChurchEvent>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (events.length < 2) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((current) => {
        const next = (current + 1) % events.length;
        listRef.current?.scrollToIndex({ animated: true, index: next });
        return next;
      });
    }, 5500);

    return () => clearInterval(interval);
  }, [events.length]);

  function handleScrollEnd(
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / cardWidth,
    );
    setActiveIndex(index);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        decelerationRate="fast"
        getItemLayout={(_data, index) => ({
          index,
          length: cardWidth,
          offset: cardWidth * index,
        })}
        horizontal
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={handleScrollEnd}
        pagingEnabled
        ref={listRef}
        renderItem={({ item }) => (
          <View style={{ width: cardWidth }}>
            <ImageBackground
              imageStyle={styles.backgroundImage}
              source={
                item.coverImageUrl
                  ? { uri: item.coverImageUrl }
                  : undefined
              }
              style={styles.card}
            >
              <View style={styles.overlay} />
              <Text style={styles.eyebrow}>EVENTOS DA SEMANA</Text>
              <Text numberOfLines={2} style={styles.title}>
                {item.title}
              </Text>
              <Text style={styles.info}>
                {formatEventDate(item.startDate)}
              </Text>
              <Text style={styles.info}>
                {formatEventTime(item.startDate)}
                {item.location ? `  |  ${item.location}` : ""}
              </Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/events/[id]",
                    params: { id: item.id },
                  })
                }
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.buttonText}>Ver detalhes</Text>
                <Text style={styles.buttonArrow}>{"\u2192"}</Text>
              </Pressable>
            </ImageBackground>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />
      {events.length > 1 ? (
        <View style={styles.dots}>
          {events.map((event, index) => (
            <View
              key={event.id}
              style={[styles.dot, index === activeIndex && styles.activeDot]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xxl,
  },
  card: {
    minHeight: 220,
    overflow: "hidden",
    justifyContent: "center",
    borderRadius: radii.xl,
    padding: spacing.xl,
    backgroundColor: colors.primary,
  },
  backgroundImage: {
    borderRadius: radii.xl,
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(4, 31, 87, 0.72)",
  },
  eyebrow: {
    color: "#79C6FF",
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: 0.8,
  },
  title: {
    maxWidth: "88%",
    color: colors.surface,
    fontSize: 24,
    fontWeight: typography.fontWeight.extraBold,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  info: {
    color: colors.surface,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  button: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: colors.secondary,
  },
  buttonText: {
    color: colors.surface,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.extraBold,
  },
  buttonArrow: {
    color: colors.surface,
    fontSize: 18,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: spacing.sm,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  activeDot: {
    width: 20,
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.72,
  },
});
