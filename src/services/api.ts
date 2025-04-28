
import { supabase } from '@/integrations/supabase/client';
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

const handleError = (error: any) => {
  const message = error.message || 'Something went wrong';
  
  if (error.status === 401) {
    toast({
      title: "Authentication Error",
      description: "Please log in again",
      variant: "destructive"
    });
  } else if (error.status === 403) {
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
  handleError
};
