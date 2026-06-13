import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
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
import {
  churchTheme,
  colors,
  radii,
  spacing,
  typography,
} from "@/theme";

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () =>
      setIsKeyboardVisible(true),
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
      setIsKeyboardVisible(false),
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  async function handleLogin() {
    try {
      setIsLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.data.token;
      const member = response.data.data.member;

      await AsyncStorage.setItem("@app_icb:token", token);
      await AsyncStorage.setItem("@app_icb:member", JSON.stringify(member));

      router.replace(
        member.mustChangePassword ? "/change-password" : "/home",
      );
    } catch (error: any) {
      console.log("ERRO NO LOGIN:", error.response?.data || error.message);

      Alert.alert(
        "Erro",
        error.response?.data?.message || "Não foi possível fazer login.",
      );
    } finally {
      setIsLoading(false);
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
          automaticallyAdjustKeyboardInsets: true,
          keyboardDismissMode: "on-drag",
          keyboardShouldPersistTaps: "handled",
        }}
      >
        {!isKeyboardVisible ? (
          <View style={styles.brandArea}>
            <ChurchLogo showTagline />
          </View>
        ) : null}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.accent} />
            <View style={styles.cardTitleArea}>
              <Text style={styles.title}>Bem-vindo</Text>
              <Text style={styles.subtitle}>
                Entre com seus dados para acessar {churchTheme.churchName}.
              </Text>
            </View>
          </View>

          <View style={styles.form}>
            <AppInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              label="E-mail"
              leftIcon="@"
              onChangeText={setEmail}
              placeholder="seu@email.com"
              returnKeyType="next"
              value={email}
            />

            <AppInput
              label="Senha"
              leftIcon="●"
              onChangeText={setPassword}
              onRightPress={() =>
                setIsPasswordVisible((current) => !current)
              }
              onSubmitEditing={handleLogin}
              placeholder="Digite sua senha"
              returnKeyType="done"
              rightLabel={isPasswordVisible ? "Ocultar" : "Mostrar"}
              secureTextEntry={!isPasswordVisible}
              value={password}
            />

            <AppButton
              isLoading={isLoading}
              onPress={handleLogin}
              title="Entrar"
            />
          </View>
        </View>

        <Text style={styles.supportText}>
          Problemas para acessar? Procure a administração da sua igreja.
        </Text>
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
    paddingVertical: spacing.lg,
  },
  brandArea: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.xxl,
    backgroundColor: colors.card,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  accent: {
    width: 4,
    height: 46,
    borderRadius: radii.pill,
    backgroundColor: colors.secondary,
  },
  cardTitleArea: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.extraBold,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    marginTop: spacing.xs,
  },
  form: {
    gap: spacing.lg,
  },
  supportText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.sm,
    textAlign: "center",
    marginTop: spacing.xl,
  },
});
