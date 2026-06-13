import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppSearchInput } from "@/components/AppSearchInput";
import { BottomNavigation } from "@/components/BottomNavigation";
import { MemberListItem } from "@/components/MemberListItem";
import { ScreenHeader } from "@/components/ScreenHeader";
import { api } from "@/services/api";
import { colors, radii, spacing, typography } from "@/theme";
import { Member } from "@/types/member";

type MemberFilter = "TODOS" | "ATIVOS" | "INATIVOS";

export function MembersScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<MemberFilter>("TODOS");
  const [isLoading, setIsLoading] = useState(true);

  const activeCount = members.filter((member) => member.isActive !== false).length;
  const inactiveCount = members.length - activeCount;

  const filteredMembers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return members.filter((member) => {
      const isActive = member.isActive !== false;
      const matchesStatus =
        filter === "TODOS" ||
        (filter === "ATIVOS" && isActive) ||
        (filter === "INATIVOS" && !isActive);
      const matchesSearch =
        !normalizedSearch ||
        member.name.toLowerCase().includes(normalizedSearch) ||
        member.email?.toLowerCase().includes(normalizedSearch) ||
        member.phone?.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [filter, members, search]);

  useFocusEffect(
    useCallback(() => {
      async function loadMembers() {
        try {
          setIsLoading(true);

          const storedMember = await AsyncStorage.getItem("@app_icb:member");
          const authenticatedMember = storedMember
            ? JSON.parse(storedMember)
            : null;
          const requests = [api.get("/members")];

          if (authenticatedMember?.isSuperAdmin === true) {
            requests.push(api.get("/members/inactive"));
          }

          const responses = await Promise.all(requests);
          const activeMembers = (responses[0].data.data as Member[]).map(
            (member) => ({ ...member, isActive: true }),
          );
          const inactiveMembers =
            responses[1]?.data.data?.map((member: Member) => ({
              ...member,
              isActive: false,
            })) ?? [];

          setIsSuperAdmin(authenticatedMember?.isSuperAdmin === true);
          setMembers([...activeMembers, ...inactiveMembers]);
        } catch (error: any) {
          console.log(
            "ERRO AO BUSCAR MEMBROS:",
            error.response?.data || error.message,
          );

          Alert.alert(
            "Erro",
            error.response?.data?.message ||
              "Nao foi possivel carregar os membros.",
          );
        } finally {
          setIsLoading(false);
        }
      }

      loadMembers();
    }, []),
  );

  const canCreate = isSuperAdmin;

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Membros" />

      <View style={styles.content}>
        <AppSearchInput
          onChangeText={setSearch}
          placeholder="Buscar membros..."
          value={search}
        />

        <View style={styles.filters}>
          {[
            { label: "Todos", value: "TODOS" as const, count: members.length },
            { label: "Ativos", value: "ATIVOS" as const, count: activeCount },
            {
              label: "Inativos",
              value: "INATIVOS" as const,
              count: inactiveCount,
            },
          ].map((option) => {
            const isSelected = filter === option.value;

            return (
              <Pressable
                key={option.value}
                disabled={option.value === "INATIVOS" && !isSuperAdmin}
                onPress={() => setFilter(option.value)}
                style={[
                  styles.filter,
                  isSelected && styles.selectedFilter,
                  option.value === "INATIVOS" &&
                    !isSuperAdmin &&
                    styles.disabledFilter,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    isSelected && styles.selectedFilterText,
                  ]}
                >
                  {option.label}
                </Text>
                <View
                  style={[
                    styles.countBadge,
                    isSelected && styles.selectedCountBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      isSelected && styles.selectedCountText,
                    ]}
                  >
                    {option.count}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>Carregando membros...</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={[
              styles.list,
              filteredMembers.length === 0 && styles.emptyList,
            ]}
            data={filteredMembers}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <MemberListItem
                member={item}
                onPress={() =>
                  router.push({
                    pathname: "/members/[id]",
                    params: { id: item.id },
                  })
                }
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {search
                  ? "Nenhum membro encontrado."
                  : "Nenhum membro nesta categoria."}
              </Text>
            }
          />
        )}

        {canCreate ? (
          <Pressable
            accessibilityLabel="Cadastrar novo membro"
            onPress={() => router.push("/members/create")}
            style={({ pressed }) => [
              styles.floatingButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.floatingButtonText}>+</Text>
          </Pressable>
        ) : null}
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  filters: {
    flexDirection: "row",
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  filter: {
    flex: 1,
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: radii.sm,
    paddingHorizontal: 4,
    backgroundColor: colors.surface,
  },
  selectedFilter: {
    backgroundColor: colors.primary,
  },
  disabledFilter: {
    opacity: 0.45,
  },
  filterText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  selectedFilterText: {
    color: colors.surface,
  },
  countBadge: {
    minWidth: 21,
    alignItems: "center",
    borderRadius: radii.pill,
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: colors.background,
  },
  selectedCountBadge: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  countText: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: typography.fontWeight.extraBold,
  },
  selectedCountText: {
    color: colors.surface,
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
    paddingBottom: 90,
  },
  emptyList: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  floatingButton: {
    position: "absolute",
    right: spacing.xl,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 7,
  },
  floatingButtonText: {
    color: colors.surface,
    fontSize: 32,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 35,
  },
  pressed: {
    opacity: 0.72,
  },
});
