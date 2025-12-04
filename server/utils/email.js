import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// ✅ Check if API key exists
if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY not found in .env file!");
  console.error("Please add: RESEND_API_KEY=re_xxxxx to your .env file");
}

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Send OTP to user's email
export const sendEmailOTP = async (email, otp) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    console.log(`📩 Attempting to send OTP to ${email}...`);
    console.log(`🔑 Using API Key: ${process.env.RESEND_API_KEY.substring(0, 10)}...`);

    const response = await resend.emails.send({
      from: "College ERP <onboarding@resend.dev>", // ✅ IMPORTANT: Use Resend's verified domain for testing
      to: email,
      subject: "Your OTP for College ERP Signup - Valid for 5 Minutes",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">College ERP</h1>
            <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Secure Your Account</p>
          </div>
          
          <div style="padding: 40px 20px; background: white;">
            <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">Hello,</p>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 30px 0;">
              You requested an OTP to sign up for College ERP. Use this code to verify your email address:
            </p>
            
            <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); padding: 25px; text-align: center; margin: 30px 0; border-radius: 10px; border: 2px dashed #667eea;">
              <p style="font-size: 12px; color: #999; margin: 0 0 10px 0;">Your One-Time Password</p>
              <p style="font-size: 36px; font-weight: bold; color: #667eea; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
            </div>
            
            <div style="background: #fffbf0; padding: 15px; border-left: 4px solid #ff9800; margin: 20px 0; border-radius: 4px;">
              <p style="color: #ff6f00; font-size: 13px; margin: 0;">
                ⏱️ This OTP expires in <strong>5 minutes</strong>. If you didn't request this, please ignore this email.
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="background: #e3f2fd; padding: 15px; border-left: 4px solid #2196F3; border-radius: 4px;">
              <p style="color: #1565c0; font-size: 13px; margin: 0;">
                🔒 <strong>Security Note:</strong> Never share this OTP with anyone. College ERP staff will never ask for your OTP.
              </p>
            </div>

            <p style="color: #666; font-size: 13px; margin-top: 30px; margin-bottom: 0;">
              Best regards,<br>
              <strong style="color: #333;">College ERP Team</strong>
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px;">
            <p style="margin: 0;">© 2025 College ERP. All rights reserved.</p>
            <p style="margin: 5px 0 0 0; opacity: 0.7;">This is an automated email. Please do not reply.</p>
          </div>
        </div>
      `,
    });

    console.log(`✅ OTP email sent successfully! ${otp}`);
    console.log(`📧 Response ID:`, response.id);
    return response;
  } catch (err) {
    console.error(`❌ Failed to send OTP email:`, err);
    throw err;
  }
};

// ✅ Send signup details to admin email
export const sendSignupDetailsToAdmin = async (userData) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { name, email, mobile, course, role } = userData;
    const adminEmail = process.env.ADMIN_EMAIL || "arsalanansari8030@gmail.com";
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    console.log(`📩 Attempting to send admin notification to ${adminEmail}...`);

    const response = await resend.emails.send({
      from: "College ERP <onboarding@resend.dev>",
      to: adminEmail,
      cc: email,
      subject: `🎓 New User Signup - ${name} (${role})`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🎓 New User Registration</h1>
            <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.9;">College ERP Admin Dashboard</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <p style="color: #333; font-size: 15px; font-weight: bold; margin: 0 0 20px 0;">
              New ${role} Account Created - Action Required ✅
            </p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: white; border-radius: 8px; overflow: hidden;">
              <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                <td style="padding: 12px 15px; font-weight: bold; width: 35%;">Field</td>
                <td style="padding: 12px 15px; font-weight: bold;">Details</td>
              </tr>
              <tr style="background: #f9f9f9; border-bottom: 1px solid #eee;">
                <td style="padding: 12px 15px; font-weight: 600; color: #333;">👤 Name</td>
                <td style="padding: 12px 15px; color: #666;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 15px; font-weight: 600; color: #333;">📧 Email</td>
                <td style="padding: 12px 15px; color: #666;">
                  <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                </td>
              </tr>
              <tr style="background: #f9f9f9; border-bottom: 1px solid #eee;">
                <td style="padding: 12px 15px; font-weight: 600; color: #333;">📱 Mobile</td>
                <td style="padding: 12px 15px; color: #666;">
                  <a href="tel:${mobile}" style="color: #667eea; text-decoration: none;">${mobile}</a>
                </td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 15px; font-weight: 600; color: #333;">👨‍💼 Role</td>
                <td style="padding: 12px 15px;">
                  <span style="background: ${role === "STUDENT" ? "#4CAF50" : "#2196F3"}; color: white; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block;">
                    ${role}
                  </span>
                </td>
              </tr>
              ${course ? `
              <tr style="background: #f9f9f9; border-bottom: 1px solid #eee;">
                <td style="padding: 12px 15px; font-weight: 600; color: #333;">🎓 Course</td>
                <td style="padding: 12px 15px; color: #666;">${course}</td>
              </tr>
              ` : ""}
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; color: #333;">⏰ Signup Time</td>
                <td style="padding: 12px 15px; color: #666;">${timestamp}</td>
              </tr>
            </table>

            <div style="background: #e3f2fd; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #1565c0; font-size: 13px;">
                ✉️ <strong>User Notification:</strong> A welcome email has been sent to ${email}
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
            
            <p style="color: #333; font-weight: bold; font-size: 14px; margin: 0 0 12px 0;">Recommended Admin Actions:</p>
            <ul style="color: #666; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>✅ Verify user identity if needed</li>
              <li>✅ Update student records (if applicable)</li>
              <li>✅ Assign fees structure & payment schedule</li>
              <li>✅ Grant required permissions & access</li>
            </ul>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 11px; border-radius: 0 0 10px 10px;">
            <p style="margin: 0;">College ERP © 2025 | Admin Notification System</p>
          </div>
        </div>
      `,
    });

    console.log(`✅ Admin notification sent successfully!`);
    console.log(`📧 Response ID:`, response.id);
    return response;
  } catch (err) {
    console.error(`❌ Failed to send admin email:`, err);
    console.warn(`⚠️ Admin email failed but signup can continue`);
  }
};

// ✅ Send welcome email to new user
export const sendWelcomeEmail = async (userData) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { name, email, role } = userData;

    console.log(`📩 Attempting to send welcome email to ${email}...`);

    const dashboardLink = role === "STUDENT" 
      ? "http://localhost:3000/student-dashboard" 
      : "http://localhost:3000/teacher-dashboard";

    const response = await resend.emails.send({
      from: "College ERP <onboarding@resend.dev>",
      to: email,
      subject: `Welcome to College ERP! 🎓 Your ${role} Account is Ready`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎓 Welcome to College ERP!</h1>
          </div>
          
          <div style="padding: 40px 20px; background: white;">
            <p style="color: #333; font-size: 16px; margin: 0 0 10px 0;">Hello <strong>${name}</strong>,</p>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 30px 0;">
              Thank you for creating your account with College ERP! Your ${role.toLowerCase()} account has been successfully set up and is ready to use.
            </p>

            <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0 0 12px 0; color: #333; font-weight: bold;">✅ Account Details:</p>
              <p style="margin: 5px 0; color: #666; font-size: 13px;">📧 Email: <strong>${email}</strong></p>
              <p style="margin: 5px 0; color: #666; font-size: 13px;">👤 Role: <strong>${role}</strong></p>
            </div>

            <p style="color: #333; font-weight: bold; font-size: 14px; margin: 20px 0 12px 0;">You can now:</p>
            <ul style="color: #666; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
              ${role === "STUDENT" ? `
                <li>✅ View your fee payment status & due dates</li>
                <li>✅ Download receipts & invoices</li>
                <li>✅ Track complete payment history</li>
              ` : `
                <li>✅ Manage student records & information</li>
                <li>✅ View class details & attendance</li>
                <li>✅ Monitor payment status</li>
              `}
            </ul>

            <div style="text-align: center; margin: 35px 0;">
              <a href="${dashboardLink}" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
                Go to Your Dashboard →
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              Best regards,<br>
              <strong style="color: #333;">College ERP Team</strong>
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 11px; border-radius: 0 0 10px 10px;">
            <p style="margin: 0;">© 2025 College ERP. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    console.log(`✅ Welcome email sent successfully!`);
    console.log(`📧 Response ID:`, response.id);
    return response;
  } catch (err) {
    console.error(`❌ Failed to send welcome email:`, err);
    console.warn(`⚠️ Welcome email failed but signup can continue`);
  }
};