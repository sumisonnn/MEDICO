import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;