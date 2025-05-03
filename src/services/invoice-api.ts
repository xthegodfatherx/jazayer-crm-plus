
import apiClient from './api-client';
import { AxiosResponse } from 'axios';
import { Invoice } from '@/types/invoice';

// Define types based on the backend structures
export interface InvoiceStats {
  total: number;
  count: number;
  count_change: number;
  paid: number;
  unpaid: number;
  overdue: number;
  draft: number;
}

// Define the API response type
interface ApiResponse<T> {
  data: T;
}

export interface InvoiceExportOptions {
  format: 'pdf' | 'excel';
  invoices?: string[];
  filter?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  };
}

export const invoiceApi = {
  getAll: async (params?: { filters?: any }): Promise<{ data: Invoice[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<Invoice[]>> = await apiClient.get('/invoices', { 
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
      const response: AxiosResponse<ApiResponse<Invoice>> = await apiClient.get(`/invoices/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching invoice with id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (data: Omit<Invoice, 'id'>): Promise<{ data: Invoice }> => {
    try {
      const response: AxiosResponse<ApiResponse<Invoice>> = await apiClient.post('/invoices', data);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },
  
  update: async (id: string, data: Partial<Omit<Invoice, 'id'>>): Promise<{ data: Invoice }> => {
    try {
      const response: AxiosResponse<ApiResponse<Invoice>> = await apiClient.put(`/invoices/${id}`, data);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating invoice with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/invoices/${id}`);
    } catch (error) {
      console.error(`Error deleting invoice with id ${id}:`, error);
      throw error;
    }
  },

  // Get invoice statistics
  getStats: async (filters?: { status?: string, period?: string }): Promise<{ data: InvoiceStats }> => {
    try {
      const response: AxiosResponse<ApiResponse<InvoiceStats>> = await apiClient.get('/invoices/stats', {
        params: filters 
      });
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching invoice stats:', error);
      throw error;
    }
  },
  
  // Export invoices
  export: async (options: InvoiceExportOptions): Promise<Blob> => {
    try {
      const response = await apiClient.post(`/invoices/export/${options.format}`, {
        invoices: options.invoices || [],
        filter: options.filter || {}
      }, { 
        responseType: 'blob' 
      });
      return response.data;
    } catch (error) {
      console.error(`Error exporting invoices as ${options.format}:`, error);
      throw error;
    }
  },
};
