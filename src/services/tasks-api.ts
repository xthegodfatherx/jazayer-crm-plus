
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define types based on the backend structures
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_to?: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  in_progress: number;
  completed_change: number;
  pending_change: number;
  rating_change: number;
}

// Define the API response type
interface ApiResponse<T> {
  data: T;
}

export const tasksApi = {
  getAll: async (params?: { filters?: any }): Promise<{ data: Task[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<Task[]>> = await apiClient.get('/tasks', { 
        params: params?.filters 
      });
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },
  
  get: async (id: string): Promise<{ data: Task }> => {
    try {
      const response: AxiosResponse<ApiResponse<Task>> = await apiClient.get(`/tasks/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching task with id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (data: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Task }> => {
    try {
      const response: AxiosResponse<ApiResponse<Task>> = await apiClient.post('/tasks', data);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },
  
  update: async (id: string, data: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>): Promise<{ data: Task }> => {
    try {
      const response: AxiosResponse<ApiResponse<Task>> = await apiClient.put(`/tasks/${id}`, data);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating task with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/tasks/${id}`);
    } catch (error) {
      console.error(`Error deleting task with id ${id}:`, error);
      throw error;
    }
  },

  // Get task statistics
  getStats: async (params?: { period?: string }): Promise<{ data: TaskStats }> => {
    try {
      const response: AxiosResponse<ApiResponse<TaskStats>> = await apiClient.get('/tasks/stats', {
        params
      });
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching task stats:', error);
      throw error;
    }
  },
  
  // Complete a task with a rating
  completeTask: async (id: string, rating: number): Promise<{ data: Task }> => {
    try {
      const response: AxiosResponse<ApiResponse<Task>> = await apiClient.post(`/tasks/${id}/complete`, {
        rating
      });
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error completing task with id ${id}:`, error);
      throw error;
    }
  },
};
