import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  course: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["STUDENT","TEACHER"], required: true },
  verified: { type: Boolean, default: false }, // OTP verification status
  otp: { type: String }, // store OTP temporarily
  otpExpires: { type: Date } // OTP expiration time
});

export default mongoose.model("User", userSchema);
