import React, {useState} from "react";
import LoginForm from "./LoginForm";

export default function SignUpForm({ onClose }) {

  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      {/*  Background with gradient + image */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500">
        <img
          src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
          alt="Student Sign Up"
          className="w-full h-full object-cover mix-blend-overlay opacity-60"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Sign Up Card */}
      <div className="relative bg-white/90 backdrop-blur-md rounded-2xl p-8 w-96 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
          Create Account
        </h2>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
           <button
              onClick={() => setShowLogin(true)}
             className="text-purple-600 font-semibold cursor-pointer hover:underline"
            >
              Login
            </button>
        </p>
      </div>
            {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
    </div>
  );
}
