import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("User DB connected");
  } catch (error) {
    console.error("User DB error:", error.message);
    process.exit(1);
  }
};
