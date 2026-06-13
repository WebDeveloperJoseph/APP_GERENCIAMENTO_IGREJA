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
import { ImagePickerAsset } from "expo-image-picker";

import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { ImagePickerField } from "@/components/ImagePickerField";
import { RoleSelector } from "@/components/RoleSelector";
import { ScreenHeader } from "@/components/ScreenHeader";
import { api } from "@/services/api";
import { uploadImage } from "@/services/uploadImage";
import { colors, radii, spacing, typography } from "@/theme";
import { MemberRole } from "@/types/member";

export function EditMemberScreen() {
  const { id: idParam } = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [role, setRole] = useState<MemberRole>("MEMBRO");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photo, setPhoto] = useState<ImagePickerAsset | null>(null);

  useEffect(() => {
    async function loadMember() {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get(`/members/${id}`);
        const member = response.data.data;

        setName(member.name || "");
        setEmail(member.email || "");
        setPhone(member.phone || "");
        setPhotoUrl(member.photoUrl || "");
        setRole(member.role || "MEMBRO");
        setBirthDate(member.birthDate?.substring(0, 10) || "");
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

  async function handleUpdateMember() {
    if (!id) {
      return;
    }

    try {
      setIsSaving(true);
      const uploadedPhotoUrl = photo
        ? await uploadImage(photo)
        : photoUrl || null;

      await api.put(`/members/${id}`, {
        name,
        email,
        phone,
        photoUrl: uploadedPhotoUrl,
        birthDate: birthDate || null,
        role,
      });

      Alert.alert("Sucesso", "Membro atualizado com sucesso.");
      router.replace({
        pathname: "/members/[id]",
        params: { id },
      });
    } catch (error: any) {
      console.log(
        "ERRO AO ATUALIZAR MEMBRO:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível atualizar o membro.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>Carregando membro...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <ScreenHeader onBack={() => router.back()} title="Editar membro" />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
        <ImagePickerField
          imageUrl={photo?.uri || photoUrl}
          label="Foto do membro"
          onChange={(asset) => {
            setPhoto(asset);

            if (!asset) {
              setPhotoUrl("");
            }
          }}
          shape="circle"
        />
        <AppInput
          label="Nome"
          onChangeText={setName}
          placeholder="Digite o nome"
          value={name}
        />
        <AppInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          label="E-mail"
          onChangeText={setEmail}
          placeholder="Digite o e-mail"
          value={email}
        />
        <AppInput
          keyboardType="phone-pad"
          label="Telefone"
          onChangeText={setPhone}
          placeholder="Digite o telefone"
          value={phone}
        />
        <AppInput
          label="Data de nascimento"
          onChangeText={setBirthDate}
          placeholder="AAAA-MM-DD"
          value={birthDate}
        />

        <View style={styles.roleField}>
          <Text style={styles.label}>Cargo</Text>
          <RoleSelector onChange={setRole} value={role} />
        </View>

        <View style={styles.actions}>
          <AppButton
            isLoading={isSaving}
            onPress={handleUpdateMember}
            title="Salvar alterações"
          />
          <AppButton
            onPress={() => router.back()}
            title="Cancelar"
            variant="secondary"
          />
        </View>
        </View>
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
  content: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  formCard: {
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.lg,
    backgroundColor: colors.card,
  },
  roleField: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
