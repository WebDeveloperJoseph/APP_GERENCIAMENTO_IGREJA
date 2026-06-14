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

import { ScreenHeader } from "@/components/ScreenHeader";
import { TransactionForm } from "@/components/TransactionForm";
import { api } from "@/services/api";
import { colors, radii, spacing } from "@/theme";
import {
  Transaction,
  TransactionFormValues,
} from "@/types/transaction";
import {
  isValidDateInput,
  parseTransactionValue,
  toDateInput,
} from "@/utils/transaction";

export function EditTransactionScreen() {
  const { id: idParam } = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadTransaction() {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get(`/transactions/${id}`);
        setTransaction(response.data.data);
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

  async function handleUpdateTransaction(values: TransactionFormValues) {
    if (!id) {
      return;
    }

    const parsedValue = parseTransactionValue(values.value);

    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      Alert.alert("Valor inválido", "Informe um valor maior que zero.");
      return;
    }

    if (!isValidDateInput(values.date)) {
      Alert.alert("Data inválida", "Informe a data no formato DD/MM/AAAA.");
      return;
    }

    try {
      setIsSaving(true);

      await api.put(`/transactions/${id}`, {
        type: values.type,
        category: values.category,
        value: parsedValue,
        date: values.date,
        description: values.description || null,
        memberId: values.memberId,
      });

      Alert.alert("Sucesso", "Transação atualizada com sucesso.");
      router.replace({
        pathname: "/transactions/[id]",
        params: { id },
      });
    } catch (error: any) {
      console.log(
        "ERRO AO ATUALIZAR TRANSAÇÃO:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível atualizar a transação.",
      );
    } finally {
      setIsSaving(false);
    }
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
        <ScreenHeader onBack={() => router.back()} title="Editar transação" />
        <View style={styles.notFound}>
          <Text style={styles.loadingText}>Transação não encontrada.</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.screen}
    >
      <ScreenHeader onBack={() => router.back()} title="Editar transação" />

      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.content}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <TransactionForm
          initialValues={{
            type: transaction.type,
            category: transaction.category,
            value: String(transaction.value),
            date: toDateInput(transaction.date),
            description: transaction.description || "",
            memberId: transaction.memberId || undefined,
          }}
          isSaving={isSaving}
          onCancel={() => router.back()}
          onSubmit={handleUpdateTransaction}
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
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.lg,
    margin: spacing.xl,
    backgroundColor: colors.card,
  },
});
