import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { AppButton } from "@/components/AppButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { api } from "@/services/api";
import { colors } from "@/theme/colors";
import { Asset } from "@/types/asset";
import {
  formatAssetDate,
  getAssetStatusLabel,
} from "@/utils/asset";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  canManageAssets,
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

export function AssetDetailsScreen() {
  const { id: idParam } = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const [asset, setAsset] = useState<Asset | null>(null);
  const [access, setAccess] = useState<CurrentUserAccess | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadAsset() {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const [response, storedMember] = await Promise.all([
          api.get(`/assets/${id}`),
          getCurrentUserAccess(),
        ]);

        setAsset(response.data.data);

        setAccess(storedMember);
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

  async function deleteAsset() {
    if (!id) {
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete(`/assets/${id}`);

      Alert.alert("Sucesso", "Bem patrimonial excluído com sucesso.");
      router.replace("/patrimonio");
    } catch (error: any) {
      console.log(
        "ERRO AO EXCLUIR PATRIMÔNIO:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível excluir o patrimônio.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function handleDeleteAsset() {
    Alert.alert(
      "Excluir patrimônio",
      "Esta ação não poderá ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: deleteAsset,
        },
      ],
    );
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
        <ScreenHeader onBack={() => router.back()} title="Patrimônio" />
        <View style={styles.notFound}>
          <Text style={styles.loadingText}>Patrimônio não encontrado.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader
        actionLabel={canManageAssets(access) ? "Editar" : undefined}
        onActionPress={
          canManageAssets(access)
            ? () =>
                router.push({
                  pathname: "/patrimonio/edit/[id]",
                  params: { id: asset.id },
                })
            : undefined
        }
        onBack={() => router.back()}
        title="Detalhes do patrimônio"
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summary}>
          {asset.imageUrl ? (
            <Image source={{ uri: asset.imageUrl }} style={styles.assetImage} />
          ) : (
            <View style={styles.symbol}>
              <Text style={styles.symbolText}>P</Text>
            </View>
          )}
          <Text style={styles.name}>{asset.name}</Text>
          <Text style={styles.category}>{asset.category}</Text>
          <Text style={styles.value}>{formatCurrency(asset.value)}</Text>
        </View>

        <View style={styles.details}>
          <DetailRow
            label="Status"
            value={getAssetStatusLabel(asset.status)}
          />
          <DetailRow
            label="Data de aquisição"
            value={formatAssetDate(asset.acquisitionDate)}
          />
          <DetailRow
            label="Localização"
            value={asset.location || "Não informada"}
          />
          <DetailRow
            label="Data de cadastro"
            value={new Date(asset.createdAt).toLocaleDateString("pt-BR")}
          />
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionLabel}>Descrição</Text>
          <Text style={styles.description}>
            {asset.description || "Sem descrição."}
          </Text>
        </View>

        <View style={styles.actions}>
          {canManageAssets(access) ? (
            <AppButton
              isLoading={isDeleting}
              onPress={handleDeleteAsset}
              title="Excluir patrimônio"
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
    paddingVertical: 24,
  },
  summary: {
    alignItems: "center",
    marginBottom: 28,
  },
  symbol: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
  },
  symbolText: {
    color: colors.primary,
    fontSize: 38,
    fontWeight: "800",
  },
  assetImage: {
    width: "100%",
    height: 220,
    borderRadius: 18,
    resizeMode: "cover",
  },
  name: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "800",
    marginTop: 14,
  },
  category: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  value: {
    color: colors.navy,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 18,
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
