
import { User as SupabaseUser } from '@supabase/supabase-js';

// Extend the Supabase User type with additional properties we need
export interface UserProfile extends SupabaseUser {
  name?: string;
  role?: string;
}
