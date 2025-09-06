import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, GraduationCap, Building, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LearnMore() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with Back Button */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-md dark:bg-gray-950/70 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-semibold text-lg">Back to Home</span>
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-center flex-grow">CampusPay</h1>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </header>

      {/* Main Content Section */}
      <div className="container mx-auto px-6 md:px-12 py-16">
        {/* Intro */}
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-700 dark:text-indigo-300 leading-tight drop-shadow-sm">
            Revolutionizing Your College Life
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400">
            CampusPay is more than just a payment app; it's a comprehensive
            platform designed to simplify every aspect of student and faculty
            life at a modern college.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Student Focus */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="p-4 bg-indigo-100 dark:bg-indigo-900 rounded-full">
              <GraduationCap className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-indigo-700 dark:text-indigo-300">
              For Students
            </h3>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Manage your academic finances effortlessly. From paying tuition fees
              and semester dues to clearing library fines, CampusPay keeps
              everything organized and secure. No more long queues or complicated
              forms.
            </p>
          </motion.div>

          {/* Card 2: Faculty/Admin Focus */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Building className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-purple-700 dark:text-purple-300">
              For College Administration
            </h3>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              CampusPay provides a robust backend for efficient fee collection,
              event management, and student data tracking. Our platform reduces
              administrative burden and ensures seamless financial operations.
            </p>
          </motion.div>

          {/* Card 3: Financial Security */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <DollarSign className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              Secure & Transparent
            </h3>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              We prioritize the security of your transactions and data. With
              advanced encryption and transparent record-keeping, you can have
              peace of mind knowing your finances are handled with the utmost care.
            </p>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center max-w-2xl mx-auto bg-indigo-50 dark:bg-gray-800 rounded-3xl p-8 shadow-xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">
            Ready to Get Started?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Join the CampusPay community and experience a smarter way to handle
            your college payments.
          </p>
          <button
            onClick={() => navigate("/get-started")}
            className="mt-6 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
          >
            Sign Up Now
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
