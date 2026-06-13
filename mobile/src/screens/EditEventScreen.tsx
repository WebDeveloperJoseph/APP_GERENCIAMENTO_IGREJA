import { router, useLocalSearchParams } from "expo-router";
import { ImagePickerAsset } from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { EventForm } from "@/components/EventForm";
import { ScreenHeader } from "@/components/ScreenHeader";
import { api } from "@/services/api";
import { syncEventsWithDeviceCalendar } from "@/services/calendarSync";
import { uploadImage } from "@/services/uploadImage";
import { colors, radii, spacing } from "@/theme";
import { ChurchEvent, EventFormValues } from "@/types/event";
import {
  eventToFormValues,
  eventValuesToPayload,
  parseLocalDateTime,
} from "@/utils/event";

export function EditEventScreen() {
  const { id: idParam } = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const [event, setEvent] = useState<ChurchEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data.data);
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

  async function handleUpdateEvent(
    values: EventFormValues,
    coverImage: ImagePickerAsset | null,
  ) {
    if (!id) {
      return;
    }

    const payload = eventValuesToPayload(values);

    if (!values.title.trim()) {
      Alert.alert("Campo obrigatório", "Informe o título do evento.");
      return;
    }

    if (!payload) {
      Alert.alert(
        "Data inválida",
        "Informe as datas em AAAA-MM-DD e os horários em HH:MM.",
      );
      return;
    }

    const startDate = parseLocalDateTime(values.startDate, values.startTime);
    const endDate = parseLocalDateTime(values.endDate, values.endTime);

    if (startDate && endDate && endDate < startDate) {
      Alert.alert(
        "Período inválido",
        "O término não pode ser anterior ao início do evento.",
      );
      return;
    }

    try {
      setIsSaving(true);
      const coverImageUrl = coverImage
        ? await uploadImage(coverImage)
        : values.coverImageUrl || null;

      const response = await api.put(`/events/${id}`, {
        ...payload,
        coverImageUrl,
      });
      void syncEventsWithDeviceCalendar([response.data.data]).catch(
        (calendarError) => {
          console.log("ERRO AO SINCRONIZAR CALENDARIO:", calendarError);
        },
      );

      Alert.alert("Sucesso", "Evento atualizado com sucesso.");
      router.replace({
        pathname: "/events/[id]",
        params: { id },
      });
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível atualizar o evento.",
      );
    } finally {
      setIsSaving(false);
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
        <ScreenHeader onBack={() => router.back()} title="Editar evento" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Evento não encontrado.</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      style={styles.screen}
    >
      <ScreenHeader onBack={() => router.back()} title="Editar evento" />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.content}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <EventForm
          initialValues={eventToFormValues(event)}
          isSaving={isSaving}
          onCancel={() => router.back()}
          onSubmit={handleUpdateEvent}
          submitLabel="Salvar alterações"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 36,
    backgroundColor: colors.background,
  },
  content: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.lg,
    paddingBottom: 140,
    margin: spacing.xl,
    backgroundColor: colors.card,
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
});
