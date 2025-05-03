
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define types based on the backend structures
export interface Report {
  id: string;
  title: string;
  type: string;
  created_by: string | null;
  parameters: any | null;
  date_range_start: string | null;
  date_range_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReportFilter {
  type?: string;
  created_by?: string;
  date_from?: string;
  date_to?: string;
}

// Define the API response type
interface ApiResponse<T> {
  data: T;
}

export const reportsApi = {
  getAll: async (params?: { filters?: ReportFilter }): Promise<{ data: Report[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<Report[]>> = await apiClient.get('/reports', { 
        params: params?.filters 
      });
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },
  
  get: async (id: string): Promise<{ data: Report }> => {
    try {
      const response: AxiosResponse<ApiResponse<Report>> = await apiClient.get(`/reports/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching report with id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (reportData: Partial<Report>): Promise<{ data: Report }> => {
    try {
      const response: AxiosResponse<ApiResponse<Report>> = await apiClient.post('/reports', reportData);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },
  
  update: async (id: string, reportData: Partial<Report>): Promise<{ data: Report }> => {
    try {
      const response: AxiosResponse<ApiResponse<Report>> = await apiClient.put(`/reports/${id}`, reportData);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating report with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/reports/${id}`);
    } catch (error) {
      console.error(`Error deleting report with id ${id}:`, error);
      throw error;
    }
  },
};
