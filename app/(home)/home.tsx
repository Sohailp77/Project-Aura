import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";

const chats:any[] = []; 

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 px-4 py-6 bg-gray-100">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-3xl font-bold text-gray-800">Chats</Text>
        <TouchableOpacity
          className="p-2 bg-gray-200 rounded-full"
          onPress={() => router.push("/sign-in")}
        >
          <FontAwesome name="user" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center p-4 mb-3 bg-white border border-gray-300 shadow-md rounded-3xl"
            onPress={() => router.push("/profile")} 
          >
            {/* User Avatar */}
            <Image
              source={{ uri: item.avatar }}
              className="w-12 h-12 mr-4 rounded-full"
            />

            {/* Chat Info */}
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">
                {item.name}
              </Text>
              <Text className="text-sm text-gray-600 truncate">{item.message}</Text>
            </View>

            {/* Time */}
            <Text className="text-xs text-gray-500">{item.time}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center mt-20">
            <Image
              source={{ uri: "https://static.vecteezy.com/system/resources/thumbnails/026/775/615/small/group-of-joyful-diversity-young-people-in-cheerful-action-flat-style-cartoon-illustration-friendship-concept-free-png.png" }}
              className="h-40 mb-4 w-80"
            />
            <Text className="text-lg font-semibold text-gray-700">Add Friends to Chat</Text> 
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              className="px-6 py-2 mt-4 bg-blue-500 rounded-full"
            >
              <Text className="font-bold text-white">Find Friends</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
