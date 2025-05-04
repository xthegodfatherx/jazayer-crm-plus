
import apiClient from './api-client';
import { AxiosResponse } from 'axios';

// Define API response type
interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Types for settings
export interface SystemSettings {
  company_name: string;
  company_email: string;
  company_website: string;
  company_phone: string;
  company_address: string;
  company_logo?: string;
  default_language: 'ar' | 'en' | 'fr';
  timezone: string;
  date_format: string;
  default_currency: string;
}

export interface NotificationSettings {
  email_notifications: boolean;
  task_reminders: boolean;
  invoice_notifications: boolean;
  system_notifications: boolean;
}

export interface SecuritySettings {
  two_factor_enabled: boolean;
  session_timeout: number; // minutes
  password_policy: 'basic' | 'standard' | 'strong' | 'very-strong';
  ip_restriction_enabled: boolean;
  allowed_ips?: string[];
  rate_limiting_enabled: boolean;
  rate_limit_attempts: number;
  rate_limit_duration: number; // minutes
}

export interface InvoiceSettings {
  tax_percentage: number;
  default_payment_terms: number; // days
  invoice_prefix: string;
  invoice_footer_text: string;
  default_download_format: 'pdf' | 'docx' | 'xlsx';
  include_company_logo: boolean;
  include_payment_instructions: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  is_enabled: boolean;
  type: 'task' | 'invoice' | 'project' | 'system';
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface SalarySettings {
  calculation_method: 'task_based' | 'fixed' | 'hourly';
  default_hourly_rate: number;
  overtime_multiplier: number;
  bonus_calculation_method: 'percentage' | 'fixed';
  bonus_percentage?: number;
  bonus_fixed_amount?: number;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const settingsApi = {
  // System settings
  getSystemSettings: async (): Promise<SystemSettings> => {
    try {
      const response: AxiosResponse<ApiResponse<SystemSettings>> = await apiClient.get(`${API_URL}/settings/system`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  },
  
  updateSystemSettings: async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
    try {
      const response: AxiosResponse<ApiResponse<SystemSettings>> = 
        await apiClient.put(`${API_URL}/settings/system`, settings);
      return response.data.data;
    } catch (error) {
      console.error('Error updating system settings:', error);
      throw error;
    }
  },
  
  uploadCompanyLogo: async (file: File): Promise<{logo_url: string}> => {
    try {
      const formData = new FormData();
      formData.append('logo', file);
      
      const response: AxiosResponse<ApiResponse<{logo_url: string}>> = 
        await apiClient.post(`${API_URL}/settings/system/logo`, formData);
      return response.data.data;
    } catch (error) {
      console.error('Error uploading company logo:', error);
      throw error;
    }
  },
  
  // Notification settings
  getNotificationSettings: async (): Promise<NotificationSettings> => {
    try {
      const response: AxiosResponse<ApiResponse<NotificationSettings>> = 
        await apiClient.get(`${API_URL}/settings/notifications`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  },
  
  updateNotificationSettings: async (settings: Partial<NotificationSettings>): Promise<NotificationSettings> => {
    try {
      const response: AxiosResponse<ApiResponse<NotificationSettings>> = 
        await apiClient.put(`${API_URL}/settings/notifications`, settings);
      return response.data.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },
  
  // Security settings
  getSecuritySettings: async (): Promise<SecuritySettings> => {
    try {
      const response: AxiosResponse<ApiResponse<SecuritySettings>> = 
        await apiClient.get(`${API_URL}/settings/security`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching security settings:', error);
      throw error;
    }
  },
  
  updateSecuritySettings: async (settings: Partial<SecuritySettings>): Promise<SecuritySettings> => {
    try {
      const response: AxiosResponse<ApiResponse<SecuritySettings>> = 
        await apiClient.put(`${API_URL}/settings/security`, settings);
      return response.data.data;
    } catch (error) {
      console.error('Error updating security settings:', error);
      throw error;
    }
  },
  
  // Invoice settings
  getInvoiceSettings: async (): Promise<InvoiceSettings> => {
    try {
      const response: AxiosResponse<ApiResponse<InvoiceSettings>> = 
        await apiClient.get(`${API_URL}/settings/invoices`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching invoice settings:', error);
      throw error;
    }
  },
  
  updateInvoiceSettings: async (settings: Partial<InvoiceSettings>): Promise<InvoiceSettings> => {
    try {
      const response: AxiosResponse<ApiResponse<InvoiceSettings>> = 
        await apiClient.put(`${API_URL}/settings/invoices`, settings);
      return response.data.data;
    } catch (error) {
      console.error('Error updating invoice settings:', error);
      throw error;
    }
  },
  
  // Email templates
  getEmailTemplates: async (): Promise<EmailTemplate[]> => {
    try {
      const response: AxiosResponse<ApiResponse<EmailTemplate[]>> = 
        await apiClient.get(`${API_URL}/settings/email-templates`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching email templates:', error);
      throw error;
    }
  },
  
  getEmailTemplate: async (id: string): Promise<EmailTemplate> => {
    try {
      const response: AxiosResponse<ApiResponse<EmailTemplate>> = 
        await apiClient.get(`${API_URL}/settings/email-templates/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching email template with id ${id}:`, error);
      throw error;
    }
  },
  
  updateEmailTemplate: async (id: string, template: Partial<EmailTemplate>): Promise<EmailTemplate> => {
    try {
      const response: AxiosResponse<ApiResponse<EmailTemplate>> = 
        await apiClient.put(`${API_URL}/settings/email-templates/${id}`, template);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating email template with id ${id}:`, error);
      throw error;
    }
  },
  
  // Audit logs
  getAuditLogs: async (
    page: number = 1, 
    limit: number = 10,
    filters?: { 
      user_id?: string; 
      action?: string;
      entity_type?: string;
      date_from?: string;
      date_to?: string;
    }
  ): Promise<{ data: AuditLog[]; total: number; page: number; limit: number }> => {
    try {
      const response: AxiosResponse<ApiResponse<{ 
        data: AuditLog[]; 
        total: number; 
        page: number; 
        limit: number
      }>> = await apiClient.get(`${API_URL}/settings/audit-logs`, {
        params: { 
          page,
          limit,
          ...filters
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  },
  
  // Salary settings
  getSalarySettings: async (): Promise<SalarySettings> => {
    try {
      const response: AxiosResponse<ApiResponse<SalarySettings>> = 
        await apiClient.get(`${API_URL}/settings/salary`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching salary settings:', error);
      throw error;
    }
  },
  
  updateSalarySettings: async (settings: Partial<SalarySettings>): Promise<SalarySettings> => {
    try {
      const response: AxiosResponse<ApiResponse<SalarySettings>> = 
        await apiClient.put(`${API_URL}/settings/salary`, settings);
      return response.data.data;
    } catch (error) {
      console.error('Error updating salary settings:', error);
      throw error;
    }
  },
};
