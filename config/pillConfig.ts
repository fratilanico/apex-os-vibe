// ═══════════════════════════════════════════════════════════════════════════════
// PILL CHOICE CONFIGURATION
// Toggle options on/off and set the active one
// ═══════════════════════════════════════════════════════════════════════════════

import { PillOption } from '../components/PillChoiceSystem';

export interface PillConfig {
  // Which option is currently active
  activeOption: PillOption;
  
  // Enable/disable each option (for A/B testing)
  enabledOptions: Record<PillOption, boolean>;
  
  // Animation settings
  animations: {
    enableGlow: boolean;
    enablePulse: boolean;
    enableScanlines: boolean;
    hoverDelay: number; // ms before showing preview
  };
  
  // Content overrides
  content: {
    title: string;
    subtitle: string;
    footerQuote: string;
    personalLabel: string;
    businessLabel: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION - EDIT THIS TO TOGGLE OPTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const PILL_CONFIG: PillConfig = {
  // ACTIVE OPTION: Choose from: 'matrix' | 'commander' | 'arcade' | 'dashboard' | 'story'
  activeOption: 'matrix',
  
  // Enable/disable for A/B testing
  enabledOptions: {
    matrix: true,      // ✅ The Matrix Glitch - Direct reference, journey preview
    commander: true,   // ✅ Commander vs Solo - Action-oriented, clear differentiation
    arcade: true,      // ✅ Minimalist Arcade - Gamified icons, minimal text
    dashboard: true,   // ✅ Data Dashboard - Metrics, progress bars
    story: true,       // ✅ Story Dialogue - Narrative immersion with JARVIS
  },
  
  // Animation settings
  animations: {
    enableGlow: true,
    enablePulse: true,
    enableScanlines: true,
    hoverDelay: 0, // Show immediately on hover
  },
  
  // Content customizations
  content: {
    title: 'Choose Your Path',
    subtitle: 'Hover to glimpse your journey. Click to commit.',
    footerQuote: '"Remember: all I\'m offering is the truth. Nothing more."',
    personalLabel: 'INDIVIDUAL',
    businessLabel: 'BUSINESS',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// OPTION DESCRIPTIONS - For admin panel / documentation
// ═══════════════════════════════════════════════════════════════════════════════

export const OPTION_DESCRIPTIONS: Record<PillOption, {
  name: string;
  description: string;
  bestFor: string;
  complexity: 'low' | 'medium' | 'high';
}> = {
  matrix: {
    name: 'The Matrix Glitch',
    description: 'Direct Matrix reference with animated journey preview on hover. Features glowing pills with scanline effects and iconic taglines.',
    bestFor: 'Users who appreciate pop culture references and dramatic reveals',
    complexity: 'high',
  },
  commander: {
    name: 'The Commander vs Solo',
    description: 'Clean card-based layout with action-oriented descriptions. Clear differentiation between paths with urgency indicators.',
    bestFor: 'Professional users who want quick, scannable information',
    complexity: 'medium',
  },
  arcade: {
    name: 'The Minimalist Arcade',
    description: 'Gamified retro aesthetic with large emoji icons and minimal text. Arcade-style buttons with hover animations.',
    bestFor: 'Younger audiences and gaming enthusiasts',
    complexity: 'low',
  },
  dashboard: {
    name: 'The Data Dashboard',
    description: 'Metrics-driven preview with animated progress bars showing ROI, scale factor, and readiness scores.',
    bestFor: 'Data-driven decision makers and business professionals',
    complexity: 'medium',
  },
  story: {
    name: 'The Story Dialogue',
    description: 'Narrative immersion featuring JARVIS dialogue. Shows week-by-week journey breakdown on hover.',
    bestFor: 'Users who engage with storytelling and character-driven experiences',
    complexity: 'high',
  },
};

// Helper to get next option (for cycling through)
export const getNextOption = (current: PillOption): PillOption => {
  const options: PillOption[] = ['matrix', 'commander', 'arcade', 'dashboard', 'story'];
  const currentIndex = options.indexOf(current);
  const nextIndex = (currentIndex + 1) % options.length;
  return options[nextIndex] ?? 'matrix';
};

// Helper to get previous option
export const getPrevOption = (current: PillOption): PillOption => {
  const options: PillOption[] = ['matrix', 'commander', 'arcade', 'dashboard', 'story'];
  const currentIndex = options.indexOf(current);
  const prevIndex = (currentIndex - 1 + options.length) % options.length;
  return options[prevIndex] ?? 'matrix';
};

export default PILL_CONFIG;
