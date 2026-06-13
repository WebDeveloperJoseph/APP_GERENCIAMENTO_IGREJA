import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { AppButton } from "@/components/AppButton";
import { SectionCard } from "@/components/SectionCard";
import { ScreenHeader } from "@/components/ScreenHeader";
import { api } from "@/services/api";
import { colors, spacing, typography } from "@/theme";
import { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  formatDate,
  getTransactionCategoryLabel,
  getTransactionTypeLabel,
} from "@/utils/transaction";
import {
  canManageFinance,
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

export function TransactionDetailsScreen() {
  const { id: idParam } = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [access, setAccess] = useState<CurrentUserAccess | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadTransaction() {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const [response, storedMember] = await Promise.all([
          api.get(`/transactions/${id}`),
          getCurrentUserAccess(),
        ]);

        setTransaction(response.data.data);

        setAccess(storedMember);
      } catch (error: any) {
        console.log(
          "ERRO AO BUSCAR TRANSAÇÃO:",
          error.response?.data || error.message,
        );

        Alert.alert(
          "Erro",
          error.response?.data?.message ||
            "Não foi possível carregar a transação.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadTransaction();
  }, [id]);

  async function deleteTransaction() {
    if (!id) {
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete(`/transactions/${id}`);

      Alert.alert("Sucesso", "Transação excluída com sucesso.");
      router.replace("/transactions");
    } catch (error: any) {
      console.log(
        "ERRO AO EXCLUIR TRANSAÇÃO:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível excluir a transação.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function handleDeleteTransaction() {
    Alert.alert(
      "Excluir transação",
      "Esta ação não poderá ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: deleteTransaction,
        },
      ],
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>Carregando transação...</Text>
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={styles.screen}>
        <ScreenHeader onBack={() => router.back()} title="Transação" />
        <View style={styles.notFound}>
          <Text style={styles.loadingText}>Transação não encontrada.</Text>
        </View>
      </View>
    );
  }

  const isIncome = transaction.type === "ENTRADA";
  const typeColor = isIncome ? colors.success : colors.danger;
  const typeBackground = isIncome ? colors.successLight : colors.dangerLight;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        actionLabel={canManageFinance(access) ? "Editar" : undefined}
        onActionPress={
          canManageFinance(access)
            ? () =>
                router.push({
                  pathname: "/transactions/edit/[id]",
                  params: { id: transaction.id },
                })
            : undefined
        }
        onBack={() => router.back()}
        title="Detalhes da transação"
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summary}>
          <View style={[styles.symbol, { backgroundColor: typeBackground }]}>
            <Text style={[styles.symbolText, { color: typeColor }]}>
              {isIncome ? "↑" : "↓"}
            </Text>
          </View>
          <Text style={styles.category}>
            {getTransactionCategoryLabel(transaction.category)}
          </Text>
          <Text style={[styles.type, { color: typeColor }]}>
            {getTransactionTypeLabel(transaction.type)}
          </Text>
          <Text style={[styles.value, { color: typeColor }]}>
            {formatCurrency(transaction.value)}
          </Text>
        </View>

        <SectionCard style={styles.details}>
          <DetailRow label="Data" value={formatDate(transaction.date)} />
          <DetailRow
            label="Categoria"
            value={getTransactionCategoryLabel(transaction.category)}
          />
          <DetailRow
            label="Membro"
            value={transaction.member?.name || "Não vinculado"}
          />
        </SectionCard>

        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionLabel}>Descrição</Text>
          <Text style={styles.description}>
            {transaction.description || "Sem descrição."}
          </Text>
        </View>

        <View style={styles.actions}>
          {canManageFinance(access) ? (
            <AppButton
              isLoading={isDeleting}
              onPress={handleDeleteTransaction}
              title="Excluir transação"
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
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
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
    borderRadius: 36,
  },
  symbolText: {
    fontSize: 42,
    fontWeight: "600",
  },
  category: {
    color: colors.text,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.extraBold,
    marginTop: 14,
  },
  type: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  value: {
    fontSize: 25,
    fontWeight: "800",
    marginTop: 20,
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
