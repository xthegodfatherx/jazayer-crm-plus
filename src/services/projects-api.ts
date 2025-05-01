
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Define simpler types explicitly
export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export interface ProjectFilter {
  status?: string;
  client_id?: string;
  name?: string;
}

export const projectsApi = {
  getAll: async (params?: { filters?: ProjectFilter }) => {
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
  create: async (data: ProjectInsert) => {
    const { data: result, error } = await supabase.from('projects').insert(data).select().single();
    if (error) throw error;
    return { data: result };
  },
  update: async (id: string, data: ProjectUpdate) => {
    const { data: result, error } = await supabase.from('projects').update(data).eq('id', id).select().single();
    if (error) throw error;
    return { data: result };
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },
};
