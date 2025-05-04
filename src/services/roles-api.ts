
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

export interface Permission {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  created_at: string;
  updated_at: string;
  permissions: string[];
}

// Define API response type
interface ApiResponse<T> {
  data: T;
}

export const rolesApi = {
  getAll: async (): Promise<{ data: Role[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<Role[]>> = await apiClient.get('/api/roles');
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },
  
  get: async (id: string): Promise<{ data: Role }> => {
    try {
      const response: AxiosResponse<ApiResponse<Role>> = await apiClient.get(`/api/roles/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching role with id ${id}:`, error);
      throw error;
    }
  },
  
  update: async (id: string, data: Partial<Role>): Promise<{ data: Role }> => {
    try {
      const response: AxiosResponse<ApiResponse<Role>> = await apiClient.put(`/api/roles/${id}`, data);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating role with id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (data: Omit<Role, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Role }> => {
    try {
      const response: AxiosResponse<ApiResponse<Role>> = await apiClient.post('/api/roles', data);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/roles/${id}`);
    } catch (error) {
      console.error(`Error deleting role with id ${id}:`, error);
      throw error;
    }
  },
  
  getPermissions: async (): Promise<{ data: Permission[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<Permission[]>> = await apiClient.get('/api/permissions');
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  },
  
  updateRolePermissions: async (roleId: string, permissionIds: string[]): Promise<{ data: Role }> => {
    try {
      const response: AxiosResponse<ApiResponse<Role>> = await apiClient.put(`/api/roles/${roleId}/permissions`, { 
        permissions: permissionIds 
      });
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating permissions for role ${roleId}:`, error);
      throw error;
    }
  }
};
