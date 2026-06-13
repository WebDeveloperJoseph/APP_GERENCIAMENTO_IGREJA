import { ImagePickerAsset } from "expo-image-picker";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { ImagePickerField } from "@/components/ImagePickerField";
import { colors, spacing } from "@/theme";
import {
  ASSET_STATUS_OPTIONS,
  AssetFormValues,
  AssetStatus,
} from "@/types/asset";

interface AssetFormProps {
  initialValues?: AssetFormValues;
  isSaving: boolean;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (
    values: AssetFormValues,
    image: ImagePickerAsset | null,
  ) => void;
}

export function AssetForm({
  initialValues,
  isSaving,
  submitLabel,
  onCancel,
  onSubmit,
}: AssetFormProps) {
  const [name, setName] = useState(initialValues?.name || "");
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl || "");
  const [image, setImage] = useState<ImagePickerAsset | null>(null);
  const [description, setDescription] = useState(
    initialValues?.description || "",
  );
  const [category, setCategory] = useState(initialValues?.category || "");
  const [value, setValue] = useState(initialValues?.value || "");
  const [acquisitionDate, setAcquisitionDate] = useState(
    initialValues?.acquisitionDate || "",
  );
  const [location, setLocation] = useState(initialValues?.location || "");
  const [status, setStatus] = useState<AssetStatus>(
    initialValues?.status || "ATIVO",
  );

  function handleSubmit() {
    onSubmit(
      {
        name,
        imageUrl,
        description,
        category,
        value,
        acquisitionDate,
        location,
        status,
      },
      image,
    );
  }

  return (
    <View style={styles.form}>
      <ImagePickerField
        aspect={[4, 3]}
        imageUrl={image?.uri || imageUrl}
        label="Foto do bem"
        onChange={(asset) => {
          setImage(asset);

          if (!asset) {
            setImageUrl("");
          }
        }}
      />

      <AppInput
        label="Nome do bem"
        onChangeText={setName}
        placeholder="Ex.: Mesa de som"
        returnKeyType="next"
        value={name}
      />
      <AppInput
        label="Categoria"
        onChangeText={setCategory}
        placeholder="Ex.: Audio, Moveis, Veiculos"
        returnKeyType="next"
        value={category}
      />
      <AppInput
        keyboardType="decimal-pad"
        label="Valor"
        onChangeText={setValue}
        placeholder="Digite o valor"
        value={value}
      />
      <AppInput
        keyboardType="numbers-and-punctuation"
        label="Data de aquisicao (opcional)"
        maxLength={10}
        onChangeText={setAcquisitionDate}
        placeholder="AAAA-MM-DD"
        value={acquisitionDate}
      />
      <AppInput
        label="Localizacao (opcional)"
        onChangeText={setLocation}
        placeholder="Ex.: Templo principal"
        returnKeyType="next"
        value={location}
      />
      <AppInput
        label="Descricao (opcional)"
        multiline
        numberOfLines={4}
        onChangeText={setDescription}
        placeholder="Descreva o bem"
        style={styles.description}
        textAlignVertical="top"
        value={description}
      />

      <View style={styles.field}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.statusOptions}>
          {ASSET_STATUS_OPTIONS.map((option) => {
            const isSelected = status === option.value;

            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                onPress={() => setStatus(option.value)}
                style={[
                  styles.statusOption,
                  isSelected && styles.selectedStatus,
                ]}
              >
                <Text
                  style={[
                    styles.statusLabel,
                    isSelected && styles.selectedStatusLabel,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.actions}>
        <AppButton
          isLoading={isSaving}
          onPress={handleSubmit}
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
  description: {
    minHeight: 104,
    paddingTop: spacing.md,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  statusOptions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statusOption: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    backgroundColor: colors.surface,
  },
  selectedStatus: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  statusLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
  },
  selectedStatusLabel: {
    color: colors.surface,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});
