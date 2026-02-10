import { create } from 'zustand';
import { 
  trackJarvisMessage, 
  trackTerminalCommand, 
  trackRecommendation,
  trackUserInteraction,
  TerminalCommandAnalytics
} from '../lib/supabase';
import { getOrCreateUserId } from '../lib/userIdentity';
import { UserProfile } from '../lib/intelligence/types';

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
  email: string;
  goal: string;
  history: string[];
  isTerminalOnly: boolean;
  isUnlocked: boolean;
  secretTreatFound: boolean;
  isVaultOpen: boolean;
  geekEffects: GeekModeEffects;
  userProfile: UserProfile;
  // Analytics - Jarvis conversations
  jarvisConversations: ConversationSession[];
  currentSessionId: string | null;
  
  // Actions
  setMode: (mode: 'STANDARD' | 'GEEK') => void;
  setUserProfile: (profile: Partial<UserProfile>) => void;
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
  // Analytics actions
  startJarvisSession: () => string;
  endJarvisSession: () => void;
  addJarvisMessage: (role: 'user' | 'jarvis', content: string) => void;
  trackTerminalCommand: (command: string, type: TerminalCommandAnalytics['command_type'], response?: string, responseType?: TerminalCommandAnalytics['response_type']) => void;
  trackRecommendationAction: (moduleId: string, action: 'view' | 'click', matchScore?: number) => void;
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

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
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
  userProfile: {
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    persona: 'developer',
    expertiseLevel: 'intermediate',
    interests: [],
    learningGoals: [],
    completedModules: [],
  },
  jarvisConversations: [],
  currentSessionId: null,

  setMode: (mode) => {
    set({
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
    });
    
    const userId = getOrCreateUserId();
    const { currentSessionId } = get();
    trackUserInteraction({
      user_id: userId,
      session_id: currentSessionId || 'session-init',
      event_type: 'geek_mode_toggle',
      event_data: { mode },
      page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
      session_duration_ms: 0,
      time_on_page_ms: 0,
    }).catch(err => console.error('[Analytics] Failed to track mode switch:', err));
  },

  setUserProfile: (profile) => set((state) => ({
    userProfile: { ...state.userProfile, ...profile }
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
  
  setStep: (step) => {
    set({ step });
    const userId = getOrCreateUserId();
    const { currentSessionId } = get();
    trackUserInteraction({
      user_id: userId,
      session_id: currentSessionId || 'onboarding',
      event_type: 'page_view', // Using page_view for step transitions
      event_data: { step },
      page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
      session_duration_ms: 0,
      time_on_page_ms: 0,
    }).catch(err => console.error('[Analytics] Failed to track step transition:', err));
  },

  setPersona: (persona) => {
    set({ persona });
    const userId = getOrCreateUserId();
    const { currentSessionId } = get();
    trackUserInteraction({
      user_id: userId,
      session_id: currentSessionId || 'persona-switch',
      event_type: 'pill_select',
      event_data: { persona },
      page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
      session_duration_ms: 0,
      time_on_page_ms: 0,
    }).catch(err => console.error('[Analytics] Failed to track persona switch:', err));
  },
  setEmail: (email) => set({ email }),
  setGoal: (goal) => set({ goal }),
  addHistory: (line) => set((state) => ({ history: [...state.history, line].slice(-100) })),
  toggleTerminalOnly: () => set((state) => ({ isTerminalOnly: !state.isTerminalOnly })),
  unlock: () => {
    set({ isUnlocked: true });
    const userId = getOrCreateUserId();
    const { currentSessionId } = get();
    trackUserInteraction({
      user_id: userId,
      session_id: currentSessionId || 'unlock',
      event_type: 'form_submit',
      event_data: { action: 'unlock' },
      page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
      session_duration_ms: 0,
      time_on_page_ms: 0,
    }).catch(err => console.error('[Analytics] Failed to track unlock:', err));
  },
  setSecretTreatFound: (found) => set({ secretTreatFound: found }),
  setVaultOpen: (open) => {
    set({ isVaultOpen: open });
    const userId = getOrCreateUserId();
    const { currentSessionId } = get();
    trackUserInteraction({
      user_id: userId,
      session_id: currentSessionId || 'vault',
      event_type: 'vault_open',
      event_data: { open },
      page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
      session_duration_ms: 0,
      time_on_page_ms: 0,
    }).catch(err => console.error('[Analytics] Failed to track vault toggle:', err));
  },
  
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
    const state = get();
    const { currentSessionId, mode, persona, jarvisConversations } = state;
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
    
    // Real Supabase Tracking
    const currentSession = jarvisConversations.find(s => s.id === currentSessionId);
    const userId = getOrCreateUserId();
    
    trackJarvisMessage({
      user_id: userId,
      session_id: currentSessionId,
      message_id: message.id,
      role,
      content,
      content_preview: content.slice(0, 200),
      page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
      persona: persona || 'UNKNOWN',
      geek_mode: mode === 'GEEK',
      message_length: content.length,
      has_code: content.includes('```'),
      has_question: content.includes('?'),
      topics: [],
      sentiment: null,
      session_start_time: currentSession?.startTime.toISOString() || new Date().toISOString(),
      session_duration_seconds: currentSession 
        ? Math.floor((Date.now() - currentSession.startTime.getTime()) / 1000)
        : 0,
      message_index: (currentSession?.messages.length || 0) + 1,
    }).catch(err => console.error('[Analytics] Failed to track Jarvis message:', err));
  },

  trackTerminalCommand: (command, type, response, responseType = 'success') => {
    const { currentSessionId, step, persona, isUnlocked, history } = get();
    const userId = getOrCreateUserId();

    trackTerminalCommand({
      user_id: userId,
      session_id: currentSessionId || 'terminal-direct',
      command_id: Date.now().toString(36),
      command,
      command_type: type,
      onboarding_step: step,
      persona: persona || 'NONE',
      is_unlocked: isUnlocked,
      response_type: responseType,
      response_preview: response ? response.slice(0, 200) : '',
      execution_time_ms: 0,
      is_admin_command: type === 'admin',
      command_sequence: history.length,
      time_since_last_command_ms: 0
    }).catch(err => console.error('[Analytics] Failed to track terminal command:', err));
  },

  trackRecommendationAction: (moduleId, action, matchScore) => {
    const { currentSessionId, persona } = get();
    const userId = getOrCreateUserId();

    trackRecommendation({
      user_id: userId,
      session_id: currentSessionId || 'recommendation-direct',
      module_id: moduleId,
      action,
      match_score: matchScore,
      persona: persona || 'UNKNOWN',
      metadata: {}
    }).catch(err => console.error('[Analytics] Failed to track recommendation:', err));
  },
  
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
    userProfile: {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      persona: 'developer',
      expertiseLevel: 'intermediate',
      interests: [],
      learningGoals: [],
      completedModules: [],
    },
    jarvisConversations: [],
    currentSessionId: null,
  }),
}));
