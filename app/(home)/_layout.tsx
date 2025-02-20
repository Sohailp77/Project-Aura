import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Slot } from "expo-router"; 
import BottomNavigation from "../component/bottomNavigation";
import TopNavigation from "../component/topNavigation";
import React from "react";

export default function Layout() {
  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar style="dark" backgroundColor="#F3F4F6" />
      <Slot />
      <TopNavigation />
      <BottomNavigation />
    </View>
  );
}
