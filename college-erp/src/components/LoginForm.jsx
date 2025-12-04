
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AtSign, KeyRound, GraduationCap, Eye, EyeOff } from "lucide-react";

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("STUDENT");
  const [form, setForm] = useState({ email: "", password: "", course: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const courses = ["BCA CSJM", "BCA MCU", "B.Tech", "MCA", "MBA", "M.Sc"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // Clear course when switching to TEACHER and reset error
  const handleRoleChange = (r) => {
    setRole(r);
    setError("");
    if (r === "TEACHER") setForm((prev) => ({ ...prev, course: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // require course only for STUDENT
    if (!form.email || !form.password || (role === "STUDENT" && !form.course)) {
      setError("⚠ Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      const payload = { email: form.email, password: form.password, role };
      if (role === "STUDENT") payload.course = form.course;

      const res = await fetch("http://localhost:5000/api/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
      } else {
        login(data.user);
        navigate(role === "STUDENT" ? "/student-dashboard" : "/teacher-dashboard");
      }
    } catch (err) {
      setError("❌ Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-400 px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          {role === "STUDENT" ? "Student Login" : "Teacher Login"}
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Welcome back! Please login to continue.
        </p>

        {/* Role toggle */}
        <div className="flex justify-center gap-4 mb-6">
          {["STUDENT", "TEACHER"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleChange(r)}
              className={`px-5 py-2 rounded-lg font-medium transition ${
                role === r
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              placeholder="Email Address"
              className="pl-10 border border-gray-300 w-full rounded-lg py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              onChange={handleChange}
              required
            />
          </div>

          {/* Course (only for STUDENT) */}
          {role === "STUDENT" && (
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                name="course"
                value={form.course}
                className="pl-10 border border-gray-300 w-full rounded-lg py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
          )}

          {/* Password */}
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              placeholder="Password"
              className="pl-10 border border-gray-300 w-full rounded-lg py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              onChange={handleChange}
              required
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-indigo-400 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-4 border-white border-opacity-50 rounded-full animate-spin border-t-white"></div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="flex justify-between text-sm mt-6">
          <button
            onClick={onSwitch}
            className="text-indigo-600 font-semibold hover:underline"
          >
            Create Account
          </button>
          <a href="/forgot-password" className="text-gray-500 hover:underline">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
}
