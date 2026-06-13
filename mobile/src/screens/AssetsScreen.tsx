import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";

import { AppSearchInput } from "@/components/AppSearchInput";
import { AssetListItem } from "@/components/AssetListItem";
import { BottomNavigation } from "@/components/BottomNavigation";
import { FilterChip } from "@/components/FilterChip";
import { ScreenHeader } from "@/components/ScreenHeader";
import { api } from "@/services/api";
import { colors } from "@/theme/colors";
import { Asset, AssetStatus } from "@/types/asset";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  canManageAssets,
  CurrentUserAccess,
  getCurrentUserAccess,
} from "@/utils/permissions";

type AssetStatusFilter = "TODOS" | AssetStatus;
type AssetSort = "RECENTES" | "MAIOR_VALOR" | "MENOR_VALOR" | "NOME";

const statusOptions: {
  label: string;
  value: AssetStatusFilter;
}[] = [
  { label: "Todos", value: "TODOS" },
  { label: "Ativos", value: "ATIVO" },
  { label: "Manutenção", value: "MANUTENCAO" },
  { label: "Baixados", value: "BAIXADO" },
];

const sortOptions: { label: string; value: AssetSort }[] = [
  { label: "Recentes", value: "RECENTES" },
  { label: "Maior valor", value: "MAIOR_VALOR" },
  { label: "Menor valor", value: "MENOR_VALOR" },
  { label: "Nome", value: "NOME" },
];

export function AssetsScreen() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AssetStatusFilter>("TODOS");
  const [category, setCategory] = useState("TODAS");
  const [sort, setSort] = useState<AssetSort>("RECENTES");
  const [isLoading, setIsLoading] = useState(true);
  const [access, setAccess] = useState<CurrentUserAccess | null>(null);

  const categoryOptions = useMemo(() => {
    const categories = Array.from(
      new Set(assets.map((asset) => asset.category.trim()).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b, "pt-BR"));

    return ["TODAS", ...categories];
  }, [assets]);

  const filteredAssets = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = assets.filter((asset) => {
      const matchesSearch =
        !normalizedSearch ||
        asset.name.toLowerCase().includes(normalizedSearch) ||
        asset.category.toLowerCase().includes(normalizedSearch) ||
        asset.location?.toLowerCase().includes(normalizedSearch);
      const matchesStatus = status === "TODOS" || asset.status === status;
      const matchesCategory =
        category === "TODAS" || asset.category === category;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    return [...result].sort((first, second) => {
      if (sort === "MAIOR_VALOR") {
        return second.value - first.value;
      }

      if (sort === "MENOR_VALOR") {
        return first.value - second.value;
      }

      if (sort === "NOME") {
        return first.name.localeCompare(second.name, "pt-BR");
      }

      return (
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime()
      );
    });
  }, [assets, category, search, sort, status]);

  const totalValue = filteredAssets.reduce(
    (total, asset) => total + asset.value,
    0,
  );

  useFocusEffect(
    useCallback(() => {
      async function loadAssets() {
        try {
          setIsLoading(true);

          const [response, currentAccess] = await Promise.all([
            api.get("/assets"),
            getCurrentUserAccess(),
          ]);
          setAssets(response.data.data);
          setAccess(currentAccess);
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

      loadAssets();
    }, []),
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        actionLabel={canManageAssets(access) ? "+ Novo" : undefined}
        onActionPress={
          canManageAssets(access)
            ? () => router.push("/patrimonio/create")
            : undefined
        }
        title="Patrimônio"
      />

      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Valor dos bens filtrados</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalValue)}</Text>
          <Text style={styles.summaryCount}>
            {filteredAssets.length}{" "}
            {filteredAssets.length === 1 ? "bem exibido" : "bens exibidos"}
          </Text>
        </View>

        <AppSearchInput
          onChangeText={setSearch}
          placeholder="Buscar bem patrimonial..."
          value={search}
        />

        <View style={styles.filters}>
          <Text style={styles.filterTitle}>Status</Text>
          <ScrollView
            horizontal
            contentContainerStyle={styles.filterRow}
            showsHorizontalScrollIndicator={false}
          >
            {statusOptions.map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                onPress={() => setStatus(option.value)}
                selected={status === option.value}
              />
            ))}
          </ScrollView>

          <Text style={styles.filterTitle}>Categoria</Text>
          <ScrollView
            horizontal
            contentContainerStyle={styles.filterRow}
            showsHorizontalScrollIndicator={false}
          >
            {categoryOptions.map((option) => (
              <FilterChip
                key={option}
                label={option === "TODAS" ? "Todas" : option}
                onPress={() => setCategory(option)}
                selected={category === option}
              />
            ))}
          </ScrollView>

          <Text style={styles.filterTitle}>Ordenar</Text>
          <ScrollView
            horizontal
            contentContainerStyle={styles.filterRow}
            showsHorizontalScrollIndicator={false}
          >
            {sortOptions.map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                onPress={() => setSort(option.value)}
                selected={sort === option.value}
              />
            ))}
          </ScrollView>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>Carregando patrimônio...</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={[
              styles.list,
              filteredAssets.length === 0 && styles.emptyList,
            ]}
            data={filteredAssets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AssetListItem
                asset={item}
                onPress={() =>
                  router.push({
                    pathname: "/patrimonio/[id]",
                    params: { id: item.id },
                  })
                }
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyCard}>
                <Text style={styles.emptySymbol}>◇</Text>
                <Text style={styles.emptyTitle}>
                  Nenhum bem encontrado
                </Text>
                <Text style={styles.emptyText}>
                  Altere a busca ou os filtros para visualizar outros bens.
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
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  summaryCard: {
    borderRadius: 14,
    padding: 18,
    backgroundColor: colors.navy,
  },
  summaryLabel: {
    color: colors.surface,
    fontSize: 13,
    opacity: 0.82,
  },
  summaryValue: {
    color: colors.surface,
    fontSize: 27,
    fontWeight: "800",
    marginTop: 7,
  },
  summaryCount: {
    color: colors.surface,
    fontSize: 12,
    opacity: 0.72,
    marginTop: 5,
  },
  filters: {
    gap: 8,
  },
  filterTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800",
  },
  filterRow: {
    gap: 8,
    paddingRight: 16,
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
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyCard: {
    alignItems: "center",
    padding: 28,
  },
  emptySymbol: {
    color: colors.primary,
    fontSize: 42,
    fontWeight: "800",
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 12,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 6,
  },
});
