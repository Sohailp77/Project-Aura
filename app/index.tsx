import { View, Text, Image, TouchableOpacity,Pressable } from "react-native";
import { Link } from "expo-router";
import { Redirect,router } from "expo-router";
import React from "react";



export default function Index() {
  const image = {uri: 'https://static.vecteezy.com/system/resources/previews/006/648/544/non_2x/girl-using-mobile-phone-texting-messaging-or-chatting-with-friends-online-looking-at-smart-phone-concept-illustration-free-vector.jpg'};

  return (
    <View className="items-center justify-center flex-1 px-6 bg-white min-h-[85vh] ">

      <Image source={require("../assets/images/world.gif")} className=" mt-[5em] mb-2 w-90 h-90" />
      
      <Text className="mb-2 text-3xl font-bold text-gray-800 ">Welcome !</Text>
      <Text className="mb-6 text-lg text-center text-gray-500 ">
        Your ultimate chat experience. Connect instantly!
      </Text>

    
      <TouchableOpacity className="px-6 py-3 rounded-lg ">
      <Pressable
        className="px-6 py-3 bg-gray-900 rounded-lg"
        onPress={() => router.push("/sign-in")}
      >
        <Text className="text-lg font-semibold text-white">Get Started</Text>
      </Pressable>
      </TouchableOpacity>
    </View>
  );
}
