import mongoose from "mongoose";

const MessageLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: true,
      default: "Ishwa Holidays",
    },
    customerName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    channel: {
      type: String,
      required: true,
      enum: ["WhatsApp", "Email", "SMS", "System"],
    },
    status: {
      type: String,
      default: "Sent",
    },
    message: {
      type: String,
    }
  },
  { timestamps: true }
);

export default mongoose.models.MessageLog || mongoose.model("MessageLog", MessageLogSchema);
