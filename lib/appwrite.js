import { Client, Account, ID } from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.aura",
  projectId: "67aed8ce001d9f1ff05d",
  databaseId: "67aedcb2003522a89563",
  userCollectioId: "67aedd260010a1424025",
  storageId: "67aede6800302d71fb91",
};

// Init your React Native SDK
const client = new Client();
client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);

export const createUser = (fullName, email, password, confirmPassword) => {
  // Register User
};
