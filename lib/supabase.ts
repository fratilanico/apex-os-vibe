import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('[Supabase] Missing SUPABASE_URL or SUPABASE_KEY — knowledge features disabled');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Type definitions for our schema
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

export interface KnowledgeEdge {
  id: string;
  source_chunk_id: string;
  target_chunk_id: string;
  relationship_type: 'similar' | 'references' | 'extends' | 'contradicts';
  strength: number;
}

export interface AgentLearning {
  id: string;
  prompt_hash: string;
  agent_id: string;
  task_type: string;
  success_score: number;
  sample_count: number;
  avg_score: number;
  tags: string[];
}

export interface UserSession {
  id: string;
  user_id: string;
  quest_id?: string;
  agent_used?: string;
  started_at: string;
  completed_at?: string;
  xp_earned: number;
  gold_earned: number;
  retry_count: number;
  error_occurred: boolean;
  abandoned: boolean;
  metadata: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOMER ANALYTICS TABLES
// ═══════════════════════════════════════════════════════════════════════════════

export interface CustomerAnalytics {
  id: string;
  user_id: string;
  email?: string;
  persona: 'PERSONAL' | 'BUSINESS' | null;
  session_id: string;
  created_at: string;
  updated_at: string;
  
  // Device info
  device_type: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  screen_resolution: string;
  
  // Journey tracking
  onboarding_step: string;
  is_unlocked: boolean;
  geek_mode_enabled: boolean;
  
  // Metadata
  metadata: Record<string, unknown>;
}

export interface JarvisConversationAnalytics {
  id: string;
  user_id: string;
  session_id: string;
  message_id: string;
  role: 'user' | 'jarvis';
  content: string;
  content_preview: string; // First 200 chars for quick view
  timestamp: string;
  
  // Context
  page_path: string;
  persona: string;
  geek_mode: boolean;
  
  // Analysis
  message_length: number;
  has_code: boolean;
  has_question: boolean;
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | null;
  
  // Session info
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
  
  // Context
  onboarding_step: string;
  persona: string;
  is_unlocked: boolean;
  
  // Command analysis
  response_type: 'success' | 'error' | 'info' | 'system';
  response_preview: string;
  execution_time_ms: number;
  
  // Admin commands
  is_admin_command: boolean;
  admin_action?: string;
  
  // Sequence
  command_sequence: number;
  time_since_last_command_ms: number;
}

export interface PillSelectionAnalytics {
  id: string;
  user_id: string;
  session_id: string;
  selected_persona: 'PERSONAL' | 'BUSINESS';
  selected_at: string;
  
  // Pre-selection info
  hovered_options: string[];
  hover_duration_ms: number;
  
  // Journey context
  name_provided: string;
  email_provided: string;
  time_to_decision_ms: number; // Time from handshake to selection
  
  // Post-selection
  modules_unlocked: string[];
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
  
  // Navigation
  page_path: string;
  referrer?: string;
  
  // Session
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
// ANALYTICS TRACKING HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    return withRetry(fn, retries - 1);
  }
}

export async function trackJarvisMessage(data: Omit<JarvisConversationAnalytics, 'id' | 'timestamp'>) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;
  
  return withRetry(async () => {
    const { error } = await supabase.from('jarvis_conversations').insert({
      ...data,
      timestamp: new Date().toISOString(),
    });
    if (error) throw error;
  });
}

export async function trackTerminalCommand(data: Omit<TerminalCommandAnalytics, 'id' | 'timestamp'>) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;

  return withRetry(async () => {
    const { error } = await supabase.from('terminal_commands').insert({
      ...data,
      timestamp: new Date().toISOString(),
    });
    if (error) throw error;
  });
}

export async function trackRecommendation(data: Omit<RecommendationAnalytics, 'id' | 'timestamp'>) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;

  return withRetry(async () => {
    const { error } = await supabase.from('recommendations').insert({
      ...data,
      timestamp: new Date().toISOString(),
    });
    if (error) throw error;
  });
}

export async function trackUserInteraction(data: Omit<UserJourneyAnalytics, 'id' | 'timestamp'>) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;

  return withRetry(async () => {
    const { error } = await supabase.from('user_interactions').insert({
      ...data,
      timestamp: new Date().toISOString(),
    });
    if (error) throw error;
  });
}

export async function trackPillSelection(data: Omit<PillSelectionAnalytics, 'id' | 'selected_at'>) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;

  return withRetry(async () => {
    const { error } = await supabase.from('pill_selection_analytics').insert({
      ...data,
      selected_at: new Date().toISOString(),
    });
    if (error) throw error;
  });
}
