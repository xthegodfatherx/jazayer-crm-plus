
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  receipt_url?: string;
  status: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  data: T;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const expensesApi = {
  getAll: async (params?: { filters?: any }): Promise<{ data: Expense[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<Expense[]>> = await apiClient.get(`${API_URL}/expenses`, { 
        params: params?.filters 
      });
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },
  
  get: async (id: string): Promise<{ data: Expense }> => {
    try {
      const response: AxiosResponse<ApiResponse<Expense>> = await apiClient.get(`${API_URL}/expenses/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching expense with id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (data: Omit<Expense, "id" | "created_at" | "updated_at">): Promise<{ data: Expense }> => {
    try {
      const response: AxiosResponse<ApiResponse<Expense>> = await apiClient.post(`${API_URL}/expenses`, data);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },
  
  update: async (id: string, data: Partial<Omit<Expense, "id" | "created_at" | "updated_at">>): Promise<{ data: Expense }> => {
    try {
      const response: AxiosResponse<ApiResponse<Expense>> = await apiClient.put(`${API_URL}/expenses/${id}`, data);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating expense with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`${API_URL}/expenses/${id}`);
    } catch (error) {
      console.error(`Error deleting expense with id ${id}:`, error);
      throw error;
    }
  },

  // Upload receipt
  uploadReceipt: async (id: string, file: File): Promise<{ receipt_url: string }> => {
    try {
      const formData = new FormData();
      formData.append('receipt', file);
      
      const response: AxiosResponse<{ receipt_url: string }> = await apiClient.post(
        `${API_URL}/expenses/${id}/receipt`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error uploading receipt for expense ${id}:`, error);
      throw error;
    }
  },

  // Get expense categories
  getCategories: async (): Promise<{ data: string[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<string[]>> = await apiClient.get(`${API_URL}/expenses/categories`);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching expense categories:', error);
      throw error;
    }
  }
};
