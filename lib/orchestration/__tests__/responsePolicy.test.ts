import { enforceResponsePolicy } from '../responsePolicy';
import type { DecisionTrace, NextBestAction, StateSnapshot } from '../types';

const trace: DecisionTrace = {
  requestId: 'ai_test',
  ruleVersion: 'orchestration-rules@1.0.0',
  evaluatedRules: [],
  confidence: 1,
  stateBefore: {
    step: 'unlocked',
    unlocked: true,
    knownEmail: true,
    knownName: true,
    knownPhone: false,
    knownPersona: true,
    knownGoal: false,
  },
  stateAfter: { nextStep: 'unlocked', transition: 'unlocked -> unlocked' },
};

const action: NextBestAction = { type: 'ANSWER_QUERY', priority: 1 };

const snapshot: StateSnapshot = {
  requestId: 'ai_test',
  ts: new Date().toISOString(),
  message: 'hello',
  historyTurns: 0,
  route: '/waitlist',
  mode: 'STANDARD',
  email: 'a@b.com',
  known: {
    email: { value: 'a@b.com', valid: true, source: 'request' },
    name: { value: 'Nico', source: 'request' },
    phone: { source: 'none' },
    persona: { value: 'BUSINESS', source: 'request' },
    goal: { source: 'none' },
  },
  currentStep: 'unlocked',
  unlocked: true,
  tier: 0,
  interactionCount: 1,
  lastIntent: 'query',
  preferredProvider: 'auto',
  preferredModel: 'auto',
};

describe('enforceResponsePolicy', () => {
  it('removes redundant email prompt when email already known', () => {
    const result = enforceResponsePolicy({
      content: 'Please provide your email address to continue.',
      snapshot,
      action,
      trace,
    });
    expect(result.rewritten).toBe(true);
    expect(result.content.toLowerCase()).not.toContain('provide your email');
  });
});
