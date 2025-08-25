const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "model", "system"], required: true },
    content: { type: String, required: true },
  },
  { _id: false, timestamps: true }
);

const ChatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    sessionId: { type: String, index: true },
    title: { type: String },
    messages: { type: [MessageSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
