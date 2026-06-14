import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppButton } from "@/components/AppButton";
import { SectionCard } from "@/components/SectionCard";
import { ScreenHeader } from "@/components/ScreenHeader";
import { api } from "@/services/api";
import { shareEventAsICS } from "@/services/calendar/shareEventAsICS";
import { colors, radii, spacing, typography } from "@/theme";
import { ChurchEvent } from "@/types/event";
import { formatEventPeriod } from "@/utils/event";
import {
  canManageEvents,
  CurrentUserAccess,
  getCurrentUserAccess,
} from "@/utils/permissions";

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export function EventDetailsScreen() {
  const { id: idParam } = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const [event, setEvent] = useState<ChurchEvent | null>(null);
  const [access, setAccess] = useState<CurrentUserAccess | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSharingCalendar, setIsSharingCalendar] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const [response, storedMember] = await Promise.all([
          api.get(`/events/${id}`),
          getCurrentUserAccess(),
        ]);

        setEvent(response.data.data);

        setAccess(storedMember);
      } catch (error: any) {
        Alert.alert(
          "Erro",
          error.response?.data?.message ||
            "Não foi possível carregar o evento.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  async function deleteEvent() {
    if (!id) {
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete(`/events/${id}`);

      Alert.alert("Sucesso", "Evento excluído com sucesso.");
      router.replace("/events");
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível excluir o evento.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function handleDeleteEvent() {
    Alert.alert(
      "Excluir evento",
      "Esta ação não poderá ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: deleteEvent },
      ],
    );
  }

  async function handleAddToCalendar() {
    if (!event) {
      return;
    }

    try {
      setIsSharingCalendar(true);
      await shareEventAsICS({
        title: event.title,
        description: event.description,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
      });
    } catch (error) {
      Alert.alert(
        "Erro na agenda",
        error instanceof Error
          ? error.message
          : "Nao foi possivel compartilhar o evento.",
      );
    } finally {
      setIsSharingCalendar(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>Carregando evento...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.screen}>
        <ScreenHeader onBack={() => router.back()} title="Evento" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Evento não encontrado.</Text>
        </View>
      </View>
    );
  }

  const startDate = new Date(event.startDate);
  const day = String(startDate.getDate()).padStart(2, "0");
  const month = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
    startDate,
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        actionLabel={canManageEvents(access) ? "Editar" : undefined}
        onActionPress={
          canManageEvents(access)
            ? () =>
                router.push({
                  pathname: "/events/edit/[id]",
                  params: { id: event.id },
                })
            : undefined
        }
        onBack={() => router.back()}
        title="Detalhes do evento"
      />

      <ScrollView contentContainerStyle={styles.content}>
        {event.coverImageUrl ? (
          <ImageBackground
            imageStyle={styles.heroImage}
            source={{ uri: event.coverImageUrl }}
            style={styles.hero}
          >
            <View style={styles.heroOverlay} />
            <Text style={styles.heroTitle}>{event.title}</Text>
          </ImageBackground>
        ) : null}
        <View style={styles.summary}>
          <View style={styles.dateBadge}>
            <Text style={styles.day}>{day}</Text>
            <Text style={styles.month}>{month}</Text>
          </View>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.period}>
            {formatEventPeriod(event.startDate, event.endDate)}
          </Text>
        </View>

        <SectionCard style={styles.details}>
          <DetailRow
            label="Local"
            value={event.location || "Não informado"}
          />
          <DetailRow
            label="Visibilidade"
            value={event.isPublic ? "Público" : "Interno"}
          />
          <DetailRow
            label="Criado por"
            value={event.createdBy?.name || "Não informado"}
          />
        </SectionCard>

        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionLabel}>Descrição</Text>
          <Text style={styles.description}>
            {event.description || "Sem descrição."}
          </Text>
        </View>

        <View style={styles.actions}>
          <AppButton
            isLoading={isSharingCalendar}
            onPress={handleAddToCalendar}
            title="Adicionar à agenda"
          />
          {canManageEvents(access) ? (
            <AppButton
              isLoading={isDeleting}
              onPress={handleDeleteEvent}
              title="Excluir evento"
              variant="danger"
            />
          ) : null}
          <AppButton
            onPress={() => router.back()}
            title="Voltar"
            variant="secondary"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 36,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.textMuted,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  summary: {
    alignItems: "center",
    marginBottom: 28,
  },
  hero: {
    height: 190,
    overflow: "hidden",
    justifyContent: "flex-end",
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
  },
  heroImage: {
    borderRadius: radii.xl,
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(4, 25, 70, 0.55)",
  },
  heroTitle: {
    color: colors.surface,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.extraBold,
  },
  dateBadge: {
    minWidth: 100,
    minHeight: 92,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: radii.xl,
    paddingHorizontal: 18,
    backgroundColor: colors.secondaryLight,
  },
  day: {
    color: colors.secondary,
    fontSize: 40,
    fontWeight: "800",
  },
  month: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.extraBold,
    textAlign: "center",
    marginTop: 16,
  },
  period: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    textAlign: "center",
    marginTop: 7,
  },
  details: {
    marginBottom: 24,
  },
  detailRow: {
    minHeight: 49,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 16,
  },
  detailLabel: {
    color: colors.text,
    fontSize: 13,
  },
  detailValue: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "right",
  },
  descriptionSection: {
    marginBottom: 26,
  },
  descriptionLabel: {
    color: colors.text,
    fontSize: 13,
    marginBottom: 8,
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    padding: 14,
    backgroundColor: colors.background,
  },
  actions: {
    gap: 10,
  },
});
