import React, { useState } from "react";
import SignUpForm from "./SignUpForm";


export default function LoginForm({ onClose }) {
 const [showSignUp, setShowSignUp] = useState(false);


  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      {/* Background with gradient + image */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <img
          src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
          alt="Student Campus"
          className="w-full h-full object-cover mix-blend-overlay opacity-60"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Login Card */}
      <div className="relative bg-white/90 backdrop-blur-md rounded-2xl p-8 w-96 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Login</h2>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Log In
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <button
              onClick={() => setShowSignUp(true)}
              className="text-indigo-600 font-semibold cursor-pointer hover:underline"
            >
              Sign Up
            </button>
        </p>
      </div>
                {showSignUp && <SignUpForm onClose={() => setShowSignUp(false)} />}

    </div>
  );
}
