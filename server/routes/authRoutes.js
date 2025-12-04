import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import OTP from "../models/OTP.js";
import { sendEmailOTP, sendSignupDetailsToAdmin, sendWelcomeEmail } from "../utils/email.js";

const router = express.Router();

// ✅ UPDATE 1: Request OTP - Send to user email
router.post("/request-otp", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ FIXED: Delete old OTP first, then create new one
    await OTP.deleteOne({ email: email.toLowerCase() });
    
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      createdAt: new Date(),
    });

    // ✅ SEND OTP TO USER'S EMAIL
    await sendEmailOTP(email, otp);
    console.log(`✅ OTP sent to ${email}: ${otp}`);

    res.json({ 
      message: "OTP sent successfully to your email",
      email: email 
    });
  } catch (err) {
    console.error("❌ Request OTP Error:", err);
    res.status(500).json({ error: "Failed to send OTP: " + err.message });
  }
});

// ✅ UPDATE 2: Verify OTP - Only verify, don't create user
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const otpDoc = await OTP.findOne({ email: email.toLowerCase() });
    
    if (!otpDoc) {
      return res.status(400).json({ error: "OTP not found. Please request a new one" });
    }

    if (otpDoc.otp !== otp.toString()) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // ✅ CHECK IF OTP IS NOT OLDER THAN 5 MINUTES
    const otpAge = Date.now() - new Date(otpDoc.createdAt).getTime();
    const fiveMinutesInMs = 5 * 60 * 1000;
    
    if (otpAge > fiveMinutesInMs) {
      await OTP.deleteOne({ email: email.toLowerCase() });
      return res.status(400).json({ error: "OTP expired. Please request a new one" });
    }

    // ✅ OTP VERIFIED - Don't delete yet, user needs to complete signup
    res.json({ 
      message: "OTP verified successfully", 
      verified: true,
      email: email 
    });
  } catch (err) {
    console.error("❌ Verify OTP Error:", err);
    res.status(500).json({ error: "OTP verification failed: " + err.message });
  }
});

// ✅ UPDATE 3: Complete Signup
router.post("/complete-signup", async (req, res) => {
  try {
    const { name, email, mobile, course, password, role } = req.body;

    // Validate all fields
    if (!name || !email || !mobile || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // For students, course is required
    if (role === "STUDENT" && !course) {
      return res.status(400).json({ error: "Course is required for students" });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate mobile (10 digits)
    if (!/^\d{10}$/.test(mobile.replace(/\D/g, ""))) {
      return res.status(400).json({ error: "Mobile must be 10 digits" });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      mobile,
      course: course || null,
      password: hashedPassword,
      role,
    });
    await user.save();

    // ✅ DELETE OTP AFTER SUCCESSFUL SIGNUP
    await OTP.deleteOne({ email: email.toLowerCase() });

    // ✅ SEND WELCOME EMAIL TO USER
    try {
      await sendWelcomeEmail({ name, email, role });
      console.log(`✅ Welcome email sent to ${email}`);
    } catch (emailErr) {
      console.error("⚠️ Welcome email failed:", emailErr);
      // Don't fail signup if email fails
    }

    // ✅ SEND SIGNUP DETAILS TO ADMIN
    try {
      await sendSignupDetailsToAdmin({ name, email, mobile, course, role });
      console.log(`✅ Admin notification sent`);
    } catch (emailErr) {
      console.error("⚠️ Admin email failed:", emailErr);
      // Don't fail signup if email fails
    }

    res.json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error("❌ Complete Signup Error:", err);
    res.status(500).json({ error: "Signup failed: " + err.message });
  }
});

// ✅ NEW: Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: "Login failed: " + err.message });
  }
});

export default router;