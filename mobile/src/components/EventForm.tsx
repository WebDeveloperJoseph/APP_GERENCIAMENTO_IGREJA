import { Ionicons } from "@expo/vector-icons";
import { ImagePickerAsset } from "expo-image-picker";
import { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { ImagePickerField } from "@/components/ImagePickerField";
import { colors, spacing } from "@/theme";
import { EventFormValues } from "@/types/event";
import { getDefaultEventValues } from "@/utils/event";

interface EventFormProps {
  initialValues?: EventFormValues;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (
    values: EventFormValues,
    coverImage: ImagePickerAsset | null,
  ) => void;
  submitLabel: string;
}

export function EventForm({
  initialValues,
  isSaving,
  onCancel,
  onSubmit,
  submitLabel,
}: EventFormProps) {
  const [values, setValues] = useState(
    initialValues || getDefaultEventValues(),
  );
  const [coverImage, setCoverImage] = useState<ImagePickerAsset | null>(null);

  function updateValue<Key extends keyof EventFormValues>(
    field: Key,
    value: EventFormValues[Key],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  return (
    <View style={styles.form}>
      <ImagePickerField
        aspect={[16, 9]}
        imageUrl={coverImage?.uri || values.coverImageUrl}
        label="Imagem de capa"
        onChange={(asset) => {
          setCoverImage(asset);

          if (!asset) {
            updateValue("coverImageUrl", "");
          }
        }}
      />

      <AppInput
        autoCapitalize="sentences"
        label="Titulo *"
        onChangeText={(value) => updateValue("title", value)}
        placeholder="Ex.: Culto de celebracao"
        returnKeyType="next"
        value={values.title}
      />

      <AppInput
        autoCapitalize="sentences"
        label="Descricao"
        multiline
        onChangeText={(value) => updateValue("description", value)}
        placeholder="Informacoes importantes sobre o evento"
        style={styles.multilineInput}
        textAlignVertical="top"
        value={values.description}
      />

      <AppInput
        autoCapitalize="words"
        label="Local"
        onChangeText={(value) => updateValue("location", value)}
        placeholder="Ex.: Templo principal"
        returnKeyType="next"
        value={values.location}
      />

      <View style={styles.sectionHeading}>
        <Ionicons color={colors.primary} name="calendar-outline" size={18} />
        <Text style={styles.sectionTitle}>Inicio *</Text>
      </View>
      <View style={styles.dateRow}>
        <View style={styles.dateField}>
          <AppInput
            autoCapitalize="none"
            keyboardType="numbers-and-punctuation"
            label="Data"
            maxLength={10}
            onChangeText={(value) => updateValue("startDate", value)}
            placeholder="AAAA-MM-DD"
            value={values.startDate}
          />
        </View>
        <View style={styles.timeField}>
          <AppInput
            autoCapitalize="none"
            keyboardType="numbers-and-punctuation"
            label="Hora"
            maxLength={5}
            onChangeText={(value) => updateValue("startTime", value)}
            placeholder="HH:MM"
            value={values.startTime}
          />
        </View>
      </View>

      <View style={styles.sectionHeading}>
        <Ionicons color={colors.primary} name="time-outline" size={18} />
        <Text style={styles.sectionTitle}>Termino *</Text>
      </View>
      <View style={styles.dateRow}>
        <View style={styles.dateField}>
          <AppInput
            autoCapitalize="none"
            keyboardType="numbers-and-punctuation"
            label="Data"
            maxLength={10}
            onChangeText={(value) => updateValue("endDate", value)}
            placeholder="AAAA-MM-DD"
            value={values.endDate}
          />
        </View>
        <View style={styles.timeField}>
          <AppInput
            autoCapitalize="none"
            keyboardType="numbers-and-punctuation"
            label="Hora"
            maxLength={5}
            onChangeText={(value) => updateValue("endTime", value)}
            placeholder="HH:MM"
            value={values.endTime}
          />
        </View>
      </View>

      <View style={styles.visibilityRow}>
        <View style={styles.visibilityText}>
          <Text style={styles.visibilityTitle}>Evento publico</Text>
          <Text style={styles.visibilityDescription}>
            Permite divulgar o evento para toda a igreja.
          </Text>
        </View>
        <Switch
          onValueChange={(value) => updateValue("isPublic", value)}
          thumbColor={colors.surface}
          trackColor={{ false: colors.border, true: colors.primary }}
          value={values.isPublic}
        />
      </View>

      <View style={styles.actions}>
        <AppButton
          isLoading={isSaving}
          onPress={() => onSubmit(values, coverImage)}
          title={submitLabel}
        />
        <AppButton
          disabled={isSaving}
          onPress={onCancel}
          title="Cancelar"
          variant="secondary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
  },
  multilineInput: {
    minHeight: 112,
    paddingTop: spacing.md,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: -8,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  dateRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  dateField: {
    flex: 1.5,
  },
  timeField: {
    flex: 1,
  },
  visibilityRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    gap: spacing.lg,
    backgroundColor: colors.background,
  },
  visibilityText: {
    flex: 1,
  },
  visibilityTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  visibilityDescription: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});
