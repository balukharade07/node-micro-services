import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: String,
    age: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
