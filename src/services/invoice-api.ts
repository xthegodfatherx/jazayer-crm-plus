
import { AxiosResponse } from 'axios';
import apiClient from './api-client';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client: string;
  amount: number;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'unpaid' | 'paid' | 'overdue' | 'cancelled';
  items?: InvoiceItem[];
}

interface ApiResponse<T> {
  data: T;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const invoiceApi = {
  getAll: async (): Promise<{ data: Invoice[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<Invoice[]>> = await apiClient.get(`${API_URL}/invoices`);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<{ data: Invoice }> => {
    try {
      const response: AxiosResponse<ApiResponse<Invoice>> = await apiClient.get(`${API_URL}/invoices/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching invoice with id ${id}:`, error);
      throw error;
    }
  },

  create: async (invoiceData: Omit<Invoice, 'id'>): Promise<{ data: Invoice }> => {
    try {
      const response: AxiosResponse<ApiResponse<Invoice>> = await apiClient.post(`${API_URL}/invoices`, invoiceData);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  update: async (id: string, invoiceData: Partial<Omit<Invoice, 'id'>>): Promise<{ data: Invoice }> => {
    try {
      const response: AxiosResponse<ApiResponse<Invoice>> = await apiClient.put(`${API_URL}/invoices/${id}`, invoiceData);
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

  sendInvoice: async (id: string): Promise<void> => {
    try {
      await apiClient.post(`${API_URL}/invoices/${id}/send`);
    } catch (error) {
      console.error(`Error sending invoice with id ${id}:`, error);
      throw error;
    }
  },

  export: async ({ format, invoices }: { format: 'pdf' | 'excel', invoices: string[] }): Promise<Blob> => {
    try {
      const response = await apiClient.post(
        `${API_URL}/invoices/export`, 
        { format, invoices },
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      console.error('Error exporting invoices:', error);
      throw error;
    }
  }
};
