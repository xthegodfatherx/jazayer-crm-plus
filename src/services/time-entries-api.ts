
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type TimeEntry = Database['public']['Tables']['time_entries']['Row'];
type TimeEntryFilter = Partial<Pick<TimeEntry, 'user_id' | 'project_id' | 'task_id' | 'billable'>>;

export const timeEntriesApi = {
  getAll: async (params?: { filters?: TimeEntryFilter }) => {
    let query = supabase.from('time_entries').select('*');
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined) query = query.eq(key, value);
      });
    }
    const { data, error } = await query;
    if (error) throw error;
    return { data };
  },
  get: async (id: string) => {
    const { data, error } = await supabase.from('time_entries').select('*').eq('id', id).single();
    if (error) throw error;
    return { data };
  },
  create: async (data: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at'>) => {
    const { data: result, error } = await supabase.from('time_entries').insert(data).select().single();
    if (error) throw error;
    return { data: result };
  },
  update: async (id: string, data: Partial<Omit<TimeEntry, 'id' | 'created_at' | 'updated_at'>>) => {
    const { data: result, error } = await supabase.from('time_entries').update(data).eq('id', id).select().single();
    if (error) throw error;
    return { data: result };
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('time_entries').delete().eq('id', id);
    if (error) throw error;
  },
  // Helper method to calculate duration
  calculateDuration: (startTime: Date, endTime: Date): number => {
    return Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
  }
};
