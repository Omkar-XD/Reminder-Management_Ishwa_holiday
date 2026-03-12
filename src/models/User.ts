import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      default: "Ishwa Holidays",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    ultramsgInstanceId: {
      type: String,
      default: "",
    },
    ultramsgToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
