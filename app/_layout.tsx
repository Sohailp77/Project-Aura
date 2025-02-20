import { SafeAreaView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Slot, useRouter } from "expo-router";
import "../global.css";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "../lib/AuthProvider"; // Import both

const AuthWrapper = () => {
  const { user, loading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (error) {
        console.error("Network Error:", error);
      } else if (user) {
        router.replace("/home");
      } else {
        router.replace("/");
      }
    }
  }, [user, loading, error]);

  if (loading) return 
  <View className="flex items-center self-center justify-center flex-1"><Text>Loading...</Text></View>;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#ffff" />
      {error ? (
        <View className="items-center justify-center flex-1">
          <Text className="text-lg text-red-500">{error}</Text>
        </View>
      ) : (
        <Slot />
      )}
    </SafeAreaView>
  );
};

const RootLayout = () => {
  return (
    <AuthProvider> 
      <AuthWrapper /> 
    </AuthProvider>
  );
};

export default RootLayout;
