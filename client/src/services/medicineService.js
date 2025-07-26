import api from './api.js';

export const medicineService = {
  // Get all medicines
  getAllMedicines: async () => {
    return await api.get('/medicines');
  },

  // Get medicine by ID
  getMedicineById: async (id) => {
    return await api.get(`/medicines/${id}`);
  },

  // Create new medicine
  createMedicine: async (medicineData) => {
    return await api.post('/medicines', medicineData);
  },

  // Update medicine
  updateMedicine: async (id, medicineData) => {
    return await api.put(`/medicines/${id}`, medicineData);
  },

  // Delete medicine
  deleteMedicine: async (id) => {
    return await api.delete(`/medicines/${id}`);
  },

  // Search medicines
  searchMedicines: async (query) => {
    return await api.get(`/medicines/search?q=${encodeURIComponent(query)}`);
  },

  // Get medicines by category
  getMedicinesByCategory: async (category) => {
    return await api.get(`/medicines/category/${encodeURIComponent(category)}`);
  }
};

export default medicineService; 