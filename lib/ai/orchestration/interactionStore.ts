import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface InteractionEvent {
  requestId: string;
  sessionKey: string;
  userEmail?: string;
  route: string;
  mode: 'GEEK' | 'STANDARD';
  stepBefore: string;
  stepAfter: string;
  actionType: string;
  message: string;
  provider?: string;
  model?: string;
  latencyMs?: number;
  success: boolean;
  error?: string;
  debug?: Record<string, unknown>;
  createdAt: string;
}

const SESSION_CACHE_LIMIT = 200;
const memorySessionCache = new Map<string, InteractionEvent[]>();

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  supabaseClient = createClient(url, key);
  return supabaseClient;
}

function pushToMemory(event: InteractionEvent): void {
  const arr = memorySessionCache.get(event.sessionKey) || [];
  const next = [...arr, event].slice(-SESSION_CACHE_LIMIT);
  memorySessionCache.set(event.sessionKey, next);
}

export function getSessionEventsFromMemory(sessionKey: string): InteractionEvent[] {
  return memorySessionCache.get(sessionKey) || [];
}

export async function loadKnownProfile(sessionKey: string): Promise<{
  email?: string;
  emailValid?: boolean;
  name?: string;
  phone?: string;
  persona?: 'PERSONAL' | 'BUSINESS' | null;
  goal?: string;
  discovery?: string;
}> {
  const fromMemory = getSessionEventsFromMemory(sessionKey);
  const latestMemory = [...fromMemory].reverse().find(e => e.debug && typeof e.debug === 'object');

  const extract = (obj: any) => {
    const ss = obj?.stateSnapshot || obj?.debug?.stateSnapshot;
    const k = ss?.known || {};
    return {
      email: k.email,
      emailValid: k.emailValid,
      name: k.name,
      phone: k.phone,
      persona: k.persona,
      goal: k.goal,
      discovery: k.discovery,
    };
  };

  if (latestMemory) {
    return extract(latestMemory);
  }

  const supabase = getSupabaseClient();
  if (!supabase) return {};

  const table = process.env.INTERACTION_EVENTS_TABLE || 'interaction_events';
  try {
    const { data } = await supabase
      .from(table)
      .select('debug_json')
      .eq('session_key', sessionKey)
      .order('created_at', { ascending: false })
      .limit(20);
    if (!data || !data.length) return {};
    for (const row of data) {
      const candidate = extract({ debug: row.debug_json });
      if (candidate.email || candidate.persona || candidate.goal || candidate.discovery || candidate.name || candidate.phone) {
        return candidate;
      }
    }
  } catch {
    return {};
  }

  return {};
}

export function buildSessionKey(userEmail: string | undefined, route: string, requestId: string): string {
  if (userEmail && userEmail.trim()) return `email:${userEmail.trim().toLowerCase()}`;
  return `route:${route || '/'}:req:${requestId}`;
}

export async function recordInteractionEvent(event: InteractionEvent): Promise<void> {
  pushToMemory(event);

  const supabase = getSupabaseClient();
  if (!supabase) return;

  const table = process.env.INTERACTION_EVENTS_TABLE || 'interaction_events';
  try {
    await supabase.from(table).insert({
      request_id: event.requestId,
      session_key: event.sessionKey,
      user_email: event.userEmail || null,
      route: event.route,
      mode: event.mode,
      step_before: event.stepBefore,
      step_after: event.stepAfter,
      action_type: event.actionType,
      message: event.message,
      provider: event.provider || null,
      model: event.model || null,
      latency_ms: event.latencyMs || null,
      success: event.success,
      error: event.error || null,
      debug_json: event.debug || null,
      created_at: event.createdAt,
    });
  } catch {
    // Best-effort persistence; memory cache still holds the event.
  }
}
