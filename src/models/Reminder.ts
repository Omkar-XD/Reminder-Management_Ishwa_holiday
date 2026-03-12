import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    company: {
      type: String,
      required: true,
      default: "Ishwa Holidays",
    },
    type: {
      type: String,
      enum: ["Visa", "Passport", "Payment", "Travel", "Other"],
      default: "Other",
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly", "yearly"],
      default: "none",
    },
    expiryDate: {
      type: Date,
    },
    renewalStatus: {
      type: String,
      enum: ["Not Required", "Pending", "In Progress", "Renewed"],
      default: "Not Required",
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Reminder || mongoose.model("Reminder", ReminderSchema);
