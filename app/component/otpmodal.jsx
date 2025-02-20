import { View, Text, TextInput, TouchableOpacity,Image } from "react-native";
import React, { useRef } from "react";
import ReactNativeModal from "react-native-modal";

const OtpModal = ({ isVisible, onClose, otp, setOtp, onVerify }) => {
  const otpDigits = otp.split(""); // Convert OTP string into array for individual boxes
  const inputRefs = Array.from({ length: 6 }, () => useRef(null)); // Create 6 refs

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return; // Allow only numbers

    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtp(newOtp.join("")); // Convert back to string

    // Move focus to the next input if a digit is entered
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  return (
    <ReactNativeModal isVisible={isVisible} animationIn="slideInUp" animationOut="slideOutDown">
      
      <View className="p-6 bg-gray-100 border-2 border-gray-400 shadow-lg rounded-3xl">
        <Text className="mb-4 text-2xl font-bold text-center text-gray-800">Enter OTP</Text>
        <View className="flex items-center justify-center">
        <Image source={{ uri: "https://cdni.iconscout.com/illustration/premium/thumb/otp-code-to-unlock-illustration-download-in-svg-png-gif-file-formats--password-authentication-security-one-time-text-passcode-pack-cyber-illustrations-3916139.png?f=webp" }} className="mt-2 mb-2 contain w-60 h-60" />
        </View>
        {/* OTP Input Boxes */}
        <View className="flex-row justify-center gap-2 mb-4 space-x-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <TextInput
              key={index}
              ref={inputRefs[index]}
              value={otpDigits[index] || ""}
              onChangeText={(value) => handleOtpChange(index, value)}
              className="w-12 h-12 text-xl font-bold text-center bg-white border-2 border-gray-400 shadow-md rounded-xl"
              keyboardType="numeric"
              maxLength={1}
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity onPress={onVerify} className="py-3 bg-gray-900 rounded-2xl">
          <Text className="text-lg font-semibold text-center text-white">Verify OTP</Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity onPress={onClose} className="py-3 mt-3 bg-red-600 opacity-80 rounded-2xl">
          <Text className="text-lg font-semibold text-center text-white">Cancel</Text>
        </TouchableOpacity>
      </View>
    </ReactNativeModal>
  );
};

export default OtpModal;
