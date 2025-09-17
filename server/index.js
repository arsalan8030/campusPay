import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "./models/User.js";
import OTP from "./models/OTP.js";
import { sendEmailOTP } from "./utils/email.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// OTP generator
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1️⃣ Request OTP (Email Only)
app.post("/api/request-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otpCode = generateOTP();

    await OTP.findOneAndUpdate(
      { email },
      { email, otp: otpCode, createdAt: new Date() },
      { upsert: true }
    );

    await sendEmailOTP(email, otpCode);

    res.json({ message: "OTP sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// 2️⃣ Verify OTP
app.post("/api/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const record = await OTP.findOne({ email });
    if (!record) return res.status(400).json({ message: "No OTP requested" });

    if (new Date() - record.createdAt > 5 * 60 * 1000) {
      return res.status(400).json({ message: "OTP expired. Please request again." });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.json({ message: "OTP verified successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// 3️⃣ Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, course, password, role } = req.body;

    if (!name || !email || !course || !password || !role) {
      return res.status(400).json({ error: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      course,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    await OTP.deleteOne({ email });

    res.json({ message: "Signup successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// 4️⃣ Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "All fields required" });
    }

    const user = await User.findOne({ email, role });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    res.json({
      message: "Login successful!",
      user: { name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
