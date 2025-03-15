import { Account, Client } from "react-native-appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Import AsyncStorage
import { config } from "./config";

const client = new Client();
client.setEndpoint(config.endpoint).setProject(config.projectId);

const account = new Account(client);

export const logInUser = async (email, password) => {
  try {
    console.log("Attempting login for:", email);

    // ✅ Destroy Active Session (if any)
    try {
      const activeSession = await account.getSession("current");
      if (activeSession) {
        console.log("Destroying existing session...");
        await account.deleteSession("current");
      }
    } catch (error) {
      console.log("No active session found, proceeding with login.");
    }

    // ✅ Authenticate User
    const session = await account.createEmailPasswordSession(email, password);
    console.log("Session created successfully:", session);

    // ✅ Get User Info
    const user = await account.get();
    console.log("User retrieved:", user);

    // ✅ Store User ID in AsyncStorage
    await AsyncStorage.setItem("userId", user.$id);

    return {
      success: true,
      message: "Login successful!",
      userId: user.$id,
      user: user,
    };
  } catch (error) {
    console.error("Login failed:", error);
    return {
      success: false,
      message: "Error signing in. Please check your credentials.",
    };
  }
};
