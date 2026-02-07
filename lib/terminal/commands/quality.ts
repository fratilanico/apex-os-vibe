/**
 * Quality command handler
 * Controls preferred model tier (fast/pro/auto)
 */

import type { CommandContext } from './types';
import * as CLIFormatter from '@/lib/cliFormatter';

const MODEL_OPTIONS = ['auto', 'fast', 'pro'] as const;
type ModelOption = typeof MODEL_OPTIONS[number];

function normalizeModel(value: string): ModelOption | null {
  const normalized = value.trim().toLowerCase();
  if ((MODEL_OPTIONS as readonly string[]).includes(normalized)) {
    return normalized as ModelOption;
  }
  return null;
}

export function handleQuality(context: CommandContext, args: string[]): string {
  const next = args[0] ? normalizeModel(args[0]) : null;

  if (!next) {
    const rows = [
      ['Preferred', context.preferredModel.toUpperCase()],
      ['Options', MODEL_OPTIONS.join(' | ').toUpperCase()],
    ];
    context.addLine('system', CLIFormatter.formatTable(['SETTING', 'VALUE'], rows));
    return '[exit 0]';
  }

  context.setPreferredModel(next);

  const rows = [
    ['Preferred', next.toUpperCase()],
    ['Routing', next === 'auto' ? 'SMART ROUTING' : `${next.toUpperCase()} FIRST`],
  ];
  context.addLine('system', CLIFormatter.formatTable(['SETTING', 'VALUE'], rows));
  return '[exit 0]';
}
