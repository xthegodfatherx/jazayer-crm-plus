
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define API response type
interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  bio: string;
  avatar: string;
  skills: string[];
  languages: string[];
  performance_rating: number;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const profileApi = {
  // Get user profile
  getUserProfile: async (): Promise<UserProfile> => {
    try {
      const response: AxiosResponse<ApiResponse<UserProfile>> = await apiClient.get(`${API_URL}/user/profile`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const response: AxiosResponse<ApiResponse<UserProfile>> = await apiClient.put(
        `${API_URL}/user/profile`,
        profileData
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Upload user avatar
  uploadAvatar: async (file: File): Promise<{ avatar_url: string }> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response: AxiosResponse<ApiResponse<{ avatar_url: string }>> = 
        await apiClient.post(`${API_URL}/user/profile/avatar`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      
      return response.data.data;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },
};
