import type { DecisionTrace, NextBestAction, StateSnapshot } from './types.js';

function looksLikeAskingForEmail(text: string): boolean {
  const t = text.toLowerCase();
  return t.includes('email') && (t.includes('enter') || t.includes('provide') || t.includes('what is your'));
}

function looksLikeAskingForName(text: string): boolean {
  const t = text.toLowerCase();
  return t.includes('your name') || t.includes('what should i call you');
}

function looksLikeAskingForPersona(text: string): boolean {
  const t = text.toLowerCase();
  return t.includes('personal or business') || t.includes('choose your persona');
}

export function enforceResponsePolicy(input: {
  content: string;
  snapshot: StateSnapshot;
  action: NextBestAction;
  trace: DecisionTrace;
}): { content: string; rewritten: boolean; trace: DecisionTrace } {
  let content = input.content;
  let rewritten = false;
  const rules = input.trace.evaluatedRules.slice();

  if (input.snapshot.known.email.valid && looksLikeAskingForEmail(content)) {
    content = 'Email already verified. Proceeding with your current request now.\n\n' + content.replace(/.*email.*\n?/gi, '').trim();
    rewritten = true;
    rules.push({ id: 'RULE_EMAIL_ALREADY_KNOWN', passed: true, reason: 'Removed redundant email prompt' });
  }

  if (input.snapshot.known.name.value && looksLikeAskingForName(content)) {
    content = 'Identity already confirmed. Continuing without redundant name prompt.\n\n' + content.replace(/.*name.*\n?/gi, '').trim();
    rewritten = true;
    rules.push({ id: 'RULE_NAME_ALREADY_KNOWN', passed: true, reason: 'Removed redundant name prompt' });
  }

  if (input.snapshot.known.persona.value && looksLikeAskingForPersona(content)) {
    content = 'Persona already set. Continuing with focused execution.\n\n' + content;
    rewritten = true;
    rules.push({ id: 'RULE_PERSONA_ALREADY_KNOWN', passed: true, reason: 'Removed redundant persona prompt' });
  }

  if (input.action.type === 'RETURN_RECOMMENDATIONS' && !content.toLowerCase().includes('next step')) {
    content = `${content}\n\nNext step: execute the top recommendation now and report your result in one line.`;
    rewritten = true;
    rules.push({ id: 'RULE_RESULTS_FIRST', passed: true, reason: 'Enforced outcome-first close' });
  }

  return {
    content,
    rewritten,
    trace: {
      ...input.trace,
      evaluatedRules: rules,
    },
  };
}
