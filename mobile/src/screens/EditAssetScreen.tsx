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
import { router, useLocalSearchParams } from "expo-router";
import { ImagePickerAsset } from "expo-image-picker";

import { AssetForm } from "@/components/AssetForm";
import { ScreenHeader } from "@/components/ScreenHeader";
import { api } from "@/services/api";
import { uploadImage } from "@/services/uploadImage";
import { colors } from "@/theme/colors";
import { Asset, AssetFormValues } from "@/types/asset";
import { parseAssetValue } from "@/utils/asset";
import { isValidDateInput } from "@/utils/transaction";

export function EditAssetScreen() {
  const { id: idParam } = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const [asset, setAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadAsset() {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get(`/assets/${id}`);
        setAsset(response.data.data);
      } catch (error: any) {
        console.log(
          "ERRO AO BUSCAR PATRIMÔNIO:",
          error.response?.data || error.message,
        );

        Alert.alert(
          "Erro",
          error.response?.data?.message ||
            "Não foi possível carregar o patrimônio.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadAsset();
  }, [id]);

  async function handleUpdateAsset(
    values: AssetFormValues,
    image: ImagePickerAsset | null,
  ) {
    if (!id) {
      return;
    }

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

      await api.put(`/assets/${id}`, {
        ...values,
        imageUrl,
        value: parsedValue,
        acquisitionDate: values.acquisitionDate || null,
      });

      Alert.alert("Sucesso", "Bem patrimonial atualizado com sucesso.");
      router.replace({
        pathname: "/patrimonio/[id]",
        params: { id },
      });
    } catch (error: any) {
      console.log(
        "ERRO AO ATUALIZAR PATRIMÔNIO:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível atualizar o patrimônio.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>Carregando patrimônio...</Text>
      </View>
    );
  }

  if (!asset) {
    return (
      <View style={styles.screen}>
        <ScreenHeader onBack={() => router.back()} title="Editar patrimônio" />
        <View style={styles.notFound}>
          <Text style={styles.loadingText}>Patrimônio não encontrado.</Text>
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
      <ScreenHeader onBack={() => router.back()} title="Editar patrimônio" />

      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.content}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <AssetForm
          initialValues={{
            name: asset.name,
            imageUrl: asset.imageUrl || "",
            description: asset.description || "",
            category: asset.category,
            value: String(asset.value),
            acquisitionDate: asset.acquisitionDate?.substring(0, 10) || "",
            location: asset.location || "",
            status: asset.status,
          }}
          isSaving={isSaving}
          onCancel={() => router.back()}
          onSubmit={handleUpdateAsset}
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
    backgroundColor: colors.surface,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.surface,
  },
  loadingText: {
    color: colors.textMuted,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 22,
    paddingBottom: 140,
  },
});
