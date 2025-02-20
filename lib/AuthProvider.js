import React, { createContext, useState, useEffect, useContext } from "react";
import { Account, Client } from "react-native-appwrite";
import { config } from "../lib/config";
import NetInfo from "@react-native-community/netinfo"; // ✅ Check internet connectivity

// Initialize Appwrite
const client = new Client();
client.setEndpoint(config.endpoint).setProject(config.projectId);
const account = new Account(client);

// Create Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    setLoading(true);
    setError(null);

    try {
      // ✅ Check Internet Connection
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        throw new Error("No internet connection. Please check your network.");
      }

      // ✅ Check if session exists
      const session = await account.getSession("current").catch(() => null);
      if (!session) {
        console.log("No active session found");
        setUser(null);
        setLoading(false);
        return;
      }

      // ✅ Fetch user data
      const currentUser = await account.get().catch((error) => {
        if (error.code === 401) {
          console.warn("Guest user detected");
          return "guest"; // Indicating guest status
        }
        throw error; // Re-throw other errors
      });

      setUser(currentUser === "guest" ? null : currentUser);
    } catch (error) {
      console.error("Auth Check Error:", error.message);
      setUser(null);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => useContext(AuthContext);
