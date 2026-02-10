import { createClient } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOMER ANALYTICS TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface KnowledgeChunk {
  id: string;
  source_id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, unknown>;
  chunk_index: number;
  created_at: string;
}

export interface IngestionSource {
  id: string;
  user_id?: string;
  source_type: 'url' | 'pdf' | 'youtube' | 'github' | 'notion' | 'markdown';
  source_url?: string;
  title?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  chunk_count: number;
  error_message?: string;
  created_at: string;
}

export interface JarvisConversationAnalytics {
  id: string;
  user_id: string;
  session_id: string;
  message_id: string;
  role: 'user' | 'jarvis';
  content: string;
  content_preview: string;
  timestamp: string;
  page_path: string;
  persona: string;
  geek_mode: boolean;
  message_length: number;
  has_code: boolean;
  has_question: boolean;
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | null;
  session_start_time: string;
  session_duration_seconds: number;
  message_index: number;
}

export interface TerminalCommandAnalytics {
  id: string;
  user_id: string;
  session_id: string;
  command_id: string;
  command: string;
  command_type: 'input' | 'admin' | 'system';
  timestamp: string;
  onboarding_step: string;
  persona: string;
  is_unlocked: boolean;
  response_type: 'success' | 'error' | 'info' | 'system';
  response_preview: string;
  execution_time_ms: number;
  is_admin_command: boolean;
  admin_action?: string;
  command_sequence: number;
  time_since_last_command_ms: number;
}

export interface UserJourneyAnalytics {
  id: string;
  user_id: string;
  session_id: string;
  event_type: 
    | 'page_view' 
    | 'terminal_open' 
    | 'terminal_command' 
    | 'jarvis_open' 
    | 'jarvis_message'
    | 'pill_hover' 
    | 'pill_select'
    | 'form_submit'
    | 'vault_open'
    | 'geek_mode_toggle';
  event_data: Record<string, unknown>;
  timestamp: string;
  page_path: string;
  referrer?: string;
  session_duration_ms: number;
  time_on_page_ms: number;
}

export interface RecommendationAnalytics {
  id: string;
  user_id: string;
  session_id: string;
  module_id: string;
  action: 'view' | 'click';
  timestamp: string;
  match_score?: number;
  persona: string;
  metadata?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUPABASE CLIENT INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

const getEnvVar = (key: string): string => {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    return import.meta.env[`VITE_${key}`] || '';
  }
  return process.env[key] || process.env[`VITE_${key}`] || '';
};

const SUPABASE_URL = getEnvVar('SUPABASE_URL');
const SUPABASE_KEY = getEnvVar('SUPABASE_ANON_KEY') || getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

// CRITICAL P0 FIX: Prevent crash
export const supabase = (SUPABASE_URL && SUPABASE_URL.startsWith('http')) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

// ═══════════════════════════════════════════════════════════════════════════════
// TRACKING HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

const withRetry = async <T>(fn: (client: any) => Promise<T>, retries = 2): Promise<T | null> => {
  if (!supabase) return null;
  try {
    const result = await fn(supabase);
    return result;
  } catch (error) {
    if (retries <= 0) return null;
    await new Promise(r => setTimeout(r, 1000));
    return withRetry(fn, retries - 1);
  }
};

export async function trackJarvisMessage(data: Partial<JarvisConversationAnalytics>) {
  return withRetry(client => client.from('jarvis_conversations').insert([{
    ...data,
    timestamp: new Date().toISOString()
  }]));
}

export async function trackTerminalCommand(data: Partial<TerminalCommandAnalytics>) {
  return withRetry(client => client.from('terminal_commands').insert([{
    ...data,
    timestamp: new Date().toISOString()
  }]));
}

export async function trackRecommendation(data: Partial<RecommendationAnalytics>) {
  return withRetry(client => client.from('recommendations').insert([{
    ...data,
    timestamp: new Date().toISOString()
  }]));
}

export async function trackUserInteraction(data: Partial<UserJourneyAnalytics>) {
  return withRetry(client => client.from('user_interactions').insert([{
    ...data,
    timestamp: new Date().toISOString()
  }]));
}
