const API_BASE = 'http://localhost:5000/api';

// Common fetch wrapper with error handling
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// FormData fetch wrapper for file uploads
const apiCallFormData = async (endpoint, formData, method = 'POST') => {
  const url = `${API_BASE}${endpoint}`;
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  const config = {
    method: method,
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: formData
    // Don't set Content-Type for FormData, let browser set it with boundary
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Helper functions for different HTTP methods
export const api = {
  get: (endpoint) => apiCall(endpoint),
  
  post: (endpoint, data) => apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  put: (endpoint, data) => apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  patch: (endpoint, data) => apiCall(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  
  delete: (endpoint) => apiCall(endpoint, {
    method: 'DELETE'
  }),

  // FormData methods for file uploads
  postFormData: (endpoint, formData) => apiCallFormData(endpoint, formData, 'POST'),
  
  putFormData: (endpoint, formData) => apiCallFormData(endpoint, formData, 'PUT')
};

export default api; 