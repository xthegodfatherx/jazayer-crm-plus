
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define API response type
interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: any;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  created_at: string;
  related_entity?: {
    type: 'task' | 'project' | 'invoice' | 'user' | 'system';
    id: string;
    name?: string;
  };
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const notificationsApi = {
  // Get all notifications
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    is_read?: boolean;
    type?: 'info' | 'warning' | 'success' | 'error';
  }): Promise<{ data: Notification[]; meta: { total: number; page: number; limit: number; } }> => {
    try {
      const response: AxiosResponse<ApiResponse<Notification[]>> = await apiClient.get(
        `${API_URL}/notifications`,
        { params }
      );
      return {
        data: response.data.data,
        meta: response.data.meta || { total: 0, page: 1, limit: 10 }
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<Notification> => {
    try {
      const response: AxiosResponse<ApiResponse<Notification>> = await apiClient.put(
        `${API_URL}/notifications/${notificationId}/read`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<{ success: boolean }> => {
    try {
      const response: AxiosResponse<ApiResponse<{ success: boolean }>> = await apiClient.put(
        `${API_URL}/notifications/read-all`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<{ success: boolean }> => {
    try {
      const response: AxiosResponse<ApiResponse<{ success: boolean }>> = await apiClient.delete(
        `${API_URL}/notifications/${notificationId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Get notification count (unread)
  getUnreadCount: async (): Promise<{ count: number }> => {
    try {
      const response: AxiosResponse<ApiResponse<{ count: number }>> = await apiClient.get(
        `${API_URL}/notifications/unread-count`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
      throw error;
    }
  },
};
