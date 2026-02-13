import { decideNextBestAction } from '../decisionEngine';
import type { StateSnapshot } from '../types';

function baseSnapshot(overrides: Partial<StateSnapshot>): StateSnapshot {
  return {
    requestId: 'ai_test',
    ts: new Date().toISOString(),
    message: 'hello',
    historyTurns: 0,
    route: '/waitlist',
    mode: 'STANDARD',
    known: {
      email: { valid: false, source: 'none' },
      name: { source: 'none' },
      phone: { source: 'none' },
      persona: { value: null, source: 'none' },
      goal: { source: 'none' },
    },
    currentStep: 'boot',
    unlocked: false,
    tier: 0,
    interactionCount: 0,
    lastIntent: 'query',
    preferredProvider: 'auto',
    preferredModel: 'auto',
    ...overrides,
  };
}

describe('decideNextBestAction', () => {
  it('asks for email when email unknown', () => {
    const { action } = decideNextBestAction(baseSnapshot({}));
    expect(action.type).toBe('ASK_EMAIL');
  });

  it('does not ask for email when known', () => {
    const { action } = decideNextBestAction(
      baseSnapshot({
        known: {
          email: { value: 'a@b.com', valid: true, source: 'request' },
          name: { source: 'none' },
          phone: { source: 'none' },
          persona: { value: null, source: 'none' },
          goal: { source: 'none' },
        },
      })
    );
    expect(action.type).toBe('ASK_NAME');
  });

  it('returns recommendations first when unlocked', () => {
    const { action } = decideNextBestAction(
      baseSnapshot({
        unlocked: true,
        currentStep: 'unlocked',
        known: {
          email: { value: 'a@b.com', valid: true, source: 'request' },
          name: { value: 'Nico', source: 'request' },
          phone: { source: 'none' },
          persona: { value: 'BUSINESS', source: 'request' },
          goal: { value: 'Scale', source: 'request' },
        },
      })
    );
    expect(action.type).toBe('RETURN_RECOMMENDATIONS');
  });
});
