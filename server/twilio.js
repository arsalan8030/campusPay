import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendPhoneOTP = async (phone, otp) => {
  try {
    await client.messages.create({
      body: `Your CampusPay OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE, // Twilio phone number
      to: phone,
    });
    console.log("OTP sent to phone:", phone);
  } catch (err) {
    console.error("Twilio Error:", err.message);
  }
};
