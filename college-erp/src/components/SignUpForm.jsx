import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AtSign, GraduationCap, User, Lock, Eye, EyeOff } from "lucide-react";

export default function SignUp({ onSwitch }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("STUDENT");

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "",
    password: "",
  });

  const courses = ["BCA CSJM", "BCA MCU", "B.Tech", "MCA", "MBA", "M.Sc"];
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const requestOtp = async () => {
    if (!form.email) {
      setError("⚠ Enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);
      setOtpSent(true);
      setError("");
      setCooldown(30);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      await requestOtp();
      return;
    }
    if (!otp) {
      setError("⚠ Please enter OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);

      const signupRes = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role }),
      });
      const signupData = await signupRes.json();
      if (!signupRes.ok) throw new Error(signupData.error || signupData.message);

      navigate(role === "STUDENT" ? "/student-dashboard" : "/teacher-dashboard");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-teal-400 px-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          {otpSent ? "Verify OTP" : "Sign Up"}
        </h1>
        <p className="text-center text-gray-500 mb-6">
          {otpSent ? "Enter the OTP sent to your email" : "Create your account"}
        </p>

        {/* Role toggle */}
        <div className="flex justify-center gap-4 mb-6">
          {["STUDENT", "TEACHER"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`px-5 py-2 rounded-lg font-medium transition ${
                role === r
                  ? "bg-teal-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!otpSent && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="name"
                  placeholder="Full Name"
                  className="pl-10 border border-gray-300 w-full rounded-lg py-2"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="pl-10 border border-gray-300 w-full rounded-lg py-2"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="course"
                  className="pl-10 border border-gray-300 w-full rounded-lg py-2"
                  onChange={handleChange}
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

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="pl-10 border border-gray-300 w-full rounded-lg py-2"
                  onChange={handleChange}
                  required
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </>
          )}

          {otpSent && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="border border-gray-300 w-full rounded-lg py-2 text-center tracking-widest"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={requestOtp}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                disabled={loading || cooldown > 0}
              >
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
            disabled={loading}
          >
            {loading ? "Loading..." : otpSent ? "Verify OTP & Sign Up" : "Get OTP"}
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <button
            onClick={onSwitch}
            className="text-teal-600 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
