import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Slot } from "expo-router";
import "../../global.css" ;
import React from "react";

const RootLayout = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Status Bar Configuration */}
      <StatusBar style="dark" backgroundColor="#F3F4F6" />
      {/* Main Content */}
      <Slot />
    </SafeAreaView>
  );
};

export default RootLayout;

