import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService.js';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout();
      navigate('/login');
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button-modern" title="Logout">
      Logout
    </button>
  );
};

export default Logout; 