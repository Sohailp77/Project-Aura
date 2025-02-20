import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // For navigation
import { Client, Account, Databases } from "react-native-appwrite";
import Toast from "react-native-toast-message";
import { config } from "../../lib/config";
import { useRouter } from "expo-router";

// ✅ Initialize Appwrite Client
const client = new Client();
client.setEndpoint(config.endpoint).setProject(config.projectId);

const account = new Account(client);
const databases = new Databases(client);

// ✅ Define User Type
interface User {
  $id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string; // 🔹 Avatar URL from collection
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);
  const navigation = useNavigation(); // 🔹 Navigation hook
  const router = useRouter();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const loggedInUser = await account.get();
        const userData = await databases.getDocument<User>(
          config.databaseId,
          config.userCollectionId,
          loggedInUser.$id
        );

        setUser(userData);
        setEditingName(userData.username);
      } catch (err: any) {
        setError(err.message || "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // ✅ Handle username update
  const handleUpdateName = async () => {
    if (!user) return;
    setUpdating(true);
    try {
      await databases.updateDocument(
        config.databaseId,
        config.userCollectionId,
        user.$id,
        { username: editingName }
      );

      setUser((prev) => (prev ? { ...prev, username: editingName } : prev));
      Toast.show({ type: "success", text1: "Profile updated!" });
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Update failed", text2: err.message });
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Handle Logout & Redirect
  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      Toast.show({ type: "success", text1: "Logged out successfully!" });

      // 🔹 Navigate to Sign-In screen
      setTimeout(() => {
       router.push("/sign-in"); // Ensure "SignIn" is your login screen name in the navigator
      }, 1000);
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Logout failed", text2: err.message });
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text className="text-lg text-center text-red-500">{error}</Text>;

  return (
    <View className="items-center flex-1 px-6 pt-24 bg-gray-100">
      {/* Profile Section */}
      <View className="items-center w-full pb-6 border-b border-gray-200">
        {/* ✅ Profile Image or Initials */}
        {user?.avatar? (
          <Image
            source={{ uri: user.avatar }}
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <View className="flex items-center justify-center w-24 h-24 bg-gray-700 rounded-full">
            <Text className="text-2xl font-bold text-white">
              {user?.username?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        
        <Text className="mt-3 text-xl font-bold">{user?.username}</Text>
        <Text className="text-gray-500">{user?.email || "No email"}</Text>
      </View>

      {/* Name Input */}
      <View className="w-full mt-6">
        <Text className="ml-2 text-sm text-gray-500">Name</Text>
        <TextInput
          className="w-full p-3 text-lg bg-gray-100 border border-gray-300 rounded-2xl"
          value={editingName}
          onChangeText={setEditingName}
        />
      </View>

      {/* Update Button */}
      <TouchableOpacity
        className="w-full py-3 mt-4 bg-gray-900 rounded-2xl"
        onPress={handleUpdateName}
        disabled={updating}
      >
        <Text className="text-lg font-semibold text-center text-white">
          {updating ? "Updating..." : "Save Changes"}
        </Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity
        className="w-full py-3 mt-6 bg-red-700 rounded-2xl"
        onPress={handleLogout}
      >
        <Text className="text-lg font-semibold text-center text-white">Log Out</Text>
      </TouchableOpacity>

      {/* Toast Messages */}
      <Toast />
    </View>
  );
};

export default Profile;
