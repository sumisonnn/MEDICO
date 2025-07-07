import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './signup.css';

const Signup = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'Pharmacist',
    agreeToTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    
    const userData = {
      
      email: formData.email,
      password: formData.password,
    };
    localStorage.setItem("user", JSON.stringify(userData));

    alert('Account created successfully! Please sign in.');

    
    navigate('/login');
  };

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.agreeToTerms;

  return (
    <div className="signup-container">
      <div className="signup-background-animation">
        <div className="signup-floating-orb signup-orb-1"></div>
        <div className="signup-floating-orb signup-orb-2"></div>
        <div className="signup-floating-orb signup-orb-3"></div>
      </div>

      <div className="signup-card">
        <div className="signup-header">
          <h2 className="signup-title">Medico Plus</h2>
          <div className="signup-title-underline"></div>
          <p className="signup-subtitle">Create your account</p>
        </div>

        <form className="signup-form" onSubmit={handleSignup}>
          <div className="signup-form-row">
            <div className="signup-form-group">
              <label className="signup-form-label">First Name *</label>
              <div className="signup-input-wrapper">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="signup-form-input"
                  placeholder="Enter first name"
                />
              </div>
            </div>
            <div className="signup-form-group">
              <label className="signup-form-label">Last Name *</label>
              <div className="signup-input-wrapper">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="signup-form-input"
                  placeholder="Enter last name"
                />
              </div>
            </div>
          </div>

          <div className="signup-form-group">
            <label className="signup-form-label">Email Address *</label>
            <div className="signup-input-wrapper">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="signup-form-input"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="signup-form-row">
            <div className="signup-form-group">
              <label className="signup-form-label">Phone Number</label>
              <div className="signup-input-wrapper">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="signup-form-input"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="signup-form-group">
              <label className="signup-form-label">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="signup-select"
              >
                <option value="Pharmacist">Pharmacist</option>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Admin">Admin</option>
                <option value="Technician">Technician</option>
              </select>
            </div>
          </div>

          <div className="signup-form-row">
            <div className="signup-form-group">
              <label className="signup-form-label">Password *</label>
              <div className="signup-input-wrapper">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="signup-form-input"
                  placeholder="Create password"
                />
              </div>
            </div>

            <div className="signup-form-group">
              <label className="signup-form-label">Confirm Password *</label>
              <div className="signup-input-wrapper">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="signup-form-input"
                  placeholder="Confirm password"
                />
              </div>
            </div>
          </div>

          <div className="terms-checkbox">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              id="agreeToTerms"
            />
            <label htmlFor="agreeToTerms" className="terms-text">
              I agree to the{' '}
              <a href="#" className="terms-link" onClick={(e) => e.preventDefault()}>
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="terms-link" onClick={(e) => e.preventDefault()}>
                Privacy Policy
              </a>
            </label>
          </div>

          <button type="submit" className="signup-button" disabled={!isFormValid}>
            Create Account
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="signup-link">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
