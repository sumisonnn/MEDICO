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

  // Create new medicine with image
  createMedicine: async (medicineData) => {
    const formData = new FormData();
    
    // Add text fields
    formData.append('name', medicineData.name);
    formData.append('category', medicineData.category);
    formData.append('price', medicineData.price);
    formData.append('stock', medicineData.stock);
    
    // Add image if provided
    if (medicineData.image) {
      formData.append('image', medicineData.image);
    }
    
    // Debug: Log FormData contents
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    
    return await api.postFormData('/medicines', formData);
  },

  // Update medicine with image
  updateMedicine: async (id, medicineData) => {
    const formData = new FormData();
    
    // Add text fields
    formData.append('name', medicineData.name);
    formData.append('category', medicineData.category);
    formData.append('price', medicineData.price);
    formData.append('stock', medicineData.stock);
    
    // Add image if provided
    if (medicineData.image) {
      formData.append('image', medicineData.image);
    }
    
    return await api.putFormData(`/medicines/${id}`, formData);
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