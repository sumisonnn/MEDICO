import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import HomePage from "./HomePage";
import Login from "./Login";
import Signup from "./Signup";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
         <Route path="/dashboard/user" element={<UserDashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;
