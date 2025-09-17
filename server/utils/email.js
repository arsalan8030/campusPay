import nodemailer from "nodemailer";

export const sendEmailOTP = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,      // your email
      pass: process.env.EMAIL_PASS, // app password from Google
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "CampusPay Signup OTP",
    html: `<p>Your OTP is: <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });
};
