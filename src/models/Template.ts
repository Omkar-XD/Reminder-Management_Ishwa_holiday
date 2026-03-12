import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["VISA", "Passport", "Birthday", "Anniversary", "Festivals"],
      default: "VISA",
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Template || mongoose.model("Template", TemplateSchema);
