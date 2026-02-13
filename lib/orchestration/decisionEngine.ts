import type { DecisionTrace, NextBestAction, OnboardingStep, StateSnapshot } from './types.js';

function hasText(value?: string): boolean {
  return Boolean(value && value.trim().length > 0);
}

function nextStepFromAction(action: NextBestAction['type'], current: OnboardingStep): OnboardingStep {
  switch (action) {
    case 'ASK_EMAIL':
      return 'email_guard';
    case 'ASK_NAME':
      return 'onboarding_name';
    case 'ASK_PHONE':
      return 'onboarding_phone';
    case 'ASK_PERSONA':
      return 'handshake';
    case 'ASK_DISCOVERY':
      return 'dynamic_discovery';
    case 'ASK_GOAL':
      return 'validation';
    case 'RUN_HANDSHAKE':
      return 'processing';
    case 'RETURN_RECOMMENDATIONS':
    case 'ANSWER_QUERY':
      return current === 'processing' ? 'unlocked' : current;
    default:
      return current;
  }
}

export function decideNextBestAction(snapshot: StateSnapshot): {
  action: NextBestAction;
  trace: DecisionTrace;
} {
  const knownEmail = Boolean(snapshot.known.email.valid);
  const knownName = hasText(snapshot.known.name.value);
  const knownPhone = hasText(snapshot.known.phone.value);
  const knownPersona = Boolean(snapshot.known.persona.value);
  const knownGoal = hasText(snapshot.known.goal.value);

  const rules: DecisionTrace['evaluatedRules'] = [];

  rules.push({
    id: 'RULE_NO_REDUNDANT_QUESTIONS',
    passed: true,
    reason: 'Single-question policy active',
  });

  if (snapshot.unlocked && snapshot.lastIntent === 'query') {
    rules.push({
      id: 'RULE_UNLOCKED_RECOMMEND_RESULTS_FIRST',
      passed: true,
      reason: 'Unlocked user receives outcomes first',
    });
    const action: NextBestAction = {
      type: 'RETURN_RECOMMENDATIONS',
      priority: 1,
      constraints: { mustNotAskFor: ['email', 'name', 'phone'], maxQuestions: 1 },
    };
    return {
      action,
      trace: {
        requestId: snapshot.requestId,
        ruleVersion: 'orchestration-rules@1.0.0',
        evaluatedRules: rules,
        confidence: 0.95,
        stateBefore: {
          step: snapshot.currentStep,
          unlocked: snapshot.unlocked,
          knownEmail,
          knownName,
          knownPhone,
          knownPersona,
          knownGoal,
        },
        stateAfter: {
          nextStep: nextStepFromAction(action.type, snapshot.currentStep),
          transition: `${snapshot.currentStep} -> ${nextStepFromAction(action.type, snapshot.currentStep)}`,
        },
      },
    };
  }

  let action: NextBestAction;
  if (!knownEmail) {
    rules.push({ id: 'RULE_REQUIRE_EMAIL_FIRST', passed: true, reason: 'Email missing' });
    action = { type: 'ASK_EMAIL', priority: 1, constraints: { maxQuestions: 1 } };
  } else if (!knownName) {
    rules.push({ id: 'RULE_REQUIRE_NAME', passed: true, reason: 'Name missing' });
    action = { type: 'ASK_NAME', priority: 1, constraints: { mustNotAskFor: ['email'], maxQuestions: 1 } };
  } else if (!knownPhone && snapshot.currentStep === 'onboarding_phone') {
    rules.push({ id: 'RULE_REQUIRE_PHONE_WHEN_IN_PHONE_STEP', passed: true, reason: 'Phone step active' });
    action = { type: 'ASK_PHONE', priority: 1, constraints: { mustNotAskFor: ['email', 'name'], maxQuestions: 1 } };
  } else if (!knownPersona && (snapshot.currentStep === 'handshake' || snapshot.currentStep === 'dynamic_discovery')) {
    rules.push({ id: 'RULE_REQUIRE_PERSONA', passed: true, reason: 'Persona missing in discovery stage' });
    action = { type: 'ASK_PERSONA', priority: 1, constraints: { mustNotAskFor: ['email', 'name', 'phone'], maxQuestions: 1 } };
  } else if (!knownGoal && snapshot.currentStep === 'validation') {
    rules.push({ id: 'RULE_REQUIRE_GOAL', passed: true, reason: 'Goal missing in validation stage' });
    action = { type: 'ASK_GOAL', priority: 1, constraints: { mustNotAskFor: ['email', 'name', 'phone', 'persona'], maxQuestions: 1 } };
  } else {
    rules.push({ id: 'RULE_ANSWER_QUERY', passed: true, reason: 'Sufficient context to answer directly' });
    action = {
      type: snapshot.unlocked ? 'RETURN_RECOMMENDATIONS' : 'ANSWER_QUERY',
      priority: 2,
      constraints: {
        mustNotAskFor: ['email', ...(knownName ? (['name'] as const) : []), ...(knownPersona ? (['persona'] as const) : [])],
        maxQuestions: 1,
      },
    };
  }

  const nextStep = nextStepFromAction(action.type, snapshot.currentStep);
  return {
    action,
    trace: {
      requestId: snapshot.requestId,
      ruleVersion: 'orchestration-rules@1.0.0',
      evaluatedRules: rules,
      confidence: 0.9,
      stateBefore: {
        step: snapshot.currentStep,
        unlocked: snapshot.unlocked,
        knownEmail,
        knownName,
        knownPhone,
        knownPersona,
        knownGoal,
      },
      stateAfter: {
        nextStep,
        transition: `${snapshot.currentStep} -> ${nextStep}`,
      },
    },
  };
}
