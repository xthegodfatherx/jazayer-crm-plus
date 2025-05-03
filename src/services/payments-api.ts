
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define types based on the backend structures
export interface Payment {
  id: string;
  invoice_id: string | null;
  amount: number;
  payment_date: string;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  reference_number: string | null;
  notes: string | null;
  client_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentFilter {
  status?: string;
  client_id?: string;
  invoice_id?: string;
  from_date?: string;
  to_date?: string;
}

// Define the API response type
interface ApiResponse<T> {
  data: T;
}

export const paymentsApi = {
  getAll: async (params?: { filters?: PaymentFilter }): Promise<{ data: Payment[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<Payment[]>> = await apiClient.get('/payments', { 
        params: params?.filters 
      });
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },
  
  get: async (id: string): Promise<{ data: Payment }> => {
    try {
      const response: AxiosResponse<ApiResponse<Payment>> = await apiClient.get(`/payments/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching payment with id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (paymentData: Partial<Payment>): Promise<{ data: Payment }> => {
    try {
      const response: AxiosResponse<ApiResponse<Payment>> = await apiClient.post('/payments', paymentData);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },
  
  update: async (id: string, paymentData: Partial<Payment>): Promise<{ data: Payment }> => {
    try {
      const response: AxiosResponse<ApiResponse<Payment>> = await apiClient.put(`/payments/${id}`, paymentData);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating payment with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/payments/${id}`);
    } catch (error) {
      console.error(`Error deleting payment with id ${id}:`, error);
      throw error;
    }
  },
};
