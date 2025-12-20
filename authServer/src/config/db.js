import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Auth DB connected");
  } catch (error) {
    console.error("Auth DB error:", error.message);
    process.exit(1);
  }
};
