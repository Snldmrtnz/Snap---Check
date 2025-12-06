import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rkbwlgeojhokdrhthlpi.supabase.co';
const supabaseKey = 'sb_publishable__WixxAnj2fm2uCgM2i0_XA_jSDEej20';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Example login function
export async function login(email, password) {
  const { user, session, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user, session, error };
}

// Example logout function
export async function logout() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Example signup function
export async function signup(email, password) {
  const { user, session, error } = await supabase.auth.signUp({ email, password });
  return { user, session, error };
}
