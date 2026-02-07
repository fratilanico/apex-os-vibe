/**
 * JARVIS Animations Index
 * 
 * Central export point for all JARVIS animation modules.
 * Provides both React hooks and standalone classes for maximum flexibility.
 * 
 * @example
 * ```tsx
 * // React usage
 * import { useModelSwapAnimation, useHolographicEffects } from '@/jarvis/animations';
 * 
 * // Standalone usage
 * import { ModelSwapAnimation, HolographicEffects } from '@/jarvis/animations';
 * ```
 */

// React Hooks
export { useHolographicEffects } from './HolographicEffects';
export { useTerminalEffects } from './TerminalEffects';
export { useVoiceWaveform } from './VoiceWaveform';
export { useJarvisEntrance } from './JarvisEntrance';

// Standalone Classes
export { ModelSwapAnimation } from './ModelSwapAnimation';
export { HolographicEffects } from './HolographicEffects';
export { TerminalEffects } from './TerminalEffects';
export { VoiceWaveform } from './VoiceWaveform';
export { JarvisEntrance } from './JarvisEntrance';
