import api from './api.js';

export const authService = {
  // Register new user
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  // Login user
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Get current user from localStorage (alias for compatibility)
  getUser: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Get user role
  getUserRole: () => {
    return localStorage.getItem('userRole');
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
  }
};

export default authService; 