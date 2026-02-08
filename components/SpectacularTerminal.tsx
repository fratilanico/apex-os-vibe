import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Bot, ArrowRight, Wifi, Shield
} from 'lucide-react';
import * as CLIFormatter from '../lib/cliFormatter';
import { InlineRenderer } from './ui/Terminal/InlineRenderer';
import { useOnboardingStore } from '../stores/useOnboardingStore';
import { 
  APEX_LOGO_ASCII,
  APEX_LOGO_ASCII_MOBILE,
  PLAYER_ONE_ASCII,
  PLAYER_ONE_ASCII_MOBILE
} from '../lib/terminal/constants';

// ═══════════════════════════════════════════════════════════════════════════════
// SPECTACULAR TERMINAL WAITLIST - STARK-V3 ORCHESTRATOR
// Direct Neural Link | Intent Parsing | Handshake Sequence
// ═══════════════════════════════════════════════════════════════════════════════

interface TerminalLine {
  id: string;
  text: string;
  type: 'input' | 'output' | 'error' | 'system' | 'success' | 'jarvis' | 'matrix' | 'choice';
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

export const SpectacularTerminal: React.FC = () => {
  const { 
    step, setStep, 
    persona, setPersona, 
    email, setEmail,
    setGoal,
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
  const [isMobile, setIsMobile] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Select appropriate ASCII based on screen size
  const apexLogo = isMobile ? APEX_LOGO_ASCII_MOBILE : APEX_LOGO_ASCII;
  const playerOneLogo = isMobile ? PLAYER_ONE_ASCII_MOBILE : PLAYER_ONE_ASCII;

  const addTerminalLine = useCallback((text: string, type: TerminalLine['type'] = 'output', className?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setLines(prev => [...prev, { id, text, type, className }].slice(-200));
    addHistory(`[${type.toUpperCase()}] ${text}`);
  }, [addHistory]);

  const addAsciiArt = useCallback((art: string, className: string) => {
    art.split('\n').filter(line => line.length > 0).forEach(line => {
      addTerminalLine(line, 'system', className);
    });
  }, [addTerminalLine]);

  // Boot Sequence
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'boot' || step === 'idle') {
      // Render APEX logo immediately on first tick
      if (bootLine === 0) {
        addAsciiArt(apexLogo, `text-cyan-400 whitespace-pre font-mono leading-[1.1] ${isMobile ? 'text-[8px]' : 'text-[14px]'} drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]`);
      }
      if (bootLine < BOOT_SEQUENCE.length) {
        const line = BOOT_SEQUENCE[bootLine]!;
        timer = setTimeout(() => {
          addTerminalLine(line.text, line.type);
          setBootLine(p => p + 1);
          if (bootLine === BOOT_SEQUENCE.length - 1) {
            addTerminalLine('Traditional forms are for the legacy world. Switching to Direct Neural Uplink...', 'jarvis');
            addTerminalLine('', 'system');
            addTerminalLine('# 01 Provide your primary email for secure handshake:', 'system');
            setStep('email_guard');
          }
        }, line.delay);
      }
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [bootLine, step, addTerminalLine, addAsciiArt, setStep, apexLogo, isMobile]);

  // Color Cycle
  useEffect(() => {
    const interval = setInterval(() => setColorIndex(p => (p + 1) % COLOR_CYCLE.length), 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [lines]);

  const validateEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

  const performHandshake = useCallback(async (data: any) => {
    setStep('processing');
    setIsProcessing(true);
    addTerminalLine('TRANSMITTING TO APEX SWARM...', 'matrix');
    addTerminalLine('ORCHESTRATING AI READINESS SCORE...', 'matrix');
    
    try {
      const syncAgents = [
        '👑 Infrastructure-Architect SYNCING...',
        '🔒 Security-Monitor VALIDATING...',
        '📋 Compliance-Guardian AUDITING...',
        '💰 Cost-Optimizer PROJECTING...',
        '🧠 Intel-Architect SYNTHESIZING...'
      ];
      
      for (const agent of syncAgents) {
        await new Promise(r => setTimeout(r, 400));
        addTerminalLine(agent, 'matrix');
      }

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

      // Level Up Sequence
      setScanActive(true);
      setGlitchActive(true);
      setTimeout(() => {
        setScanActive(false);
        setGlitchActive(false);
      }, 2000);

      addTerminalLine('SYNCING NEURAL LINK...', 'matrix');
      addTerminalLine('[████████████████████] 100%', 'success');
      addTerminalLine('ESTABLISHING SECURE HANDSHAKE...', 'matrix');
      
      addAsciiArt(playerOneLogo, `text-emerald-400 whitespace-pre font-mono leading-[1.1] ${isMobile ? 'text-[8px]' : 'text-[14px]'} drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]`);
      addTerminalLine('. . . PLAYER 1 - CONNECTED', 'success');
      
      addTerminalLine(`✓ AI READINESS SCORE: ${result.ai_score}/100`, 'success');
      addTerminalLine(`✓ QUEUE RANK: #${result.rank}`, 'success');
      addTerminalLine('', 'system');
      addTerminalLine(`You're in the swarm now, ${data.name || 'Player One'}. Standard protocols are offline.`, 'jarvis');
      addTerminalLine('I\'m all yours. What are we building today?', 'jarvis');
      addTerminalLine('Tip: Ask about Module 00: The Shift or type "help" for intel.', 'system');
      
      unlock();
      setStep('unlocked');
    } catch (e: any) {
      addTerminalLine(`Transmission failed: ${e.message}. Retry submission?`, 'error');
      setStep('validation');
    } finally {
      setIsProcessing(false);
    }
  }, [addTerminalLine, addAsciiArt, setStep, unlock, playerOneLogo, isMobile]);

  const handleChat = async (msg: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/ai-unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: msg,
          userEmail: email,
          context: `User persona: ${persona}. Access granted to Module 00/01. System: Stark-V3. User has joined waitlist.` 
        }),
      });
      const data = await res.json();
      const content = data?.content || 'Intelligence unreachable.';
      const formatted = CLIFormatter.convertMarkdownToCLI(content);
      formatted.split('\n').forEach(l => addTerminalLine(l, 'output'));
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
      setStep('onboarding_name' as any);
      return;
    }

    if (step === 'onboarding_name' as any) {
      setFormData((p: any) => ({ ...p, name: trimmed }));
      addTerminalLine(`✓ Identity logged: ${trimmed}`, 'success');
      addTerminalLine('', 'system');
      addTerminalLine('Provide a direct line for secure comms. Enter your phone number:', 'jarvis');
      setStep('onboarding_phone' as any);
      return;
    }

    if (step === 'onboarding_phone' as any) {
      setFormData((p: any) => ({ ...p, phone: trimmed }));
      addTerminalLine(`✓ Signal channel set.`, 'success');
      addTerminalLine('', 'system');
      addTerminalLine('Now, tell me who I\'m talking to. Are you here to master the stack yourself, or are we architecting a fleet for your company?', 'jarvis');
      addTerminalLine('[ 1: PERSONAL_BUILDER ]', 'choice');
      addTerminalLine('[ 2: BUSINESS_ARCHITECT ]', 'choice');
      setStep('handshake');
      return;
    }

    if (step === 'handshake') {
      const isPersonal = lower === '1' || lower.includes('personal') || lower.includes('myself') || lower.includes('me') || lower.includes('just me');
      const isBusiness = lower === '2' || lower.includes('business') || lower.includes('company') || lower.includes('team') || lower.includes('fleet');

      if (isPersonal) {
        setPersona('PERSONAL');
        addTerminalLine('✓ Profile: PERSONAL_BUILDER. Initializing individual arbitrage metrics.', 'success');
        addTerminalLine('Right. Let\'s turn you into a one-man production powerhouse. Standard dev cycles are for hobbyists.', 'jarvis');
        addTerminalLine('# 03 What is your Dream Stack? (e.g., Next.js, Python, Rust):', 'system');
        setStep('dynamic_discovery');
      } else if (isBusiness) {
        setPersona('BUSINESS');
        addTerminalLine('✓ Profile: BUSINESS_ARCHITECT. Allocating market sovereignty resources.', 'success');
        addTerminalLine('Director. Let\'s talk about orchestrating outcomes and dominating the market.', 'jarvis');
        addTerminalLine('# 03 Current Tech Debt or Bottleneck? (e.g., slow dev cycles, high burn):', 'system');
        setStep('dynamic_discovery');
      } else {
        addTerminalLine('I need to categorize your intent, Sir. Are we building for [1] YOU or [2] THE COMPANY?', 'jarvis');
      }
      return;
    }

    if (step === 'dynamic_discovery') {
      setFormData((p: any) => ({ ...p, discovery: trimmed }));
      addTerminalLine('✓ Intel captured.', 'success');
      addTerminalLine('', 'system');
      addTerminalLine('Now, the most important part. What is your primary 10-day build goal?', 'jarvis');
      addTerminalLine('Note: Be specific. Ambition requires depth (Min 50 characters).', 'system');
      setStep('validation');
      return;
    }

    if (step === 'validation') {
      if (trimmed.length < 50) {
        addTerminalLine(`I can't build a fleet based on a single word, Sir. Give me some depth so I can allocate the right agents. (${trimmed.length}/50 chars).`, 'jarvis');
        return;
      }
      setGoal(trimmed);
      addTerminalLine('✓ Visionary intent recognized. Processing mission profile...', 'success');
      void performHandshake({ ...formData, email, goal: trimmed, persona });
      return;
    }

    if (step === 'unlocked') {
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

      if (lower === 'status') {
        addTerminalLine('[SYSTEM] 17 Agents Synchronized. All systems nominal.', 'success');
        return;
      }

      void handleChat(trimmed);
      return;
    }
  };

  const currentColor = persona === 'BUSINESS' ? '#8b5cf6' : COLOR_CYCLE[colorIndex]!;

  return (
    <motion.div 
      className={`flex-1 bg-black/90 backdrop-blur-2xl border-2 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl transition-all duration-1000 relative min-h-[400px] sm:min-h-[500px] ${glitchActive ? 'animate-glitch' : ''}`}
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
      <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 sm:p-8 font-mono space-y-2 sm:space-y-3 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        <AnimatePresence>
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-xs sm:text-sm leading-relaxed ${line.className?.includes('whitespace-pre') ? '' : 'break-words'} ${
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
              {line.type === 'input' && <span className="text-white/20 mr-3">λ</span>}
              {line.type === 'jarvis' && <Bot className="w-4 h-4 inline mr-2 mb-1" />}
              <InlineRenderer text={line.text} />
            </motion.div>
          ))}
        </AnimatePresence>
        {isProcessing && (
          <div className="flex items-center gap-3 text-cyan-400 text-xs tracking-widest animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" /> EXECUTING...
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); handleCommand(inputValue); }}
            className="p-6 border-t border-white/10 bg-white/5 flex items-center gap-4">
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
    </motion.div>
  );
};
