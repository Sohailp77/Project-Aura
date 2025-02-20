import { View, Text, TextInput, TouchableOpacity, Pressable, Image,Alert } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import Toast from "react-native-toast-message"; // Import toast
import { createUser } from "../../lib/createUser";
import { verifyOtp } from "../../lib/createUser";
import OtpModal from "../component/otpmodal";


const SignUp = () => {
  const router = useRouter();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState(""); // OTP state

  const [userId, setUserId] = useState<string | null>(null);



  const submit = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields are required!",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Passwords do not match!",
      });
      return;
    }
  
  //createUser(fullName,email,password,confirmPassword);

   const response = await createUser(fullName, email, password);
   if (response.success) {
     setUserId(response.userId ?? null); // Store userId for OTP verification
     setModalVisible(true);
   } else {
     Toast.show({
      type: "error",
      text1: "Error",
      text2: response.message,
    });
   }

  }
  
  const handleOtpVerification = async () => {
    const response = await verifyOtp(userId,otp);
    if(response.success){
      Toast.show({
        type: "success",
        text1: "success",
        text2: response.message,
      });

        // Navigate to home after a short delay
      setTimeout(() => {
        router.push("/home");
      }, 2000); 
        }else{
      Toast.show({
        type: "error",
        text1: "Error",
        text2: response.message,
      });
    }
    
  };

  return (
    <View className="justify-center flex-1 px-6 bg-gray-100">
      
      {/* Back Button */}
      <View className="mb-6 top-[-7em] gap-2 flex-row items-center">
        <Pressable onPress={() => router.push("/")}>
          <FontAwesome name="arrow-left" size={25} color="gray" />
        </Pressable>
      </View>

      {/* Title */}
      <View className="w-full mb-6 top-[-5em] gap-2">

        <Text className="text-4xl font-bold text-left text-gray-800">Create</Text>
        <Text className="text-4xl font-bold text-left text-gray-800">Your Account</Text>
        
      </View>

      {/* Name Input */}
      <View className="flex-row items-center px-4 py-3 mb-4 bg-gray-100 border-2 border-gray-400 shadow-md rounded-3xl">
        
        <FontAwesome name="user" size={20} color="gray" />
        <TextInput
          placeholder="Full Name"
          className="flex-1 ml-3 text-gray-700"
          value={fullName}
          onChangeText={setFullName}
        />
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
      <View className="flex-row items-center px-4 py-3 mb-4 bg-gray-100 border-2 border-gray-400 shadow-md rounded-3xl">
        <FontAwesome name="lock" size={20} color="gray" />
        <TextInput
          placeholder="Enter your password"
          className="flex-1 ml-3 text-gray-700"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Confirm Password Input */}
      <View className="flex-row items-center px-4 py-3 mb-2 bg-gray-100 border-2 border-gray-400 shadow-md rounded-3xl">
        <FontAwesome name="lock" size={20} color="gray" />
        <TextInput
          placeholder="Confirm password"
          className="flex-1 ml-3 text-gray-700"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity className="py-3 mb-4 bg-gray-900 rounded-2xl" onPress={submit}>
        <Text className="text-lg font-semibold text-center text-white">Sign Up</Text>
      </TouchableOpacity>

      {/* Divider */}
      <Text className="mb-4 text-center text-gray-500">or continue with</Text>

      {/* Google Sign Up */}
      <TouchableOpacity className="flex-row items-center justify-center py-3 mb-6 bg-gray-100 border-2 border-gray-400 shadow-md rounded-2xl">
        <Image
          source={{ uri: "https://questfinance.co.uk/wp-content/uploads/2024/03/google-G-review.jpg" }}
          className="w-6 h-6 mr-3"
        />
        <Text className="text-lg font-semibold text-gray-700">Google</Text>
      </TouchableOpacity>

      {/* Sign In Link */}
      <Pressable onPress={() => router.push("/sign-in")}>
        <Text className="font-semibold text-center text-gray-700">
          Already have an account?
          <Text className="text-lg font-bold text-gray-900"> Sign In</Text>
        </Text>
      </Pressable>

      <Pressable onPress={() => setModalVisible(true)}>
  <Text className="font-semibold text-center text-gray-700">
    Enter
    <Text className="text-lg font-bold text-gray-900"> OTP</Text>
  </Text>
</Pressable>

      {/* Toast Notification */}
      <Toast />

            {/* OTP Modal */}
            <OtpModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        otp={otp}
        setOtp={setOtp}
        onVerify={handleOtpVerification}
      />

    </View>
  );
};

export default SignUp;
