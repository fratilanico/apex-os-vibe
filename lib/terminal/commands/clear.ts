/**
 * Clear command handler
 * Clears the terminal screen and resets session
 */

import type { CommandContext } from './types';

/**
 * Clear the terminal
 */
export function handleClear(context: CommandContext): string {
  // Clear the visual output
  context.setLines([]);
  // Clear session storage
  context.clearSession();
  return '[exit 0]';
}
