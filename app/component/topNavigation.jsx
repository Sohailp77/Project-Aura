import { View, Text, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function TopBar() {
  return (
    <View className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4 py-3 bg-gray-100 ">
      
      {/* App Name */}
      <Text className="text-xl font-bold text-gray-900 ">
        Aura
      </Text>

      {/* Action Icons */}
      <View className="flex-row items-center gap-4">
        <TouchableOpacity className="p-2">
          <FontAwesome name="search" size={22} color="gray" />
        </TouchableOpacity>


        <TouchableOpacity className="p-2">
          <FontAwesome name="gear" size={22} color="gray" />
        </TouchableOpacity>
        {/* User Avatar */}
        {/* <TouchableOpacity className="border-2 border-gray-300 rounded-full dark:border-gray-700">
          <Image
            source={{ uri: "https://i.pravatar.cc/300" }} // Dummy avatar
            className="w-8 h-8 rounded-full"
          />
        </TouchableOpacity> */}
      </View>
      
    </View>
  );
}
