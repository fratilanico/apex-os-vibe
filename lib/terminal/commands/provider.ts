/**
 * Provider command handler
 * Controls preferred AI provider routing
 */

import type { CommandContext } from './types';
import * as CLIFormatter from '@/lib/cliFormatter';

const PROVIDER_OPTIONS = ['auto', 'vertex', 'perplexity'] as const;

type ProviderOption = typeof PROVIDER_OPTIONS[number];

function normalizeProvider(value: string): ProviderOption | null {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'vertex-ai') return 'vertex';
  if ((PROVIDER_OPTIONS as readonly string[]).includes(normalized)) {
    return normalized as ProviderOption;
  }
  return null;
}

export function handleProvider(context: CommandContext, args: string[]): string {
  const next = args[0] ? normalizeProvider(args[0]) : null;

  if (!next) {
    const rows = [
      ['Preferred', context.preferredProvider.toUpperCase()],
      ['Options', PROVIDER_OPTIONS.join(' | ').toUpperCase()],
    ];
    context.addLine('system', CLIFormatter.formatTable(['SETTING', 'VALUE'], rows));
    return '[exit 0]';
  }

  context.setPreferredProvider(next);

  const rows = [
    ['Preferred', next.toUpperCase()],
    ['Routing', next === 'auto' ? 'VERTEX PRIMARY' : `${next.toUpperCase()} OVERRIDE`],
  ];
  context.addLine('system', CLIFormatter.formatTable(['SETTING', 'VALUE'], rows));
  return '[exit 0]';
}
