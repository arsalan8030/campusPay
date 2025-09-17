import express from "express";
import { sendEmailOTP } from "./email.js";
import { sendPhoneOTP } from "./twilio.js";

const router = express.Router();
const otpStore = {}; // store OTP temporarily: { email: otp, phone: otp }

router.post("/api/request-otp", async (req, res) => {
  const { email, mobile } = req.body;
  if (!email && !mobile) return res.status(400).json({ message: "Email or phone required" });

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

  if (email) {
    otpStore[email] = otp;
    await sendEmailOTP(email, otp);
  }
  if (mobile) {
    otpStore[mobile] = otp;
    await sendPhoneOTP(mobile, otp);
  }

  setTimeout(() => {
    if (email) delete otpStore[email];
    if (mobile) delete otpStore[mobile];
  }, 5 * 60 * 1000); // OTP expires in 5 minutes

  res.json({ message: "OTP sent successfully" });
});

router.post("/api/verify-otp", (req, res) => {
  const { email, mobile, otp } = req.body;
  if ((email && otpStore[email] == otp) || (mobile && otpStore[mobile] == otp)) {
    res.json({ valid: true });
  } else {
    res.status(400).json({ valid: false, message: "Invalid or expired OTP" });
  }
});

export default router;
