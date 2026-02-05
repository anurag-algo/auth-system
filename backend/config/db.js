import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connetDB = async () => {
  try {
    const cnn = mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${cnn.connection.host}`);
  } catch (error) {
    console.log(`error: ${error.message}`);
  }
};
