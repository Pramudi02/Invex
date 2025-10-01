import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - Clear token and redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Handle other errors
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ==========================================
// AUTH API CALLS
// ==========================================

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me')
};

// ==========================================
// USER API CALLS
// ==========================================

export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  updateUserPassword: (id, newPassword) => api.put(`/users/${id}/password`, { newPassword }),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getMyProfile: () => api.get('/users/me'),
  updateMyPassword: (currentPassword, newPassword) => 
    api.put('/users/me/password', { currentPassword, newPassword })
};

// ==========================================
// ITEM API CALLS
// ==========================================

export const itemAPI = {
  getAllItems: () => api.get('/items'),
  getItemById: (id) => api.get(`/items/${id}`),
  createItem: (itemData) => api.post('/items', itemData),
  updateItem: (id, itemData) => api.put(`/items/${id}`, itemData),
  deleteItem: (id) => api.delete(`/items/${id}`),
  searchItems: (params) => api.get('/items/search', { params }),
  getLowStockItems: (threshold) => api.get('/items/low-stock', { params: { threshold } })
};

export default api;