import { createClient } from '@supabase/supabase-js';

// Safe environment variable accessor for both browser (Vite) and server (Node)
const getEnvVar = (key: string): string => {
  if (typeof window !== 'undefined') {
    // Browser side (Vite)
    // @ts-ignore
    return import.meta.env[`VITE_${key}`] || import.meta.env[`NEXT_PUBLIC_${key}`] || '';
  }
  // Server side (Node)
  return process.env[key] || process.env[`VITE_${key}`] || process.env[`NEXT_PUBLIC_${key}`] || '';
};

const url = getEnvVar('SUPABASE_URL');
const key = getEnvVar('SUPABASE_ANON_KEY') || getEnvVar('SUPABASE_SERVICE_ROLE_KEY') || getEnvVar('SUPABASE_KEY');

// CRITICAL: We MUST not call createClient with empty strings as it throws
export const supabase = (url && key) ? createClient(url, key) : null;

// Helper to track events safely even if Supabase is offline
export const safeTrack = async (fn: (client: any) => Promise<any>) => {
  if (!supabase) {
    console.warn('[Supabase] Tracking skipped: Client not initialized');
    return;
  }
  try {
    await fn(supabase);
  } catch (err) {
    console.error('[Supabase] Tracking error:', err);
  }
};

export async function trackJarvisMessage(data: any) {
  return safeTrack(client => client.from('jarvis_conversations').insert({
    ...data,
    timestamp: new Date().toISOString(),
  }));
}

export async function trackTerminalCommand(data: any) {
  return safeTrack(client => client.from('terminal_commands').insert({
    ...data,
    timestamp: new Date().toISOString(),
  }));
}

export async function trackRecommendation(data: any) {
  return safeTrack(client => client.from('recommendations').insert({
    ...data,
    timestamp: new Date().toISOString(),
  }));
}

export async function trackUserInteraction(data: any) {
  return safeTrack(client => client.from('user_interactions').insert({
    ...data,
    timestamp: new Date().toISOString(),
  }));
}

export async function trackPillSelection(data: any) {
  return safeTrack(client => client.from('pill_selection_analytics').insert({
    ...data,
    selected_at: new Date().toISOString(),
  }));
}
