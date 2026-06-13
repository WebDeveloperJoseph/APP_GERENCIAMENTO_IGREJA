import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { ScreenHeader } from "@/components/ScreenHeader";
import { api } from "@/services/api";
import { colors, radii, spacing } from "@/theme";

export function EditProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((response) => {
        const member = response.data.data;
        setName(member.name || "");
        setEmail(member.email || "");
        setPhone(member.phone || "");
      })
      .catch((error: any) => {
        Alert.alert(
          "Erro",
          error.response?.data?.message || "Não foi possível carregar seus dados.",
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function handleSave() {
    try {
      setIsSaving(true);
      const response = await api.patch("/auth/profile", {
        name,
        email,
        phone,
      });

      await AsyncStorage.setItem(
        "@app_icb:member",
        JSON.stringify(response.data.data),
      );

      Alert.alert("Sucesso", "Seus dados foram atualizados.");
      router.back();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Não foi possível atualizar seus dados.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <ScreenHeader onBack={() => router.back()} title="Meus dados" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <AppInput
            label="Nome"
            onChangeText={setName}
            placeholder="Seu nome"
            value={name}
          />
          <AppInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            label="E-mail de acesso"
            onChangeText={setEmail}
            placeholder="seu@email.com"
            value={email}
          />
          <AppInput
            keyboardType="phone-pad"
            label="Telefone"
            onChangeText={setPhone}
            placeholder="Seu telefone"
            value={phone}
          />
          <AppButton
            isLoading={isSaving}
            onPress={handleSave}
            title="Salvar dados"
          />
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
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
  },
  card: {
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.lg,
    backgroundColor: colors.card,
  },
});
