import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { colors } from "@/theme/colors";
import {
  TRANSACTION_CATEGORY_OPTIONS,
  TransactionCategory,
  TransactionFormValues,
  TransactionType,
} from "@/types/transaction";
import { getTodayDateInput } from "@/utils/transaction";

interface TransactionFormProps {
  initialValues?: TransactionFormValues;
  isSaving: boolean;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (values: TransactionFormValues) => void;
}

export function TransactionForm({
  initialValues,
  isSaving,
  submitLabel,
  onCancel,
  onSubmit,
}: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(
    initialValues?.type || "ENTRADA",
  );
  const [category, setCategory] = useState<TransactionCategory>(
    initialValues?.category || "DIZIMO",
  );
  const [value, setValue] = useState(initialValues?.value || "");
  const [date, setDate] = useState(
    initialValues?.date || getTodayDateInput(),
  );
  const [description, setDescription] = useState(
    initialValues?.description || "",
  );

  function handleSubmit() {
    onSubmit({
      type,
      category,
      value,
      date,
      description,
      memberId: initialValues?.memberId,
    });
  }

  return (
    <View style={styles.form}>
      <View style={styles.typeSelector}>
        <Pressable
          accessibilityRole="radio"
          accessibilityState={{ checked: type === "ENTRADA" }}
          onPress={() => setType("ENTRADA")}
          style={[
            styles.typeOption,
            type === "ENTRADA" && styles.incomeOption,
          ]}
        >
          <Text
            style={[
              styles.typeLabel,
              type === "ENTRADA" && styles.selectedTypeLabel,
            ]}
          >
            Entrada
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="radio"
          accessibilityState={{ checked: type === "SAIDA" }}
          onPress={() => setType("SAIDA")}
          style={[
            styles.typeOption,
            type === "SAIDA" && styles.expenseOption,
          ]}
        >
          <Text
            style={[
              styles.typeLabel,
              type === "SAIDA" && styles.selectedTypeLabel,
            ]}
          >
            Saída
          </Text>
        </Pressable>
      </View>

      <AppInput
        keyboardType="decimal-pad"
        label="Valor"
        onChangeText={setValue}
        placeholder="Digite o valor"
        value={value}
      />

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Categoria</Text>
        <View style={styles.categoryOptions}>
          {TRANSACTION_CATEGORY_OPTIONS.map((option) => {
            const isSelected = category === option.value;

            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                onPress={() => setCategory(option.value)}
                style={[
                  styles.categoryOption,
                  isSelected && styles.selectedCategory,
                ]}
              >
                <Text
                  style={[
                    styles.categoryLabel,
                    isSelected && styles.selectedCategoryLabel,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <AppInput
        label="Data"
        onChangeText={setDate}
        placeholder="AAAA-MM-DD"
        value={date}
      />

      <AppInput
        label="Descrição (opcional)"
        multiline
        numberOfLines={4}
        onChangeText={setDescription}
        placeholder="Digite uma descrição"
        style={styles.description}
        textAlignVertical="top"
        value={description}
      />

      <View style={styles.actions}>
        <AppButton
          isLoading={isSaving}
          onPress={handleSubmit}
          title={submitLabel}
        />
        <AppButton
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
    gap: 18,
  },
  typeSelector: {
    flexDirection: "row",
    gap: 8,
  },
  typeOption: {
    flex: 1,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  incomeOption: {
    borderColor: colors.success,
    backgroundColor: colors.success,
  },
  expenseOption: {
    borderColor: colors.danger,
    backgroundColor: colors.danger,
  },
  typeLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  selectedTypeLabel: {
    color: colors.surface,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  categoryOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryOption: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 9,
    backgroundColor: colors.surface,
  },
  selectedCategory: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  categoryLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  selectedCategoryLabel: {
    color: colors.primaryDark,
    fontWeight: "800",
  },
  description: {
    minHeight: 104,
    paddingTop: 13,
  },
  actions: {
    gap: 10,
    marginTop: 4,
    paddingBottom: 24,
  },
});
