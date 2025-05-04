
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define invoice item interface
export interface InvoiceItem {
  id?: string;
  name: string;
  description?: string;
  quantity: number;
  price?: number;
  total?: number;
}

// Define the invoice interface
export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  client?: {
    id: string;
    name: string;
    email?: string;
    address?: string;
  };
  status: string;
  issued_date?: string;
  due_date?: string;
  payment_date?: string;
  amount: number;
  total: number; // Added to fix type error
  subtotal?: number;
  tax_rate?: number;
  tax_amount?: number;
  notes?: string;
  terms?: string;
  reference?: string;
  items?: InvoiceItem[];
  created_at?: string;
  updated_at?: string;
}

// Define filter params interface
export interface InvoiceFilters {
  client_id?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
  search?: string;
}

// Define the API response type
interface ApiResponse<T> {
  data: T;
}

export const invoicesApi = {
  getAll: async (params?: { filters?: InvoiceFilters }): Promise<{ data: Invoice[] }> => {
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
  
  update: async (id: string, data: Partial<Invoice>): Promise<{ data: Invoice }> => {
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

  // Send invoice by email
  sendByEmail: async (id: string, emailData: { to?: string, message?: string }): Promise<void> => {
    try {
      await apiClient.post(`/invoices/${id}/send`, emailData);
    } catch (error) {
      console.error(`Error sending invoice ${id} by email:`, error);
      throw error;
    }
  },
  
  // Generate PDF for an invoice
  generatePdf: async (id: string): Promise<Blob> => {
    try {
      const response = await apiClient.get(`/invoices/${id}/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Error generating PDF for invoice ${id}:`, error);
      throw error;
    }
  }
};
