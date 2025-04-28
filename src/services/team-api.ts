
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type TeamMember = Database['public']['Tables']['team_members']['Row'];

export const teamApi = {
  getMembers: async () => {
    const { data, error } = await supabase.from('team_members').select('*');
    if (error) throw error;
    return { data };
  },
  getMember: async (id: string) => {
    const { data, error } = await supabase.from('team_members').select('*').eq('id', id).single();
    if (error) throw error;
    return { data };
  },
  create: async (data: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
    const { data: result, error } = await supabase.from('team_members').insert(data).select().single();
    if (error) throw error;
    return { data: result };
  },
  update: async (id: string, data: Partial<Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>>) => {
    const { data: result, error } = await supabase.from('team_members').update(data).eq('id', id).select().single();
    if (error) throw error;
    return { data: result };
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) throw error;
  },
};
