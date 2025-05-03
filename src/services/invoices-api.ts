
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define types based on the backend structures
export interface Invoice {
  id: string;
  client_id: string;
  date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  tax: number;
  total: number;
  notes: string | null;
  terms: string | null;
  created_at: string;
  updated_at: string;
  items?: InvoiceItem[];
  client?: {
    id: string;
    name: string;
    company: string | null;
  };
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface InvoiceFilter {
  status?: string;
  client_id?: string;
  date_from?: string;
  date_to?: string;
}

// Define the API response type
interface ApiResponse<T> {
  data: T;
}

export const invoicesApi = {
  getAll: async (params?: { filters?: InvoiceFilter }): Promise<{ data: Invoice[] }> => {
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
  
  create: async (invoiceData: Partial<Invoice>): Promise<{ data: Invoice }> => {
    try {
      const response: AxiosResponse<ApiResponse<Invoice>> = await apiClient.post('/invoices', invoiceData);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },
  
  update: async (id: string, invoiceData: Partial<Invoice>): Promise<{ data: Invoice }> => {
    try {
      const response: AxiosResponse<ApiResponse<Invoice>> = await apiClient.put(`/invoices/${id}`, invoiceData);
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
  
  sendInvoice: async (id: string): Promise<{ data: Invoice }> => {
    try {
      const response: AxiosResponse<ApiResponse<Invoice>> = await apiClient.post(`/invoices/${id}/send`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error sending invoice with id ${id}:`, error);
      throw error;
    }
  },
  
  markAsPaid: async (id: string): Promise<{ data: Invoice }> => {
    try {
      const response: AxiosResponse<ApiResponse<Invoice>> = await apiClient.post(`/invoices/${id}/mark-paid`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error marking invoice ${id} as paid:`, error);
      throw error;
    }
  },
};
