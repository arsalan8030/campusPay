import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSMSOTP = async (mobile, otp) => {
  try {
    console.log(`📱 SMS OTP for ${mobile}: ${otp}`);
    const msg = await client.messages.create({
      body: `Your CampusPay OTP is ${otp}. It expires in 5 minutes.`,
      from: process.env.TWILIO_PHONE,
      to: mobile,
    });
    console.log("✅ SMS sent:", msg.sid, "to", mobile);
  } catch (err) {
    console.error("❌ SMS send error:", err);
    throw new Error("Failed to send SMS");
  }
};
