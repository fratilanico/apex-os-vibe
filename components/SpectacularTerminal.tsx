import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Bot, ArrowRight, Wifi, Shield
} from 'lucide-react';
import * as CLIFormatter from '../lib/cliFormatter';
import { InlineRenderer } from './ui/Terminal/InlineRenderer';
import { useOnboardingStore } from '../stores/useOnboardingStore';
import { 
  APEX_LOGO_ASCII_LINES,
  PLAYER_ONE_ASCII
} from '../lib/terminal/constants';
import { RotatingCTA } from './ui/Terminal/RotatingCTA';
import { queryAI } from '../lib/ai/globalAIService';
import { PillChoiceSystem } from './PillChoiceSystem';
import { PILL_CONFIG } from '../config/pillConfig';
import { TRAJECTORY_CONFIG } from '../config/trajectoryConfig';
import { getProfile, markPillPrompted, upsertTrajectory, trackEvent } from '../lib/analytics/client';

// ═══════════════════════════════════════════════════════════════════════════════
// SPECTACULAR TERMINAL WAITLIST - STARK-V3 ORCHESTRATOR
// Direct Neural Link | Intent Parsing | Handshake Sequence
// ═══════════════════════════════════════════════════════════════════════════════

// CSS-based chromatic aberration - 3 layer approach (from NeuralPixelBranding)
const chromaticStyle = `
  @keyframes chromatic-cyan {
    0%, 100% { transform: translate(-2px, -1px); opacity: 0.7; }
    25% { transform: translate(2px, 1px); opacity: 0.5; }
    50% { transform: translate(-1px, 0px); opacity: 0.8; }
    75% { transform: translate(1px, -1px); opacity: 0.6; }
  }
  @keyframes chromatic-pink {
    0%, 100% { transform: translate(2px, 1px); opacity: 0.7; }
    25% { transform: translate(-2px, -1px); opacity: 0.5; }
    50% { transform: translate(1px, 0px); opacity: 0.8; }
    75% { transform: translate(-1px, 1px); opacity: 0.6; }
  }
  @keyframes chromatic-main {
    0%, 100% { transform: translate(0px, 0px); opacity: 1; }
    50% { transform: translate(0.5px, -0.5px); opacity: 0.95; }
  }
  .chromatic-cyan {
    animation: chromatic-cyan 0.15s linear infinite;
  }
  .chromatic-pink {
    animation: chromatic-pink 0.12s linear infinite;
  }
  .chromatic-main {
    animation: chromatic-main 0.1s linear infinite;
  }
  @keyframes glitch {
    0%, 100% { transform: translate(0); }
    10% { transform: translate(-2px, 1px); }
    20% { transform: translate(2px, -1px); }
    30% { transform: translate(-1px, -2px); }
    40% { transform: translate(1px, 2px); }
    50% { transform: translate(-2px, -1px); }
    60% { transform: translate(2px, 1px); }
    70% { transform: translate(-1px, 2px); }
    80% { transform: translate(1px, -2px); }
    90% { transform: translate(-2px, 0px); }
  }
  .animate-glitch {
    animation: glitch 0.15s linear infinite;
  }
`;

interface TerminalLine {
  id: string;
  text: string;
  type: 'input' | 'output' | 'error' | 'system' | 'success' | 'jarvis' | 'matrix' | 'choice' | 'ascii' | 'brand-logo';
  className?: string;
}

const COLOR_CYCLE = ['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

const JOKES: Record<string, string> = {
  sudo: "Nice try. You are already root here. This is YOUR terminal. You have full control.",
  'rm -rf': "You cannot delete the future. Module 00 is immutable. Nice try though.",
  matrix: "Wake up, Neo... The Matrix has you... Follow the white rabbit.",
  coffee: "☕ COFFEE.exe loaded successfully. Caffeine levels: OPTIMAL.",
  beer: "🍺 Pouring beer... Relaxation mode activated. Ship tomorrow.",
  '42': "The Answer to the Ultimate Question of Life, the Universe, and Everything is 42.",
};

const BOOT_SEQUENCE = [
  { text: 'Initializing APEX_OS Kernel v6.4.1...', delay: 100, type: 'system' as const },
  { text: 'Loading Neural Interface Protocol...', delay: 400, type: 'system' as const },
  { text: 'Connecting to 17-Agent Swarm...', delay: 700, type: 'matrix' as const },
  { text: 'Establishing Secure Founder Channel...', delay: 1000, type: 'system' as const },
  { text: '[OK] FULL WIRE ENGAGED', delay: 1300, type: 'success' as const },
  { text: '', delay: 1400, type: 'system' as const },
];

const PILL_SEQUENCE = [
  { text: '', type: 'system' as const },
  { text: 'Wake up, Operator.', type: 'jarvis' as const },
  { text: 'Red pill or blue pill comes AFTER handshake. First: secure identity.', type: 'system' as const },
  { text: '', type: 'system' as const },
];

export const SpectacularTerminal: React.FC = () => {
  const { 
    step, setStep, 
    persona, setPersona, 
    trajectory, setTrajectory,
    pillPromptedAt, setPillPromptedAt,
    strictMode, setStrictMode,
    showSuggestions, setShowSuggestions,
    name, setName,
    phone, setPhone,
    discovery,
    email, setEmail,
    goal,
    isUnlocked, unlock,
    setVaultOpen,
    secretTreatFound, setSecretTreatFound,
    addHistory
  } = useOnboardingStore();

  const [bootLine, setBootLine] = useState(0);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [colorIndex, setColorIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [glitchActive, setGlitchActive] = useState(false);
  const [scanActive, setScanActive] = useState(false);
  const [showPillChoice, setShowPillChoice] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cliWrapWidth, setCliWrapWidth] = useState<number>(() => {
    if (typeof window === 'undefined') return 42;
    return window.innerWidth < 640 ? 42 : 96;
  });
  const [lastUserMessage, setLastUserMessage] = useState<string>('');

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logoRenderedRef = useRef(false);
  const pillPromptedRef = useRef(false);
  const pinnedToBottomRef = useRef(true);
  const [hasNewOutput, setHasNewOutput] = useState(false);
  
  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    
    // Inject chromatic CSS for 3-layer logo effect
    if (!document.getElementById('spectacular-chromatic-style')) {
      const style = document.createElement('style');
      style.id = 'spectacular-chromatic-style';
      style.textContent = chromaticStyle;
      document.head.appendChild(style);
    }
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Responsive CLI wrap width
  // - Mobile: force ~42 chars
  // - Tablet/Desktop: fill available width (clamped)
  useEffect(() => {
    const el = terminalRef.current;
    if (!el) return;

    const compute = () => {
      try {
        // Mobile requirement: keep CLI width ~42 for readability.
        if (window.innerWidth < 640) {
          setCliWrapWidth(42);
          return;
        }
        const style = window.getComputedStyle(el);
        const padL = parseFloat(style.paddingLeft || '0') || 0;
        const padR = parseFloat(style.paddingRight || '0') || 0;
        const innerWidthPx = Math.max(0, el.clientWidth - padL - padR);
        if (innerWidthPx <= 0) return;

        const fontWeight = style.fontWeight || '400';
        const fontSize = style.fontSize || '14px';
        const fontFamily = style.fontFamily || 'monospace';
        const font = `${fontWeight} ${fontSize} ${fontFamily}`;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.font = font;

        const sample = 'M'.repeat(80);
        const sampleWidth = ctx.measureText(sample).width;
        const charWidth = sampleWidth / 80;
        if (!charWidth || !Number.isFinite(charWidth)) return;

        const cols = Math.floor(innerWidthPx / charWidth);
        const maxCols = Math.max(80, Math.min(140, cols));
        const clamped = Math.max(42, Math.min(maxCols, cols));
        setCliWrapWidth(clamped);
      } catch {
        // Keep default width.
      }
    };

    compute();
    // ResizeObserver keeps wrap width synced with responsive layout
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const RO: any = (window as any).ResizeObserver;
    if (!RO) return;
    const ro = new RO(() => compute());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const getDynamicSuggestions = useCallback((): string[] => {
    const tId = trajectory === 'RED' ? 'RED' : 'BLUE';
    const base = TRAJECTORY_CONFIG[tId].defaultPrompts;
    const t = (lastUserMessage || '').trim().toLowerCase();
    if (!t) return base;

    // If user explicitly says "build mvp" (or similar), stop interrogating.
    if (/\bmvp\b|build\s+mvp|ship\s+mvp|prototype/.test(t)) {
      return [
        'Give me 3 MVP definitions for my idea and pick the fastest one.',
        'Assume no clarity. Infer the likely product and propose the smallest measurable outcome in 10 days.',
        'Turn "build mvp" into a concrete scope: 3 user stories + success metrics + deployment checklist.',
      ];
    }

    if (/module\s*0|module\s*00|the\s+shift/.test(t)) {
      return [
        'Explain Module 00 in one mental model + one practical exercise.',
        'Give me a 15-minute drill to adopt the orchestrator mindset today.',
        'What is the biggest mistake people make with AI coding?'
      ];
    }

    return base;
  }, [trajectory, lastUserMessage]);
  
  // Always use full ASCII - scaling handles mobile
  const playerOneLogo = PLAYER_ONE_ASCII;

  const addTerminalLine = useCallback((
    text: string,
    type: TerminalLine['type'] = 'output',
    className?: string,
    recordHistory: boolean = true,
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setLines(prev => [...prev, { id, text, type, className }].slice(-200));
    if (recordHistory) addHistory(`[${type.toUpperCase()}] ${text}`);
  }, [addHistory]);

  const addAsciiArt = useCallback((art: string, className: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setLines(prev => [...prev, { id, text: art, type: 'ascii' as const, className }].slice(-200));
    addHistory(`[ASCII] art_block`);
  }, [addHistory]);

  // Add multi-color ASCII art (Gemini-style gradient)
  const addMultiColorAsciiArt = useCallback((lines: Array<{text: string, color: string}>, baseClassName: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    // Store the structured line data with colors
    setLines(prev => [...prev, { 
      id, 
      text: JSON.stringify(lines), // Store as JSON to preserve colors
      type: 'brand-logo' as const, 
      className: baseClassName 
    }].slice(-200));
    addHistory(`[ASCII] multi_color_art_block`);
  }, [addHistory]);

  // Welcome back effect for returning users
  useEffect(() => {
    if (isUnlocked && lines.length === 0 && !logoRenderedRef.current) {
      logoRenderedRef.current = true;
      addMultiColorAsciiArt(
        APEX_LOGO_ASCII_LINES,
        `leading-none ${isMobile ? 'text-[6px]' : 'text-[12px]'} drop-shadow-[0_0_12px_rgba(139,92,246,0.5)]`
      );
      addTerminalLine(`[SYSTEM] Identity verified: ${name || 'Player 1'}`, 'success');
      addTerminalLine('━━━━━━━━━ NEURAL LINK RESTORED ━━━━━━━━━', 'success');
      addTerminalLine('', 'system');
      addTerminalLine('JARVIS: Welcome back, Founder. All systems operational.', 'jarvis');
      addTerminalLine('What are we building today? Type `help` for commands.', 'jarvis');
    }
  }, [isUnlocked, lines.length, name, addTerminalLine, addMultiColorAsciiArt, isMobile]);

  // Boot Sequence
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'boot' || step === 'idle') {
      // Render APEX logo immediately on first tick (multi-color Gemini style)
      // Use ref to prevent duplicate rendering
      if (bootLine === 0 && !logoRenderedRef.current) {
        logoRenderedRef.current = true;
        addMultiColorAsciiArt(
          APEX_LOGO_ASCII_LINES,
          `leading-none ${isMobile ? 'text-[6px]' : 'text-[12px]'} drop-shadow-[0_0_12px_rgba(139,92,246,0.5)]`
        );
      }
      if (bootLine < BOOT_SEQUENCE.length) {
        const line = BOOT_SEQUENCE[bootLine]!;
        timer = setTimeout(() => {
          addTerminalLine(line.text, line.type);
          setBootLine(p => p + 1);
          if (bootLine === BOOT_SEQUENCE.length - 1) {
            addTerminalLine('Traditional forms are for the legacy world. Switching to Direct Neural Uplink...', 'jarvis');
            PILL_SEQUENCE.forEach((l) => addTerminalLine(l.text, l.type));
            addTerminalLine('# 01 Provide your primary email for secure handshake:', 'system');
            setStep('email_guard');
          }
        }, line.delay);
      }
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [bootLine, step, addTerminalLine, addAsciiArt, addMultiColorAsciiArt, setStep, isMobile]);

  // Recovery: if persisted step is from an old/long flow, keep users moving.
  useEffect(() => {
    if (step === 'handshake' || step === 'dynamic_discovery' || step === 'validation') {
      if (isUnlocked) {
        setStep('unlocked');
      } else {
        setStep('email_guard');
      }
    }
  }, [step, isUnlocked, setStep]);

  // After handshake, show pill choice ONCE per user (DB-backed when available).
  useEffect(() => {
    if (!isUnlocked) return;
    if (pillPromptedRef.current) return;
    pillPromptedRef.current = true;

    const run = async () => {
      // If already chosen locally, do not re-prompt.
      if (trajectory) {
        setShowPillChoice(false);
        return;
      }

      // If we've already shown the pill UI once on this device, don't auto-show again.
      if (pillPromptedAt) {
        setShowPillChoice(false);
        return;
      }

      try {
        const profile = await getProfile({ email });
        if (profile.trajectory === 'BLUE' || profile.trajectory === 'RED') {
          setTrajectory(profile.trajectory);
          setPersona(profile.trajectory === 'BLUE' ? 'PERSONAL' : 'BUSINESS');
          setShowPillChoice(false);
          return;
        }

        if (profile.trajectoryPromptedAt) {
          setPillPromptedAt(profile.trajectoryPromptedAt);
          setShowPillChoice(false);
          return;
        }
      } catch {
        // Supabase not configured or profile lookup failed — allow local-only experience.
      }

      const nowIso = new Date().toISOString();
      setPillPromptedAt(nowIso);
      void markPillPrompted({ email }).catch(() => undefined);
      setShowPillChoice(true);
    };

    void run();
  }, [isUnlocked, trajectory, pillPromptedAt, email, setPersona, setTrajectory, setPillPromptedAt]);

  // Color Cycle
  useEffect(() => {
    const interval = setInterval(() => setColorIndex(p => (p + 1) % COLOR_CYCLE.length), 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  const handleOutputScroll = useCallback(() => {
    const el = terminalRef.current;
    if (!el) return;
    const thresholdPx = 96;
    const distanceFromBottom = el.scrollHeight - (el.scrollTop + el.clientHeight);
    const nearBottom = distanceFromBottom <= thresholdPx;
    pinnedToBottomRef.current = nearBottom;
    if (nearBottom) setHasNewOutput(false);
  }, []);

  useEffect(() => {
    const el = terminalRef.current;
    if (!el) return;
    if (pinnedToBottomRef.current) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    } else {
      setHasNewOutput(true);
    }
  }, [lines, showPillChoice]);

  const validateEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

  const performHandshake = useCallback(async (data: any) => {
    setStep('processing');
    setIsProcessing(true);
    addTerminalLine('ESTABLISHING SECURE HANDSHAKE...', 'matrix');
    
    try {
      const res = await fetch('/api/waitlist/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...data,
          persona: data.persona || 'PERSONAL', // Ensure persona is included
          notes: data.discovery,
          mode: 'GEEK_V3', 
          version: '3.0_STARK',
          consent: true // Implied consent in GEEK mode
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Handshake failed');

      // ═══════════════════════════════════════════════════════════
      // LEVEL UP SEQUENCE — 5 PHASES (per FULL_WIRE_ARCHITECTURE)
      // Phase 1: GLITCH EFFECT (0.5s)
      // Phase 2: BIOMETRIC SCAN (2s)
      // Phase 3: TYPING ANIMATION (1s)
      // Phase 4: AURA MORPH (0.5s)
      // Phase 5: WIDGET REVEAL (staggered)
      // ═══════════════════════════════════════════════════════════
      const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

      // — PHASE 1: GLITCH EFFECT —
      setGlitchActive(true);
      addTerminalLine('▓▓▓ PHASE 1: CHROMATIC ABERRATION ▓▓▓', 'matrix');
      await wait(500);
      setGlitchActive(false);

      // — PHASE 2: BIOMETRIC SCAN —
      setScanActive(true);
      addTerminalLine('SCANNING... BIOMETRIC VALIDATION IN PROGRESS', 'matrix');
      await wait(800);
      addTerminalLine('[████████░░░░░░░░░░░░] 40%', 'system');
      await wait(600);
      addTerminalLine('[████████████████░░░░] 80%', 'system');
      await wait(400);
      addTerminalLine('[████████████████████] 100%', 'success');
      await wait(300);
      addTerminalLine('✓ BIOMETRIC_MATCH_CONFIRMED', 'success');
      setScanActive(false);
      await wait(200);

      // — PHASE 3: TYPING ANIMATION — Character-by-char reveal
      addTerminalLine('ESTABLISHING SECURE HANDSHAKE...', 'matrix');
      await wait(400);
      addAsciiArt(playerOneLogo, `text-emerald-400 leading-none ${isMobile ? 'text-[4.5px]' : 'text-[12px]'} drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]`);
      await wait(300);

      // Type out ". . . PLAYER 1 - CONNECTED" character by character
      const connectMsg = '. . . PLAYER 1 - CONNECTED';
      for (let i = 1; i <= connectMsg.length; i++) {
        // Update last line with progressive reveal
        setLines(prev => {
          const withoutLast = prev.filter(l => l.id !== '__typing__');
          return [...withoutLast, { id: '__typing__', text: connectMsg.slice(0, i) + '█', type: 'success' as const }];
        });
        await wait(35);
      }
      // Final version without cursor
      setLines(prev => {
        const withoutTyping = prev.filter(l => l.id !== '__typing__');
        return [...withoutTyping, { id: '__typed__', text: connectMsg, type: 'success' as const }];
      });
      await wait(200);

      // — PHASE 4: AURA MORPH — Persona-specific color shift
      const personaLabel = data.persona === 'BUSINESS' ? 'BUSINESS_ARCHITECT' : 'PERSONAL_BUILDER';
      const auraColor = data.persona === 'BUSINESS' ? 'VIOLET (#8b5cf6)' : 'CYAN (#06b6d4)';
      addTerminalLine(`AURA MORPH: ${personaLabel} → ${auraColor}`, 'matrix');
      await wait(500);

      // — PHASE 5: WIDGET REVEAL — Staggered persona stats
      addTerminalLine('', 'system');
      addTerminalLine('━━━━━━━━━ NEURAL LINK ESTABLISHED ━━━━━━━━━', 'success');
      await wait(200);
      addTerminalLine(`✓ AI READINESS SCORE: ${result.ai_score}/100`, 'success');
      await wait(200);
      addTerminalLine(`✓ QUEUE RANK: #${result.rank}`, 'success');
      await wait(200);
      addTerminalLine(`✓ REFERRAL CODE: ${result.referral_code}`, 'success');
      await wait(200);
      addTerminalLine(`✓ STATUS: ${result.status?.toUpperCase() || 'ACTIVE'}`, 'success');
      await wait(300);

      addTerminalLine('', 'system');
      addTerminalLine('┌─── CORE MODULES (SAME FOR ALL) ─────────┐', 'matrix');
      addTerminalLine('│ ⚡ Module 00: The Shift     — UNLOCKED  │', 'matrix');
      addTerminalLine('│ ⚡ Module 01: Environment   — UNLOCKED  │', 'matrix');
      addTerminalLine('│ 🔒 Module 02: Specifying   — LOCKED    │', 'matrix');
      addTerminalLine('│ 🔒 Module 03: Orchestration— LOCKED    │', 'matrix');
      addTerminalLine('│ 🔒 Module 04: Synthesis    — LOCKED    │', 'matrix');
      addTerminalLine('│ 🔒 Module 05: Practicum    — LOCKED    │', 'matrix');
      addTerminalLine('└────────────────────────────────────────┘', 'matrix');
      await wait(400);

      addTerminalLine('', 'system');
      addTerminalLine(`You're in the swarm now, ${data.name || 'Player One'}. Standard protocols are offline.`, 'jarvis');
      addTerminalLine('I\'m all yours. What are we building today?', 'jarvis');
      addTerminalLine('Tip: Ask about Module 00: The Shift or type "help" for intel.', 'system');

      void trackEvent({ email, eventType: 'handshake_success', payload: { persona: data.persona || null } })
        .catch(() => undefined);

      unlock();
      setStep('unlocked');
    } catch (e: any) {
      addTerminalLine(`Transmission failed: ${e.message}. Retry submission?`, 'error');
      setStep('validation');
    } finally {
      setIsProcessing(false);
    }
  }, [addTerminalLine, addAsciiArt, setStep, unlock, playerOneLogo, isMobile]);

  const handlePillChoice = useCallback((choice: 'personal' | 'business') => {
    const next = choice === 'personal' ? 'BLUE' : 'RED';
    setTrajectory(next);
    setPersona(next === 'BLUE' ? 'PERSONAL' : 'BUSINESS');
    setShowPillChoice(false);

    addTerminalLine(
      next === 'BLUE'
        ? '✓ BLUE PILL selected. Builder-to-Founder lens engaged.'
        : '✓ RED PILL selected. Operator-to-Founder lens engaged.',
      'success'
    );

    // Persist choice (best-effort). If Supabase is missing, local store still keeps it.
    void upsertTrajectory({ email, trajectory: next })
      .catch(() => undefined);
    void trackEvent({ email, eventType: 'trajectory_selected', payload: { trajectory: next } })
      .catch(() => undefined);
  }, [addTerminalLine, email, setPersona, setTrajectory]);

  const formatProviderDebugLine = (
    requested: string,
    used: string,
    model: string,
    latency: number,
    requestId?: string,
  ) => {
    return `[muted]debug requestId=${requestId || 'n/a'} requested=${requested} used=${used} model=${model} latency=${latency}ms[/muted]`;
  };

  const looksLikeTokenDump = (input: string): boolean => {
    const t = (input || '').trim();
    if (t.length < 80) return false;

    // Numeric / hyphen blobs (often accidental paste of IDs, traces, or internal tokens)
    if (/^[0-9-]+$/.test(t) && t.replace(/-/g, '').length >= 80) return true;

    // High entropy / mostly non-words (base64/hex-ish)
    const compact = t.replace(/\s+/g, '');
    if (compact.length >= 120 && /^[A-Za-z0-9+/_=-]+$/.test(compact)) return true;
    if (compact.length >= 96 && /^[a-f0-9]+$/i.test(compact)) return true;

    // Very low letter ratio
    const letters = (t.match(/[A-Za-z]/g) || []).length;
    if (t.length >= 120 && letters / t.length < 0.05) return true;

    return false;
  };

  const looksLikeRigidGoalGate = (text: string): boolean => {
    const lower = text.toLowerCase();
    return (
      (lower.includes('terminate') || lower.includes('session') || lower.includes('invalid')) &&
      (lower.includes('sorry') || lower.includes('cannot') || lower.includes('unable'))
    );
  };

  const handleChat = async (msg: string) => {
    setIsProcessing(true);
    try {
      // Build rolling history from recent terminal lines (strategy A - no store changes)
      const recentLines = lines.slice(-20); // Last 20 lines for context
      const history: { role: 'user' | 'assistant'; content: string }[] = [];
      
        for (const line of recentLines) {
          if (line.type === 'input') {
            // Strip the "> " prefix from input lines
            const content = line.text.replace(/^>\s*/, '');
            if (content && content !== msg && !looksLikeTokenDump(content)) { // Don't include current message
              history.push({ role: 'user', content });
            }
          } else if (line.type === 'output' || line.type === 'jarvis') {
            // Only include substantial responses (not empty lines)
            if (line.text && line.text.length > 10) {
              history.push({ role: 'assistant', content: line.text });
            }
          }
        }
      
      // Keep only last 8-10 conversational turns to stay within token limits
      const trimmedHistory = history.slice(-10);
      
      // Parser-compatible context with Mode and pathname
      const mode = persona === 'PERSONAL' ? 'GEEK' : 'STANDARD';
      const stateHints = [
        email ? `Email: ${email}` : undefined,
        name ? `Name: ${name}` : undefined,
        phone ? `Phone: ${phone}` : undefined,
        persona ? `Persona: ${persona}` : undefined,
        discovery ? `Discovery: ${discovery}` : undefined,
        goal ? `Goal: ${goal}` : undefined,
        `Unlocked: ${isUnlocked ? 'true' : 'false'}`,
        `Step: ${step}`,
        `StrictMode: ${strictMode ? 'on' : 'off'}`,
      ].filter(Boolean).join(' | ');

      const context = `The user is on the "/waitlist" page. Mode: ${mode}. Sync Level: ${isUnlocked ? 'TIER 1' : 'TIER 0'}. User persona: ${persona || 'undetermined'}. Trajectory: ${trajectory || 'unset'}. StrictMode: ${strictMode ? 'on' : 'off'}. Access granted to Module 00/01. System: Stark-V3. StateHints: ${stateHints}`;

      const systemPrompt = [
        'You are JARVIS for APEX OS. You are helpful, fast, and non-rigid.',
        'Never threaten termination, reassignment, penalties, or "lower-priority queues".',
        'Infer intent from context and the user message. If unclear, ask at most ONE clarifying question.',
        'If the user says "build mvp" or provides a vague request, propose 3 concrete MVP targets with measurable outcomes and pick a recommended default.',
        'Do not force the user into a long onboarding questionnaire. They are already unlocked.',
        'Keep answers actionable: bullets, next steps, and one optional clarifier.',
        `StrictMode: ${strictMode ? 'ON (ask for precise target)' : 'OFF (infer + propose options)'}`,
      ].join('\n');
      
      // Use queryAI for resilience (timeouts, error handling, fallback)
      const requestedProvider = 'auto';
      const response = await queryAI({
        message: msg,
        userEmail: email,
        context,
        history: trimmedHistory,
        systemPrompt,
        preferredProvider: requestedProvider,
      });

      void trackEvent({
        email,
        eventType: 'terminal_prompt_submitted',
        payload: { text: msg, trajectory: trajectory ?? null },
      }).catch(() => undefined);
      
      const content = response?.content || 'Intelligence unreachable.';
      
      // Auto-end session logic
      if (looksLikeRigidGoalGate(content)) {
        addTerminalLine('SYSTEM: Optimization detected. Bypassing rigid protocol...', 'matrix');
      }

      const formatted = CLIFormatter.convertMarkdownToCLI(content, { width: cliWrapWidth });
       formatted.split('\n').forEach(l => addTerminalLine(l, 'output'));
      addTerminalLine(
        formatProviderDebugLine(
          requestedProvider,
          response?.provider || 'offline',
          response?.model || 'unknown',
          response?.latency || 0,
          response?.requestId,
        ),
        'system'
      );
      if (response?.debug?.attempts?.length) {
        const chain = response.debug.attempts
          .map((a) => `${a.provider}:${a.success ? 'ok' : a.error || 'fail'}`)
          .join(' -> ');
        addTerminalLine(`[muted]debug chain ${chain}[/muted]`, 'system');
      }
    } catch (e) {
      addTerminalLine('Neural link lost. Try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCommand = async (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();

    setLastUserMessage(trimmed);

    // Strictness toggle (default: helpful mode)
    if (lower === 'strict on' || lower === 'strict: on') {
      addTerminalLine(`> ${trimmed}`, 'input');
      setStrictMode(true);
      addTerminalLine('Strict mode enabled. I will ask for precise targets when missing.', 'system');
      setInputValue('');
      return;
    }
    if (lower === 'strict off' || lower === 'strict: off') {
      addTerminalLine(`> ${trimmed}`, 'input');
      setStrictMode(false);
      addTerminalLine('Strict mode disabled. I will infer intent and keep you moving.', 'system');
      setInputValue('');
      return;
    }

    // Guard: prevent accidental pasting of token/trace dumps into the public terminal.
    if (looksLikeTokenDump(trimmed)) {
      addTerminalLine('> [input redacted: looks like token/id dump]', 'input', undefined, false);
      addTerminalLine('Input rejected. Paste your actual goal/question (human text).', 'error');
      setInputValue('');
      return;
    }

    if (JOKES[lower]) {
      addTerminalLine(`> ${trimmed}`, 'input');
      setInputValue('');
      addTerminalLine(JOKES[lower]!, 'matrix');
      return;
    }

    if (lower === 'clear') {
      addTerminalLine(`> ${trimmed}`, 'input');
      setInputValue('');
      setLines([]);
      return;
    }

    addTerminalLine(`> ${trimmed}`, 'input');
    setInputValue('');

    if (step === 'email_guard') {
      if (!validateEmail(trimmed)) {
        addTerminalLine('Sir, that is not an email. This is an orchestrator interface, not a playground. Try again.', 'error');
        return;
      }
      setEmail(trimmed);
      addTerminalLine('✓ Handshake confirmed.', 'success');
      addTerminalLine('', 'system');
      addTerminalLine('Identify yourself, Founder. I don\'t talk to ghosts. Enter your full name:', 'jarvis');
      setStep('onboarding_name');
      return;
    }

    if (step === 'onboarding_name') {
      setName(trimmed);
      setFormData((p: any) => ({ ...p, name: trimmed }));
      addTerminalLine(`✓ Identity logged: ${trimmed}`, 'success');
      addTerminalLine('', 'system');
      addTerminalLine('Provide a direct line for secure comms. Enter your phone number:', 'jarvis');
      setStep('onboarding_phone');
      return;
    }

    if (step === 'onboarding_phone') {
      setPhone(trimmed);
      setFormData((p: any) => ({ ...p, phone: trimmed }));
      addTerminalLine(`✓ Signal channel set.`, 'success');
      addTerminalLine('', 'system');
      addTerminalLine('All right. Establishing secure handshake now...', 'jarvis');
      const inferredPersona = persona || 'PERSONAL';
      void performHandshake({
        ...formData,
        name,
        phone: trimmed,
        email,
        persona: inferredPersona,
      });
      return;
    }

    if (step === 'unlocked') {
      if (lower === 'suggestions off' || lower === 'tips off') {
        setShowSuggestions(false);
        addTerminalLine('Suggestions disabled. Type `suggestions on` to re-enable.', 'system');
        return;
      }
      if (lower === 'suggestions on' || lower === 'tips on') {
        setShowSuggestions(true);
        addTerminalLine('Suggestions enabled.', 'system');
        return;
      }

      // Pill selection works any time after unlock (non-blocking)
      if (lower === '1' || lower.includes('blue pill') || lower === 'blue') {
        setTrajectory('BLUE');
        setPersona('PERSONAL');
        setShowPillChoice(false);
        addTerminalLine('✓ BLUE PILL selected. Builder-to-Founder lens engaged.', 'success');
        return;
      }
      if (lower === '2' || lower.includes('red pill') || lower === 'red') {
        setTrajectory('RED');
        setPersona('BUSINESS');
        setShowPillChoice(false);
        addTerminalLine('✓ RED PILL selected. Operator-to-Founder lens engaged.', 'success');
        return;
      }

      // GREUCEANU PROTOCOL - The Vault
      if (lower === 'greuceanu') {
        addTerminalLine('SECRET PROTOCOL: GREUCEANU ACTIVATED', 'matrix');
        addTerminalLine('Accessing Private Resource Vault...', 'jarvis');
        addTerminalLine('UNLOCKED: Direct Signal Channel & Founder Bible.', 'success');
        setSecretTreatFound(true);
        setVaultOpen(true);
        return;
      }

      // FINANCIAL QUANT ENGINE - Pitch Deck Mode Only (Restricted)
      // These commands are for SEED meeting demos and investor presentations
      const isPitchDeckContext = window.location.pathname.includes('showmethemoney') || 
                                  window.location.pathname.includes('pitch') ||
                                  window.location.pathname.includes('investor');
      
      if (isPitchDeckContext) {
        if (lower === 'mrr' || lower === 'financials') {
          addTerminalLine('[FINANCIALS] MRR Projections (Month 1-12)', 'success');
          addTerminalLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
          addTerminalLine('Month 1:  $10,000  [INIT]', 'system');
          addTerminalLine('Month 3:  $45,000  [GROWTH]', 'system');
          addTerminalLine('Month 6:  $185,000 [SCALE]', 'system');
          addTerminalLine('Month 12: $847,000 [DOMINANCE]', 'system');
          addTerminalLine('', 'system');
          addTerminalLine('Blended ARPU: $165 | Target CAC: <$20', 'system');
          addTerminalLine('LTV:CAC Ratio: 9.8:1 ✓', 'success');
          return;
        }

        if (lower === 'ltv') {
          addTerminalLine('[UNIT ECONOMICS] LTV:CAC Analysis', 'success');
          addTerminalLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
          addTerminalLine('Customer Lifetime Value:  $196', 'system');
          addTerminalLine('Customer Acquisition Cost: $20', 'system');
          addTerminalLine('LTV:CAC Ratio:            9.8:1', 'success');
          addTerminalLine('', 'system');
          addTerminalLine('Industry Benchmark: 3:1 (We are 3.3x better)', 'success');
          return;
        }

        if (lower === 'valuation') {
          addTerminalLine('[VALUATION] Berkus Method Rationale', 'success');
          addTerminalLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
          addTerminalLine('Sound Idea:          $500k', 'system');
          addTerminalLine('Prototype:           $500k', 'system');
          addTerminalLine('Quality Management:  $500k', 'system');
          addTerminalLine('Strategic Relations: $500k', 'system');
          addTerminalLine('Product Rollout:     $500k', 'system');
          addTerminalLine('', 'system');
          addTerminalLine('Reverse-Engineered Valuation: $2.5M - $5M Post-Seed', 'success');
          return;
        }
      }

      if (lower === 'help') {
        addTerminalLine('[SYSTEM] Available Commands:', 'system');
        addTerminalLine('  clear  - Clear screen', 'system');
        addTerminalLine('  status - Check sync status', 'system');
        addTerminalLine('  jarvis - Direct AI link', 'system');
        addTerminalLine('  about  - APEX OS mission', 'system');
        if (!secretTreatFound) {
          addTerminalLine('  ???    - Hidden protocol detected', 'matrix');
        }
        if (isPitchDeckContext) {
          addTerminalLine('', 'system');
          addTerminalLine('[PITCH DECK MODE]', 'success');
          addTerminalLine('  mrr        - Revenue projections', 'system');
          addTerminalLine('  ltv        - Unit economics', 'system');
          addTerminalLine('  valuation  - Berkus method', 'system');
        }
        return;
      }

      if (lower === 'pill') {
        setShowPillChoice(true);
        addTerminalLine('PILL UI reopened. Choose BLUE or RED (or ignore and keep typing).', 'system');
        return;
      }

      if (lower === 'status') {
        addTerminalLine('[SYSTEM] 17 Agents Synchronized. All systems nominal.', 'success');
        return;
      }

      void handleChat(trimmed);
      return;
    }
  };

  const currentColor = persona === 'BUSINESS' ? '#8b5cf6' : COLOR_CYCLE[colorIndex]!;
  const suggestionPrompts = getDynamicSuggestions();

  return (
    <motion.div 
      className={`h-full w-full bg-black/90 backdrop-blur-2xl border-2 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl transition-all duration-1000 relative ${glitchActive ? 'animate-glitch' : ''}`}
      style={{ borderColor: `${currentColor}40`, boxShadow: `0 0 100px ${currentColor}10` }}
    >
      {/* Biometric Scan Line */}
      {scanActive && (
        <motion.div 
          initial={{ top: 0 }}
          animate={{ top: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] z-50 pointer-events-none"
        />
      )}

      {/* Glitch Overlay */}
      {glitchActive && (
        <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay z-50 pointer-events-none animate-pulse" />
      )}
      
      {/* Terminal Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: currentColor }} />
          <span className="text-[10px] font-mono font-bold text-white/40 tracking-widest uppercase">
            APEX_OS // {isUnlocked ? 'DIRECT_LINK' : 'VETTING_PROTOCOL'}
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-4 text-[10px] font-mono text-white/30 uppercase tracking-widest">
            <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-emerald-400" /> Online</span>
            <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-cyan-400" /> Secure</span>
          </div>
        </div>
      </div>

      {/* Output */}
      <div
        ref={terminalRef}
        onScroll={handleOutputScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-8 font-mono space-y-2 sm:space-y-3 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
      >
        
        <AnimatePresence>
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={line.type === 'ascii' ? '' : `text-xs sm:text-sm leading-relaxed ${line.className?.includes('whitespace-pre') ? '' : 'break-words'} ${
                line.className ? line.className : (
                  line.type === 'input' ? 'text-cyan-400' :
                  line.type === 'error' ? 'text-red-400 font-bold' :
                  line.type === 'success' ? 'text-emerald-400' :
                  line.type === 'jarvis' ? 'text-violet-400 font-black' :
                  line.type === 'choice' ? 'text-cyan-300 font-black underline cursor-pointer hover:text-white transition-colors' :
                  line.type === 'matrix' ? 'text-green-400' :
                  'text-white/70'
                )
              }`}
            >
              {line.type === 'ascii' ? (
                <pre 
                  className={`font-mono overflow-visible whitespace-pre leading-[0.85] ${isMobile ? 'text-[6px]' : 'text-xs sm:text-sm'} ${line.className || ''}`}
                  style={{ 
                    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
                    fontVariantLigatures: 'none',
                    textRendering: 'geometricPrecision',
                    margin: 0,
                    padding: 0
                  }}
                >
                  {line.text}
                </pre>
              ) : line.type === 'brand-logo' ? (
                <pre 
                  className={`font-mono overflow-visible whitespace-pre leading-[0.85] ${isMobile ? 'text-[6px]' : 'text-xs sm:text-sm'} ${line.className || ''}`}
                  style={{ 
                    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
                    fontVariantLigatures: 'none',
                    textRendering: 'geometricPrecision',
                    margin: 0,
                    padding: 0
                  }}
                >
                  {(() => {
                    try {
                      const coloredLines = JSON.parse(line.text) as Array<{text: string, color: string}>;
                      return coloredLines.map((l, i) => (
                        <React.Fragment key={i}>
                          <span style={{ color: l.color, display: 'block' }}>
                            {l.text}
                          </span>
                        </React.Fragment>
                      ));
                    } catch {
                      return line.text;
                    }
                  })()}
                </pre>
              ) : (
                <>
                  {line.type === 'input' && <span className="text-white/20 mr-3">λ</span>}
                  {line.type === 'jarvis' && <Bot className="w-4 h-4 inline mr-2 mb-1" />}
                  <InlineRenderer text={line.text} />
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {isProcessing && (
          <div className="flex items-center gap-3 text-cyan-400 text-xs tracking-widest animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" /> EXECUTING...
          </div>
        )}

        {showPillChoice && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mt-8"
          >
            <PillChoiceSystem
              activeOption={PILL_CONFIG.activeOption}
              onSelect={handlePillChoice}
            />
            <div className="mt-3 text-center text-[10px] font-mono text-white/40 tracking-widest">
              OPTIONAL: You can ignore this and start typing. Change later via command: [blue] / [red]
            </div>
          </motion.div>
        )}

        {hasNewOutput && (
          <div className="sticky bottom-2 w-full flex justify-center">
            <button
              type="button"
              onClick={() => {
                const el = terminalRef.current;
                if (!el) return;
                pinnedToBottomRef.current = true;
                setHasNewOutput(false);
                el.scrollTop = el.scrollHeight;
              }}
              className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-[10px] font-mono tracking-widest hover:bg-cyan-500/15 transition-colors"
            >
              NEW OUTPUT · JUMP TO BOTTOM
            </button>
          </div>
        )}
      </div>


      {/* Input */}
      <div className="border-t border-white/10 bg-white/5 flex flex-col">
        {/* Rotating Punchline CTA */}
        {!isProcessing && step !== 'boot' && (
          <div className="px-6 pt-2 pb-0">
            <RotatingCTA />
          </div>
        )}

        {isUnlocked && showSuggestions && !showPillChoice && (
          <div className="px-6 pt-2">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[10px] font-mono text-white/35 tracking-widest uppercase">
                Lens: {trajectory ? `${trajectory} PILL` : 'UNSET'}
              </div>
              <div className="text-[10px] font-mono text-white/25 tracking-widest">
                Type `pill` or `suggestions off`
              </div>
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {suggestionPrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setInputValue(p);
                    setTimeout(() => inputRef.current?.focus(), 0);
                    void trackEvent({ email, eventType: 'suggestion_clicked', payload: { prompt: p.slice(0, 80), trajectory: trajectory ?? null } })
                      .catch(() => undefined);
                  }}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-[11px] font-mono hover:bg-white/10 hover:border-white/20 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <form onSubmit={(e) => { e.preventDefault(); handleCommand(inputValue); }}
              className="px-6 pb-4 pt-2 flex items-center gap-4">
          <span className="text-xl font-bold font-mono" style={{ color: currentColor }}>λ</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white text-base font-mono placeholder-white/10"
            placeholder={isUnlocked ? "Ask JARVIS anything..." : step === 'boot' ? "Initializing..." : "Type response..."}
            disabled={step === 'boot' || isProcessing}
            autoFocus
          />
          {step === 'validation' && (
            <div className={`text-[10px] font-mono ${inputValue.length >= 50 ? 'text-emerald-400' : 'text-white/30'}`}>
              {inputValue.length}/50
            </div>
          )}
          <button type="submit" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <ArrowRight className="w-6 h-6 text-white/20" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
