import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserPlus, LogIn, Info } from "lucide-react";

export default function GetStarted({ onBack }) {
  const navigate = useNavigate();

  // Define the features in a single, clear array.
  const features = [
    {
      icon: <LogIn className="h-6 w-6 text-blue-600" />,
      title: "Quick Login",
      desc: "Already have an account? Access your dashboard with just a few clicks.",
      action: () => navigate("/login"),
      buttonText: "Login",
    },
    {
      icon: <UserPlus className="h-6 w-6 text-green-600" />,
      title: "Create Account",
      desc: "New here? Join CampusPay and get started instantly.",
      action: () => navigate("/signup"),
      buttonText: "Sign Up",
    },
    {
      icon: <Info className="h-6 w-6 text-purple-600" />,
      title: "Know More",
      desc: "Discover how CampusPay makes managing campus life easier for students.",
      action: () => navigate("/learn-more"),
      buttonText: "Learn More",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.section
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 md:px-16 py-20 bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2
        className="text-3xl md:text-5xl font-extrabold text-center text-gray-900"
        variants={itemVariants}
      >
        Welcome to CampusPay
      </motion.h2>
      <motion.p
        className="mt-4 text-lg text-gray-600 text-center max-w-2xl"
        variants={itemVariants}
      >
        Choose an option below to continue your journey.
      </motion.p>

      {/* Features Grid */}
      <motion.div
        className="mt-12 grid gap-8 md:grid-cols-3 w-full max-w-5xl"
        variants={containerVariants}
      >
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center border border-gray-100"
            whileHover={{ scale: 1.03, y: -5 }}
            variants={itemVariants}
            onClick={f.action}
          >
            <div className="p-4 bg-gray-100 rounded-full mb-4">{f.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800">{f.title}</h3>
            <p className="mt-2 text-gray-500">{f.desc}</p>
            <button
              onClick={f.action}
              className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105"
            >
              {f.buttonText}
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="mt-12 px-6 py-3 rounded-full bg-transparent text-gray-600 font-medium hover:text-gray-900 transition-colors duration-300"
        variants={itemVariants}
      >
        ← Go Back
      </motion.button>
    </motion.section>
  );
}