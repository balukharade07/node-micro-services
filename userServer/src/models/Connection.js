import mongoose from "mongoose";
import validator from 'validator'

const connectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: 'Users',
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
       validate: {
      validator(value) {
        return !this.fromUserId.equals(value);
      },
      message: "Can't send connection request to yourself!",
    },
      // ref: 'Users'
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepeted", "rejected"],
        message: `{VALUE} is incorrect status type.`,
      },
    },
  },
  { timestamps: true }
);

connectionSchema.index({ fromUserId: 1, toUserId: 1 });

connectionSchema.pre('save', function () {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Can't send connection request to yourself!");
  }
});

export default mongoose.model("connection", connectionSchema);
