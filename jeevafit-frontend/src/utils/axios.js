// frontend/src/utils/axios.js
import axios from 'axios';


const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json', // ✅ This triggers preflight
  }
});

export const setupInterceptors = (setLoading) => {
  instance.interceptors.request.use((config) => {
    setLoading(true);
    return config;
  }, (error) => {
    setLoading(false);
    return Promise.reject(error);
  });

 instance.interceptors.response.use((response) => {
    setLoading(false);
    return response;
  }, (error) => {
    setLoading(false);
    return Promise.reject(error);
  });
};

export default instance;
