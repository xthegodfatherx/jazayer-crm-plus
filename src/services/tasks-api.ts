
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Define simpler types explicitly
export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export interface TaskFilter {
  status?: string;
  priority?: string;
  assigned_to?: string;
  category_id?: string;
}

export const tasksApi = {
  getAll: async (params?: { filters?: TaskFilter }) => {
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
  create: async (data: TaskInsert) => {
    const { data: result, error } = await supabase.from('tasks').insert(data).select().single();
    if (error) throw error;
    return { data: result };
  },
  update: async (id: string, data: TaskUpdate) => {
    const { data: result, error } = await supabase.from('tasks').update(data).eq('id', id).select().single();
    if (error) throw error;
    return { data: result };
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
  },
};
