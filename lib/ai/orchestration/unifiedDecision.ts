import { RECOMMENDATION_CATALOG_SEED, type RecommendationCandidate } from '../recommendationCatalog.js';

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
  | 'SHOW_STATUS';

interface UnifiedAIRequestLike {
  message: string;
  context?: string;
  history?: Array<{ role: string; content: string }>;
  userEmail?: string;
}

export interface StateSnapshot {
  requestId: string;
  route: string;
  mode: 'GEEK' | 'STANDARD';
  clientSessionId?: string;
  clientSyncHint?: 'TIER_0' | 'TIER_1' | 'UNKNOWN';
  strictMode: boolean;
  currentStep: OnboardingStep;
  unlocked: boolean;
  tier: number;
  message: string;
  known: {
    email?: string;
    emailValid: boolean;
    name?: string;
    phone?: string;
    persona: Persona;
    goal?: string;
    discovery?: string;
  };
}

export interface KnownProfileSeed {
  email?: string;
  emailValid?: boolean;
  name?: string;
  phone?: string;
  persona?: Persona;
  goal?: string;
  discovery?: string;
}

export interface DecisionTrace {
  stateBefore: OnboardingStep;
  stateAfter: OnboardingStep;
  blockedBy?: string;
  rules: Array<{ id: string; passed: boolean; reason: string }>;
}

export interface NextBestAction {
  type: ActionType;
  nextStep: OnboardingStep;
  prompt: string;
}

export interface RecommendationPayload {
  persona: 'PERSONAL' | 'BUSINESS';
  track: 'foundation' | 'build' | 'scale';
  quickWin?: string;
  top3: Array<{
    id: string;
    title: string;
    why: string;
    nextStep: string;
    effort: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    score: number;
  }>;
}

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE = /(\+?\d[\d\s\-()]{7,})/;

function looksLikeTokenDump(input: string): boolean {
  const t = normalizeUserText(input);
  if (t.length < 80) return false;
  if (/^[0-9-]+$/.test(t) && t.replace(/-/g, '').length >= 80) return true;
  const compact = t.replace(/\s+/g, '');
  if (compact.length >= 120 && /^[A-Za-z0-9+/_=-]+$/.test(compact)) return true;
  if (compact.length >= 96 && /^[a-f0-9]+$/i.test(compact)) return true;
  const letters = (t.match(/[A-Za-z]/g) || []).length;
  if (t.length >= 120 && letters / t.length < 0.05) return true;
  return false;
}

function normalizePhoneCandidate(v?: string): string | undefined {
  if (!v) return undefined;
  const t = normalizeUserText(v);
  // Hard guard against accidental token dumps being parsed as phone numbers.
  if (looksLikeTokenDump(t)) return undefined;
  // Keep only plausible phone-sized strings.
  if (t.length < 7 || t.length > 25) return undefined;
  const digits = (t.match(/\d/g) || []).length;
  if (digits < 7 || digits > 20) return undefined;
  return t;
}

function isValidEmail(v?: string): boolean {
  return !!v && EMAIL_RE.test(v);
}

function isGoalValid(v?: string): boolean {
  return !!v && v.trim().length >= 50;
}

function extractRoute(context?: string): string {
  if (!context) return '/';
  const m = context.match(/on the "([^"]+)" page/i);
  return m?.[1] || '/';
}

function extractClientSessionId(context?: string): string | undefined {
  if (!context) return undefined;
  const m = context.match(/ClientSessionId:\s*([A-Za-z0-9_\-:.]+)/i);
  return m?.[1];
}

function extractClientSyncHint(context?: string): 'TIER_0' | 'TIER_1' | 'UNKNOWN' {
  if (!context) return 'UNKNOWN';
  const m = context.match(/Sync\s*Level:\s*(TIER\s*0|TIER\s*1)/i);
  if (!m?.[1]) return 'UNKNOWN';
  const n = m[1].replace(/\s+/g, '').toUpperCase();
  if (n === 'TIER0') return 'TIER_0';
  if (n === 'TIER1') return 'TIER_1';
  return 'UNKNOWN';
}

function extractStrictMode(context?: string): boolean {
  if (!context) return false;
  const m = context.match(/\bStrictMode\s*:\s*(on|off|true|false)\b/i);
  if (!m?.[1]) return false;
  const v = m[1].toLowerCase();
  return v === 'on' || v === 'true';
}

function extractMode(context?: string): 'GEEK' | 'STANDARD' {
  if (!context) return 'STANDARD';
  const m = context.match(/Mode:\s*(GEEK|STANDARD)/i);
  return m?.[1]?.toUpperCase() === 'GEEK' ? 'GEEK' : 'STANDARD';
}

function extractPersona(text: string): Persona {
  const n = text.toLowerCase();
  const m = n.match(/\bpersona\s*:\s*(personal|business)\b/);
  if (m?.[1] === 'business') return 'BUSINESS';
  if (m?.[1] === 'personal') return 'PERSONAL';
  if (n.includes('business_architect') || n.includes('business')) return 'BUSINESS';
  if (n.includes('personal_builder') || n.includes('personal')) return 'PERSONAL';
  return null;
}

function extractHintField(allText: string, label: 'name' | 'phone' | 'goal' | 'discovery'): string | undefined {
  const re = new RegExp(`\\b${label}\\s*:\\s*([^|\\n\\r]+)`, 'i');
  const m = re.exec(allText || '');
  const v = normalizeUserText(m?.[1] || '');
  if (!v) return undefined;
  if (looksLikeTokenDump(v)) return undefined;
  return v;
}

function extractNameCandidate(latestMessage: string): string | undefined {
  const m = (latestMessage || '').trim();
  if (!m) return undefined;
  if (EMAIL_RE.test(m)) return undefined;
  if (PHONE_RE.test(m)) return undefined;
  if (m.length < 3 || m.length > 60) return undefined;
  if (/^[A-Z][a-z'\-]+\s+[A-Z][a-z'\-]+(?:\s+[A-Z][a-z'\-]+)?$/.test(m)) {
    return m;
  }
  if (/\b(personal|business|architect|builder|goal|stack|bottleneck|orchestration|module|waitlist)\b/i.test(m)) return undefined;
  const words = m.split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 4) return undefined;
  if (!words.every(w => /^[A-Za-z'\-]+$/.test(w))) return undefined;
  return words.map(w => w[0]!.toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function normalizeUserText(input: string): string {
  return (input || '').trim().replace(/\s+/g, ' ');
}

function isIgnorableShortUtterance(text: string): boolean {
  const t = normalizeUserText(text).toLowerCase();
  if (!t) return true;
  if (t.length <= 2) return true;
  return [
    'hi',
    'hello',
    'hey',
    'yes',
    'yep',
    'yeah',
    'ok',
    'okay',
    'cool',
    'thanks',
    'thank you',
    'continue',
    'go',
    'next',
  ].includes(t);
}

function getRecentUserMessages(req: UnifiedAIRequestLike): string[] {
  const history = req.history || [];
  const fromHistory = history
    .filter(h => (h.role || '').toLowerCase() === 'user')
    .map(h => normalizeUserText(h.content || ''))
    .filter(Boolean);

  const latest = normalizeUserText(req.message || '');
  // Newest first; include latest message even if it's duplicate.
  return [latest, ...fromHistory.reverse()].filter(Boolean);
}

function extractGoalFromMessages(messages: string[]): string | undefined {
  for (const m of messages) {
    if (isIgnorableShortUtterance(m)) continue;
    if (looksLikeTokenDump(m)) continue;
    if (EMAIL_RE.test(m)) continue;
    if (PHONE_RE.test(m)) continue;
    if (m.length >= 50) return m;
  }
  return undefined;
}

function extractDiscoveryFromMessages(messages: string[], goal?: string): string | undefined {
  for (const m of messages) {
    if (isIgnorableShortUtterance(m)) continue;
    if (looksLikeTokenDump(m)) continue;
    if (EMAIL_RE.test(m)) continue;
    if (PHONE_RE.test(m)) continue;
    if (extractPersona(m)) continue;
    if (goal && m === goal) continue;
    // Discovery should be a short, human statement (not the long goal).
    if (m.length >= 10 && m.length < 120) return m;
  }
  return undefined;
}

function extractNameFromMessages(messages: string[]): string | undefined {
  for (const m of messages) {
    const candidate = extractNameCandidate(m);
    if (candidate) return candidate;
  }
  return undefined;
}

function inferKnownFields(req: UnifiedAIRequestLike): StateSnapshot['known'] {
  const history = req.history || [];
  const all = [req.context || '', ...history.map(h => h.content || ''), req.message || ''].join('\n');

  const recentUserMessages = getRecentUserMessages(req);

  // Prefer explicit state hints if present (client can send StateHints: Name/Phone/Goal/Discovery).
  const hintedName = extractHintField(all, 'name');
  const hintedPhone = extractHintField(all, 'phone');
  const hintedGoal = extractHintField(all, 'goal');
  const hintedDiscovery = extractHintField(all, 'discovery');

  const emailMatch = (req.userEmail && EMAIL_RE.exec(req.userEmail)) || EMAIL_RE.exec(all);
  const phoneMatch = PHONE_RE.exec(all);
  const nameCandidate = hintedName || extractNameFromMessages(recentUserMessages);
  const persona = extractPersona(all);

  // Lightweight heuristics for goal/discovery from recent user messages.
  // This is intentionally stateless: it works even when serverless memory is cold.
  const goal = (hintedGoal && isGoalValid(hintedGoal)) ? hintedGoal : extractGoalFromMessages(recentUserMessages);
  const discovery = hintedDiscovery || extractDiscoveryFromMessages(recentUserMessages, goal);

  return {
    email: emailMatch?.[0],
    emailValid: isValidEmail(emailMatch?.[0]),
    name: nameCandidate,
    phone: normalizePhoneCandidate(hintedPhone || phoneMatch?.[0]),
    persona,
    goal,
    discovery,
  };
}

function inferStep(known: StateSnapshot['known'], route: string, message: string): OnboardingStep {
  if (route.includes('/waitlist') || route.includes('/waitinglist')) {
    if (!known.emailValid) return 'email_guard';
    if (!known.name) return 'onboarding_name';
    if (!known.phone) return 'onboarding_phone';
    if (!known.persona) return 'handshake';
    if (!known.discovery) return 'dynamic_discovery';
    if (!isGoalValid(known.goal)) return 'validation';
    return 'unlocked';
  }
  if ((message || '').trim().length === 0) return 'boot';
  return 'unlocked';
}

export function buildStateSnapshot(
  requestId: string,
  req: UnifiedAIRequestLike,
  tier: number,
  seed?: KnownProfileSeed,
): StateSnapshot {
  const route = extractRoute(req.context);
  const mode = extractMode(req.context);
  const clientSessionId = extractClientSessionId(req.context);
  const clientSyncHint = extractClientSyncHint(req.context);
  const strictMode = extractStrictMode(req.context);
  const inferred = inferKnownFields(req);
  const known = {
    email: inferred.email || seed?.email,
    emailValid: inferred.emailValid || !!seed?.emailValid,
    name: inferred.name || seed?.name,
    phone: inferred.phone || seed?.phone,
    persona: inferred.persona || seed?.persona || null,
    goal: inferred.goal || seed?.goal,
    discovery: inferred.discovery || seed?.discovery,
  };
  const currentStep = inferStep(known, route, req.message || '');
  const unlocked = currentStep === 'unlocked' || (clientSyncHint === 'TIER_1' && (route.includes('/waitlist') || route.includes('/waitinglist')));

  return {
    requestId,
    route,
    mode,
    clientSessionId,
    clientSyncHint,
    strictMode,
    currentStep,
    unlocked,
    tier,
    message: req.message || '',
    known,
  };
}

function looksLikeRigidGoalGate(text: string): boolean {
  const t = (text || '').toLowerCase();
  return (
    t.includes('termination') ||
    t.includes('reassignment') ||
    t.includes('lower-priority queue') ||
    t.includes('failure to provide') ||
    t.includes('directive:') ||
    (t.includes('this session') && t.includes('terminated')) ||
    (t.includes('smart') && t.includes('objective')) ||
    (t.includes('provide your') && t.includes('now'))
  );
}

function buildHelpfulObjectiveAssist(snapshot: StateSnapshot): string {
  const persona = snapshot.known.persona || 'PERSONAL';
  const discovery = snapshot.known.discovery;
  const base = discovery ? `Based on your context: ${discovery}` : 'Based on what you shared so far.';

  const options = persona === 'BUSINESS'
    ? [
        {
          id: '1',
          title: 'Customer Support Autopilot (MVP)',
          metric: 'Resolve 50% of inbound FAQs end-to-end with human handoff',
        },
        {
          id: '2',
          title: 'Lead Qualifier + Router (MVP)',
          metric: 'Auto-classify leads + push to Notion/Sheets with score + next action',
        },
        {
          id: '3',
          title: 'Internal Ops Command Center (MVP)',
          metric: 'Single command interface that runs 5 workflows reliably',
        },
      ]
    : [
        {
          id: '1',
          title: 'Personal AI Workflow (MVP)',
          metric: 'Automate 1 daily workflow: capture -> summarize -> next steps',
        },
        {
          id: '2',
          title: 'Micro SaaS Launch (MVP)',
          metric: 'Live app deployed with 1 paid feature + analytics',
        },
        {
          id: '3',
          title: 'Codebase Assistant (MVP)',
          metric: 'Answer repo questions + generate PR-ready diffs for 3 tasks',
        },
      ];

  return [
    '[h2]No Blocking. We Move.[/h2]',
    `[muted]${base}[/muted]`,
    '',
    '[success]✓[/success] You can start with a rough target. I will refine it as we go.',
    '',
    '[h3]Pick a 10-day target (or I pick #1 by default)[/h3]',
    ...options.flatMap((o) => [
      `[b]${o.id}. ${o.title}[/b]`,
      `[muted]Success metric:[/muted] ${o.metric}`,
      '',
    ]),
    '[info]Reply with 1/2/3, or tell me: your domain + your stack + your current users (if any).[/info]',
    '',
    '[muted]If you WANT hard gating, type `strict on`. Default is helpful mode.[/muted]',
  ].join('\n').trim();
}

function wantsRecommendations(message: string): boolean {
  const t = normalizeUserText(message).toLowerCase();
  if (!t) return true;
  if (isIgnorableShortUtterance(t)) return true;
  return /(recommend|next\s*step|what\s*should\s*i\s*do|priorit|top\s*3|quick\s*win)/.test(t);
}

export function decideNextAction(snapshot: StateSnapshot): { action: NextBestAction; trace: DecisionTrace } {
  const rules: DecisionTrace['rules'] = [];
  const before = snapshot.currentStep;

  rules.push({
    id: 'RULE_NO_REDUNDANT_EMAIL',
    passed: !snapshot.known.emailValid || snapshot.currentStep !== 'email_guard',
    reason: snapshot.known.emailValid ? 'email known; avoid re-asking' : 'email missing; ask required',
  });

  const isWaitlistRoute = snapshot.route.includes('/waitlist') || snapshot.route.includes('/waitinglist');
  if (snapshot.unlocked && isWaitlistRoute) {
    const actionType: ActionType = wantsRecommendations(snapshot.message) ? 'RETURN_RECOMMENDATIONS' : 'ANSWER_QUERY';
    return {
      action: {
        type: actionType,
        nextStep: 'unlocked',
        prompt: actionType === 'RETURN_RECOMMENDATIONS'
          ? 'Return concrete recommendations first, then one optional clarifier.'
          : 'Answer directly with actionable, customer-first guidance.',
      },
      trace: { stateBefore: before, stateAfter: 'unlocked', rules },
    };
  }

  if (!isWaitlistRoute) {
    return {
      action: {
        type: 'ANSWER_QUERY',
        nextStep: 'unlocked',
        prompt: 'Answer directly with actionable, customer-first guidance.',
      },
      trace: { stateBefore: before, stateAfter: 'unlocked', rules },
    };
  }

  switch (snapshot.currentStep) {
    case 'email_guard':
      if (snapshot.known.emailValid) {
        return {
          action: { type: 'ASK_NAME', nextStep: 'onboarding_name', prompt: 'Email confirmed. Ask for full name.' },
          trace: { stateBefore: before, stateAfter: 'onboarding_name', rules },
        };
      }
      return {
        action: { type: 'ASK_EMAIL', nextStep: 'email_guard', prompt: 'Ask for a valid email address only.' },
        trace: { stateBefore: before, stateAfter: 'email_guard', rules },
      };
    case 'onboarding_name':
      return {
        action: { type: 'ASK_NAME', nextStep: 'onboarding_name', prompt: 'Ask for full name (single prompt).' },
        trace: { stateBefore: before, stateAfter: 'onboarding_name', rules },
      };
    case 'onboarding_phone':
      return {
        action: { type: 'ASK_PHONE', nextStep: 'onboarding_phone', prompt: 'Ask for phone number (single prompt).' },
        trace: { stateBefore: before, stateAfter: 'onboarding_phone', rules },
      };
    case 'handshake':
      return {
        action: { type: 'ASK_PERSONA', nextStep: 'handshake', prompt: 'Ask persona choice PERSONAL or BUSINESS.' },
        trace: { stateBefore: before, stateAfter: 'handshake', rules },
      };
    case 'dynamic_discovery':
      return {
        action: { type: 'ASK_DISCOVERY', nextStep: 'dynamic_discovery', prompt: 'Ask one discovery question tied to user context.' },
        trace: { stateBefore: before, stateAfter: 'dynamic_discovery', rules },
      };
    case 'validation':
      return {
        action: { type: 'ASK_GOAL', nextStep: 'validation', prompt: 'Ask for 10-day goal with minimum 50 chars.' },
        trace: { stateBefore: before, stateAfter: 'validation', rules },
      };
    case 'processing':
      return {
        action: { type: 'SHOW_STATUS', nextStep: 'processing', prompt: 'Return status update only.' },
        trace: { stateBefore: before, stateAfter: 'processing', rules },
      };
    default:
      return {
        action: { type: 'ANSWER_QUERY', nextStep: 'unlocked', prompt: 'Answer directly with customer-first execution detail.' },
        trace: { stateBefore: before, stateAfter: 'unlocked', rules },
      };
  }
}

function classifyTrack(text: string): 'foundation' | 'build' | 'scale' {
  const t = text.toLowerCase();
  if (/(scale|team|revenue|sales|funnel|growth|investor|enterprise)/.test(t)) return 'scale';
  if (/(ship|build|deploy|mvp|launch|api|feature)/.test(t)) return 'build';
  return 'foundation';
}

function getIntentKeywords(text: string): string[] {
  const t = text.toLowerCase();
  const lex = [
    'nextjs', 'react', 'supabase', 'orchestration', 'agent', 'automation', 'deployment',
    'vercel', 'api', 'auth', 'pricing', 'growth', 'sales', 'architecture', 'debug', 'latency',
    'performance', 'mobile', 'ux', 'learning', 'recommendation'
  ];
  return lex.filter(k => t.includes(k));
}

function scoreCandidate(c: RecommendationCandidate, persona: 'PERSONAL' | 'BUSINESS', tier: number, keywords: string[], route: string): number {
  let score = 0;
  const tagHits = c.tags.filter(t => keywords.includes(t)).length;
  score += Math.min(40, tagHits * 10);
  if (c.personaFit.includes(persona)) score += 25;
  if (tier >= c.minTier) score += 15;
  else score -= 20;
  if (c.effort === 'low' && c.impact !== 'low') score += 20;
  if (route.includes('waitlist') && c.tags.includes('onboarding')) score += 5;
  return Math.max(0, Math.min(100, score));
}

export function buildRecommendationPayload(snapshot: StateSnapshot): RecommendationPayload | null {
  if (!snapshot.unlocked) return null;
  const persona: 'PERSONAL' | 'BUSINESS' = snapshot.known.persona || 'PERSONAL';
  const track = classifyTrack(`${snapshot.message} ${snapshot.known.goal || ''}`);
  const keywords = getIntentKeywords(`${snapshot.message} ${snapshot.known.goal || ''} ${snapshot.known.discovery || ''}`);

  const ranked = RECOMMENDATION_CATALOG_SEED
    .filter(c => c.personaFit.includes(persona) && snapshot.tier >= c.minTier)
    .map(c => {
      const score = scoreCandidate(c, persona, snapshot.tier, keywords, snapshot.route);
      return {
        id: c.id,
        title: c.title,
        why: `Score ${score}/100 based on your persona, goal, and current step.`,
        nextStep: c.nextStepTemplate
          .replace('{goal}', snapshot.known.goal || 'your objective')
          .replace('{persona}', persona),
        effort: c.effort,
        impact: c.impact,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const quick = ranked.find(r => r.effort === 'low' && r.impact === 'high');
  return {
    persona,
    track,
    quickWin: quick?.nextStep,
    top3: ranked,
  };
}

export function applyResponsePolicy(content: string, snapshot: StateSnapshot, action: NextBestAction): string {
  let out = content || '';

  // Universal anti-repetition guard
  if (snapshot.known.emailValid && /provide\s+(a\s+)?valid\s+email|email\s+address/i.test(out)) {
    out = out.replace(/provide\s+(a\s+)?valid\s+email\s+address[^.]*\.?/gi, 'Email is already confirmed.');
  }
  if (snapshot.known.persona && /choose\s+persona|personal\s+or\s+business/i.test(out) && snapshot.currentStep !== 'handshake') {
    out = out.replace(/choose\s+persona[^.]*\.?/gi, 'Persona is already locked.');
  }

  // Force customer-first action framing
  if (action.type === 'RETURN_RECOMMENDATIONS' && !/next\s*step|recommend/i.test(out)) {
    out = `[h2]Execution Priority[/h2]\n[success]✓[/success] Focused recommendations generated.\n\n${out}`;
  }

  // Waitlist UX: never threaten, never block, never force SMART gates unless user explicitly enables strict mode.
  const isWaitlistRoute = snapshot.route.includes('/waitlist') || snapshot.route.includes('/waitinglist');
  if (isWaitlistRoute && snapshot.unlocked && !snapshot.strictMode && looksLikeRigidGoalGate(out)) {
    out = buildHelpfulObjectiveAssist(snapshot);
  }

  return out;
}
