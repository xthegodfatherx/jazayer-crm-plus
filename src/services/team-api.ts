
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
}

interface TeamStats {
  total: number;
  active: number;
  admins: number;
  rating_average: number;
}

interface SalarySettings {
  base_salary: number;
  hourly_rate: number;
  tax_rate: number;
  bonus_rate: number;
}

interface ApiResponse<T> {
  data: T;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const teamApi = {
  getMembers: async (): Promise<{ data: TeamMember[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<TeamMember[]>> = await apiClient.get(`${API_URL}/team`);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },

  getMember: async (id: string): Promise<{ data: TeamMember }> => {
    try {
      const response: AxiosResponse<ApiResponse<TeamMember>> = await apiClient.get(`${API_URL}/team/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching team member with id ${id}:`, error);
      throw error;
    }
  },

  create: async (data: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: TeamMember }> => {
    try {
      const response: AxiosResponse<ApiResponse<TeamMember>> = await apiClient.post(`${API_URL}/team`, data);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>>): Promise<{ data: TeamMember }> => {
    try {
      const response: AxiosResponse<ApiResponse<TeamMember>> = await apiClient.put(`${API_URL}/team/${id}`, data);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating team member with id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`${API_URL}/team/${id}`);
    } catch (error) {
      console.error(`Error deleting team member with id ${id}:`, error);
      throw error;
    }
  },

  getTeamStats: async (): Promise<{ data: TeamStats }> => {
    try {
      const response: AxiosResponse<ApiResponse<TeamStats>> = await apiClient.get(`${API_URL}/team/stats`);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching team stats:', error);
      throw error;
    }
  },

  getSalarySettings: async (memberId: string): Promise<{ data: SalarySettings }> => {
    try {
      const response: AxiosResponse<ApiResponse<SalarySettings>> = await apiClient.get(`${API_URL}/team/${memberId}/salary-settings`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching salary settings for member with id ${memberId}:`, error);
      throw error;
    }
  },

  updateSalarySettings: async (memberId: string, settings: Partial<SalarySettings>): Promise<{ data: SalarySettings }> => {
    try {
      const response: AxiosResponse<ApiResponse<SalarySettings>> = await apiClient.put(`${API_URL}/team/${memberId}/salary-settings`, settings);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating salary settings for member with id ${memberId}:`, error);
      throw error;
    }
  }
};
