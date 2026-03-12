import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      default: "Manual", // Facebook, Website, Manual, Referral
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Interested", "Converted", "Lost"],
      default: "New",
    },
    assignedTo: {
       type: String, // Name or ID of team member
       default: "Unassigned"
    },
    destination: {
      type: String,
    },
    budget: {
      type: String,
    },
    notes: {
      type: String,
    },
    followUpDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
