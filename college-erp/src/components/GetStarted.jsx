import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Local illustrations
import LoginImg from "../assets/login.svg";
import SignupImg from "../assets/signup.svg";
import LearnImg from "../assets/learn.svg";

export default function GetStarted() {
  const navigate = useNavigate();

  const features = [
    {
      badge: "Returning Student",
      illustration: LoginImg,
      title: "Access Your Dashboard",
      desc: "Log in securely and manage your fees, courses, and campus activities in one place.",
      action: () => navigate("/login"),
      buttonText: "Login",
    },
    {
      badge: "New Student",
      illustration: SignupImg,
      title: "Start Your Journey",
      desc: "Create your CampusPay account and unlock smart, hassle-free payments and services.",
      action: () => navigate("/signup"),
      buttonText: "Sign Up",
    },
    {
      badge: "Explore",
      illustration: LearnImg,
      title: "Why CampusPay?",
      desc: "Discover how CampusPay simplifies student life with seamless transactions and tools.",
      action: () => navigate("/learn-more"),
      buttonText: "Learn More",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.25 },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  return (
    <motion.section
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 md:px-16 py-20 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Heading */}
      <motion.h2
        className="text-3xl md:text-5xl font-extrabold text-center text-gray-900 relative z-10"
        variants={itemVariants}
      >
        Welcome to <span className="text-indigo-600">CampusPay</span>
      </motion.h2>
      <motion.p
        className="mt-4 text-lg text-gray-600 text-center max-w-2xl relative z-10"
        variants={itemVariants}
      >
        Choose an option below to continue your journey with us.
      </motion.p>

      {/* Features Grid */}
      <motion.div
        className="mt-12 grid gap-8 sm:grid-cols-1 md:grid-cols-3 w-full max-w-5xl relative z-10"
        variants={containerVariants}
      >
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center border border-gray-100"
            whileHover={{ scale: 1.05, y: -6 }}
            variants={itemVariants}
          >
            {/* Badge */}
            <span className="text-xs font-medium uppercase tracking-wide text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3">
              {f.badge}
            </span>

            {/* Circle Image */}
            <div className="w-28 h-28 rounded-full bg-gray-50 flex items-center justify-center mb-4 shadow-inner">
              <img
                src={f.illustration}
                alt={f.title}
                className="w-16 h-16 object-contain"
              />
            </div>

            <h3 className="text-xl font-semibold text-gray-800">{f.title}</h3>
            <p className="mt-2 text-gray-500">{f.desc}</p>

            <button
              onClick={f.action}
              aria-label={`Go to ${f.title}`}
              className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {f.buttonText}
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Back Button */}
      <motion.button
        onClick={() => navigate("/")}
        className="mt-12 px-6 py-3 rounded-full border border-gray-300 text-gray-600 font-medium hover:text-gray-900 hover:border-gray-500 transition-colors duration-300 flex items-center gap-2 relative z-10"
        variants={itemVariants}
      >
        <ArrowLeft className="h-5 w-5" />
        Go Back
      </motion.button>
    </motion.section>
  );
}
