import React from "react";
import { motion } from "framer-motion";

export default function Hero({ onGetStarted }) {
  return (
    <main className="relative flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-20 md:py-32 gap-12 text-white overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-800/80 via-purple-800/80 to-indigo-900/80"></div>

      {/* Left: Text */}
      <motion.div
        className="relative flex-1 text-center md:text-left z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-xl"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Smarter Payments for <br />
          <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
            Every Student
          </span>
        </motion.h1>

        <motion.p
          className="mt-4 text-lg md:text-xl max-w-xl mx-auto md:mx-0 text-gray-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Manage your college fees, fines, events, and library all in one
          platform. Fast, secure, and student-friendly.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="mt-8 flex flex-col md:flex-row gap-4 justify-center md:justify-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <button
            onClick={onGetStarted}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-xl hover:scale-105 transition"
          >
            Get Started
          </button>
          <button
            onClick={() =>
              document.getElementById("learn-more")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-6 py-3 rounded-lg bg-white text-indigo-700 font-semibold shadow-md hover:bg-gray-100 hover:scale-105 transition"
          >
            Learn More
          </button>
        </motion.div>
      </motion.div>

      {/* Right: Illustration */}
      <motion.div
        className="relative flex-1 flex justify-center z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3079/3079994.png"
            alt="Student Illustration"
            className="w-72 md:w-96 drop-shadow-lg"
          />
        </motion.div>
      </motion.div>
    </main>
  );
  
}
