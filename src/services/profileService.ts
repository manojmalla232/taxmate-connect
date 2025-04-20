import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];

// Get current user's profile
export async function getProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

// Update current user's profile
export async function updateProfile(userId: string, updates: Partial<ProfileRow>): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Create a new profile (for signup flows)
export async function createProfile(profile: Omit<ProfileRow, 'id'>): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profile])
    .select()
    .single();
  if (error) throw error;
  return data;
}
