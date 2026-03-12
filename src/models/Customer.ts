import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
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
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    studentId: {
      type: String,
    },
    passportNo: {
      type: String,
    },
    visaNo: {
      type: String,
    },
    passportExpiry: {
      type: String,
    },
    visaExpiry: {
      type: String,
    },
    companyName: {
      type: String,
    },
    pwd1: {
      type: String,
    },
    userIdExcel: {
      type: String,
    },
    pwd2: {
      type: String,
    },
    work: {
      type: String,
    },
    applicationDate: {
      type: String,
    },
    applicationNumber: {
      type: String,
    },
    puneFRO: {
      type: String,
    },
    remark: {
      type: String,
    },
    status: {
      type: String,
      default: "Active",
    },
    travelerType: {
      type: String,
      enum: ["Individual", "Company/Org"],
      default: "Individual",
    },
    dob: { type: String },
    maritalStatus: { type: String },
    anniversaryDate: { type: String },
    companyId: { type: String },
    companyEmail: { type: String },
    companyContact: { type: String },
    companyRepresentative: { type: String },
    company: {
      type: String,
      required: true,
      default: "Ishwa Holidays",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
