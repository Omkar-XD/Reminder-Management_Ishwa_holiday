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
      enum: [
        "Policy Renewal",
        "Premium Due",
        "Payment",
        "Offers",
        "Birthday",
        "Anniversary",
        "Festival",
        "Custom",
        "WhatsApp",
        "Email",
        "SMS",
        "General",
      ],
      default: "General",
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Template || mongoose.model("Template", TemplateSchema);
