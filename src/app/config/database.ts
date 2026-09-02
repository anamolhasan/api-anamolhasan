import mongoose from "mongoose";
import { envVars } from "./env.js";

export const connectDatabase = async (): Promise<typeof mongoose> => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  return mongoose.connect(envVars.MONGODB_URI, {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
};
