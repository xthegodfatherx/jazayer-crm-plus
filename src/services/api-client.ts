
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,  // Required for cookie-based authentication
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  }
});

// Add a request interceptor to include CSRF token
apiClient.interceptors.request.use(function (config) {
  // Get CSRF token from meta tag if present
  const token = document.head.querySelector('meta[name="csrf-token"]');
  if (token) {
    config.headers['X-CSRF-TOKEN'] = token.getAttribute('content');
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 (Unauthorized) responses
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token logic can go here
      console.warn('Authentication error: Please log in again');
    }
    
    // Handle 403 (Forbidden) responses
    if (error.response && error.response.status === 403) {
      console.warn('Authorization error: You do not have permission to perform this action');
    }
    
    // Handle 422 (Validation Error) responses
    if (error.response && error.response.status === 422) {
      console.warn('Validation error:', error.response.data.errors);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
