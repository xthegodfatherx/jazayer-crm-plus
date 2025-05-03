
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define types based on the backend structures
export interface Project {
  id: string;
  name: string;
  description: string | null;
  client_id: string | null;
  status: 'pending' | 'active' | 'completed' | 'on-hold';
  progress: number;
  budget: number;
  currency: string;
  start_date: string | null;
  end_date: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  client?: string;
  teamMembers?: string[];
  tasks?: number;
  completedTasks?: number;
  totalHours?: number;
}

export interface ProjectFilter {
  status?: string;
  client_id?: string;
  name?: string;
}

// Define the API response type
interface ApiResponse<T> {
  data: T;
}

export const projectsApi = {
  getAll: async (params?: { filters?: ProjectFilter }): Promise<{ data: Project[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<Project[]>> = await apiClient.get('/projects', { 
        params: params?.filters 
      });
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },
  
  get: async (id: string): Promise<{ data: Project }> => {
    try {
      const response: AxiosResponse<ApiResponse<Project>> = await apiClient.get(`/projects/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching project with id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (projectData: Partial<Project>): Promise<{ data: Project }> => {
    try {
      const response: AxiosResponse<ApiResponse<Project>> = await apiClient.post('/projects', projectData);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },
  
  update: async (id: string, projectData: Partial<Project>): Promise<{ data: Project }> => {
    try {
      const response: AxiosResponse<ApiResponse<Project>> = await apiClient.put(`/projects/${id}`, projectData);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating project with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/projects/${id}`);
    } catch (error) {
      console.error(`Error deleting project with id ${id}:`, error);
      throw error;
    }
  },
};
