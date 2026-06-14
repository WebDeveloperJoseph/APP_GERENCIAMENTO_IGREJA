import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BottomNavigation } from "@/components/BottomNavigation";
import { EventCalendar } from "@/components/EventCalendar";
import { EventListItem } from "@/components/EventListItem";
import { ScreenHeader } from "@/components/ScreenHeader";
import { api } from "@/services/api";
import { colors, spacing, typography } from "@/theme";
import { ChurchEvent } from "@/types/event";
import {
  canManageEvents,
  CurrentUserAccess,
  getCurrentUserAccess,
} from "@/utils/permissions";

export function EventsScreen() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [access, setAccess] = useState<CurrentUserAccess | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const visibleEvents = useMemo(() => {
    if (!selectedDay) {
      return events;
    }

    return events.filter(
      (event) => new Date(event.startDate).getDate() === selectedDay,
    );
  }, [events, selectedDay]);

  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);

      const [response, storedMember] = await Promise.all([
        api.get("/events", {
          params: {
            month: selectedMonth.getMonth() + 1,
            year: selectedMonth.getFullYear(),
          },
        }),
        getCurrentUserAccess(),
      ]);

      setEvents(response.data.data);

      setAccess(storedMember);
    } catch (error: any) {
      console.log(
        "ERRO AO BUSCAR EVENTOS:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Nao foi possivel carregar os eventos.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth]);

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [loadEvents]),
  );

  function changeMonth(offset: number) {
    setSelectedDay(null);
    setSelectedMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader
        actionLabel={canManageEvents(access) ? "+ Novo" : undefined}
        onActionPress={
          canManageEvents(access)
            ? () => router.push("/events/create")
            : undefined
        }
        title="Eventos"
      />

      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>Carregando eventos...</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={[
              styles.list,
              visibleEvents.length === 0 && styles.emptyList,
            ]}
            data={visibleEvents}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
              <>
                <EventCalendar
                  events={events}
                  month={selectedMonth}
                  onChangeMonth={changeMonth}
                  onSelectDay={setSelectedDay}
                  selectedDay={selectedDay}
                />
                <View style={styles.listHeader}>
                  <View>
                    <Text style={styles.sectionTitle}>
                      {selectedDay
                        ? `Eventos do dia ${selectedDay}`
                        : "Proximos eventos"}
                    </Text>
                    <Text style={styles.eventCount}>
                      {visibleEvents.length}{" "}
                      {visibleEvents.length === 1 ? "evento" : "eventos"}
                    </Text>
                  </View>
                  {selectedDay ? (
                    <Pressable onPress={() => setSelectedDay(null)}>
                      <Text style={styles.clearFilter}>Ver todos</Text>
                    </Pressable>
                  ) : null}
                </View>
              </>
            }
            renderItem={({ item }) => (
              <EventListItem
                event={item}
                onPress={() =>
                  router.push({
                    pathname: "/events/[id]",
                    params: { id: item.id },
                  })
                }
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>
                  Nenhum evento encontrado
                </Text>
                <Text style={styles.emptyText}>
                  Selecione outro dia ou consulte outro mes.
                </Text>
              </View>
            }
          />
        )}
      </View>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 36,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingText: {
    color: colors.textMuted,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  emptyList: {
    flexGrow: 1,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.extraBold,
  },
  eventCount: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 3,
  },
  clearFilter: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  emptyCard: {
    alignItems: "center",
    padding: 28,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.extraBold,
    textAlign: "center",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 6,
  },
});
