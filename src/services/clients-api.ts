
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define types based on the backend structures
export interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ClientFilter {
  status?: string;
  name?: string;
}

// Define the API response type
interface ApiResponse<T> {
  data: T;
}

export const clientsApi = {
  getAll: async (params?: { filters?: ClientFilter }): Promise<{ data: Client[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<Client[]>> = await apiClient.get('/clients', { 
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
      const response: AxiosResponse<ApiResponse<Client>> = await apiClient.get(`/clients/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching client with id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (clientData: Partial<Client>): Promise<{ data: Client }> => {
    try {
      const response: AxiosResponse<ApiResponse<Client>> = await apiClient.post('/clients', clientData);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },
  
  update: async (id: string, clientData: Partial<Client>): Promise<{ data: Client }> => {
    try {
      const response: AxiosResponse<ApiResponse<Client>> = await apiClient.put(`/clients/${id}`, clientData);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating client with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/clients/${id}`);
    } catch (error) {
      console.error(`Error deleting client with id ${id}:`, error);
      throw error;
    }
  },
};
