import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    
    if (email && password) {
      
      alert(`Logging in with Email: ${email}`);
      
      
      navigate("/dashboard");
    } else {
      alert("Please enter both email and password");
    }
  };
  

  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>MEDICO</h2>
        <h3>Login</h3>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <a href="#" className="forgot-link">
            Forgot password?
          </a>
          <button type="submit">Login</button>
        </form>
        <p className="toggle-form">
          New user?{" "}
          <button className="toggle-button" onClick={goToSignup}>
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;