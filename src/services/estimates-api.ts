
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

export interface EstimateItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface Estimate {
  id: string;
  estimate_number: string;
  client_id?: string;
  project_id?: string;
  issued_date?: string;
  expiry_date?: string;
  status: string;
  amount: number;
  tax?: number;
  discount?: number;
  notes?: string;
  items?: EstimateItem[];
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    name: string;
    email?: string;
  };
}

interface ApiResponse<T> {
  data: T;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const estimatesApi = {
  getAll: async (params?: { filters?: any }): Promise<{ data: Estimate[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<Estimate[]>> = await apiClient.get(`${API_URL}/estimates`, { 
        params: params?.filters 
      });
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching estimates:', error);
      throw error;
    }
  },
  
  get: async (id: string): Promise<{ data: Estimate }> => {
    try {
      const response: AxiosResponse<ApiResponse<Estimate>> = await apiClient.get(`${API_URL}/estimates/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching estimate with id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (data: Omit<Estimate, "id" | "created_at" | "updated_at">): Promise<{ data: Estimate }> => {
    try {
      const response: AxiosResponse<ApiResponse<Estimate>> = await apiClient.post(`${API_URL}/estimates`, data);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating estimate:', error);
      throw error;
    }
  },
  
  update: async (id: string, data: Partial<Omit<Estimate, "id" | "created_at" | "updated_at">>): Promise<{ data: Estimate }> => {
    try {
      const response: AxiosResponse<ApiResponse<Estimate>> = await apiClient.put(`${API_URL}/estimates/${id}`, data);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating estimate with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`${API_URL}/estimates/${id}`);
    } catch (error) {
      console.error(`Error deleting estimate with id ${id}:`, error);
      throw error;
    }
  },

  // Generate PDF
  generatePdf: async (id: string): Promise<{ url: string }> => {
    try {
      const response: AxiosResponse<{ url: string }> = await apiClient.post(`${API_URL}/estimates/${id}/pdf`);
      return response.data;
    } catch (error) {
      console.error(`Error generating PDF for estimate ${id}:`, error);
      throw error;
    }
  },

  // Send estimate by email
  sendByEmail: async (id: string): Promise<{ success: boolean }> => {
    try {
      const response: AxiosResponse<{ success: boolean }> = await apiClient.post(`${API_URL}/estimates/${id}/send`);
      return response.data;
    } catch (error) {
      console.error(`Error sending estimate ${id} by email:`, error);
      throw error;
    }
  },

  // Convert estimate to invoice
  convertToInvoice: async (id: string): Promise<{ invoice_id: string }> => {
    try {
      const response: AxiosResponse<{ invoice_id: string }> = await apiClient.post(`${API_URL}/estimates/${id}/convert`);
      return response.data;
    } catch (error) {
      console.error(`Error converting estimate ${id} to invoice:`, error);
      throw error;
    }
  }
};
