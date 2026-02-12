import type { RecommendationPayload, StateSnapshot } from './types.js';
import { CONTENT_DATABASE } from '../ai/recommendationEngine.js';

function toTrack(snapshot: StateSnapshot): RecommendationPayload['track'] {
  if (!snapshot.unlocked) return 'foundation';
  if (snapshot.known.persona.value === 'BUSINESS') return 'scale';
  return 'build';
}

function scoreModule(module: (typeof CONTENT_DATABASE)[number], snapshot: StateSnapshot): number {
  let score = 0;
  const message = snapshot.message.toLowerCase();
  const persona = snapshot.known.persona.value;

  if (module.persona === 'BOTH') score += 20;
  if (persona && module.persona === persona) score += 30;
  if (message.includes('architecture') && module.topics.some((topic) => topic.toLowerCase().includes('orchestration'))) score += 25;
  if (message.includes('study') || message.includes('learn')) score += 10;
  if (snapshot.unlocked) score += 10;
  if (module.difficulty === 'beginner' && !snapshot.unlocked) score += 15;
  if (module.difficulty === 'advanced' && snapshot.unlocked) score += 10;

  return score;
}

export function generateUniversalRecommendations(snapshot: StateSnapshot): RecommendationPayload | undefined {
  const persona = snapshot.known.persona.value;
  if (!persona) return undefined;

  const ranked = CONTENT_DATABASE
    .map((module) => ({ module, score: scoreModule(module, snapshot) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ module }) => ({
      id: module.id,
      title: module.title,
      why: module.description.slice(0, 120),
      nextStep: `Start ${module.title} and complete first milestone this week`,
      effort: (module.difficulty === 'beginner' ? 'low' : module.difficulty === 'intermediate' ? 'medium' : 'high') as 'low' | 'medium' | 'high',
      impact: (module.category === 'business' ? 'high' : module.category === 'technical' ? 'medium' : 'low') as 'low' | 'medium' | 'high',
    }));

  return {
    persona,
    track: toTrack(snapshot),
    top3: ranked,
    quickWin: ranked[0] ? `Quick win: ${ranked[0].title}` : undefined,
  };
}

export function recommendationsToPrompt(recommendations?: RecommendationPayload): string {
  if (!recommendations || recommendations.top3.length === 0) return '';
  const lines = [
    'RECOMMENDATION_CONTEXT:',
    `Persona: ${recommendations.persona}`,
    `Track: ${recommendations.track}`,
  ];
  recommendations.top3.forEach((item, idx) => {
    lines.push(`${idx + 1}. ${item.title} | why=${item.why} | next=${item.nextStep}`);
  });
  if (recommendations.quickWin) lines.push(`QuickWin: ${recommendations.quickWin}`);
  return lines.join('\n');
}

export function renderRecommendationsCLI(input: {
  query: string;
  recommendations: RecommendationPayload;
}): string {
  const r = input.recommendations;
  const lines: string[] = [];
  lines.push('[h1]NEXT BEST ACTION: LEARNING PATH[/h1]');
  lines.push('');
  lines.push(`[b]Query:[/b] ${input.query}`);
  lines.push(`[b]Persona:[/b] ${r.persona}   [b]Track:[/b] ${r.track}`);
  lines.push('');

  lines.push('┌──────────────────────────────────────────────────────────────────────────────┐');
  lines.push('│ TOP 3 RECOMMENDATIONS                                                        │');
  lines.push('├────┬──────────────────────────────┬────────┬────────┬───────────────────────┤');
  lines.push('│ #  │ Module                        │ Effort │ Impact │ Next Step              │');
  lines.push('├────┼──────────────────────────────┼────────┼────────┼───────────────────────┤');
  r.top3.slice(0, 3).forEach((item, idx) => {
    const title = item.title.padEnd(28).slice(0, 28);
    const effort = item.effort.toUpperCase().padEnd(6).slice(0, 6);
    const impact = item.impact.toUpperCase().padEnd(6).slice(0, 6);
    const next = item.nextStep.padEnd(21).slice(0, 21);
    lines.push(`│ ${(idx + 1).toString().padEnd(2)} │ ${title} │ ${effort} │ ${impact} │ ${next} │`);
  });
  lines.push('└────┴──────────────────────────────┴────────┴────────┴───────────────────────┘');
  lines.push('');

  r.top3.slice(0, 3).forEach((item, idx) => {
    lines.push(`[b]${idx + 1}. ${item.title}[/b]`);
    lines.push(`[muted]Why:[/muted] ${item.why}`);
    lines.push(`[muted]Next:[/muted] ${item.nextStep}`);
    lines.push('');
  });

  if (r.quickWin) {
    lines.push(`[success]${r.quickWin}[/success]`);
    lines.push('');
  }
  lines.push('[h2]ONE-LINE CONFIRMATION[/h2]');
  lines.push('Reply with `1`, `2`, or `3` and I will generate a 7-day execution plan (no fluff).');
  return lines.join('\n');
}
