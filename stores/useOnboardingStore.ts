import { create } from 'zustand';

export type OnboardingStep = 
  | 'boot'
  | 'idle' 
  | 'email_guard' 
  | 'handshake' 
  | 'dynamic_discovery' 
  | 'validation' 
  | 'processing' 
  | 'success' 
  | 'unlocked';

export type Persona = 'PERSONAL' | 'BUSINESS' | null;

// Geek Mode Effects
export interface GeekModeEffects {
  enableMatrixRain: boolean;
  enableGlitchEffects: boolean;
  enableAsciiArt: boolean;
  enableTerminalSounds: boolean;
  showHiddenCommands: boolean;
  enhancedAnimations: boolean;
  scanlineIntensity: number; // 0-100
}

interface OnboardingState {
  mode: 'STANDARD' | 'GEEK';
  step: OnboardingStep;
  persona: Persona;
  email: string;
  goal: string;
  history: string[];
  isTerminalOnly: boolean;
  isUnlocked: boolean;
  secretTreatFound: boolean;
  isVaultOpen: boolean;
  geekEffects: GeekModeEffects;
  
  // Actions
  setMode: (mode: 'STANDARD' | 'GEEK') => void;
  toggleGeekEffect: (effect: keyof GeekModeEffects) => void;
  setGeekEffect: (effect: keyof GeekModeEffects, value: boolean | number) => void;
  setStep: (step: OnboardingStep) => void;
  setPersona: (persona: Persona) => void;
  setEmail: (email: string) => void;
  setGoal: (goal: string) => void;
  addHistory: (line: string) => void;
  toggleTerminalOnly: () => void;
  unlock: () => void;
  setSecretTreatFound: (found: boolean) => void;
  setVaultOpen: (open: boolean) => void;
  reset: () => void;
}

const defaultGeekEffects: GeekModeEffects = {
  enableMatrixRain: false,
  enableGlitchEffects: false,
  enableAsciiArt: false,
  enableTerminalSounds: false,
  showHiddenCommands: false,
  enhancedAnimations: false,
  scanlineIntensity: 0,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  mode: 'STANDARD',
  step: 'boot',
  persona: null,
  email: '',
  goal: '',
  history: [],
  isTerminalOnly: false,
  isUnlocked: false,
  secretTreatFound: false,
  isVaultOpen: false,
  geekEffects: { ...defaultGeekEffects },

  setMode: (mode) => set(() => ({
    mode,
    // Auto-enable geek effects when switching to GEEK mode
    geekEffects: mode === 'GEEK' ? {
      enableMatrixRain: true,
      enableGlitchEffects: true,
      enableAsciiArt: true,
      enableTerminalSounds: true,
      showHiddenCommands: true,
      enhancedAnimations: true,
      scanlineIntensity: 30,
    } : { ...defaultGeekEffects }
  })),
  
  toggleGeekEffect: (effect) => set((state) => ({
    geekEffects: {
      ...state.geekEffects,
      [effect]: !state.geekEffects[effect],
    }
  })),
  
  setGeekEffect: (effect, value) => set((state) => ({
    geekEffects: {
      ...state.geekEffects,
      [effect]: value,
    }
  })),
  
  setStep: (step) => set({ step }),
  setPersona: (persona) => set({ persona }),
  setEmail: (email) => set({ email }),
  setGoal: (goal) => set({ goal }),
  addHistory: (line) => set((state) => ({ history: [...state.history, line].slice(-100) })),
  toggleTerminalOnly: () => set((state) => ({ isTerminalOnly: !state.isTerminalOnly })),
  unlock: () => set({ isUnlocked: true }),
  setSecretTreatFound: (found) => set({ secretTreatFound: found }),
  setVaultOpen: (open) => set({ isVaultOpen: open }),
  reset: () => set({
    mode: 'STANDARD',
    step: 'boot',
    persona: null,
    email: '',
    goal: '',
    history: [],
    isTerminalOnly: false,
    isUnlocked: false,
    secretTreatFound: false,
    isVaultOpen: false,
    geekEffects: { ...defaultGeekEffects },
  }),
}));
