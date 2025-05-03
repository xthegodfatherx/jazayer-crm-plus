
import { supabase } from '@/integrations/supabase/client';
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface AuthResponse {
  user: any;
  token: string;
}

interface ApiResponse<T> {
  data: T;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const authApi = {
  // Use Supabase for local authentication during development
  login: async ({ email, password }: LoginCredentials): Promise<{ data: any }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // For Laravel integration
      try {
        // Store the token in localStorage for API requests
        localStorage.setItem('auth_token', data.session?.access_token || '');
        
        // Authenticate with Laravel Sanctum if API_URL is set
        if (API_URL) {
          await apiClient.post(`${API_URL}/auth/login`, { email, password });
        }
      } catch (laravelError) {
        console.error("Laravel auth error:", laravelError);
        // Continue with Supabase auth if Laravel fails
      }
      
      return { data };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async ({ name, email, password, password_confirmation }: RegisterData): Promise<{ data: any }> => {
    try {
      // For Laravel integration
      if (API_URL) {
        try {
          const response: AxiosResponse<ApiResponse<AuthResponse>> = await apiClient.post(`${API_URL}/auth/register`, {
            name,
            email,
            password,
            password_confirmation
          });
          
          localStorage.setItem('auth_token', response.data.data.token);
          return { data: response.data.data };
        } catch (laravelError) {
          console.error("Laravel registration error:", laravelError);
          // Fall back to Supabase if Laravel registration fails
        }
      }
      
      // Fallback to Supabase
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  logout: async (): Promise<void> => {
    try {
      // For Laravel integration
      if (API_URL) {
        try {
          await apiClient.post(`${API_URL}/auth/logout`);
        } catch (laravelError) {
          console.error("Laravel logout error:", laravelError);
        }
      }
      
      localStorage.removeItem('auth_token');
      
      // Always log out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  getUser: async (): Promise<{ data: any }> => {
    try {
      // For Laravel integration
      if (API_URL) {
        try {
          const response: AxiosResponse<ApiResponse<any>> = await apiClient.get(`${API_URL}/auth/user`);
          return { data: response.data.data };
        } catch (laravelError) {
          console.error("Laravel get user error:", laravelError);
          // Fall back to Supabase if Laravel fails
        }
      }
      
      // Fallback to Supabase
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { data: user };
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },
  
  forgotPassword: async (email: string): Promise<void> => {
    try {
      // For Laravel integration
      if (API_URL) {
        try {
          await apiClient.post(`${API_URL}/auth/forgot-password`, { email });
          return;
        } catch (laravelError) {
          console.error("Laravel forgot password error:", laravelError);
        }
      }
      
      // Fallback to Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },
  
  resetPassword: async (token: string, password: string, password_confirmation: string): Promise<void> => {
    try {
      // For Laravel integration
      if (API_URL) {
        await apiClient.post(`${API_URL}/auth/reset-password`, {
          token,
          password,
          password_confirmation
        });
      } else {
        // Supabase password reset would be handled with updateUser after email confirmation
        // but this specific flow depends on the Laravel token structure
        console.error('Password reset requires Laravel API');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
};
