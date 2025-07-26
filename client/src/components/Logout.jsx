import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
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