import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connetDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected successfully`);
  } catch (error) {
    console.log(`error: ${error.message}`);
  }
};
export default connetDB;
