import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          {/* Left side brand name */}
          <h1 className="text-2xl font-extrabold text-white tracking-wide drop-shadow-sm">
            CampusPay
          </h1>

          {/* Right side buttons (desktop) */}
          <div className="hidden md:flex space-x-4">
            <button
              onClick={() => setShowLogin(true)}
              className="px-5 py-2 rounded-lg font-medium text-white border border-white transition duration-200 hover:bg-white hover:text-indigo-700 hover:shadow-md"
            >
              Login
            </button>
            <button
              onClick={() => setShowSignUp(true)}
              className="px-5 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-pink-500 to-orange-500 transition duration-200 hover:scale-105 hover:shadow-lg"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="text-white focus:outline-none"
            >
              <FaBars size={24} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="bg-indigo-700 text-white flex flex-col space-y-2 py-4 px-6 animate-slide-down md:hidden">
            <button
              onClick={() => {
                setShowLogin(true);
                setMobileMenuOpen(false);
              }}
              className="px-4 py-2 rounded-md font-medium hover:bg-indigo-800 transition"
            >
              Login
            </button>
            <button
              onClick={() => {
                setShowSignUp(true);
                setMobileMenuOpen(false);
              }}
              className="px-4 py-2 rounded-md font-medium bg-gradient-to-r from-pink-500 to-orange-500 hover:scale-105 transition"
            >
              Sign Up
            </button>
          </nav>
        )}
      </header>

      {/* Login Form Modal */}
      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}

      {/* Sign Up Form Modal */}
      {showSignUp && <SignUpForm onClose={() => setShowSignUp(false)} />}
    </>
  );
}
