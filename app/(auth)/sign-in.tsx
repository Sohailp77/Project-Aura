import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons"; // For email & password icons
import Toast from "react-native-toast-message"; // Import toast
import { logInUser } from "../../lib/loginuser";
import React from "react";
import Loading from "../component/loading"; // Import the loading component

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const submit = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields are required!",
      });
      return;
    }

      // ✅ Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Toast.show({
      type: "error",
      text1: "Invalid Email",
      text2: "Please enter a valid email address.",
    });
    return;
  }

  setIsLoading(true); // Show loading animation

    setIsLoading(true); // Show loading animation
    try {
      const response = await logInUser(email, password);
      if (response.success) {
        router.push("/home"); // Redirect after login
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: response.message,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong!",
      });
    } finally {
      setIsLoading(false); // Hide loading animation
    }
  };

  return (
    <View className="justify-center flex-1 px-6 bg-gray-100">
      {isLoading && <Loading />}
    
      <View className="mb-6 top-[-9em] gap-2 flex-row items-center">
        <Pressable onPress={() => router.push("/")}>
          <FontAwesome name="arrow-left" size={25} color="gray" />
        </Pressable>
      </View>

      <View className="w-full mb-6 top-[-5em] gap-2">
        <Text className="text-4xl font-bold text-gray-800">Hey,</Text>
        <Text className="text-4xl font-bold text-gray-800">Welcome Back</Text>
  
      </View>

      {/* Email Input */}
      <View className="flex-row items-center px-4 py-3 mb-4 bg-gray-100 border-2 border-gray-400 shadow-md rounded-3xl">
        <FontAwesome name="envelope" size={20} color="gray" />
        <TextInput
          placeholder="Enter your email"
          className="flex-1 ml-3 text-gray-700"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Input */}
      <View className="flex-row items-center px-4 py-3 mb-2 bg-gray-100 border-2 border-gray-400 shadow-md rounded-3xl">
        <FontAwesome name="lock" size={20} color="gray" />
        <TextInput
          placeholder="Enter your password"
          className="flex-1 ml-3 text-gray-700"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Forgot Password */}
      <Pressable onPress={() => router.push("/home")}>
        <Text className="mb-6 text-lg font-bold text-right text-gray-900">Forgot Password?</Text>
      </Pressable>

      {/* Login Button */}
      <TouchableOpacity 
        className={`py-3 mb-4 ${isLoading ? "bg-gray-400" : "bg-gray-900"} rounded-2xl`}
        onPress={submit}
        disabled={isLoading}
      >
        <Text className="text-lg font-semibold text-center text-white">
          {isLoading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      {/* Divider */}
      <Text className="mb-4 text-center text-gray-500">or continue with</Text>

      {/* Google Sign In */}
      <TouchableOpacity className="flex-row items-center justify-center py-3 mb-6 bg-gray-100 border-2 border-gray-400 shadow-md rounded-2xl">
        <Image
          source={{ uri: "https://questfinance.co.uk/wp-content/uploads/2024/03/google-G-review.jpg" }}
          className="w-6 h-6 mr-3"
        />
        <Text className="text-lg font-semibold text-gray-700">Google</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <Pressable onPress={() => router.push("/sign-up")}>
        <Text className="font-semibold text-center text-gray-700">
          Don't have an account? <Text className="text-lg font-bold text-gray-900">Sign up</Text>
        </Text>
      </Pressable>
      <Toast />
    </View>
  );
}
