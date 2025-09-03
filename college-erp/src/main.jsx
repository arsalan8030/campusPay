import React from "react";
import ReactDOM from "react-dom/client";   // 👈 FIXED
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter basename="/campusPay">  {/* 👈 use your repo name */}
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
