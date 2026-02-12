import type { CustomerState, OnboardingStep, Persona, StateHints, StateSnapshot } from './types.js';
import { loadCustomerState } from './storage.js';

function parseRoute(context?: string): string {
  if (!context) return '/';
  const pathMatch = context.match(/on the "([^"]+)" page/i);
  return pathMatch?.[1] || '/';
}

function parseMode(context?: string): 'STANDARD' | 'GEEK' {
  if (!context) return 'STANDARD';
  const modeMatch = context.match(/Mode:\s*(GEEK|STANDARD)/i);
  return modeMatch?.[1]?.toUpperCase() === 'GEEK' ? 'GEEK' : 'STANDARD';
}

function parseIntent(message: string): CustomerState['lastIntent'] {
  const lower = message.toLowerCase();
  if (lower === 'help' || lower.includes('what can i do')) return 'help';
  if (['status', 'clear', 'vault', 'jarvis'].includes(lower)) return 'command';
  if (lower.includes('@') || lower.includes('my name is') || lower.includes('i am ') || lower.includes('persona')) {
    return 'provide_field';
  }
  if (message.trim().length > 0) return 'query';
  return 'unknown';
}

function normalizeStep(step?: string): OnboardingStep {
  const valid: OnboardingStep[] = [
    'boot',
    'email_guard',
    'onboarding_name',
    'onboarding_phone',
    'handshake',
    'dynamic_discovery',
    'validation',
    'processing',
    'unlocked',
  ];
  if (step && valid.includes(step as OnboardingStep)) return step as OnboardingStep;
  return 'boot';
}

export async function resolveStateSnapshot(input: {
  requestId: string;
  message: string;
  history: Array<{ role: string; content: string }>;
  context?: string;
  userEmail?: string;
  userId?: string;
  sessionId?: string;
  preferredProvider?: string;
  preferredModel?: string;
  stateHints?: StateHints;
  tier: 0 | 1 | 2;
}): Promise<StateSnapshot> {
  const route = parseRoute(input.context);
  const mode = input.stateHints?.mode || parseMode(input.context);
  const dbState = await loadCustomerState({ userId: input.userId, email: input.userEmail, sessionId: input.sessionId });

  const personaValue =
    input.stateHints?.persona ??
    dbState?.known?.persona?.value ??
    null;

  const goalValue =
    input.stateHints?.goal ??
    dbState?.known?.goal?.value ??
    undefined;

  const nameValue =
    input.stateHints?.name ??
    dbState?.known?.name?.value ??
    undefined;

  const emailValue =
    input.stateHints?.email ??
    input.userEmail ??
    dbState?.known?.email?.value ??
    undefined;

  const phoneValue =
    input.stateHints?.phone ??
    dbState?.known?.phone?.value ??
    undefined;

  const step = normalizeStep(input.stateHints?.currentStep || dbState?.currentStep);
  const unlocked = Boolean(input.stateHints?.unlocked ?? dbState?.unlocked ?? false);

  return {
    requestId: input.requestId,
    ts: new Date().toISOString(),
    message: input.message,
    historyTurns: input.history.length,
    userId: input.userId || dbState?.userId,
    email: emailValue,
    sessionId: input.sessionId || dbState?.sessionId,
    route,
    mode,
    known: {
      email: { value: emailValue, valid: Boolean(emailValue && /\S+@\S+\.\S+/.test(emailValue)), source: emailValue ? 'request' : 'none' },
      name: { value: nameValue, source: nameValue ? 'request' : 'none' },
      phone: { value: phoneValue, source: phoneValue ? 'request' : 'none' },
      persona: { value: personaValue as Persona, source: personaValue ? 'request' : 'none' },
      goal: { value: goalValue, source: goalValue ? 'request' : 'none' },
    },
    currentStep: step,
    unlocked,
    tier: input.tier,
    interactionCount: (dbState?.interactionCount || 0) + 1,
    lastIntent: parseIntent(input.message),
    preferredProvider: (input.preferredProvider as StateSnapshot['preferredProvider']) || 'auto',
    preferredModel: (input.preferredModel as StateSnapshot['preferredModel']) || 'auto',
  };
}
