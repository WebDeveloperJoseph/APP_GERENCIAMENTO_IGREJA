import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { ImagePickerAsset } from "expo-image-picker";

import { AssetForm } from "@/components/AssetForm";
import { ScreenHeader } from "@/components/ScreenHeader";
import { api } from "@/services/api";
import { uploadImage } from "@/services/uploadImage";
import { colors } from "@/theme/colors";
import { AssetFormValues } from "@/types/asset";
import { parseAssetValue } from "@/utils/asset";
import { isValidDateInput } from "@/utils/transaction";

export function CreateAssetScreen() {
  const [isSaving, setIsSaving] = useState(false);

  async function handleCreateAsset(
    values: AssetFormValues,
    image: ImagePickerAsset | null,
  ) {
    const parsedValue = parseAssetValue(values.value);

    if (!values.name.trim() || !values.category.trim()) {
      Alert.alert("Campos obrigatórios", "Informe o nome e a categoria.");
      return;
    }

    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      Alert.alert("Valor inválido", "Informe um valor igual ou maior que zero.");
      return;
    }

    if (
      values.acquisitionDate &&
      !isValidDateInput(values.acquisitionDate)
    ) {
      Alert.alert("Data inválida", "Informe a data no formato DD/MM/AAAA.");
      return;
    }

    try {
      setIsSaving(true);
      const imageUrl = image
        ? await uploadImage(image)
        : values.imageUrl || null;

      await api.post("/assets", {
        ...values,
        imageUrl,
        value: parsedValue,
        acquisitionDate: values.acquisitionDate || null,
      });

      Alert.alert("Sucesso", "Bem patrimonial cadastrado com sucesso.");
      router.replace("/patrimonio");
    } catch (error: any) {
      console.log(
        "ERRO AO CADASTRAR PATRIMÔNIO:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível cadastrar o patrimônio.",
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
      <ScreenHeader onBack={() => router.back()} title="Novo patrimônio" />

      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.content}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <AssetForm
          isSaving={isSaving}
          onCancel={() => router.back()}
          onSubmit={handleCreateAsset}
          submitLabel="Cadastrar"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 36,
    backgroundColor: colors.surface,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 22,
    paddingBottom: 140,
  },
});
