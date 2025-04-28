
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

// Define base API URL - would come from environment in production
const API_URL = 'http://localhost:8000/api';

// Create axios instance with credentials support
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true, // Important for cookies/authentication
});

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      toast({
        title: "Authentication Error",
        description: "Please log in again",
        variant: "destructive"
      });
      // You could redirect to login page here
    } else if (error.response?.status === 403) {
      toast({
        title: "Permission Denied",
        description: message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    }
    
    return Promise.reject(error);
  }
);

// Auth API service
export const authApi = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  register: (userData: { name: string; email: string; password: string; password_confirmation: string }) => 
    api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getUser: () => api.get('/auth/user'),
};

// Task Categories API service
export const taskCategoriesApi = {
  getAll: () => api.get('/task-categories'),
  get: (id: string) => api.get(`/task-categories/${id}`),
  create: (data: any) => api.post('/task-categories', data),
  update: (id: string, data: any) => api.put(`/task-categories/${id}`, data),
  delete: (id: string) => api.delete(`/task-categories/${id}`),
};

// Tasks API service
export const tasksApi = {
  getAll: (params?: any) => api.get('/tasks', { params }),
  get: (id: string) => api.get(`/tasks/${id}`),
  create: (data: any) => api.post('/tasks', data),
  update: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  updatePositions: (data: any) => api.post('/tasks/positions', data),
};

// Projects API service
export const projectsApi = {
  getAll: (params?: any) => api.get('/projects', { params }),
  get: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// Team API service
export const teamApi = {
  getMembers: () => api.get('/team'),
  getMember: (id: string) => api.get(`/team/${id}`),
  create: (data: any) => api.post('/team', data),
  update: (id: string, data: any) => api.put(`/team/${id}`, data),
  delete: (id: string) => api.delete(`/team/${id}`),
};

// Invoices API service
export const invoicesApi = {
  getAll: (params?: any) => api.get('/invoices', { params }),
  get: (id: string) => api.get(`/invoices/${id}`),
  create: (data: any) => api.post('/invoices', data),
  update: (id: string, data: any) => api.put(`/invoices/${id}`, data),
  delete: (id: string) => api.delete(`/invoices/${id}`),
};

// Export the API instance as default
export default api;
