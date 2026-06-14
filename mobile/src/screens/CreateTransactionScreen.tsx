import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

import { ScreenHeader } from "@/components/ScreenHeader";
import { TransactionForm } from "@/components/TransactionForm";
import { api } from "@/services/api";
import { colors, radii, spacing } from "@/theme";
import { TransactionFormValues } from "@/types/transaction";
import {
  isValidDateInput,
  parseTransactionValue,
} from "@/utils/transaction";

export function CreateTransactionScreen() {
  const [isSaving, setIsSaving] = useState(false);

  async function handleCreateTransaction(values: TransactionFormValues) {
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

      await api.post("/transactions", {
        type: values.type,
        category: values.category,
        value: parsedValue,
        date: values.date,
        description: values.description || null,
      });

      Alert.alert("Sucesso", "Transação cadastrada com sucesso.");
      router.replace("/transactions");
    } catch (error: any) {
      console.log(
        "ERRO AO CADASTRAR TRANSAÇÃO:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível cadastrar a transação.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.screen}
    >
      <ScreenHeader onBack={() => router.back()} title="Nova transação" />

      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.content}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <TransactionForm
          isSaving={isSaving}
          onCancel={() => router.back()}
          onSubmit={handleCreateTransaction}
          submitLabel="Salvar"
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
    margin: spacing.xl,
    backgroundColor: colors.card,
  },
});
