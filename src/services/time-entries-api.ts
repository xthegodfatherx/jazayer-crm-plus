
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define types based on the backend structures
export interface TimeEntry {
  id: number;
  task_id: number;
  user_id: number | null;
  project_id: number | null;
  start_time: string;
  end_time: string;
  duration: number;
  description: string;
  billable: boolean;
  created_at: string;
  updated_at: string;
}

// Type for creating a new time entry
export interface TimeEntryInsert {
  task_id: string | number;
  user_id: number | null;
  project_id: number | null;
  start_time: string;
  end_time: string;
  duration: number;
  description: string;
  billable: boolean;
}

// Define the API response type
interface ApiResponse<T> {
  data: T;
}

export const timeEntriesApi = {
  getAll: async (params?: { taskId?: number }): Promise<{ data: TimeEntry[] }> => {
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
  
  get: async (id: number): Promise<{ data: TimeEntry }> => {
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
  
  update: async (id: number, timeEntryData: Partial<TimeEntry>): Promise<{ data: TimeEntry }> => {
    try {
      const response: AxiosResponse<ApiResponse<TimeEntry>> = await apiClient.put(`/time-entries/${id}`, timeEntryData);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error updating time entry with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/time-entries/${id}`);
    } catch (error) {
      console.error(`Error deleting time entry with id ${id}:`, error);
      throw error;
    }
  },
};
