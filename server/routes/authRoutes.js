import express from "express";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import { sendEmailOTP } from "  ./utils/email.js";

const router = express.Router();

// Signup
router.post("/api/signup", async (req, res) => {
  try {
    const { name, email, mobile, course, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      mobile,
      course,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/api/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email, role });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    res.status(200).json({ message: "Login successful", user: { name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Step 1: Request OTP
router.post("/api/request-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore[email] = { otp, expires };
    await sendEmailOTP(email, otp);

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// Step 2: Verify OTP & Signup
router.post("/api/signup", async (req, res) => {
  try {
    const { name, email, mobile, course, password, role, otp } = req.body;

    if (!name || !email || !mobile || !course || !password || !role || !otp)
      return res.status(400).json({ message: "All fields are required" });

    const storedOTP = otpStore[email];
    if (!storedOTP) return res.status(400).json({ message: "OTP not requested" });

    if (storedOTP.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (storedOTP.expires < Date.now()) return res.status(400).json({ message: "OTP expired" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, mobile, course, password: hashedPassword, role });
    await newUser.save();

    delete otpStore[email]; // remove used OTP
    res.json({ message: "Signup successful!" });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});


export default router;




