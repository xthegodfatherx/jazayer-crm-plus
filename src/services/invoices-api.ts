
import { supabase } from '@/integrations/supabase/client';

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
