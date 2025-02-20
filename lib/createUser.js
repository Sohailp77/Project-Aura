import { Account, Client, Databases, ID } from "react-native-appwrite";
import { config } from "./config";

// Initialize Appwrite Client
const client = new Client();
client.setEndpoint(config.endpoint).setProject(config.projectId);

const db = new Databases(client);
const account = new Account(client);

export const createUser = async (fullName, email, password) => {
  const fixedOtp = "098765"; // Fixed OTP
  const avatar =
    "https://thumbs.dreamstime.com/b/user-sign-icon-person-symbol-human-avatar-successful-man-84531334.jpg";

  let userId = null; // Declare userId outside

  try {
    // ✅ Step 1: Create User in Appwrite Authentication
    try {
      const authUser = await account.create(
        ID.unique(),
        email,
        password,
        fullName
      );
      userId = authUser.$id; // Assign value to userId
    } catch (error) {
      return { success: false, message: "Credentials already in use", error };
    }

    if (!userId) {
      return { success: false, message: "User creation failed in Auth." };
    }

    // ✅ Step 2: Store Additional Data in the Database Collection
    const user = await db.createDocument(
      config.databaseId,
      config.userCollectionId,
      userId, // Use Auth User ID as document ID
      {
        username: fullName,
        email,
        avatar,
        accountId: userId, // Link database entry with Auth User ID
        otp: fixedOtp, // Always store the fixed OTP
        otp_verified: false,
      }
    );
    console.log(userId);
    return {
      success: true,
      message: "User registered! (Sending Pending).",
      userId, // Return userId for later use
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, message: "Error creating user.", error };
  }
};

// Verify OTP
export const verifyOtp = async (userId, enteredOtp) => {
  try {
    console.log("verify");
    console.log(userId);
    const user = await db.getDocument(
      config.databaseId,
      config.userCollectionId,
      userId
    );

    if (user.otp === enteredOtp) {
      await db.updateDocument(
        config.databaseId,
        config.userCollectionId,
        userId,
        {
          otp_verified: true,
        }
      );

      return { success: true, message: "OTP verified!" };
    }
    return { success: false, message: "Invalid OTP." };
  } catch (error) {
    return { success: false, message: "Error verifying OTP.", error };
  }
};

// // Resend OTP (Still Fixed at 098765)
// export const resendOtp = async (userId) => {
//   const fixedOtp = "098765"; // Fixed OTP

//   try {
//     await db.updateDocument(
//       config.databaseId,
//       config.userCollectionId,
//       userId,
//       { otp: fixedOtp }
//     );

//     console.log("New OTP is 098765 (Sending Pending)");
//     return { success: true, message: "New OTP is 098765 (Sending Pending)." };
//   } catch (error) {
//     return { success: false, message: "Error resending OTP.", error };
//   }
// };
