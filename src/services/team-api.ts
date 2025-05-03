
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define types based on the backend structures
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string | null;
  status: 'active' | 'inactive' | 'vacation';
  rating: number;
  tasks_completed: number;
  tasks_in_progress: number;
  base_salary: number;
  hourly_rate: number;
  created_at: string;
  updated_at: string;
}

export interface SalarySettings {
  id: string;
  base_salary: number;
  rating_1_multiplier: number;
  rating_2_multiplier: number;
  rating_3_multiplier: number;
  rating_4_multiplier: number;
  rating_5_multiplier: number;
  hourly_rate: number;
  overtime_multiplier: number;
}

export interface TeamPerformance {
  id: string;
  member_id: string;
  member_name: string;
  total_tasks: number;
  completed_tasks: number;
  average_rating: number;
  total_hours: number;
  calculated_salary: number;
  period: string;
}

// Define the API response type
interface ApiResponse<T> {
  data: T;
}

export const teamApi = {
  getMembers: async (): Promise<{ data: TeamMember[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<TeamMember[]>> = await apiClient.get('/team-members');
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },
  
  getMember: async (id: string): Promise<{ data: TeamMember }> => {
    try {
      const response: AxiosResponse<ApiResponse<TeamMember>> = await apiClient.get(`/team-members/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching team member with id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (data: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: TeamMember }> => {
    try {
      const response: AxiosResponse<ApiResponse<TeamMember>> = await apiClient.post('/team-members', data);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  },
  
  update: async (id: string, data: Partial<Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>>): Promise<{ data: TeamMember }> => {
    try {
      const response: AxiosResponse<ApiResponse<TeamMember>> = await apiClient.put(`/team-members/${id}`, data);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating team member with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/team-members/${id}`);
    } catch (error) {
      console.error(`Error deleting team member with id ${id}:`, error);
      throw error;
    }
  },

  // Get team performance metrics
  getPerformance: async (period?: string): Promise<{ data: TeamPerformance[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<TeamPerformance[]>> = await apiClient.get('/team/performance', {
        params: { period }
      });
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching team performance:', error);
      throw error;
    }
  },

  // Get salary settings
  getSalarySettings: async (): Promise<{ data: SalarySettings[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<SalarySettings[]>> = await apiClient.get('/salary-settings');
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching salary settings:', error);
      throw error;
    }
  },

  // Calculate salary for a team member
  calculateSalary: async (memberId: string, month?: string, year?: string): Promise<{ data: { 
    salary: number,
    details: {
      base_salary: number,
      task_bonus: number,
      hourly_earnings: number,
      overtime_earnings: number
    }
  } }> => {
    try {
      const response = await apiClient.get(`/team-members/${memberId}/salary`, {
        params: { month, year }
      });
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error calculating salary for team member ${memberId}:`, error);
      throw error;
    }
  },

  // Update team member salary settings
  updateSalarySettings: async (memberId: string, settings: Partial<SalarySettings>): Promise<{ data: SalarySettings }> => {
    try {
      const response = await apiClient.put(`/team-members/${memberId}/salary-settings`, settings);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating salary settings for team member ${memberId}:`, error);
      throw error;
    }
  }
};
