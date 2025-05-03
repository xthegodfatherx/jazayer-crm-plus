
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define types based on the backend structures
export interface Activity {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  type: 'task' | 'invoice' | 'payment' | 'team' | 'notification';
  description: string;
  entity_id?: string;
  entity_type?: string;
  created_at: string;
}

// Define the API response type
interface ApiResponse<T> {
  data: T;
}

export const activityApi = {
  getAll: async (params?: { filters?: any }): Promise<{ data: Activity[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<Activity[]>> = await apiClient.get('/activities', { 
        params: params?.filters 
      });
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },
  
  getRecent: async (limit: number = 10): Promise<{ data: Activity[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<Activity[]>> = await apiClient.get('/activities/recent', {
        params: { limit }
      });
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  },
  
  create: async (data: Omit<Activity, 'id' | 'created_at'>): Promise<{ data: Activity }> => {
    try {
      const response: AxiosResponse<ApiResponse<Activity>> = await apiClient.post('/activities', data);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  },
};
