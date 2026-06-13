import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { ChurchLogo } from "@/components/ChurchLogo";
import { ScreenContainer } from "@/components/ScreenContainer";
import { api } from "@/services/api";
import { colors, radii, spacing, typography } from "@/theme";

export function ChangePasswordScreen() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleChangePassword() {
    if (newPassword.length < 6) {
      Alert.alert(
        "Senha invalida",
        "A nova senha deve ter pelo menos 6 caracteres.",
      );
      return;
    }

    if (newPassword !== confirmation) {
      Alert.alert("Senhas diferentes", "Confirme a nova senha corretamente.");
      return;
    }

    try {
      setIsSaving(true);

      await api.patch("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      const response = await api.get("/auth/me");

      await AsyncStorage.setItem(
        "@app_icb:member",
        JSON.stringify(response.data.data),
      );

      Alert.alert("Senha alterada", "Seu acesso esta pronto para uso.");
      router.replace("/home");
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Nao foi possivel alterar a senha.",
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
      <ScreenContainer
        contentStyle={styles.content}
        maxWidth={460}
        scrollViewProps={{
          keyboardDismissMode: "on-drag",
          keyboardShouldPersistTaps: "handled",
        }}
      >
        <ChurchLogo />

        <View style={styles.card}>
          <Text style={styles.title}>Alterar senha</Text>
          <Text style={styles.description}>
            Informe sua senha atual e escolha uma nova senha de acesso.
          </Text>

          <View style={styles.form}>
            <AppInput
              label="Senha temporaria"
              onChangeText={setOldPassword}
              placeholder="Digite a senha recebida"
              secureTextEntry
              value={oldPassword}
            />
            <AppInput
              label="Nova senha"
              onChangeText={setNewPassword}
              placeholder="Minimo de 6 caracteres"
              secureTextEntry
              value={newPassword}
            />
            <AppInput
              label="Confirmar nova senha"
              onChangeText={setConfirmation}
              onSubmitEditing={handleChangePassword}
              placeholder="Digite novamente"
              returnKeyType="done"
              secureTextEntry
              value={confirmation}
            />
            <AppButton
              isLoading={isSaving}
              onPress={handleChangePassword}
              title="Salvar nova senha"
            />
          </View>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    justifyContent: "center",
    gap: spacing.xxl,
    paddingVertical: spacing.xxl,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.xxl,
    backgroundColor: colors.card,
  },
  title: {
    color: colors.text,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.extraBold,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
  form: {
    gap: spacing.lg,
  },
});
