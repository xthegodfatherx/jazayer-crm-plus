
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define types based on the backend structures
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in-progress' | 'in-review' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  assigned_to: string | null;
  project_id: string | null;
  category_id: string | null;
  rating?: number;
  tags?: string[];
  subtasks?: { id: string; title: string; completed: boolean }[];
  comments?: {
    id: string;
    author: string;
    content: string;
    createdAt: string;
  }[];
  timeTracked?: number;
  pinned?: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskFilter {
  status?: string;
  priority?: string;
  assigned_to?: string;
  category_id?: string;
  project_id?: string;
  search?: string;
}

// Define the API response type
interface ApiResponse<T> {
  data: T;
}

export const tasksApi = {
  getAll: async (params?: { filters?: TaskFilter }): Promise<{ data: Task[] }> => {
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
  
  create: async (taskData: Partial<Task>): Promise<{ data: Task }> => {
    try {
      const response: AxiosResponse<ApiResponse<Task>> = await apiClient.post('/tasks', taskData);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },
  
  update: async (id: string, taskData: Partial<Task>): Promise<{ data: Task }> => {
    try {
      // Laravel expects PUT/PATCH requests for updates
      const response: AxiosResponse<ApiResponse<Task>> = await apiClient.put(`/tasks/${id}`, taskData);
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

  rateTask: async (id: string, rating: number): Promise<{ data: Task }> => {
    try {
      const response: AxiosResponse<ApiResponse<Task>> = await apiClient.post(`/tasks/${id}/rate`, { rating });
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error rating task with id ${id}:`, error);
      throw error;
    }
  },
};
