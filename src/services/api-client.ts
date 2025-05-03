
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for cookies/session authentication with Laravel Sanctum
});

// Request interceptor - could add auth token here if needed
apiClient.interceptors.request.use(
  (config) => {
    // You can add authentication headers here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle different error cases
    if (response && response.status === 401) {
      // Unauthorized - could redirect to login or refresh token
      console.error('Authentication required');
      // Example: window.location.href = '/login';
    } else if (response && response.status === 403) {
      console.error('Permission denied');
    } else if (response && response.status === 404) {
      console.error('Resource not found');
    } else if (response && response.status >= 500) {
      console.error('Server error');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
