import { router } from "expo-router";
import { ImagePickerAsset } from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

import { EventForm } from "@/components/EventForm";
import { ScreenHeader } from "@/components/ScreenHeader";
import { api } from "@/services/api";
import { uploadImage } from "@/services/uploadImage";
import { colors, radii, spacing } from "@/theme";
import { EventFormValues } from "@/types/event";
import { eventValuesToPayload, parseLocalDateTime } from "@/utils/event";

export function CreateEventScreen() {
  const [isSaving, setIsSaving] = useState(false);

  async function handleCreateEvent(
    values: EventFormValues,
    coverImage: ImagePickerAsset | null,
  ) {
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

      await api.post("/events", {
        ...payload,
        coverImageUrl,
      });

      Alert.alert("Sucesso", "Evento cadastrado com sucesso.");
      router.replace("/events");
    } catch (error: any) {
      console.log(
        "ERRO AO CADASTRAR EVENTO:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível cadastrar o evento.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      style={styles.screen}
    >
      <ScreenHeader onBack={() => router.back()} title="Novo evento" />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.content}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <EventForm
          isSaving={isSaving}
          onCancel={() => router.back()}
          onSubmit={handleCreateEvent}
          submitLabel="Cadastrar evento"
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
});
