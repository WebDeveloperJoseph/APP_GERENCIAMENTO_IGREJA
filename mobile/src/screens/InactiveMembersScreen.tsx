import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import { AppSearchInput } from "@/components/AppSearchInput";
import { BottomNavigation } from "@/components/BottomNavigation";
import { MemberListItem } from "@/components/MemberListItem";
import { ScreenHeader } from "@/components/ScreenHeader";
import { api } from "@/services/api";
import { colors } from "@/theme/colors";
import { Member } from "@/types/member";

function formatInactiveDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

export function InactiveMembersScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const filteredMembers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return members;
    }

    return members.filter((member) => {
      return (
        member.name.toLowerCase().includes(normalizedSearch) ||
        member.email?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [members, search]);

  useEffect(() => {
    async function loadInactiveMembers() {
      try {
        const response = await api.get("/members/inactive");
        setMembers(response.data.data);
      } catch (error: any) {
        console.log(
          "ERRO AO BUSCAR MEMBROS INATIVOS:",
          error.response?.data || error.message,
        );

        Alert.alert(
          "Erro",
          error.response?.data?.message ||
            "Não foi possível carregar os membros inativos.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadInactiveMembers();
  }, []);

  async function restoreMember(member: Member) {
    try {
      setRestoringId(member.id);

      await api.patch(`/members/${member.id}/restore`);

      setMembers((currentMembers) =>
        currentMembers.filter((currentMember) => currentMember.id !== member.id),
      );

      Alert.alert("Sucesso", "Membro restaurado com sucesso.");
    } catch (error: any) {
      console.log(
        "ERRO AO RESTAURAR MEMBRO:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Erro",
        error.response?.data?.message || "Não foi possível restaurar o membro.",
      );
    } finally {
      setRestoringId(null);
    }
  }

  function handleRestoreMember(member: Member) {
    Alert.alert(
      "Restaurar membro",
      `Deseja restaurar ${member.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Restaurar",
          onPress: () => restoreMember(member),
        },
      ],
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader
        onBack={() => router.back()}
        title="Membros inativos"
      />

      <View style={styles.content}>
        <AppSearchInput
          onChangeText={setSearch}
          placeholder="Buscar membro..."
          value={search}
        />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>
              Carregando membros inativos...
            </Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={[
              styles.list,
              filteredMembers.length === 0 && styles.emptyList,
            ]}
            data={filteredMembers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MemberListItem
                disabled={restoringId !== null}
                member={item}
                metadata={`Inativo em: ${formatInactiveDate(item.updatedAt)}`}
                onPress={() => handleRestoreMember(item)}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {search
                  ? "Nenhum membro encontrado."
                  : "Nenhum membro inativo."}
              </Text>
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
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
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
    paddingTop: 12,
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: colors.textMuted,
  },
});
