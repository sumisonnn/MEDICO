import React, { useState } from 'react';
import './Signup.css';
import signupImage from './assets/wall.png'; // Replace with your image
import logoIcon from './assets/logo.png'; // Replace with your logo
import authService from './services/authService.js';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await authService.register({
        username: name,
        email,
        password
      });
      
      setSuccess('Signup successful! Redirecting to login...');
      setName('');
      setEmail('');
      setPassword('');
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Left Side Image */}
        <div className="login-image">
          <img src={signupImage} alt="Signup Visual" />
        </div>
        {/* Right Side Card */}
        <div className="login-card">
          <h1 className="logo" style={{ color: '#2e7d32' }}>
            <img src={logoIcon} alt="Logo" className="logo-icon" />
            MEDICO
          </h1>
          <div className="signup-header">
            <h2>CREATE ACCOUNT</h2>
            <p>Please fill in your details</p>
          </div>
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
          </form>
          <div className="login-link">
            Already have an account? <a href="/login">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 