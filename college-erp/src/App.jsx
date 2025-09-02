import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import GetStarted from "./components/GetStarted";

function App() {
  const [showGetStarted, setShowGetStarted] = useState(false);

  return (
    <div className="min-h-screen bg-student-pattern bg-cover bg-center relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      <Header />
      <Hero />
      {/* {!showGetStarted ? (
        <Hero onGetStarted={() => setShowGetStarted(true)} />
      ) : (
        <GetStarted onBack={() => setShowGetStarted(false)} />
      )} */}
    </div>
  );

  
}


export default App;
