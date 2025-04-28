
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Define simpler types explicitly
export type Client = Database['public']['Tables']['clients']['Row'];
export type ClientInsert = Database['public']['Tables']['clients']['Insert'];
export type ClientUpdate = Database['public']['Tables']['clients']['Update'];

export interface ClientFilter {
  status?: string;
  name?: string;
}

export const clientsApi = {
  getAll: async (params?: { filters?: ClientFilter }) => {
    let query = supabase.from('clients').select('*');
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
    const { data, error } = await supabase.from('clients').select('*').eq('id', id).single();
    if (error) throw error;
    return { data };
  },
  create: async (data: ClientInsert) => {
    const { data: result, error } = await supabase.from('clients').insert(data).select().single();
    if (error) throw error;
    return { data: result };
  },
  update: async (id: string, data: ClientUpdate) => {
    const { data: result, error } = await supabase.from('clients').update(data).eq('id', id).select().single();
    if (error) throw error;
    return { data: result };
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
  },
};
