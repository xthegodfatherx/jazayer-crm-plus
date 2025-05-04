
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define API response type
interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Types for user settings
export interface UserSettings {
  id: string;
  user_id: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  task_reminders: boolean;
  invoice_notifications: boolean;
  system_notifications: boolean;
  dark_mode: boolean;
  language: 'ar' | 'en' | 'fr';
  created_at: string;
  updated_at: string;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const userSettingsApi = {
  // Get user settings
  getUserSettings: async (): Promise<UserSettings> => {
    try {
      const response: AxiosResponse<ApiResponse<UserSettings>> = await apiClient.get(
        `${API_URL}/user/settings`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
  },

  // Update user settings
  updateUserSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    try {
      const response: AxiosResponse<ApiResponse<UserSettings>> = await apiClient.put(
        `${API_URL}/user/settings`,
        settings
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  },

  // Update user notifications settings
  updateNotificationSettings: async (settings: {
    notifications_enabled?: boolean;
    email_notifications?: boolean;
    task_reminders?: boolean;
    invoice_notifications?: boolean;
    system_notifications?: boolean;
  }): Promise<UserSettings> => {
    try {
      const response: AxiosResponse<ApiResponse<UserSettings>> = await apiClient.put(
        `${API_URL}/user/settings/notifications`,
        settings
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },

  // Update user appearance settings
  updateAppearanceSettings: async (settings: {
    dark_mode?: boolean;
  }): Promise<UserSettings> => {
    try {
      const response: AxiosResponse<ApiResponse<UserSettings>> = await apiClient.put(
        `${API_URL}/user/settings/appearance`,
        settings
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating appearance settings:', error);
      throw error;
    }
  },

  // Update user language settings
  updateLanguageSettings: async (settings: {
    language: 'ar' | 'en' | 'fr';
  }): Promise<UserSettings> => {
    try {
      const response: AxiosResponse<ApiResponse<UserSettings>> = await apiClient.put(
        `${API_URL}/user/settings/language`,
        settings
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating language settings:', error);
      throw error;
    }
  },
};
