
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
  created_after?: string;
  created_before?: string;
}

// Define project performance data types
export interface ProjectTimeData {
  project_id: string;
  project_name: string;
  estimated_hours: number;
  actual_hours: number;
  remaining_hours: number;
}

export interface ProjectProgressData {
  project_id: string;
  project_name: string;
  progress: number;
  budget: number;
  budget_used: number;
}

export interface ProjectStatusDistribution {
  active: number;
  completed: number;
  on_hold: number;
  pending: number;
}

export interface ProjectProgressOverTime {
  month: string;
  [projectId: string]: string | number;
}

export interface ProjectPerformanceData {
  project_status: ProjectStatusDistribution;
  project_time: ProjectTimeData[];
  project_progress: ProjectProgressData[];
  project_progress_over_time: ProjectProgressOverTime[];
  total_budget: number;
  total_budget_used: number;
}

// Define the API response type
interface ApiResponse<T> {
  data: T;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const projectsApi = {
  getAll: async (params?: { filters?: ProjectFilter }): Promise<{ data: Project[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<Project[]>> = await apiClient.get(`${API_URL}/projects`, { 
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
      const response: AxiosResponse<ApiResponse<Project>> = await apiClient.get(`${API_URL}/projects/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching project with id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (projectData: Partial<Project>): Promise<{ data: Project }> => {
    try {
      const response: AxiosResponse<ApiResponse<Project>> = await apiClient.post(`${API_URL}/projects`, projectData);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },
  
  update: async (id: string, projectData: Partial<Project>): Promise<{ data: Project }> => {
    try {
      const response: AxiosResponse<ApiResponse<Project>> = await apiClient.put(`${API_URL}/projects/${id}`, projectData);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating project with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`${API_URL}/projects/${id}`);
    } catch (error) {
      console.error(`Error deleting project with id ${id}:`, error);
      throw error;
    }
  },
  
  // Get project statistics
  getStats: async (): Promise<{ active: number, completed: number, pending: number, onHold: number }> => {
    try {
      const response: AxiosResponse<ApiResponse<{ active: number, completed: number, pending: number, onHold: number }>> = 
        await apiClient.get(`${API_URL}/projects/stats`);
      return { ...response.data.data };
    } catch (error) {
      console.error('Error fetching project statistics:', error);
      throw error;
    }
  },
  
  // Get project performance data
  getPerformanceData: async (dateRange?: string): Promise<ProjectPerformanceData> => {
    try {
      const response: AxiosResponse<ApiResponse<ProjectPerformanceData>> = 
        await apiClient.get(`${API_URL}/projects/performance`, {
          params: { date_range: dateRange }
        });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching project performance data:', error);
      throw error;
    }
  }
};
