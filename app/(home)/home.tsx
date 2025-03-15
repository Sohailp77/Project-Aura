import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import React from "react";
import { useRouter } from "expo-router"; // Import router
import { database, config } from "../../lib/config"; // Import Appwrite config
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Query } from "appwrite";

export default function Home() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // Fetch Friends
  const fetchFriends = async () => {
    try {
      const currentUserId = await AsyncStorage.getItem("userId");

      if (!currentUserId) {
        console.error("No user ID found in storage.");
        return;
      }

      // Fetch friend relationships where the user is either user1 or user2
      const response = await database.listDocuments(
        config.databaseId,
        config.friendsCollectionId,
        [Query.or([Query.equal("user1_id", currentUserId), Query.equal("user2_id", currentUserId)])]
      );

      // Extract friend IDs
      const friendIds = response.documents.map((friend) =>
        friend.user1_id === currentUserId ? friend.user2_id : friend.user1_id
      );

      // Fetch friend details
      const friendsData = await Promise.all(
        friendIds.map(async (friendId) => {
          try {
            const friend = await database.getDocument(
              config.databaseId,
              config.userCollectionId,
              friendId
            );
            return friend;
          } catch (error) {
            console.error(`Error fetching friend details for ${friendId}:`, error.message);
            return null;
          }
        })
      );

      // Filter out any null values (in case of fetch errors)
      setFriends(friendsData.filter((friend) => friend !== null));
    } catch (error) {
      console.error("Error fetching friends:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <View className="flex-1 bg-gray-100 mt-[4rem] dark:bg-black">
      <Text className="mb-4 text-2xl font-bold text-center text-black dark:text-white">
        Friends
      </Text>

      {loading && <ActivityIndicator size="large" color="blue" className="mt-4" />}

      {!loading && friends.length === 0 && (
        <View className="items-center justify-center mt-20">
        <Image
          source={{ uri: "https://static.vecteezy.com/system/resources/thumbnails/026/775/615/small/group-of-joyful-diversity-young-people-in-cheerful-action-flat-style-cartoon-illustration-friendship-concept-free-png.png" }}
          className="h-40 mb-4 w-80"
        />
        <Text className="text-lg font-semibold text-gray-700">Add Friends to Chat</Text>
        <TouchableOpacity
          onPress={() => router.push("/Add")}
          className="px-6 py-2 mt-4 bg-blue-500 rounded-full"
        >
          <Text className="font-bold text-white">Find Friends</Text>
        </TouchableOpacity>
      </View>
      )}

<FlatList
      data={friends}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TouchableOpacity
          className="w-full p-4 mb-3 bg-white rounded-lg shadow-md dark:bg-gray-800"
          onPress={() => {
            console.log("Navigating to chat with:", item);
            //router.push("/chat")
            router.push({ pathname: "/chat", params: { friendId: item.$id, username: item.username, avatar: item.avatar } });
          }}
          
        >
          <View className="flex-row items-center">
            <Image source={{ uri: item.avatar }} className="w-12 h-12 mr-4 rounded-full" />
            <Text className="text-lg font-semibold text-black dark:text-white">
              {item.username}
            </Text>
          </View>
        </TouchableOpacity>
        
      )}
    />
    </View>
  );
}
