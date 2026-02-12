export type Persona = 'PERSONAL' | 'BUSINESS' | null;

export type OnboardingStep =
  | 'boot'
  | 'email_guard'
  | 'onboarding_name'
  | 'onboarding_phone'
  | 'handshake'
  | 'dynamic_discovery'
  | 'validation'
  | 'processing'
  | 'unlocked';

export type ActionType =
  | 'ASK_EMAIL'
  | 'ASK_NAME'
  | 'ASK_PHONE'
  | 'ASK_PERSONA'
  | 'ASK_DISCOVERY'
  | 'ASK_GOAL'
  | 'RUN_HANDSHAKE'
  | 'RETURN_RECOMMENDATIONS'
  | 'ANSWER_QUERY'
  | 'SHOW_ERROR';

export type InteractionEventType =
  | 'field.provided'
  | 'field.updated'
  | 'step.entered'
  | 'step.completed'
  | 'ai.requested'
  | 'ai.responded'
  | 'ai.failed'
  | 'provider.failed'
  | 'policy.rewritten'
  | 'recommendation.shown'
  | 'recommendation.accepted'
  | 'window.error'
  | 'unhandledrejection';

export interface KnownField<T = string> {
  value?: T;
  valid?: boolean;
  source: 'request' | 'state' | 'db' | 'none';
}

export interface StateHints {
  name?: string;
  email?: string;
  phone?: string;
  persona?: Persona;
  goal?: string;
  currentStep?: OnboardingStep;
  unlocked?: boolean;
  mode?: 'STANDARD' | 'GEEK';
}

export interface CustomerState {
  userId?: string;
  email?: string;
  sessionId?: string;
  route: string;
  mode: 'STANDARD' | 'GEEK';
  known: {
    email: KnownField<string>;
    name: KnownField<string>;
    phone: KnownField<string>;
    persona: KnownField<Persona>;
    goal: KnownField<string>;
  };
  currentStep: OnboardingStep;
  unlocked: boolean;
  tier: 0 | 1 | 2;
  interactionCount: number;
  lastIntent: 'query' | 'provide_field' | 'help' | 'command' | 'unknown';
}

export interface StateSnapshot extends CustomerState {
  requestId: string;
  ts: string;
  message: string;
  historyTurns: number;
  preferredProvider: 'auto' | 'vertex' | 'perplexity' | 'vertex-ai' | 'gemini';
  preferredModel: 'auto' | 'fast' | 'pro';
}

export interface NextBestAction {
  type: ActionType;
  priority: number;
  prompt?: string;
  constraints?: {
    mustNotAskFor?: Array<'email' | 'name' | 'phone' | 'persona' | 'goal'>;
    maxQuestions?: number;
  };
}

export interface DecisionTrace {
  requestId: string;
  ruleVersion: string;
  evaluatedRules: Array<{ id: string; passed: boolean; reason: string }>;
  blockedBy?: string;
  confidence: number;
  stateBefore: {
    step: OnboardingStep;
    unlocked: boolean;
    knownEmail: boolean;
    knownName: boolean;
    knownPhone: boolean;
    knownPersona: boolean;
    knownGoal: boolean;
  };
  stateAfter: {
    nextStep: OnboardingStep;
    transition?: string;
  };
}

export interface RecommendationItem {
  id: string;
  title: string;
  why: string;
  nextStep: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

export interface RecommendationPayload {
  persona: 'PERSONAL' | 'BUSINESS';
  track: 'foundation' | 'build' | 'scale';
  top3: RecommendationItem[];
  quickWin?: string;
}

export interface ProviderAttemptDebug {
  provider: string;
  enabled: boolean;
  healthy?: boolean;
  success: boolean;
  error?: string;
  durationMs?: number;
}

export interface InteractionEvent {
  requestId: string;
  eventType: InteractionEventType;
  userId?: string;
  email?: string;
  sessionId?: string;
  source: string;
  route: string;
  payload: Record<string, unknown>;
  ts: string;
}
