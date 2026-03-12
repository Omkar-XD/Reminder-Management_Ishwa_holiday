import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    travelerType: {
      type: String,
      enum: ["Individual", "Company/Org"],
      default: "Individual",
    },
    name: {
      type: String,
      required: true,
    },
    dob: { type: String },
    email: { type: String },
    phone: { type: String },
    gender: { type: String },
    studentId: { type: String }, // Used as Document ID
    maritalStatus: { type: String },
    passportNo: { type: String },
    passportExpiry: { type: String },
    visaNo: { type: String },
    visaExpiry: { type: String },
    companyName: { type: String },
    companyId: { type: String },
    companyEmail: { type: String },
    companyContact: { type: String },
    companyRepresentative: { type: String },
    status: {
      type: String,
      default: "Active",
    },
    company: {
      type: String,
      required: true,
      default: "Ishwa Holidays",
    },
    anniversaryDate: { type: String },
    documents: [
      {
        name: String,
        type: String, // e.g., Passport, VISA, Ticket
        url: String,  // Local path or URL
        fileType: String, // e.g., pdf, png
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

