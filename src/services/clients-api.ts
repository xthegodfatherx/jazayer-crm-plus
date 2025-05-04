
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

export interface Client {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  data: T;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const clientsApi = {
  getAll: async (params?: { filters?: any }): Promise<{ data: Client[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<Client[]>> = await apiClient.get(`${API_URL}/clients`, { 
        params: params?.filters 
      });
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },
  
  get: async (id: string): Promise<{ data: Client }> => {
    try {
      const response: AxiosResponse<ApiResponse<Client>> = await apiClient.get(`${API_URL}/clients/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching client with id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (data: Omit<Client, "id" | "created_at" | "updated_at">): Promise<{ data: Client }> => {
    try {
      const response: AxiosResponse<ApiResponse<Client>> = await apiClient.post(`${API_URL}/clients`, data);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },
  
  update: async (id: string, data: Partial<Omit<Client, "id" | "created_at" | "updated_at">>): Promise<{ data: Client }> => {
    try {
      const response: AxiosResponse<ApiResponse<Client>> = await apiClient.put(`${API_URL}/clients/${id}`, data);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating client with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`${API_URL}/clients/${id}`);
    } catch (error) {
      console.error(`Error deleting client with id ${id}:`, error);
      throw error;
    }
  },

  // Get client projects
  getProjects: async (id: string): Promise<{ data: any[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<any[]>> = await apiClient.get(`${API_URL}/clients/${id}/projects`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching projects for client ${id}:`, error);
      throw error;
    }
  },

  // Get client invoices
  getInvoices: async (id: string): Promise<{ data: any[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<any[]>> = await apiClient.get(`${API_URL}/clients/${id}/invoices`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching invoices for client ${id}:`, error);
      throw error;
    }
  }
};
