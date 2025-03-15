import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname(); // Get current route
  const colorScheme = useColorScheme(); // Detect system theme

  // Determine active tab based on current route
  const getActiveTab = () => {
    if (pathname.startsWith("/profile")) return "profile";
    if (pathname.startsWith("/add")) return "add";
    return "home"; // Default to home
  };

  const activeTab = getActiveTab();

  return (
    <View className="absolute bottom-0 flex-row items-center justify-between w-full px-2 bg-gray-100 border-t border-gray-400 dark:bg-black dark:border-gray-700">
      
      {/* Left Tab - Chat */}
      <TouchableOpacity
        onPress={() => router.push("/home")}
        className="items-center flex-1"
      >
        <FontAwesome
          name="comments"
          size={24}
          color={activeTab === "home" ? (colorScheme === "dark" ? "white" : "black") : "gray"}
        />
        <Text className={`text-xs font-semibold ${activeTab === "home" ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
          Chat
        </Text>
      </TouchableOpacity>

      {/* Center Button - Floating New Chat */}
      <View className="relative -top-4">
        <TouchableOpacity
          onPress={() => router.push("/add")}
          className="p-4 bg-gray-900 border-2 border-white rounded-full shadow-lg dark:bg-white dark:border-black"
        >
          <FontAwesome 
            name="plus" 
            size={28} 
            color={colorScheme === "dark" ? "black" : "white"} 
          />
        </TouchableOpacity>
      </View>

      {/* Right Tab - Profile */}
      <TouchableOpacity
        onPress={() => router.push("/profile")}
        className="items-center flex-1"
      >
        <FontAwesome
          name="user"
          size={24}
          color={activeTab === "profile" ? (colorScheme === "dark" ? "white" : "black") : "gray"}
        />
        <Text className={`text-xs font-semibold ${activeTab === "profile" ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
          Profile
        </Text>
      </TouchableOpacity>

    </View>
  );
}
