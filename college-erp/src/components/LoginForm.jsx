import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AtSign, KeyRound, GraduationCap,Eye, EyeOff  } from "lucide-react";


// The following imports are for future database integration
// import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// import { doc, setDoc, getDoc, getFirestore } from 'firebase/firestore';



export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("STUDENT");
  const [form, setForm] = useState({ email: "", password: "", course: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.course) {
      setError("⚠ Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

     setTimeout(() => {
        setLoading(false);
        console.log("Login form submitted successfully (simulated).");
    }, 2000);

    login({ name: role === "STUDENT" ? "Student" : "Teacher", role });
    navigate(role === "STUDENT" ? "/student-dashboard" : "/teacher-dashboard");
  };

  //  const GoogleIcon = () => (
  //   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-google-logo">
  //     <path d="M12 10.9v2.8h7.9c-.2 1.8-1.5 4.3-4.8 4.3-3.6 0-6.5-2.9-6.5-6.5S8.4 5 12 5c2.1 0 3.7.8 4.9 1.9l2.2-2.2C17 2.3 14.6 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.5 0 9.8-4.4 9.8-9.8 0-.8-.1-1.4-.2-2z"/>
  //   </svg>
  // );
  

  const courses = ["BCA CSJM", "BCA MCU", "B.Tech", "MCA", "MBA", "M.Sc"];

  return (
    <div className="bg-white shadow-2xl rounded-2xl w-full p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        {role === "STUDENT" ? "Student Login" : "Teacher Login"}
      </h1>
      <p className="text-center text-gray-500">
        Welcome back! Please login to continue.
      </p>

      {/* Toggle Role */}
      <div className="flex justify-center gap-4 mt-4">
        {["STUDENT", "TEACHER"].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              role === r
                ? "bg-indigo-600 text-white shadow-md scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="pl-10 border border-gray-300 w-full rounded-lg py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              onChange={handleChange}
              required
            />
          </div>
        <div className="relative">
          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            name="course"
            className="input pl-10 border-gray-300"
            onChange={handleChange}
            required
          >
            <option value="">Select {role === "STUDENT" ? "Course" : "Department"}</option>
            {courses.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="pl-10 border border-gray-300 w-full rounded-lg py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              onChange={handleChange}
              required
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-4 border-white border-opacity-50 rounded-full animate-spin border-t-white"></div>
            ) : (
              'Login'
            )}
          </button>
      </form>

      <div className="flex justify-between text-sm mt-4">
        <button
          onClick={onSwitch}
          className="text-indigo-600 font-semibold hover:underline"
        >
          Create Account
        </button>
        <a href="/forgot-password" className="text-gray-500 hover:underline">
          Forgot Password?
        </a>
      </div>
    </div>
  );
}










// --- Placeholder for database login logic ---
    // You would integrate Firebase here to handle authentication.
    // try {
    //   const auth = getAuth(); // Or from your context
    //   await signInWithEmailAndPassword(auth, form.email, form.password);
    //   // On success, navigate to the user's dashboard.
    //   console.log("Login successful!");
    // } catch (err) {
    //   if (err.code === 'auth/invalid-credential') {
    //     setError('Invalid email or password.');
    //   } else {
    //     setError('An unexpected error occurred. Please try again.');
    //     console.error("Firebase Auth Error: ", err);
    //   }
    // } finally {
    //   setLoading(false);
    // }
    // --- End of placeholder ---
    
    // Simulating a network request for the UI