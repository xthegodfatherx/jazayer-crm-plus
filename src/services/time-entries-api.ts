
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define types based on the backend structures
export interface TimeEntry {
  id: string;
  task_id: string | null;
  project_id: string | null;
  user_id: string | null;
  description: string | null;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  billable: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimeEntryInsert {
  task_id: string | null;
  project_id: string | null;
  user_id: string | null;
  description: string | null;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  billable: boolean;
}

export interface TimeEntryFilter {
  task_id?: string;
  project_id?: string;
  user_id?: string;
  date_from?: string;
  date_to?: string;
  billable?: boolean;
}

// Define the API response type
interface ApiResponse<T> {
  data: T;
}

export const timeEntriesApi = {
  getAll: async (params?: { filters?: TimeEntryFilter }): Promise<{ data: TimeEntry[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<TimeEntry[]>> = await apiClient.get('/time-entries', { 
        params: params?.filters 
      });
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching time entries:', error);
      throw error;
    }
  },
  
  get: async (id: string): Promise<{ data: TimeEntry }> => {
    try {
      const response: AxiosResponse<ApiResponse<TimeEntry>> = await apiClient.get(`/time-entries/${id}`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching time entry with id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (timeEntryData: TimeEntryInsert): Promise<{ data: TimeEntry }> => {
    try {
      const response: AxiosResponse<ApiResponse<TimeEntry>> = await apiClient.post('/time-entries', timeEntryData);
      return { data: response.data.data };
    } catch (error) {
      console.error('Error creating time entry:', error);
      throw error;
    }
  },
  
  update: async (id: string, timeEntryData: Partial<TimeEntry>): Promise<{ data: TimeEntry }> => {
    try {
      const response: AxiosResponse<ApiResponse<TimeEntry>> = await apiClient.put(`/time-entries/${id}`, timeEntryData);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating time entry with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/time-entries/${id}`);
    } catch (error) {
      console.error(`Error deleting time entry with id ${id}:`, error);
      throw error;
    }
  },
};
