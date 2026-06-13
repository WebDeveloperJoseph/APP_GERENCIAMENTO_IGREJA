import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { SectionCard } from "@/components/SectionCard";
import { ScreenHeader } from "@/components/ScreenHeader";
import { api } from "@/services/api";
import { colors, radii, spacing, typography } from "@/theme";
import { Member, MemberRole } from "@/types/member";
import { getMemberInitials, getMemberRoleLabel } from "@/utils/member";

function formatDateOnly(date?: string | null) {
  if (!date) {
    return "Não informado";
  }

  const [year, month, day] = date.substring(0, 10).split("-");

  return `${day}/${month}/${year}`;
}

function formatTimestamp(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

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

export function MemberDetailsScreen() {
  const { id: idParam } = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const [member, setMember] = useState<Member | null>(null);
  const [currentRole, setCurrentRole] = useState<MemberRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeactivating, setIsDeactivating] = useState(false);

  useEffect(() => {
    async function loadMember() {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const [response, storedMember] = await Promise.all([
          api.get(`/members/${id}`),
          AsyncStorage.getItem("@app_icb:member"),
        ]);

        setMember(response.data.data);

        if (storedMember) {
          setCurrentRole(JSON.parse(storedMember).role);
        }
      } catch (error: any) {
        console.log(
          "ERRO AO BUSCAR MEMBRO:",
          error.response?.data || error.message,
        );

        Alert.alert(
          "Erro",
          error.response?.data?.message ||
            "Não foi possível carregar o membro.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadMember();
  }, [id]);

  async function deactivateMember() {
    if (!id) {
      return;
    }

    try {
      setIsDeactivating(true);
      await api.delete(`/members/${id}`);

      Alert.alert("Sucesso", "Membro inativado com sucesso.");
      router.replace("/members");
    } catch (error: any) {
      console.log(
        "ERRO AO INATIVAR MEMBRO:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível inativar o membro.",
      );
    } finally {
      setIsDeactivating(false);
    }
  }

  function handleDeactivateMember() {
    Alert.alert(
      "Inativar membro",
      `Deseja inativar ${member?.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Inativar",
          style: "destructive",
          onPress: deactivateMember,
        },
      ],
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>Carregando membro...</Text>
      </View>
    );
  }

  if (!member) {
    return (
      <View style={styles.screen}>
        <ScreenHeader onBack={() => router.back()} title="Membro" />
        <View style={styles.notFound}>
          <Text style={styles.loadingText}>Membro não encontrado.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader
        actionLabel={currentRole === "ADMIN" ? "Editar" : undefined}
        onActionPress={
          currentRole === "ADMIN"
            ? () =>
                router.push({
                  pathname: "/members/edit/[id]",
                  params: { id: member.id },
                })
            : undefined
        }
        onBack={() => router.back()}
        title="Detalhes do membro"
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profile}>
          <View style={styles.avatar}>
            {member.photoUrl ? (
              <Image
                source={{ uri: member.photoUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>
                {getMemberInitials(member.name)}
              </Text>
            )}
          </View>
          <Text style={styles.name}>{member.name}</Text>
          <Text style={styles.role}>{getMemberRoleLabel(member.role)}</Text>
        </View>

        <SectionCard style={styles.details}>
          <DetailRow label="E-mail" value={member.email || "Sem e-mail"} />
          <DetailRow
            label="Telefone"
            value={member.phone || "Sem telefone"}
          />
          <DetailRow
            label="Data de nascimento"
            value={formatDateOnly(member.birthDate)}
          />
          <DetailRow
            label="Data de cadastro"
            value={formatTimestamp(member.createdAt)}
          />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={styles.status}>Ativo</Text>
          </View>
        </SectionCard>

        <View style={styles.actions}>
          {currentRole === "ADMIN" ? (
            <AppButton
              isLoading={isDeactivating}
              onPress={handleDeactivateMember}
              title="Inativar membro"
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
  profile: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  avatar: {
    width: 78,
    height: 78,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 39,
    borderWidth: 3,
    borderColor: colors.surface,
    backgroundColor: colors.primary,
  },
  avatarText: {
    color: colors.surface,
    fontSize: 24,
    fontWeight: "800",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 39,
    resizeMode: "cover",
  },
  name: {
    color: colors.text,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.extraBold,
    marginTop: 14,
  },
  role: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    marginTop: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.successLight,
  },
  details: {
    marginBottom: spacing.xxl,
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
  status: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.successLight,
  },
  actions: {
    gap: 10,
  },
});
