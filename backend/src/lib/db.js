import mongoose from "mongoose";
import { ENV } from "./env.js";

let isConnected = false;

export const connectDB = async () => {
  try {
    const { MONGO_URI } = ENV;
    if (!MONGO_URI) {
      console.warn("MONGO_URI is not set. Continuing without a database connection.");
      return;
    }

    if (isConnected) {
      return;
    }

    const conn = await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log("MONGODB CONNECTED:", conn.connection.host);
  }catch (error) {
  console.error("❌ MongoDB Connection Failed");
  console.error(error);
}
};

export const isDbConnected = () => isConnected;