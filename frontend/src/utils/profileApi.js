import { supabase } from './supabaseClient';

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('user_id', userId)
    .single();
  return { displayName: data?.display_name, error };
}

export async function setProfile(userId, displayName) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ user_id: userId, display_name: displayName }, { onConflict: ['user_id'] });
  return { error };
}
