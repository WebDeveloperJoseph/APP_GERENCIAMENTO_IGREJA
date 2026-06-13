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
import { syncEventsWithDeviceCalendar } from "@/services/calendarSync";
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
  const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);

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
      void syncEventsWithDeviceCalendar(response.data.data).catch(
        (calendarError) => {
          console.log("ERRO AO SINCRONIZAR CALENDARIO:", calendarError);
        },
      );

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

  async function handleSyncCalendar() {
    try {
      setIsSyncingCalendar(true);
      const response = await api.get("/events");
      const result = await syncEventsWithDeviceCalendar(response.data.data);

      if (result.status === "permission-denied") {
        Alert.alert(
          "Permissao necessaria",
          "Autorize o APP ICB a acessar o calendario nas configuracoes do celular.",
        );
        return;
      }

      if (result.status === "unavailable") {
        Alert.alert(
          "Agenda indisponivel",
          "A sincronizacao com a agenda nao esta disponivel neste dispositivo.",
        );
        return;
      }

      Alert.alert(
        "Agenda sincronizada",
        result.syncedCount > 0
          ? `${result.syncedCount} evento(s) foram adicionados ou atualizados no calendario APP ICB.`
          : "Sua agenda ja esta atualizada.",
      );
    } catch (error: any) {
      Alert.alert(
        "Erro na agenda",
        error.message || "Nao foi possivel sincronizar o calendario.",
      );
    } finally {
      setIsSyncingCalendar(false);
    }
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
                <Pressable
                  disabled={isSyncingCalendar}
                  onPress={handleSyncCalendar}
                  style={({ pressed }) => [
                    styles.syncButton,
                    pressed && styles.syncButtonPressed,
                    isSyncingCalendar && styles.syncButtonDisabled,
                  ]}
                >
                  <Text style={styles.syncButtonText}>
                    {isSyncingCalendar
                      ? "Sincronizando agenda..."
                      : "Sincronizar agenda do celular"}
                  </Text>
                </Pressable>
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
  syncButton: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.primaryLight,
  },
  syncButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.extraBold,
  },
  syncButtonPressed: {
    opacity: 0.72,
  },
  syncButtonDisabled: {
    opacity: 0.55,
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
