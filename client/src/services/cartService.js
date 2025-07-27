import api from './api.js';

export const cartService = {
  // Get user's cart
  async getCart() {
    try {
      const response = await api.get('/cart');
      return response;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Add item to cart
  async addToCart(medicineId, quantity = 1) {
    try {
      const response = await api.post('/cart/add', { medicineId, quantity });
      return response;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Update cart item quantity
  async updateCartItem(medicineId, quantity) {
    try {
      const response = await api.put('/cart/update', { medicineId, quantity });
      return response;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  // Remove item from cart
  async removeFromCart(medicineId) {
    try {
      const response = await api.delete(`/cart/remove/${medicineId}`);
      return response;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Clear entire cart
  async clearCart() {
    try {
      const response = await api.delete('/cart/clear');
      return response;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};

export default cartService; 