
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

export interface Subscription {
  id: string;
  name: string;
  description?: string;
  price: number;
  billing_cycle: 'monthly' | 'quarterly' | 'yearly';
  status: string;
  start_date?: string;
  end_date?: string;
  client_id?: string;
  created_at: string;
  updated_at: string;
  features?: string[];
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

export const subscriptionsApi = {
  getAll: async (params?: { filters?: any }): Promise<{ data: Subscription[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<Subscription[]>> = await apiClient.get(`${API_URL}/subscriptions`, { 
        params: params?.filters 
      });
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  },
  
  get: async (id: string): Promise<{ data: Subscription }> => {
    try {
      const response: AxiosResponse<ApiResponse<Subscription>> = await apiClient.get(`${API_URL}/subscriptions/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching subscription with id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (data: Omit<Subscription, "id" | "created_at" | "updated_at">): Promise<{ data: Subscription }> => {
    try {
      const response: AxiosResponse<ApiResponse<Subscription>> = await apiClient.post(`${API_URL}/subscriptions`, data);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  },
  
  update: async (id: string, data: Partial<Omit<Subscription, "id" | "created_at" | "updated_at">>): Promise<{ data: Subscription }> => {
    try {
      const response: AxiosResponse<ApiResponse<Subscription>> = await apiClient.put(`${API_URL}/subscriptions/${id}`, data);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating subscription with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`${API_URL}/subscriptions/${id}`);
    } catch (error) {
      console.error(`Error deleting subscription with id ${id}:`, error);
      throw error;
    }
  },

  // Cancel subscription
  cancel: async (id: string, reason?: string): Promise<{ data: Subscription }> => {
    try {
      const response: AxiosResponse<ApiResponse<Subscription>> = await apiClient.post(`${API_URL}/subscriptions/${id}/cancel`, { 
        reason 
      });
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error cancelling subscription ${id}:`, error);
      throw error;
    }
  },

  // Renew subscription
  renew: async (id: string): Promise<{ data: Subscription }> => {
    try {
      const response: AxiosResponse<ApiResponse<Subscription>> = await apiClient.post(`${API_URL}/subscriptions/${id}/renew`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error renewing subscription ${id}:`, error);
      throw error;
    }
  },

  // Get subscription plans
  getPlans: async (): Promise<{ data: any[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<any[]>> = await apiClient.get(`${API_URL}/subscription-plans`);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }
  }
};
