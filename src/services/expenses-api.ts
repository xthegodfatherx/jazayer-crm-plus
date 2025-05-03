
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define types based on the backend structures
export interface Expense {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  category: string;
  date: string;
  status: string;
  project_id: string | null;
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpenseFilter {
  status?: string;
  category?: string;
  project_id?: string;
  date_from?: string;
  date_to?: string;
}

// Define the API response type
interface ApiResponse<T> {
  data: T;
}

export const expensesApi = {
  getAll: async (params?: { filters?: ExpenseFilter }): Promise<{ data: Expense[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<Expense[]>> = await apiClient.get('/expenses', { 
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
      const response: AxiosResponse<ApiResponse<Expense>> = await apiClient.get(`/expenses/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching expense with id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (expenseData: Partial<Expense>): Promise<{ data: Expense }> => {
    try {
      // Handle file uploads if receipt is included
      const formData = new FormData();
      
      // Append all expense data to formData
      for (const [key, value] of Object.entries(expenseData)) {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      }
      
      const response: AxiosResponse<ApiResponse<Expense>> = await apiClient.post('/expenses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },
  
  update: async (id: string, expenseData: Partial<Expense>): Promise<{ data: Expense }> => {
    try {
      // Handle file uploads if receipt is included
      const formData = new FormData();
      
      // Append all expense data to formData
      for (const [key, value] of Object.entries(expenseData)) {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      }
      
      // Laravel expects PUT/POST for file uploads with _method=PUT
      formData.append('_method', 'PUT');
      
      const response: AxiosResponse<ApiResponse<Expense>> = await apiClient.post(`/expenses/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating expense with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/expenses/${id}`);
    } catch (error) {
      console.error(`Error deleting expense with id ${id}:`, error);
      throw error;
    }
  },
};
