import React, { useState } from 'react';
import './signup.css'; // Import the signup CSS file

const Signup = ({ onSignup, onNavigate }) => {
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignup = () => {
   
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
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      role: formData.role
    };

    
    if (onSignup) {
      onSignup(userData);
    } else {
      
      alert('Account created successfully! Please sign in.');
      onNavigate('login');
    }
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && 
                     formData.password && formData.confirmPassword && formData.agreeToTerms;

  return (
    <div className="signup-container">
      {}
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
        
        <div className="signup-form">
         
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
                <svg className="signup-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
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
                <svg className="signup-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Email field */}
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
              <svg className="signup-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
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
                <svg className="signup-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
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
                <svg className="signup-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
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
                <svg className="signup-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
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
          
          <button
            onClick={handleSignup}
            className="signup-button"
            disabled={!isFormValid}
          >
            Create Account
          </button>
        </div>
        
        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="signup-link"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>

      
    </div>
  );
};

export default Signup;