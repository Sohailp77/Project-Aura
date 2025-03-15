import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import React from "react";
import { database, config,account } from "../../lib/config"; // Import Appwrite config
import { ID, Query } from "appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Add() {
  const [activeTab, setActiveTab] = useState("find"); // 'find' or 'pending'
  const [users, setUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);


  
  // Fetch all users (excluding current user)
  const fetchUsers = async () => {
    try {
      // ✅ Retrieve the stored user ID from AsyncStorage
      const currentUserId = await AsyncStorage.getItem("userId");
  
      if (!currentUserId) {
        console.error("No user ID found in storage.");
        return;
      }
  
      // ✅ Fetch all users excluding the current user
      const response = await database.listDocuments(
        config.databaseId,
        config.userCollectionId,
        [Query.notEqual("accountId", currentUserId)]
      );
  
      setUsers(response.documents);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  };

// Fetch pending friend requests
const fetchPendingRequests = async () => {
    try {
      const currentUserId = await AsyncStorage.getItem("userId");
  
      if (!currentUserId) {
        console.error("No user ID found in storage.");
        return;
      }
  
      // Fetch pending requests
      const response = await database.listDocuments(
        config.databaseId,
        config.friendRequestsCollectionId,
        [Query.equal("receiverId", currentUserId)]
      );
  
      // Fetch sender details for each request
      const pendingRequestsWithSenderDetails = await Promise.all(
        response.documents.map(async (request) => {
          try {
            // Fetch sender details from users collection
            const sender = await database.getDocument(
              config.databaseId,
              config.userCollectionId,
              request.senderId
            );
  
            return {
              ...request,
              senderName: sender.username,
              avatar: sender.avatar, // Assuming 'avatar' is stored in the users collection
            };
          } catch (error) {
            console.error(`Error fetching sender details for ${request.senderId}:`, error.message);
            return {
              ...request,
              senderName: "Unknown",
              avatar: null,
            };
          }
        })
      );
  
      setPendingRequests(pendingRequestsWithSenderDetails);
    } catch (error) {
      console.error("Error fetching pending requests:", error.message);
    }
  };
  

  // Send Friend Request
  const sendFriendRequest = async (receiverId) => {
    try {
        if (!receiverId) {
            console.error("Error: friendId is undefined!");
            return;
          }
        const currentUserId = await AsyncStorage.getItem("userId");
  
        if (!currentUserId) {
          console.error("No user ID found in storage.");
          return;
        }
        console.log("Current User ID:", currentUserId);
console.log("Receiver ID:", receiverId);
      await database.createDocument(
        config.databaseId,
        config.friendRequestsCollectionId,
        ID.unique(),
        {   
          senderId: currentUserId,
          receiverId,
          status: "pending",
        }
      );
      fetchPendingRequests(); // Refresh pending requests
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error.message);
    }
  };

  const acceptFriendRequest = async (requestId, senderId) => {
    try {
      const currentUserId = await AsyncStorage.getItem("userId");
  
      if (!currentUserId) {
        console.error("No user ID found in storage.");
        return;
      }
  
      // Add friendship in friends collection
      await database.createDocument(
        config.databaseId,
        config.friendsCollectionId,
        ID.unique(), // Generate unique ID for friend document
        {
          user1_id: currentUserId,
          user2_id: senderId, // Friend's ID
        }
      );
  
      // Delete the friend request after accepting
      await database.deleteDocument(
        config.databaseId,
        config.friendRequestsCollectionId,
        requestId
      );
  
      // Update state after accepting
      setPendingRequests((prev) => prev.filter((req) => req.$id !== requestId));
  
      console.log("Friend request accepted successfully.");
    } catch (error) {
      console.error("Error accepting friend request:", error.message);
    }
  };
  
  const declineFriendRequest = async (requestId) => {
    try {
      // Delete the friend request
      await database.deleteDocument(
        config.databaseId,
        config.friendRequestsCollectionId,
        requestId
      );
  
      // Update state after declining
      setPendingRequests((prev) => prev.filter((req) => req.$id !== requestId));
  
      console.log("Friend request declined successfully.");
    } catch (error) {
      console.error("Error declining friend request:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPendingRequests();
  }, []);

  return (
    <View className="flex-1 bg-gray-100 mt-[4rem] dark:bg-black">
      {/* Toggle Tabs */}
      <View className="flex-row p-1 bg-gray-300 rounded-full dark:bg-gray-700">
        <TouchableOpacity
          onPress={() => setActiveTab("find")}
          className="items-center flex-1 py-2"
        >
          <View className={`w-full py-2 ${activeTab === "find" ? "bg-gray-900 rounded-full dark:bg-white" : ""}`}>
            <Text className={`text-lg font-semibold text-center ${activeTab === "find" ? "text-white dark:text-black" : "text-black dark:text-white"}`}>
              Find Friends
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("pending")}
          className="items-center flex-1 py-2"
        >
          <View className={`w-full py-2 ${activeTab === "pending" ? "bg-gray-900 rounded-full dark:bg-white" : ""}`}>
            <Text className={`text-lg font-semibold text-center ${activeTab === "pending" ? "text-white dark:text-black" : "text-black dark:text-white"}`}>
              Pending Requests
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Show Loader */}
      {loading && <ActivityIndicator size="large" color="blue" className="mt-4" />}

      {/* Find Friends */}
      {activeTab === "find" && !loading && (
        <View className="p-4 mt-2">
          <FlatList
  data={users}
  keyExtractor={(item) => item.accountId} // ✅ Ensure `accountId` is correctly referenced
  renderItem={({ item }) => (
    <TouchableOpacity className="w-full p-4 mb-3 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Image source={{ uri: item.avatar }} className="w-12 h-12 mr-4 rounded-full" />
          <Text className="text-lg font-semibold text-black dark:text-white">{item.username}</Text>
        </View>
        <TouchableOpacity
          onPress={() => sendFriendRequest(item.accountId)} // ✅ Use correct `accountId`
          className="px-4 py-2 bg-gray-700 rounded-md dark:bg-white"
        >
          <Text className="font-semibold text-white dark:text-black">Add Friend</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )}
/>

        </View>
      )}

      {/* Pending Requests */}
      {activeTab === "pending" && !loading && (
        <View className="p-4">
          <FlatList
            data={pendingRequests}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
              <TouchableOpacity className="w-full p-4 mb-3 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Image source={{ uri: item.avatar }} className="w-12 h-12 mr-4 rounded-full" />
                    <Text className="text-lg font-semibold text-black dark:text-white">{item.senderName}</Text>
                  </View>
                  <View className="flex-row gap-2 space-x-3">
                <TouchableOpacity 
                    className="px-4 py-2 bg-green-500 rounded-md"
                    onPress={() => acceptFriendRequest(item.$id, item.senderId)}
                >
                    <Text className="font-semibold text-white">Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    className="px-4 py-2 bg-red-500 rounded-md"
                    onPress={() => declineFriendRequest(item.$id)}
                >
                    <Text className="font-semibold text-white">Decline</Text>
                </TouchableOpacity>
                </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}
