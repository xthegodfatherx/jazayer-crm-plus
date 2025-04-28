
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Report = Database['public']['Tables']['reports']['Row'];
type ReportFilter = Partial<Pick<Report, 'type' | 'created_by'>>;

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
  create: async (data: Omit<Report, 'id' | 'created_at' | 'updated_at'>) => {
    const { data: result, error } = await supabase.from('reports').insert(data).select().single();
    if (error) throw error;
    return { data: result };
  },
  update: async (id: string, data: Partial<Omit<Report, 'id' | 'created_at' | 'updated_at'>>) => {
    const { data: result, error } = await supabase.from('reports').update(data).eq('id', id).select().single();
    if (error) throw error;
    return { data: result };
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('reports').delete().eq('id', id);
    if (error) throw error;
  },
};
