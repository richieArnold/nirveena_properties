// api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.nirveena.com/",
  // baseURL: "http://localhost:5000/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
5

// Add token to every request automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// PASTE THE RESPONSE INTERCEPTOR HERE 👇
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is due to expired token
    if (error.response?.status === 401 && error.response?.data?.expired) {
      // Clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      
      // Redirect to login with message
      window.location.href = '/admin/login?session=expired';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;