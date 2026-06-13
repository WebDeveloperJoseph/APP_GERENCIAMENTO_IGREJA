import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { LoginScreen } from "@/screens/LoginScreen";
import { api } from "@/services/api";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem("@app_icb:token")
      .then(async (token) => {
        if (!token) {
          if (isMounted) {
            setIsLoading(false);
          }
          return;
        }

        const response = await api.get("/auth/me");

        await AsyncStorage.setItem(
          "@app_icb:member",
          JSON.stringify(response.data.data),
        );

        router.replace(
          response.data.data.mustChangePassword
            ? "/change-password"
            : "/home",
        );
      })
      .catch(async (error: any) => {
        console.log(
          "SESSAO INVALIDA:",
          error.response?.data || error.message,
        );

        await AsyncStorage.removeItem("@app_icb:token");
        await AsyncStorage.removeItem("@app_icb:member");

        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <LoginScreen />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
