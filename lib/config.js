import { Client, Databases, Account } from "appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "67aed8ce001d9f1ff05d",
  databaseId: "67aedcb2003522a89563",
  userCollectionId: "67aedd260010a1424025",
  friendRequestsCollectionId: "67d53fd6002262d727e6",
  friendsCollectionId: "67d5414e002e59d24039",
  messagesCollectionId: "67d54217003ae2a58601",
};

// ✅ Initialize Appwrite Client
const client = new Client();
client.setEndpoint(config.endpoint).setProject(config.projectId);

// ✅ Export initialized Appwrite services
export const database = new Databases(client);
export const account = new Account(client);
export default client;
