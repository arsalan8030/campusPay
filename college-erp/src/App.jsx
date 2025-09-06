import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import AuthContainer from "./components/AuthContainer";


import Header from "./components/Header";
import Hero from "./components/Hero";
import GetStarted from "./components/GetStarted";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";

import StudentDashboard from "./pages/student/Dashboard";
import TeacherDashboard from "./pages/teacher/Dashboard"; // we’ll create later
import LearnMore from "./components/LearnMore";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
}


export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Hero/>
            </>
          }
        />
        <Route path="/get-started" element={<GetStarted/>} />
        <Route path="/learn-more" element={<LearnMore/>} />


        {/* Login & Signup */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />

        {/* Dashboards */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route path="/campusPay" element={<Navigate to="/" />} />
        <Route path="/auth" element={<AuthContainer />} />

      </Routes>
    </div>
  );
}