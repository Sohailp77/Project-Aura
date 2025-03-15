import React, { useState, useEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { database, config } from "../../lib/config"; 
import { Query, ID } from "appwrite"; 

export default function Chat() {
  const { friendId, username, avatar } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    getCurrentUserId();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchMessages();
    }
  }, [currentUserId]);

  const getCurrentUserId = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (userId) {
      setCurrentUserId(userId);
    } else {
      console.error("User ID not found in storage.");
    }
  };

  const fetchMessages = async () => {
    try {
      if (!currentUserId) return;

      const response = await database.listDocuments(
        config.databaseId,
        config.messagesCollectionId,
        [
          Query.or([
            Query.and([
              Query.equal("sender_id", currentUserId),
              Query.equal("receiver_id", friendId),
            ]),
            Query.and([
              Query.equal("sender_id", friendId),
              Query.equal("receiver_id", currentUserId),
            ]),
          ]),
          Query.orderDesc("timestamp"),
        ]
      );

      setMessages(response.documents.reverse()); 
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim()) return; 

    try {
      const newMessage = {
        sender_id: currentUserId,
        receiver_id: friendId,
        message: messageText.trim(),
        timestamp: new Date().toISOString(), 
      };

      const response = await database.createDocument(
        config.databaseId,
        config.messagesCollectionId,
        ID.unique(),
        newMessage
      );

      setMessages([...messages, response]); 
      setMessageText(""); 
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-100"
    >
      {/* Header */}
      <View className="items-center mt-16 mb-5">
        <Image source={{ uri: avatar }} className="w-24 h-24 mb-3 rounded-full" />
        <Text className="text-lg font-bold">Chat with {username}</Text>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View
            className={`${
              item.sender_id === currentUserId
                ? "bg-green-500 self-end text-white"
                : "bg-gray-700 self-start text-black"
            } p-3 rounded-lg my-1 max-w-[80%]`}
          >
            <Text className="text-white">
            {item.message}
            </Text>
            <Text className="self-end mt-1 text-xs text-gray-200">
        {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </Text>

            {/* <Text className="text-white">
              {item.sender_id === currentUserId ? "You" : username}: {item.message}
            </Text> */}
          </View>
        )}
        className="flex-1 px-5"
      />

      {/* Input & Send Button (Fixed at Bottom) */}
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center p-4 bg-white border-t border-gray-300">
        <TextInput
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          className="flex-1 p-3 bg-gray-100 border border-gray-300 rounded-md"
        />
        <TouchableOpacity onPress={sendMessage} className="px-4 py-2 ml-3 bg-blue-500 rounded-md">
          <Text className="font-bold text-white">Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
