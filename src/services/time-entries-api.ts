
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define types based on the backend structures
export interface TimeEntry {
  id: string; // Changed from number to string to match Supabase UUID format
  task_id: string | null; // Changed from number to string or null
  user_id: string | null; // Changed from number to string or null
  project_id: string | null; // Changed from number to string or null
  start_time: string;
  end_time: string | null; // Adding null as it can be null
  duration: number | null; // Adding null as it can be null
  description: string | null; // Adding null as it can be null
  billable: boolean | null;
  created_at: string;
  updated_at: string;
}

// Type for creating a new time entry
export interface TimeEntryInsert {
  task_id: string | null;
  user_id: string | null;
  project_id: string | null;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  description: string | null;
  billable: boolean | null;
}

// Define the API response type
interface ApiResponse<T> {
  data: T;
}

export const timeEntriesApi = {
  getAll: async (params?: { taskId?: string }): Promise<{ data: TimeEntry[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<TimeEntry[]>> = await apiClient.get('/time-entries', { 
        params: params
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
