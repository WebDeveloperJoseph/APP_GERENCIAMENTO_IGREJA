import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
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

export function CreateMemberScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [role, setRole] = useState<MemberRole>("MEMBRO");
  const [photo, setPhoto] = useState<ImagePickerAsset | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleCreateMember() {
    try {
      setIsSaving(true);
      const photoUrl = photo ? await uploadImage(photo) : null;

      await api.post("/members", {
        name,
        email,
        password,
        phone,
        photoUrl,
        birthDate: birthDate || null,
        role,
      });

      Alert.alert("Sucesso", "Membro cadastrado com sucesso.");
      router.replace("/members");
    } catch (error: any) {
      console.log(
        "ERRO AO CADASTRAR MEMBRO:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível cadastrar o membro.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <ScreenHeader onBack={() => router.back()} title="Novo membro" />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
        <ImagePickerField
          imageUrl={photo?.uri}
          label="Foto do membro"
          onChange={setPhoto}
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
          label="Senha"
          onChangeText={setPassword}
          placeholder="Digite a senha"
          secureTextEntry
          value={password}
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
            onPress={handleCreateMember}
            title="Cadastrar"
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
