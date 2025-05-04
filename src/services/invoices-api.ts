
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id?: string;
  project_id?: string;
  issued_date?: string;
  due_date?: string;
  status: string;
  amount: number;
  tax?: number;
  discount?: number;
  notes?: string;
  items?: InvoiceItem[];
  payment_method?: string;
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

export const invoicesApi = {
  getAll: async (params?: { filters?: any }): Promise<{ data: Invoice[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<Invoice[]>> = await apiClient.get(`${API_URL}/invoices`, { 
        params: params?.filters 
      });
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },
  
  get: async (id: string): Promise<{ data: Invoice }> => {
    try {
      const response: AxiosResponse<ApiResponse<Invoice>> = await apiClient.get(`${API_URL}/invoices/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching invoice with id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (data: Omit<Invoice, "id" | "created_at" | "updated_at">): Promise<{ data: Invoice }> => {
    try {
      const response: AxiosResponse<ApiResponse<Invoice>> = await apiClient.post(`${API_URL}/invoices`, data);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },
  
  update: async (id: string, data: Partial<Omit<Invoice, "id" | "created_at" | "updated_at">>): Promise<{ data: Invoice }> => {
    try {
      const response: AxiosResponse<ApiResponse<Invoice>> = await apiClient.put(`${API_URL}/invoices/${id}`, data);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating invoice with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`${API_URL}/invoices/${id}`);
    } catch (error) {
      console.error(`Error deleting invoice with id ${id}:`, error);
      throw error;
    }
  },

  // Generate PDF
  generatePdf: async (id: string): Promise<{ url: string }> => {
    try {
      const response: AxiosResponse<{ url: string }> = await apiClient.post(`${API_URL}/invoices/${id}/pdf`);
      return response.data;
    } catch (error) {
      console.error(`Error generating PDF for invoice ${id}:`, error);
      throw error;
    }
  },

  // Send invoice by email
  sendByEmail: async (id: string): Promise<{ success: boolean }> => {
    try {
      const response: AxiosResponse<{ success: boolean }> = await apiClient.post(`${API_URL}/invoices/${id}/send`);
      return response.data;
    } catch (error) {
      console.error(`Error sending invoice ${id} by email:`, error);
      throw error;
    }
  },

  // Mark invoice as paid
  markAsPaid: async (id: string, paymentMethod: string): Promise<{ data: Invoice }> => {
    try {
      const response: AxiosResponse<ApiResponse<Invoice>> = await apiClient.post(`${API_URL}/invoices/${id}/pay`, {
        payment_method: paymentMethod
      });
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error marking invoice ${id} as paid:`, error);
      throw error;
    }
  }
};
