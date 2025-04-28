
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Add response interceptor for global error handling
const handleError = (error: any) => {
  const message = error.message || 'Something went wrong';
  
  // Handle authentication errors
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

// Auth API service
export const authApi = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { data };
  },
  register: async ({ name, email, password }: { name: string; email: string; password: string }) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { name }
      }
    });
    if (error) throw error;
    return { data };
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { data: user };
  },
};

// Task Categories API service
export const taskCategoriesApi = {
  getAll: async () => {
    const { data, error } = await supabase.from('task_categories').select('*');
    if (error) throw error;
    return { data };
  },
  get: async (id: string) => {
    const { data, error } = await supabase.from('task_categories').select('*').eq('id', id).single();
    if (error) throw error;
    return { data };
  },
  create: async (data: any) => {
    const { data: result, error } = await supabase.from('task_categories').insert(data).select().single();
    if (error) throw error;
    return { data: result };
  },
  update: async (id: string, data: any) => {
    const { data: result, error } = await supabase.from('task_categories').update(data).eq('id', id).select().single();
    if (error) throw error;
    return { data: result };
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('task_categories').delete().eq('id', id);
    if (error) throw error;
  },
};

// Tasks API service
export const tasksApi = {
  getAll: async (params?: any) => {
    let query = supabase.from('tasks').select('*');
    if (params?.filters) {
      // Add filters based on params
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value) query = query.eq(key, value);
      });
    }
    const { data, error } = await query;
    if (error) throw error;
    return { data };
  },
  get: async (id: string) => {
    const { data, error } = await supabase.from('tasks').select('*').eq('id', id).single();
    if (error) throw error;
    return { data };
  },
  create: async (data: any) => {
    const { data: result, error } = await supabase.from('tasks').insert(data).select().single();
    if (error) throw error;
    return { data: result };
  },
  update: async (id: string, data: any) => {
    const { data: result, error } = await supabase.from('tasks').update(data).eq('id', id).select().single();
    if (error) throw error;
    return { data: result };
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
  },
};

// Projects API service
export const projectsApi = {
  getAll: async (params?: any) => {
    let query = supabase.from('projects').select('*');
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value) query = query.eq(key, value);
      });
    }
    const { data, error } = await query;
    if (error) throw error;
    return { data };
  },
  get: async (id: string) => {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
    if (error) throw error;
    return { data };
  },
  create: async (data: any) => {
    const { data: result, error } = await supabase.from('projects').insert(data).select().single();
    if (error) throw error;
    return { data: result };
  },
  update: async (id: string, data: any) => {
    const { data: result, error } = await supabase.from('projects').update(data).eq('id', id).select().single();
    if (error) throw error;
    return { data: result };
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },
};

// Team API service
export const teamApi = {
  getMembers: async () => {
    const { data, error } = await supabase.from('team_members').select('*');
    if (error) throw error;
    return { data };
  },
  getMember: async (id: string) => {
    const { data, error } = await supabase.from('team_members').select('*').eq('id', id).single();
    if (error) throw error;
    return { data };
  },
  create: async (data: any) => {
    const { data: result, error } = await supabase.from('team_members').insert(data).select().single();
    if (error) throw error;
    return { data: result };
  },
  update: async (id: string, data: any) => {
    const { data: result, error } = await supabase.from('team_members').update(data).eq('id', id).select().single();
    if (error) throw error;
    return { data: result };
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) throw error;
  },
};

// Invoices API service
export const invoicesApi = {
  getAll: async (params?: any) => {
    let query = supabase.from('invoices').select('*');
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value) query = query.eq(key, value);
      });
    }
    const { data, error } = await query;
    if (error) throw error;
    return { data };
  },
  get: async (id: string) => {
    const { data, error } = await supabase.from('invoices').select('*').eq('id', id).single();
    if (error) throw error;
    return { data };
  },
  create: async (data: any) => {
    const { data: result, error } = await supabase.from('invoices').insert(data).select().single();
    if (error) throw error;
    return { data: result };
  },
  update: async (id: string, data: any) => {
    const { data: result, error } = await supabase.from('invoices').update(data).eq('id', id).select().single();
    if (error) throw error;
    return { data: result };
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) throw error;
  },
};

// Remove axios export since we're not using it anymore
