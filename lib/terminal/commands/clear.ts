/**
 * Clear command handler
 * Clears the terminal screen and resets session
 * POLYCHROMATIC GEEK MODE: Re-renders NeuralPixelBranding after clear
 */

import type { CommandContext } from './types';

/**
 * Clear the terminal
 * Enhanced for FULL GEEK MODE - shows branding after clear
 */
export function handleClear(context: CommandContext): string {
  // Clear the visual output
  context.setLines([]);
  // Clear session storage
  context.clearSession();
  
  // POLYCHROMATIC ENHANCEMENT: Re-show branding for immersive experience
  if (context.addLine) {
    // Small delay to make it feel intentional
    setTimeout(() => {
      context.addLine('system', '[h1]TERMINAL CLEARED[/h1]');
      context.addLine('system', '[b]Polychromatic GEEK MODE[/b] active.');
    }, 100);
  }
  
  return '[exit 0]';
}
