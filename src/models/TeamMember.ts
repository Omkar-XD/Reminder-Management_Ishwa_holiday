import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Office", "On-Trip", "Away"],
      default: "Office",
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    color: {
      type: String, // e.g., "from-blue-500 to-indigo-600"
      default: "from-indigo-500 to-violet-600",
    },
  },
  { timestamps: true }
);

export default mongoose.models.TeamMember || mongoose.model("TeamMember", TeamMemberSchema);
