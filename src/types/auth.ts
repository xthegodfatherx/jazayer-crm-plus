
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserProfile extends SupabaseUser {
  name?: string;
  role?: string;
}
