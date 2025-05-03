
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { toast } from '@/hooks/use-toast';

// Define the base URL from environment variable or fallback to a default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for cookies/session authentication with Laravel Sanctum
});

// Request interceptor - for authentication and other request modifications
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = localStorage.getItem('auth_token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // You can add other request configurations here
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refreshing
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized errors - may need token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token if you have a refresh endpoint
        // const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        
        // If token refresh successful, update the token and retry the original request
        // localStorage.setItem('auth_token', refreshResponse.data.token);
        // originalRequest.headers!.Authorization = `Bearer ${refreshResponse.data.token}`;
        // return apiClient(originalRequest);
        
        // If no refresh token logic, redirect to login
        window.location.href = '/login';
        return Promise.reject(error);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    // Handle different error scenarios
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const data = error.response.data as any;
      
      // Handle different status codes
      switch (status) {
        case 400:
          toast({
            title: "Bad Request",
            description: data.message || "The request could not be processed",
            variant: "destructive"
          });
          break;
        case 403:
          toast({
            title: "Access Denied",
            description: data.message || "You don't have permission to perform this action",
            variant: "destructive"
          });
          break;
        case 404:
          toast({
            title: "Not Found",
            description: data.message || "The requested resource was not found",
            variant: "destructive"
          });
          break;
        case 422:
          // Validation errors
          const validationErrors = data.errors ? Object.values(data.errors).flat() : [];
          toast({
            title: "Validation Error",
            description: validationErrors.length > 0 
              ? validationErrors[0] as string 
              : data.message || "Validation failed",
            variant: "destructive"
          });
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          toast({
            title: "Server Error",
            description: "Something went wrong on our servers. Please try again later.",
            variant: "destructive"
          });
          break;
        default:
          toast({
            title: "Error",
            description: data.message || "An unexpected error occurred",
            variant: "destructive"
          });
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast({
        title: "Network Error",
        description: "Unable to connect to the server. Please check your internet connection.",
        variant: "destructive"
      });
    } else {
      // Something happened in setting up the request
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
