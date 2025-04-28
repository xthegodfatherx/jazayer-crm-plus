
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];

export const taskCategoriesApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('task_categories')
      .select('*');
    if (error) throw error;
    return { data };
  },
  get: async (id: string) => {
    const { data, error } = await supabase
      .from('task_categories')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return { data };
  },
  create: async (data: Tables['task_categories']['Insert']) => {
    const { data: result, error } = await supabase
      .from('task_categories')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return { data: result };
  },
  update: async (id: string, data: Tables['task_categories']['Update']) => {
    const { data: result, error } = await supabase
      .from('task_categories')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return { data: result };
  },
  delete: async (id: string) => {
    const { error } = await supabase
      .from('task_categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};
