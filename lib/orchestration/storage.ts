import { hasSupabaseServerConfig, supabaseServer } from '../supabaseServer.js';
import type { CustomerState, InteractionEvent, DecisionTrace, ProviderAttemptDebug, RecommendationPayload } from './types.js';

export async function loadCustomerState(identity: {
  userId?: string;
  email?: string;
  sessionId?: string;
}): Promise<Partial<CustomerState> | null> {
  if (!hasSupabaseServerConfig) return null;
  try {
    let query = supabaseServer!.from('customer_state').select('*').limit(1);
    if (identity.userId) query = query.eq('user_id', identity.userId);
    else if (identity.email) query = query.eq('email', identity.email);
    else if (identity.sessionId) query = query.eq('session_id', identity.sessionId);
    else return null;

    const { data, error } = await query.maybeSingle();
    if (error || !data) return null;
    const known = (data.known_json || {}) as Partial<CustomerState['known']>;
    return {
      userId: data.user_id || undefined,
      email: data.email || undefined,
      sessionId: data.session_id || undefined,
      route: data.route || '/',
      mode: data.mode || 'STANDARD',
      known: {
        email: known.email || { source: 'none' },
        name: known.name || { source: 'none' },
        phone: known.phone || { source: 'none' },
        persona: known.persona || { source: 'none', value: null },
        goal: known.goal || { source: 'none' },
      },
      currentStep: data.current_step || 'boot',
      unlocked: Boolean(data.unlocked),
      tier: data.tier || 0,
      interactionCount: data.interaction_count || 0,
      lastIntent: data.last_intent || 'unknown',
    } as Partial<CustomerState>;
  } catch {
    return null;
  }
}

export async function persistCustomerState(state: CustomerState): Promise<void> {
  if (!hasSupabaseServerConfig) return;
  try {
    const row = {
      user_id: state.userId || null,
      email: state.email || state.known.email.value || null,
      session_id: state.sessionId || null,
      route: state.route,
      mode: state.mode,
      known_json: state.known,
      current_step: state.currentStep,
      unlocked: state.unlocked,
      tier: state.tier,
      interaction_count: state.interactionCount,
      last_intent: state.lastIntent,
      updated_at: new Date().toISOString(),
    };

    let conflict = 'session_id';
    if (state.userId) conflict = 'user_id';
    else if (state.email) conflict = 'email';

    await supabaseServer!.from('customer_state').upsert(row, { onConflict: conflict });
  } catch {
    // best effort only
  }
}

export async function appendInteractionEvent(event: InteractionEvent): Promise<void> {
  if (!hasSupabaseServerConfig) return;
  try {
    await supabaseServer!.from('interaction_events').insert({
      request_id: event.requestId,
      user_id: event.userId || null,
      email: event.email || null,
      session_id: event.sessionId || null,
      source: event.source,
      route: event.route,
      event_type: event.eventType,
      payload_json: event.payload,
      created_at: event.ts,
    });
  } catch {
    // best effort only
  }
}

export async function appendDecisionLog(input: {
  requestId: string;
  userId?: string;
  email?: string;
  sessionId?: string;
  stateSnapshot: unknown;
  decisionTrace: DecisionTrace;
  providerAttempts: ProviderAttemptDebug[];
  recommendations?: RecommendationPayload;
  resultSummary: string;
}): Promise<void> {
  if (!hasSupabaseServerConfig) return;
  try {
    await supabaseServer!.from('ai_decision_logs').insert({
      request_id: input.requestId,
      user_id: input.userId || null,
      email: input.email || null,
      session_id: input.sessionId || null,
      state_snapshot_json: input.stateSnapshot,
      decision_trace_json: input.decisionTrace,
      provider_attempts_json: input.providerAttempts,
      recommendations_json: input.recommendations || null,
      result_summary: input.resultSummary,
      created_at: new Date().toISOString(),
    });
  } catch {
    // best effort only
  }
}
