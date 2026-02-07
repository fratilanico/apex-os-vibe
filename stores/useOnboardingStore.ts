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
  
  // Actions
  setMode: (mode: 'STANDARD' | 'GEEK') => void;
  setStep: (step: OnboardingStep) => void;
  setPersona: (persona: Persona) => void;
  setEmail: (email: string) => void;
  setGoal: (goal: string) => void;
  addHistory: (line: string) => void;
  toggleTerminalOnly: () => void;
  unlock: () => void;
  setSecretTreatFound: (found: boolean) => void;
  reset: () => void;
}

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

  setMode: (mode) => set({ mode }),
  setStep: (step) => set({ step }),
  setPersona: (persona) => set({ persona }),
  setEmail: (email) => set({ email }),
  setGoal: (goal) => set({ goal }),
  addHistory: (line) => set((state) => ({ history: [...state.history, line].slice(-100) })),
  toggleTerminalOnly: () => set((state) => ({ isTerminalOnly: !state.isTerminalOnly })),
  unlock: () => set({ isUnlocked: true }),
  setSecretTreatFound: (found) => set({ secretTreatFound: found }),
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
  }),
}));
