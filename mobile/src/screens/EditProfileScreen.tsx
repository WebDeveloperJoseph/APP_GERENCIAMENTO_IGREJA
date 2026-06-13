import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImagePickerAsset } from "expo-image-picker";
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
import { ImagePickerField } from "@/components/ImagePickerField";
import { ScreenHeader } from "@/components/ScreenHeader";
import { api } from "@/services/api";
import { uploadImage } from "@/services/uploadImage";
import { colors, radii, spacing } from "@/theme";

export function EditProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photo, setPhoto] = useState<ImagePickerAsset | null>(null);
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
        setBirthDate(member.birthDate?.substring(0, 10) || "");
        setPhotoUrl(member.photoUrl || "");
      })
      .catch((error: any) => {
        Alert.alert(
          "Erro",
          error.response?.data?.message ||
            "Nao foi possivel carregar seus dados.",
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function handleSave() {
    try {
      setIsSaving(true);
      const updatedPhotoUrl = photo
        ? await uploadImage(photo)
        : photoUrl || null;
      const response = await api.patch("/auth/profile", {
        name,
        email,
        phone,
        birthDate: birthDate || null,
        photoUrl: updatedPhotoUrl,
      });

      await AsyncStorage.setItem(
        "@app_icb:member",
        JSON.stringify(response.data.data),
      );

      Alert.alert("Sucesso", "Seu perfil foi atualizado.");
      router.back();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Nao foi possivel atualizar seus dados.",
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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.screen}
    >
      <ScreenHeader onBack={() => router.back()} title="Meu perfil" />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.content}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <ImagePickerField
            imageUrl={photo?.uri || photoUrl}
            label="Foto de perfil"
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
          <AppInput
            label="Data de nascimento"
            onChangeText={setBirthDate}
            placeholder="AAAA-MM-DD"
            value={birthDate}
          />
          <AppButton
            isLoading={isSaving}
            onPress={handleSave}
            title="Salvar perfil"
          />
          <AppButton
            onPress={() => router.push("/change-password")}
            title="Alterar senha"
            variant="secondary"
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
    paddingBottom: 120,
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
