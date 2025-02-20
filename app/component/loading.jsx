import React from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";

export default function Loading() {
  return (
    <View className="items-center justify-center flex-1 bg-gray-100">
      <LottieView
        source={require("../../assets/images/Animation1740033254848.json")} // Replace with your Lottie file
        autoPlay
        loop
        className="w-40 h-40"
      />
    </View>
  );
}
