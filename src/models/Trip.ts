import mongoose from "mongoose";

const TripSchema = new mongoose.Schema(
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
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Domestic", "International", "Corporate", "Family", "Cultural", "Adventure", "Other"],
      default: "Domestic",
    },
    status: {
      type: String,
      enum: ["Draft", "In Preparation", "Booking Open", "Active", "Completed", "Cancelled"],
      default: "Draft",
    },
    hotelStatus: {
      type: String,
      enum: ["Not Required", "Pending", "In Progress", "Confirmed"],
      default: "Pending",
    },
    vehicleStatus: {
      type: String,
      enum: ["Not Required", "Pending", "In Progress", "Confirmed"],
      default: "Pending",
    },
    company: {
      type: String,
      required: true,
      default: "Ishwa Holidays",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Trip || mongoose.model("Trip", TripSchema);
