import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import OTP from "../models/OTP.js";
import { sendEmailOTP } from "../utils/email.js";

const router = express.Router();

// Request OTP
router.post("/request-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    await sendEmailOTP(email, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify OTP & Signup
router.post("/verify-otp", async (req, res) => {
  try {
    const { name, email, mobile, course, password, role, otp } = req.body;

    if (!name || !email || !mobile || !course || !password || !role || !otp) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const otpDoc = await OTP.findOne({ email });
    if (!otpDoc || otpDoc.otp !== otp) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      mobile,
      course,
      password: hashedPassword,
      role,
    });
    await user.save();

    await OTP.deleteOne({ email });

    res.json({ message: "Signup successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

export default router;
