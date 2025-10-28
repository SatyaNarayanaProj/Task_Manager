import axios from 'axios';

const api = axios.create({
  baseURL: 'https://task-manager-2dsp.onrender.com', // Your Go backend URL
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const signupUser = (userData) => api.post('/auth/signup', userData);

// Task endpoints
export const getTasks = () => api.get('/api/tasks');
export const createTask = (taskData) => api.post('/api/tasks', taskData);
export const updateTask = (id, updates) => api.put(`/api/tasks/${id}`, updates);
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);

export default api;
