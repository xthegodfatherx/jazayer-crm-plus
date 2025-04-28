
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Define simpler types explicitly
export type Report = Database['public']['Tables']['reports']['Row'];
export type ReportInsert = Database['public']['Tables']['reports']['Insert'];
export type ReportUpdate = Database['public']['Tables']['reports']['Update'];

export interface ReportFilter {
  type?: string;
  created_by?: string;
}

export const reportsApi = {
  getAll: async (params?: { filters?: ReportFilter }) => {
    let query = supabase.from('reports').select('*');
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
    const { data, error } = await supabase.from('reports').select('*').eq('id', id).single();
    if (error) throw error;
    return { data };
  },
  create: async (data: ReportInsert) => {
    const { data: result, error } = await supabase.from('reports').insert(data).select().single();
    if (error) throw error;
    return { data: result };
  },
  update: async (id: string, data: ReportUpdate) => {
    const { data: result, error } = await supabase.from('reports').update(data).eq('id', id).select().single();
    if (error) throw error;
    return { data: result };
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('reports').delete().eq('id', id);
    if (error) throw error;
  },
};
