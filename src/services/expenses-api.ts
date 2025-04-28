
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Define simpler types explicitly
export type Expense = Database['public']['Tables']['expenses']['Row'];
export type ExpenseInsert = Database['public']['Tables']['expenses']['Insert'];
export type ExpenseUpdate = Database['public']['Tables']['expenses']['Update'];

export interface ExpenseFilter {
  status?: string;
  category?: string;
  project_id?: string;
}

export const expensesApi = {
  getAll: async (params?: { filters?: ExpenseFilter }) => {
    let query = supabase.from('expenses').select('*');
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
    const { data, error } = await supabase.from('expenses').select('*').eq('id', id).single();
    if (error) throw error;
    return { data };
  },
  create: async (data: ExpenseInsert) => {
    const { data: result, error } = await supabase.from('expenses').insert(data).select().single();
    if (error) throw error;
    return { data: result };
  },
  update: async (id: string, data: ExpenseUpdate) => {
    const { data: result, error } = await supabase.from('expenses').update(data).eq('id', id).select().single();
    if (error) throw error;
    return { data: result };
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
  },
};
