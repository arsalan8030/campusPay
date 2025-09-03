import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, BookOpen } from "lucide-react";

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("STUDENT");
  const [form, setForm] = useState({ email: "", password: "", course: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.course) {
      setError("⚠ Please fill all fields");
      return;
    }

    // Mock login
    login({ name: role === "STUDENT" ? "Student" : "Teacher", role });

    // Redirect
    navigate(role === "STUDENT" ? "/student-dashboard" : "/teacher-dashboard");
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl w-full p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        {role === "STUDENT" ? "Student Login" : "Teacher Login"}
      </h1>
      <p className="text-center text-gray-500">
        Welcome back! Please login to continue.
      </p>

      {/* Toggle Role */}
      <div className="flex justify-center gap-4 mt-4">
        {["STUDENT", "TEACHER"].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              role === r
                ? "bg-indigo-600 text-white shadow-md scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input pl-10 border-gray-300"
            onChange={handleChange}
            required
          />
        </div>
        <div className="relative">
          <BookOpen className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            name="course"
            placeholder={role === "STUDENT" ? "Course" : "Department"}
            className="input pl-10 border-gray-300"
            onChange={handleChange}
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input pl-10 border-gray-300"
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition transform hover:scale-105"
        >
          Login
        </button>
      </form>

      {/* Links */}
      <div className="flex justify-between text-sm mt-4">
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
  );
}
