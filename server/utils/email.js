import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailOTP = async (email, otp) => {
  try {
    console.log(`📩 Email OTP for ${email}: ${otp}`);
    await resend.emails.send({
      from: "CampusPay <onboarding@resend.dev>",
      to: email,
      subject: "Your OTP for CampusPay Signup",
      text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
      html: `<p>Your OTP is: <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });
  } catch (err) {
    console.error("❌ Email send error:", err);
    throw new Error("Failed to send email");
  }
};
