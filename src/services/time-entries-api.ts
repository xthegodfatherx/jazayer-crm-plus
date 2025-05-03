
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define types based on the backend structures
export interface TimeEntry {
  id: string;
  task_id: string | null;
  user_id: string | null;
  project_id: string | null;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  description: string | null;
  billable: boolean | null;
  hourly_rate: number | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  task?: {
    id: string;
    title: string;
    status: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
  project?: {
    id: string;
    name: string;
  };
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
  hourly_rate?: number | null;
}

// Define time tracking summary interface
export interface TimeTrackingSummary {
  total_time: number; // in seconds
  billable_time: number; // in seconds
  non_billable_time: number; // in seconds
  by_project: {
    project_id: string;
    project_name: string;
    time: number; // in seconds
  }[];
  by_task_status: {
    status: string;
    time: number; // in seconds
  }[];
  salary_earned: number;
}

// Define the API response type
interface ApiResponse<T> {
  data: T;
}

export const timeEntriesApi = {
  getAll: async (params?: { taskId?: string, userId?: string, projectId?: string, dateFrom?: string, dateTo?: string }): Promise<{ data: TimeEntry[] }> => {
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

  // Get summary of time entries for a period
  getSummary: async (userId: string, dateFrom?: string, dateTo?: string): Promise<{ data: TimeTrackingSummary }> => {
    try {
      const response: AxiosResponse<ApiResponse<TimeTrackingSummary>> = await apiClient.get(`/time-entries/summary/${userId}`, {
        params: { 
          date_from: dateFrom,
          date_to: dateTo
        }
      });
      return { data: response.data.data };
    } catch (error) {
      console.error('Error fetching time entries summary:', error);
      throw error;
    }
  },

  // Approve a time entry
  approve: async (id: string): Promise<{ data: TimeEntry }> => {
    try {
      const response: AxiosResponse<ApiResponse<TimeEntry>> = await apiClient.post(`/time-entries/${id}/approve`);
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error approving time entry with id ${id}:`, error);
      throw error;
    }
  },

  // Reject a time entry
  reject: async (id: string, reason: string): Promise<{ data: TimeEntry }> => {
    try {
      const response: AxiosResponse<ApiResponse<TimeEntry>> = await apiClient.post(`/time-entries/${id}/reject`, { reason });
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error rejecting time entry with id ${id}:`, error);
      throw error;
    }
  },

  // Get time entries by period (day, week, month)
  getByPeriod: async (period: 'day' | 'week' | 'month', userId?: string): Promise<{ data: TimeEntry[] }> => {
    try {
      const response: AxiosResponse<ApiResponse<TimeEntry[]>> = await apiClient.get(`/time-entries/period/${period}`, {
        params: { user_id: userId }
      });
      return { data: response.data.data };
    } catch (error) {
      console.error(`Error fetching time entries by period ${period}:`, error);
      throw error;
    }
  }
};
