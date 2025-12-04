import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AtSign, GraduationCap, User, Lock, Eye, EyeOff, Phone, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SignUpForm({ onSwitch }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("STUDENT");

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [signupComplete, setSignupComplete] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    course: "",
    password: "",
  });

  const courses = ["BCA CSJM", "BCA MCU", "B.Tech", "MCA", "MBA", "M.Sc"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const requestOtp = async () => {
    if (!form.email) {
      setError("⚠ Enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("⚠ Enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to send OTP");
      }

      setOtpSent(true);
      setSuccess("✓ OTP sent to your email");
      setCooldown(30);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("⚠ Enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Invalid OTP");
      }

      setOtpVerified(true);
      setSuccess("✓ OTP verified successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpSent) {
      await requestOtp();
      return;
    }

    if (!otpVerified) {
      await verifyOtp();
      return;
    }

    // Validate all fields
    if (!form.name || !form.email || !form.mobile || !form.password) {
      setError("⚠ All fields are required");
      return;
    }

    if (role === "STUDENT" && !form.course) {
      setError("⚠ Please select a course");
      return;
    }

    if (form.password.length < 6) {
      setError("⚠ Password must be at least 6 characters");
      return;
    }

    if (!/^\d{10}$/.test(form.mobile)) {
      setError("⚠ Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // ✅ UPDATED: Call /api/complete-signup instead of /api/SignUp
      const signupRes = await fetch("http://localhost:5000/api/complete-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          course: form.course || null,
          password: form.password,
          role,
        }),
      });

      const signupData = await signupRes.json();

      if (!signupRes.ok) {
        throw new Error(signupData.error || signupData.message || "Signup failed");
      }

      setSuccess("✓ Account created successfully!");
      setSignupComplete(true);

      // Store user info in localStorage
      const userData = {
        id: signupData.user?.id,
        name: signupData.user?.name,
        email: signupData.user?.email,
        role: signupData.user?.role,
        course: signupData.user?.course || null,
        mobile: signupData.user?.mobile,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("auth_token", signupData.token || "");

      // Navigate after 2 seconds
      setTimeout(() => {
        if (role === "STUDENT") {
          navigate("/student-dashboard", { replace: true });
        } else {
          navigate("/teacher-dashboard", { replace: true });
        }
      }, 2000);
    } catch (err) {
      setError(err.message);
      setSignupComplete(false);
    } finally {
      setLoading(false);
    }
  };

  // Success screen after signup complete
  if (signupComplete) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 text-center"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Success animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                <CheckCircle size={48} className="text-green-600" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
          >
            Account Created! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-2"
          >
            Welcome to College ERP, <span className="font-semibold">{form.name}</span>!
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-gray-500 mb-6"
          >
            Your {role.toLowerCase()} account has been successfully created.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xs text-gray-400 mb-6"
          >
            📧 Welcome email sent • 📩 Admin notified at arsalan@gmail.com
          </motion.p>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="w-full bg-gray-200 rounded-full h-1 overflow-hidden mb-4"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-gray-400"
          >
            Redirecting to dashboard in 2 seconds...
          </motion.p>

          {/* User details summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-6 p-4 bg-gray-50 rounded-lg text-left text-sm space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-600">📝 Name:</span>
              <span className="font-semibold text-gray-900">{form.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">📧 Email:</span>
              <span className="font-semibold text-gray-900 truncate">{form.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">📱 Mobile:</span>
              <span className="font-semibold text-gray-900">{form.mobile}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">👤 Role:</span>
              <span className={`font-semibold px-3 py-1 rounded-full text-xs ${
                role === "STUDENT"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {role}
              </span>
            </div>
            {role === "STUDENT" && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">🎓 Course:</span>
                <span className="font-semibold text-gray-900">{form.course}</span>
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-6 sm:p-8"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mb-4"
          >
            <span className="text-white font-bold text-lg">ERP</span>
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {otpVerified ? "Complete Your Profile" : otpSent ? "Verify Email" : "Create Account"}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {otpVerified
              ? "Fill in your details to complete signup"
              : otpSent
              ? "We sent an OTP to your email"
              : "Join College ERP today"}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-6 flex items-center justify-between text-xs">
          <div className={`flex items-center gap-2 ${otpSent ? "text-indigo-600" : "text-gray-400"}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${otpSent ? "bg-indigo-600 text-white" : "bg-gray-200"}`}>
              {otpSent ? "✓" : "1"}
            </div>
            <span className="hidden sm:inline">Email</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${otpSent ? "bg-indigo-600" : "bg-gray-200"}`}></div>
          <div className={`flex items-center gap-2 ${otpVerified ? "text-indigo-600" : "text-gray-400"}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${otpVerified ? "bg-indigo-600 text-white" : "bg-gray-200"}`}>
              {otpVerified ? "✓" : "2"}
            </div>
            <span className="hidden sm:inline">Verify</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${otpVerified ? "bg-indigo-600" : "bg-gray-200"}`}></div>
          <div className={`flex items-center gap-2 ${otpVerified ? "text-indigo-600" : "text-gray-400"}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${otpVerified ? "bg-indigo-600 text-white" : "bg-gray-200"}`}>
              3
            </div>
            <span className="hidden sm:inline">Complete</span>
          </div>
        </div>

        {/* Role Toggle */}
        {!otpSent && (
          <motion.div
            className="flex gap-3 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {["STUDENT", "TEACHER"].map((r) => (
              <motion.button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                  role === r
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {r === "STUDENT" ? "👨‍🎓 Student" : "👨‍🏫 Teacher"}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 border border-green-200 text-green-600 text-sm p-3 rounded-lg mb-4 flex items-center gap-2"
            >
              <CheckCircle size={16} />
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Email & Profile Info */}
          {!otpSent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="name"
                  placeholder="Full Name"
                  className="pl-10 pr-4 border border-gray-300 w-full rounded-lg py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  onChange={handleChange}
                  value={form.name}
                  required
                />
              </div>

              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="pl-10 pr-4 border border-gray-300 w-full rounded-lg py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  onChange={handleChange}
                  value={form.email}
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number (10 digits)"
                  maxLength={10}
                  className="pl-10 pr-4 border border-gray-300 w-full rounded-lg py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  onChange={handleChange}
                  value={form.mobile}
                  required
                />
              </div>

              {/* Course: Only for Students */}
              {role === "STUDENT" && (
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    name="course"
                    className="pl-10 pr-4 border border-gray-300 w-full rounded-lg py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition"
                    onChange={handleChange}
                    value={form.course}
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password (min 6 characters)"
                  className="pl-10 pr-10 border border-gray-300 w-full rounded-lg py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  onChange={handleChange}
                  value={form.password}
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  whileHover={{ scale: 1.1 }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 2: OTP Verification */}
          {otpSent && !otpVerified && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="text-center mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">OTP sent to</p>
                <p className="font-semibold text-gray-900 break-all">{form.email}</p>
              </div>

              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="border border-gray-300 w-full rounded-lg py-3 text-center tracking-widest text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
              />

              <motion.button
                type="button"
                onClick={requestOtp}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50"
                disabled={loading || cooldown > 0}
                whileHover={{ scale: 1.01 }}
              >
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
              </motion.button>
            </motion.div>
          )}

          {/* Main CTA Button */}
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 mt-6"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading...
              </div>
            ) : otpVerified ? (
              "✓ Complete Signup"
            ) : otpSent ? (
              "Verify OTP"
            ) : (
              "Get OTP"
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <motion.button
            type="button"
            onClick={onSwitch}
            className="text-indigo-600 font-semibold hover:underline"
            whileHover={{ scale: 1.05 }}
          >
            Login here
          </motion.button>
        </p>

        {/* Terms */}
        <p className="text-xs text-center mt-4 text-gray-500">
          By signing up, you agree to our{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}