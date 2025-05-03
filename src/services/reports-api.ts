
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define types based on the backend structures
export interface Report {
  id: string;
  title: string;
  type: 'project' | 'team' | 'financial' | 'time' | 'task';
  date_range: {
    start: string;
    end: string;
  };
  data: any; // This will depend on the report type
  created_at: string;
  updated_at: string;
}

export interface ReportFilter {
  type?: string;
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
  
  generate: async (reportData: { type: string, params: any }): Promise<{ data: Report }> => {
    try {
      const response: AxiosResponse<ApiResponse<Report>> = await apiClient.post('/reports/generate', reportData);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },
  
  export: async (id: string, format: 'pdf' | 'csv' | 'excel'): Promise<Blob> => {
    try {
      const response = await apiClient.get(`/reports/${id}/export/${format}`, { 
        responseType: 'blob' 
      });
      return response.data;
    } catch (error) {
      console.error(`Error exporting report ${id} as ${format}:`, error);
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
