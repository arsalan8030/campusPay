import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // ✅ CHANGED: Use email as unique key, not identifier
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // ✅ Auto-delete after 5 minutes (300 seconds)
  },
});

// ✅ REMOVE old identifier index if exists
otpSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("OTP", otpSchema);