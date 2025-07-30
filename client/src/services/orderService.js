import api from './api.js';

export const orderService = {
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders/create', orderData);
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async getUserOrders() {
    try {
      const response = await api.get('/orders');
      return response;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  async getAllOrders() {
    try {
      const response = await api.get('/orders/all');
      return response;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      console.log('Updating order status:', { orderId, status });
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      console.log('Update response:', response);
      return response;
    } catch (error) {
      console.error('Error updating order status:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  }
};

export default orderService; 