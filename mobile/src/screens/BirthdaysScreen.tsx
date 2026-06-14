import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BirthdayCard } from "@/components/BirthdayCard";
import { ScreenHeader } from "@/components/ScreenHeader";
import { api } from "@/services/api";
import { colors, radii, spacing, typography } from "@/theme";
import { Member } from "@/types/member";
import {
  getBirthdaysForMonth,
  getCurrentMonthName,
} from "@/utils/birthdayUtils";

export function BirthdaysScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const monthName = getCurrentMonthName();
  const birthdays = useMemo(
    () => getBirthdaysForMonth(members),
    [members],
  );

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function loadBirthdays() {
        try {
          setIsLoading(true);
          const response = await api.get<{ data: Member[] }>("/members");

          if (isMounted) {
            setMembers(response.data.data);
          }
        } catch {
          if (isMounted) {
            Alert.alert(
              "Erro",
              "Nao foi possivel carregar os aniversariantes.",
            );
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }

      void loadBirthdays();

      return () => {
        isMounted = false;
      };
    }, []),
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        onBack={() => router.back()}
        title="Aniversariantes do Mes"
      />

      <View style={styles.content}>
        <View style={styles.monthCard}>
          <Ionicons color={colors.surface} name="gift-outline" size={28} />
          <View>
            <Text style={styles.monthLabel}>ANIVERSARIOS EM</Text>
            <Text style={styles.monthName}>{monthName}</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.count}>{birthdays.length}</Text>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>
              Carregando aniversariantes...
            </Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={[
              styles.list,
              birthdays.length === 0 && styles.emptyList,
            ]}
            data={birthdays}
            keyExtractor={(member) => member.id}
            renderItem={({ item }) => <BirthdayCard member={item} />}
            ListEmptyComponent={
              <View style={styles.emptyCard}>
                <Ionicons
                  color={colors.primary}
                  name="calendar-outline"
                  size={48}
                />
                <Text style={styles.emptyTitle}>
                  Nenhum aniversariante neste mes
                </Text>
                <Text style={styles.emptyText}>
                  Os membros com data de nascimento cadastrada aparecerao aqui.
                </Text>
              </View>
            }
          />
        )}
      </View>
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
  monthCard: {
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: colors.primaryDark,
  },
  monthLabel: {
    color: "#8EABD7",
    fontSize: 10,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: 1,
  },
  monthName: {
    color: colors.surface,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.extraBold,
    marginTop: 3,
  },
  countBadge: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginLeft: "auto",
    backgroundColor: colors.secondary,
  },
  count: {
    color: colors.surface,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.extraBold,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  loadingText: {
    color: colors.textMuted,
  },
  list: {
    paddingBottom: spacing.xxl,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyCard: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.xxxl,
    backgroundColor: colors.card,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.extraBold,
    textAlign: "center",
    marginTop: spacing.lg,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    textAlign: "center",
    marginTop: spacing.sm,
  },
});
