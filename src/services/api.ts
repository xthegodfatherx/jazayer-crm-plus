
import { toast } from '@/hooks/use-toast';
import { authApi } from './auth-api';
import { taskCategoriesApi } from './task-categories-api';
import { tasksApi } from './tasks-api';
import { projectsApi } from './projects-api';
import { teamApi } from './team-api';
import { invoicesApi } from './invoices-api';
import { clientsApi } from './clients-api';
import { expensesApi } from './expenses-api';
import { timeEntriesApi } from './time-entries-api';
import { reportsApi } from './reports-api';
import apiClient from './api-client';

const handleError = (error: any) => {
  const message = error.response?.data?.message || error.message || 'Something went wrong';
  
  if (error.response?.status === 401) {
    toast({
      title: "Authentication Error",
      description: "Please log in again",
      variant: "destructive"
    });
  } else if (error.response?.status === 403) {
    toast({
      title: "Permission Denied",
      description: message,
      variant: "destructive"
    });
  } else {
    toast({
      title: "Error",
      description: message,
      variant: "destructive"
    });
  }
  
  return Promise.reject(error);
};

// Authentication helper for Laravel Sanctum CSRF protection
const csrfCookie = async () => {
  try {
    await apiClient.get('/sanctum/csrf-cookie');
  } catch (error) {
    console.error('Failed to fetch CSRF cookie');
    handleError(error);
  }
};

// Re-export Task type for convenience
export type { Task } from './tasks-api';
export type { Project } from './projects-api';
export type { Client } from './clients-api';
export type { Expense } from './expenses-api';
export type { TimeEntry } from './time-entries-api';
export type { Report } from './reports-api';

export {
  authApi,
  taskCategoriesApi,
  tasksApi,
  projectsApi,
  teamApi,
  invoicesApi,
  clientsApi,
  expensesApi,
  timeEntriesApi,
  reportsApi,
  handleError,
  csrfCookie,
  apiClient
};
