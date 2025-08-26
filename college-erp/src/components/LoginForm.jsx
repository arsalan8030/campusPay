import React from "react";

export default function LoginForm({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-md p-6 w-80 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form>
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-md p-2 mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-md p-2 mb-6"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}