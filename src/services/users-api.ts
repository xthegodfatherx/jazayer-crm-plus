
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define types for user data
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Team Lead' | 'Member' | 'Client';
  status: 'Active' | 'Inactive';
  avatar?: string;
  created_at: string;
  last_login?: string;
  tasksCompleted?: number;
  hoursLogged?: number;
  rating?: number;
}

// Define API response type
interface ApiResponse<T> {
  data: T;
}

export const usersApi = {
  getAll: async (): Promise<{ data: User[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<User[]>> = await apiClient.get('/api/users');
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  get: async (id: string): Promise<{ data: User }> => {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await apiClient.get(`/api/users/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  },
  
  getCurrentUser: async (): Promise<{ data: User }> => {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await apiClient.get('/api/me');
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },
  
  update: async (id: string, data: Partial<User>): Promise<{ data: User }> => {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await apiClient.put(`/api/users/${id}`, data);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  },
  
  toggleStatus: async (id: string, status: 'Active' | 'Inactive'): Promise<{ data: User }> => {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await apiClient.patch(`/api/users/${id}/status`, { status });
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error toggling status for user with id ${id}:`, error);
      throw error;
    }
  }
};
