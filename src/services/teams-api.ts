
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

export interface Team {
  id: string;
  name: string;
  description?: string;
  leader_id?: string;
  leader_name?: string;
  created_at: string;
  updated_at: string;
  member_count: number;
  badge_color?: string;
}

export interface TeamMember {
  id: string;
  user_id: string;
  team_id: string;
  name: string;
  email: string;
  role: string;
  is_leader: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const teamsApi = {
  // Get all teams
  getAll: async (): Promise<Team[]> => {
    try {
      const response: AxiosResponse<ApiResponse<Team[]>> = await apiClient.get(`${API_URL}/teams`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  },

  // Get a single team by ID
  get: async (id: string): Promise<Team> => {
    try {
      const response: AxiosResponse<ApiResponse<Team>> = await apiClient.get(`${API_URL}/teams/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching team with id ${id}:`, error);
      throw error;
    }
  },

  // Create a new team
  create: async (data: Omit<Team, 'id' | 'created_at' | 'updated_at'>): Promise<Team> => {
    try {
      const response: AxiosResponse<ApiResponse<Team>> = await apiClient.post(`${API_URL}/teams`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  },

  // Update a team
  update: async (id: string, data: Partial<Omit<Team, 'id' | 'created_at' | 'updated_at'>>): Promise<Team> => {
    try {
      const response: AxiosResponse<ApiResponse<Team>> = await apiClient.patch(`${API_URL}/teams/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating team with id ${id}:`, error);
      throw error;
    }
  },

  // Delete a team
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`${API_URL}/teams/${id}`);
    } catch (error) {
      console.error(`Error deleting team with id ${id}:`, error);
      throw error;
    }
  },

  // Get team members
  getMembers: async (teamId: string): Promise<TeamMember[]> => {
    try {
      const response: AxiosResponse<ApiResponse<TeamMember[]>> = 
        await apiClient.get(`${API_URL}/teams/${teamId}/members`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching members for team ${teamId}:`, error);
      throw error;
    }
  },

  // Assign user to team
  assignUser: async (teamId: string, userId: string): Promise<void> => {
    try {
      await apiClient.post(`${API_URL}/teams/${teamId}/assign-user`, { user_id: userId });
    } catch (error) {
      console.error(`Error assigning user to team:`, error);
      throw error;
    }
  },

  // Set team leader
  setLeader: async (teamId: string, userId: string): Promise<void> => {
    try {
      await apiClient.post(`${API_URL}/teams/${teamId}/set-leader`, { user_id: userId });
    } catch (error) {
      console.error(`Error setting team leader:`, error);
      throw error;
    }
  },
  
  // Remove user from team
  removeUser: async (teamId: string, userId: string): Promise<void> => {
    try {
      await apiClient.delete(`${API_URL}/teams/${teamId}/members/${userId}`);
    } catch (error) {
      console.error(`Error removing user from team:`, error);
      throw error;
    }
  },
  
  // Get team performance metrics
  getPerformance: async (teamId: string, period?: string): Promise<any> => {
    try {
      const response: AxiosResponse<ApiResponse<any>> = 
        await apiClient.get(`${API_URL}/teams/${teamId}/performance`, {
          params: { period }
        });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching performance for team ${teamId}:`, error);
      throw error;
    }
  }
};
