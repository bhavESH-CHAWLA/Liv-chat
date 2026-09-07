import mongoose from "mongoose";
import { ENV } from "./env.js";

let isConnected = false;

export const connectDB = async () => {
  try {
    const { MONGO_URI } = ENV;
    if (!MONGO_URI) {
      console.warn("⚠️ MONGO_URI is not set. Running in offline/disconnected mode.");
      return;
    }

    if (isConnected) {
      return;
    }

    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log("✅ MONGODB CONNECTED:", conn.connection.host);
  } catch (error) {
    isConnected = false;
    console.error("❌ MongoDB Connection Failed:", error.message);
    console.warn("⚠️ Server will remain running. Please verify your MONGO_URI in backend/.env");
  }
};

export const isDbConnected = () => isConnected;