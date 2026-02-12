import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OnboardingStep = 
  | 'boot'
  | 'idle' 
  | 'email_guard' 
  | 'onboarding_name'
  | 'onboarding_phone'
  | 'handshake' 
  | 'dynamic_discovery' 
  | 'validation' 
  | 'processing' 
  | 'success' 
  | 'unlocked';

export type Persona = 'PERSONAL' | 'BUSINESS' | null;

export type Trajectory = 'BLUE' | 'RED' | null;

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

// Conversation analytics for Jarvis
export interface ConversationMessage {
  id: string;
  role: 'user' | 'jarvis';
  content: string;
  timestamp: Date;
  sessionId: string;
}

export interface ConversationSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  messages: ConversationMessage[];
  topics: string[];
  satisfaction?: number;
}

interface OnboardingState {
  mode: 'STANDARD' | 'GEEK';
  step: OnboardingStep;
  persona: Persona;
  trajectory: Trajectory;
  pillPromptedAt: string | null;
  strictMode: boolean;
  showSuggestions: boolean;
  name: string;
  phone: string;
  discovery: string;
  email: string;
  goal: string;
  history: string[];
  isTerminalOnly: boolean;
  isUnlocked: boolean;
  secretTreatFound: boolean;
  isVaultOpen: boolean;
  geekEffects: GeekModeEffects;
  // Analytics - Jarvis conversations
  jarvisConversations: ConversationSession[];
  currentSessionId: string | null;
  
  // Actions
  setMode: (mode: 'STANDARD' | 'GEEK') => void;
  toggleGeekEffect: (effect: keyof GeekModeEffects) => void;
  setGeekEffect: (effect: keyof GeekModeEffects, value: boolean | number) => void;
  setStep: (step: OnboardingStep) => void;
  setPersona: (persona: Persona) => void;
  setTrajectory: (trajectory: Trajectory) => void;
  setPillPromptedAt: (iso: string | null) => void;
  setStrictMode: (strict: boolean) => void;
  setShowSuggestions: (show: boolean) => void;
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
  setDiscovery: (discovery: string) => void;
  setEmail: (email: string) => void;
  setGoal: (goal: string) => void;
  addHistory: (line: string) => void;
  toggleTerminalOnly: () => void;
  unlock: () => void;
  setSecretTreatFound: (found: boolean) => void;
  setVaultOpen: (open: boolean) => void;
  // Analytics actions
  startJarvisSession: () => void;
  endJarvisSession: () => void;
  addJarvisMessage: (role: 'user' | 'jarvis', content: string) => void;
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

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      mode: 'STANDARD',
      step: 'boot',
      persona: null,
      trajectory: null,
      pillPromptedAt: null,
      strictMode: false,
      showSuggestions: true,
      name: '',
      phone: '',
      discovery: '',
      email: '',
      goal: '',
      history: [],
      isTerminalOnly: false,
      isUnlocked: false,
      secretTreatFound: false,
      isVaultOpen: false,
      geekEffects: { ...defaultGeekEffects },
      jarvisConversations: [],
      currentSessionId: null,

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
      setTrajectory: (trajectory) => set({ trajectory }),
      setPillPromptedAt: (iso) => set({ pillPromptedAt: iso }),
      setStrictMode: (strict) => set({ strictMode: strict }),
      setShowSuggestions: (show) => set({ showSuggestions: show }),
      setName: (name) => set({ name }),
      setPhone: (phone) => set({ phone }),
      setDiscovery: (discovery) => set({ discovery }),
      setEmail: (email) => set({ email }),
      setGoal: (goal) => set({ goal }),
      addHistory: (line) => set((state) => ({ history: [...state.history, line].slice(-100) })),
      toggleTerminalOnly: () => set((state) => ({ isTerminalOnly: !state.isTerminalOnly })),
      unlock: () => set({ isUnlocked: true }),
      setSecretTreatFound: (found) => set({ secretTreatFound: found }),
      setVaultOpen: (open) => set({ isVaultOpen: open }),

      // Jarvis analytics
      startJarvisSession: () => {
        const sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        const newSession: ConversationSession = {
          id: sessionId,
          startTime: new Date(),
          messages: [],
          topics: [],
        };
        set((state) => ({
          currentSessionId: sessionId,
          jarvisConversations: [...state.jarvisConversations, newSession],
        }));
        return sessionId;
      },

      endJarvisSession: () => {
        const { currentSessionId } = get();
        if (!currentSessionId) return;

        set((state) => ({
          currentSessionId: null,
          jarvisConversations: state.jarvisConversations.map(session =>
            session.id === currentSessionId
              ? { ...session, endTime: new Date() }
              : session
          ),
        }));
      },

      addJarvisMessage: (role, content) => {
        const { currentSessionId } = get();
        if (!currentSessionId) return;

        const message: ConversationMessage = {
          id: Date.now().toString(36),
          role,
          content,
          timestamp: new Date(),
          sessionId: currentSessionId,
        };

        set((state) => ({
          jarvisConversations: state.jarvisConversations.map(session =>
            session.id === currentSessionId
              ? { ...session, messages: [...session.messages, message] }
              : session
          ),
        }));

        // TODO: Send to analytics API
        console.log('[Analytics] Jarvis message:', { role, content: content.slice(0, 100) });
      },

      reset: () => set({
        mode: 'STANDARD',
        step: 'boot',
        persona: null,
        trajectory: null,
        pillPromptedAt: null,
        strictMode: false,
        showSuggestions: true,
        name: '',
        phone: '',
        discovery: '',
        email: '',
        goal: '',
        history: [],
        isTerminalOnly: false,
        isUnlocked: false,
        secretTreatFound: false,
        isVaultOpen: false,
        geekEffects: { ...defaultGeekEffects },
        jarvisConversations: [],
        currentSessionId: null,
      }),
    }),
    {
      name: 'apex_onboarding_v1',
      partialize: (state) => ({
        mode: state.mode,
        step: state.step,
        persona: state.persona,
        trajectory: state.trajectory,
        pillPromptedAt: state.pillPromptedAt,
        strictMode: state.strictMode,
        showSuggestions: state.showSuggestions,
        name: state.name,
        phone: state.phone,
        discovery: state.discovery,
        email: state.email,
        goal: state.goal,
        isUnlocked: state.isUnlocked,
        secretTreatFound: state.secretTreatFound,
      }),
    }
  )
);
