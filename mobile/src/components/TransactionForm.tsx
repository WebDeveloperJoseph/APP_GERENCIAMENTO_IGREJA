import { useState, useEffect, useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { api } from "@/services/api"; // Ajuste o caminho se necessário
import { AppButton } from "@/components/AppButton";
import { AppDateInput } from "@/components/AppDateInput";
import { AppInput } from "@/components/AppInput";
import { colors } from "@/theme/colors";
import {
  TRANSACTION_CATEGORY_OPTIONS,
  TransactionCategory,
  TransactionFormValues,
  TransactionType,
} from "@/types/transaction";
import { getTodayDateInput } from "@/utils/transaction";

interface Member {
  id: string;
  name: string;
}

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
  const [date, setDate] = useState(initialValues?.date || getTodayDateInput());
  const [description, setDescription] = useState(
    initialValues?.description || "",
  );

  // 🔑 Estados para controle dos membros e pesquisa
  const [memberId, setMemberId] = useState<string>(
    initialValues?.memberId || "",
  );
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Estado do texto de busca

  // 🔄 Carrega os membros da API quando a categoria for dízimo
  useEffect(() => {
    async function loadMembers() {
      if (category !== "DIZIMO") {
        setMemberId("");
        setSearchQuery(""); // Limpa o campo de busca se mudar de categoria
        return;
      }

      try {
        setIsLoadingMembers(true);
        const response = await api.get<{ data: Member[] }>("/members");

        if (response.data && response.data.data) {
          setMembers(response.data.data);
        }
      } catch (error) {
        console.error("Erro ao carregar membros para o financeiro:", error);
      } finally {
        setIsLoadingMembers(false);
      }
    }

    loadMembers();
  }, [category]);

  // 🔍 Filtra os membros dinamicamente com base no que o tesoureiro digitou
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;

    return members.filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, members]);

  function handleSubmit() {
    onSubmit({
      type,
      category,
      value,
      date,
      description,
      memberId: category === "DIZIMO" && memberId ? memberId : undefined,
    });
  }

  return (
    <View style={styles.form}>
      <View style={styles.typeSelector}>
        <Pressable
          accessibilityRole="radio"
          accessibilityState={{ checked: type === "ENTRADA" }}
          onPress={() => setType("ENTRADA")}
          style={[styles.typeOption, type === "ENTRADA" && styles.incomeOption]}
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
          style={[styles.typeOption, type === "SAIDA" && styles.expenseOption]}
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

      {/* 🔑 SELETOR DE MEMBROS COM CAMPO DE PESQUISA */}
      {category === "DIZIMO" && (
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Vincular Membro (Dizimista)</Text>

          {isLoadingMembers ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Carregando dizimistas...</Text>
            </View>
          ) : (
            <View style={styles.memberSelectorContainer}>
              {/* Campo de Pesquisa em tempo real */}
              <AppInput
                label="Buscar membro"
                placeholder="🔍 Digite o nome para buscar..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchBar}
              />

              {filteredMembers.length === 0 ? (
                <Text style={styles.emptyText}>
                  {members.length === 0
                    ? "Nenhum membro cadastrado nesta igreja."
                    : "Nenhum membro encontrado com esse nome."}
                </Text>
              ) : (
                /* ScrollView interno com tamanho fixo para não quebrar o layout da tela */
                <ScrollView
                  style={styles.membersScroll}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={styles.memberGrid}>
                    {filteredMembers.map((member) => {
                      const isSelected = memberId === member.id;

                      return (
                        <Pressable
                          key={member.id}
                          onPress={() => setMemberId(member.id)}
                          style={[
                            styles.memberItem,
                            isSelected && styles.selectedMemberItem,
                          ]}
                        >
                          <Text
                            style={[
                              styles.memberItemLabel,
                              isSelected && styles.selectedMemberItemLabel,
                            ]}
                            numberOfLines={1}
                          >
                            {member.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
              )}
            </View>
          )}
        </View>
      )}

      <AppDateInput label="Data" onChangeDate={setDate} value={date} />

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
        <AppButton onPress={onCancel} title="Cancelar" variant="secondary" />
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
  /* 🔑 Estilizações da Barra de Pesquisa e Lista com Scroll */
  loaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  memberSelectorContainer: {
    width: "100%",
    gap: 8,
  },
  searchBar: {
    marginBottom: 2,
  },
  membersScroll: {
    maxHeight: 180, // Limita a altura da lista para não empurrar os botões da tela para baixo
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    padding: 6,
  },
  memberGrid: {
    flexDirection: "column",
    gap: 4,
  },
  memberItem: {
    width: "100%",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.surface,
  },
  selectedMemberItem: {
    backgroundColor: colors.primaryLight,
  },
  memberItemLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "500",
  },
  selectedMemberItemLabel: {
    color: colors.primaryDark,
    fontWeight: "700",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
    fontStyle: "italic",
    paddingVertical: 6,
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
