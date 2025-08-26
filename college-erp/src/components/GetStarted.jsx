import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserPlus, LogIn, Info } from "lucide-react";

export default function GetStarted({ onBack }) {
  const navigate = useNavigate();

  const features = [
    {
      icon: <LogIn className="h-6 w-6 text-indigo-600" />,
      title: "Quick Login",
      desc: "Access your account with just a few clicks.",
      action: () => navigate("/login"), // direct to login
    },
    {
      icon: <UserPlus className="h-6 w-6 text-indigo-600" />,
      title: "Create Account",
      desc: "New here? Sign up and get started instantly.",
      action: () => navigate("/register"), // direct to signup
    },
    {
      icon: <Info className="h-6 w-6 text-indigo-600" />,
      title: "Know More",
      desc: "Learn how CampusPay makes student life easier.",
    },
  ];

  return (
    <motion.section
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 md:px-16 py-20 bg-gradient-to-r from-indigo-50 to-purple-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl md:text-5xl font-bold text-indigo-700 text-center">
        Let’s Get You Started
      </h2>
      <p className="mt-4 text-gray-600 text-center max-w-2xl">
        Choose an option below to continue. Whether you already have an account
        or want to create one, CampusPay is here to make your journey smooth.
      </p>

      {/* Features Grid */}
      <div className="mt-12 grid gap-8 md:grid-cols-3 w-full max-w-5xl">
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col items-center text-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={f.action}
          >
            <div className="p-4 bg-indigo-100 rounded-full">{f.icon}</div>
            <h3 className="mt-4 text-lg font-semibold text-indigo-700">{f.title}</h3>
            <p className="mt-2 text-gray-500">{f.desc}</p>

            {/* Action button only for Login & Sign Up */}
            {f.action && (
              <button
                onClick={f.action}
                className="mt-4 px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow hover:shadow-lg transition"
              >
                {f.title === "Create Account" ? "Sign Up" : "Login"}
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="mt-10 px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
      >
        ← Back
      </button>
    </motion.section>
  );
}
