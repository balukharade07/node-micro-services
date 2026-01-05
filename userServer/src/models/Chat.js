import mongoose from 'mongoose';

const chatMessages = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    seenBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true },
);

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    ],
    messages: [chatMessages],
  },
  { timestamps: true },
);

export default mongoose.model('Chat', chatSchema);
