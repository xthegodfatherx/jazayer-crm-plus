
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['projects']['Row'];

export const projectsApi = {
  getAll: async (params?: { filters?: Record<string, any> }) => {
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
  create: async (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    const { data: result, error } = await supabase.from('projects').insert(data).select().single();
    if (error) throw error;
    return { data: result };
  },
  update: async (id: string, data: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>) => {
    const { data: result, error } = await supabase.from('projects').update(data).eq('id', id).select().single();
    if (error) throw error;
    return { data: result };
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },
};
