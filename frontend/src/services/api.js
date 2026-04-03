import axios from 'axios';

// ✅ Use the EXACT backend URL that works
const API_URL = 'https://resume-screening-e3cz.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: { 
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add a request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export default api;