import api from './api.js';

export const userService = {
  async getAllUsers() {
    try {
      const response = await api.get('/users/all');
      return response;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  },

  async getUserById(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Get current user profile
  async getCurrentUserProfile() {
    try {
      const response = await api.get('/users/profile');
      return response;
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      throw error;
    }
  },

  // Update current user profile
  async updateCurrentUserProfile(userData) {
    try {
      const response = await api.put('/users/profile', userData);
      return response;
    } catch (error) {
      console.error('Error updating current user profile:', error);
      throw error;
    }
  }
};

export default userService; 