import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/user.js";
import { sendEmailOTP } from "./utils/email.js";
import OTP from "./otpRoutes.js";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper to send OTP
const sendEmailOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"CampusPay" <${process.env.EMAIL}>`,
    to: email,
    subject: "Your OTP for CampusPay Signup",
    html: `<p>Your OTP is: <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });
};

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// -------------------- Routes --------------------

// 1️⃣ Request OTP
app.post("/api/request-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already registered" });

    const otpCode = generateOTP();

    // Save OTP in DB (expires in 5 minutes)
    await OTP.findOneAndUpdate(
      { email },
      { email, otp: otpCode, createdAt: new Date() },
      { upsert: true }
    );

    // Send OTP via email
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
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

    const record = await OTP.findOne({ email });
    if (!record) return res.status(400).json({ message: "No OTP requested" });

    // Check expiration (5 minutes)
    const now = new Date();
    if (now - record.createdAt > 5 * 60 * 1000) {
      return res.status(400).json({ message: "OTP expired. Please request again." });
    }

    if (record.otp != otp) return res.status(400).json({ message: "Invalid OTP" });

    res.json({ message: "OTP verified successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// 3️⃣ Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, mobile, course, password, role } = req.body;

    if (!name || !email || !mobile || !course || !password || !role) {
      return res.status(400).json({ error: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, mobile, course, password: hashedPassword, role });
    await newUser.save();

    // Delete OTP after signup
    await OTP.deleteOne({ email });

    res.json({ message: "Signup successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});
// login route
app.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "All fields required" });
    }

    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    res.json({ message: "Login successful!", user: { name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

const otpStore = {};

// Request OTP
app.post("/api/request-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  otpStore[email] = otp;

  try {
    await sendEmailOTP(email, otp);
    // Remove OTP after 5 minutes
    setTimeout(() => delete otpStore[email], 5 * 60 * 1000);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Verify OTP
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] && otpStore[email] == otp) {
    delete otpStore[email];
    return res.json({ message: "OTP verified successfully" });
  }

  res.status(400).json({ message: "Invalid or expired OTP" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
