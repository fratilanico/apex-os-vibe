import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Bot, ArrowRight, Wifi, Shield
} from 'lucide-react';
import * as CLIFormatter from '../lib/cliFormatter';
import { InlineRenderer } from './ui/Terminal/InlineRenderer';
import { useOnboardingStore } from '../stores/useOnboardingStore';

// ═══════════════════════════════════════════════════════════════════════════════
// SPECTACULAR TERMINAL WAITLIST - STARK-V3 ORCHESTRATOR
// Direct Neural Link | Intent Parsing | Dynamic Branching
// ═══════════════════════════════════════════════════════════════════════════════

interface TerminalLine {
  id: string;
  text: string;
  type: 'input' | 'output' | 'error' | 'system' | 'success' | 'jarvis' | 'matrix' | 'choice';
}

const COLOR_CYCLE = ['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

const BOOT_SEQUENCE = [
  { text: 'Initializing APEX_OS Kernel v6.4.1...', delay: 100, type: 'system' as const },
  { text: 'Loading Neural Interface Protocol...', delay: 400, type: 'system' as const },
  { text: 'Connecting to 17-Agent Swarm...', delay: 700, type: 'matrix' as const },
  { text: 'Establishing Secure Founder Channel...', delay: 1000, type: 'system' as const },
  { text: '[OK] FULL WIRE ENGAGED', delay: 1300, type: 'success' as const },
  { text: '', delay: 1400, type: 'system' as const },
];

const JOKES: Record<string, string> = {
  sudo: "Nice try. You are already root here. This is YOUR terminal. You have full control.",
  'rm -rf': "You cannot delete the future. Module 00 is immutable. Nice try though.",
  matrix: "Wake up, Neo... The Matrix has you... Follow the white rabbit.",
  coffee: "☕ COFFEE.exe loaded successfully. Caffeine levels: OPTIMAL.",
  beer: "🍺 Pouring beer... Relaxation mode activated. Ship tomorrow.",
  '42': "The Answer to the Ultimate Question of Life, the Universe, and Everything is 42.",
};

export const SpectacularTerminal: React.FC = () => {
  const { 
    step, setStep, 
    persona, setPersona, 
    email, setEmail,
    setGoal,
    isUnlocked, unlock,
    setVaultOpen,
    addHistory
  } = useOnboardingStore();

  const [bootLine, setBootLine] = useState(0);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [colorIndex, setColorIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [glitchActive, setGlitchActive] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTerminalLine = useCallback((text: string, type: TerminalLine['type'] = 'output') => {
    const id = Math.random().toString(36).substr(2, 9);
    setLines(prev => [...prev, { id, text, type }].slice(-200));
    addHistory(`[${type.toUpperCase()}] ${text}`);
  }, [addHistory]);

  // Boot Sequence
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'boot' && bootLine < BOOT_SEQUENCE.length) {
      const line = BOOT_SEQUENCE[bootLine];
      if (line) {
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
  }, [bootLine, step, addTerminalLine, setStep]);

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
        body: JSON.stringify({ ...data, mode: 'GEEK_V3', version: '3.0_STARK' }),
      });
      const result = await res.json();
      
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 1500);

      addTerminalLine('SYNCING NEURAL LINK...', 'matrix');
      addTerminalLine('[████████████████████] 100%', 'success');
      addTerminalLine('ESTABLISHING SECURE HANDSHAKE...', 'matrix');
      
      const handshakeMsg = `
╔══════════════════════════════════════════╗
║ . . . PLAYER 1 - CONNECTED               ║
╚══════════════════════════════════════════╝`;
      
      addTerminalLine(handshakeMsg, 'success');
      addTerminalLine(`✓ AI READINESS SCORE: ${result.ai_score}/100`, 'success');
      addTerminalLine(`✓ QUEUE RANK: #${result.rank}`, 'success');
      addTerminalLine('', 'system');
      addTerminalLine('You\'re in the swarm now, Player One. Standard protocols are offline.', 'jarvis');
      addTerminalLine('I\'m all yours. What are we building today?', 'jarvis');
      addTerminalLine('Tip: Ask about Module 00: The Shift or type "help" for intel.', 'system');
      
      unlock();
      setStep('unlocked');
    } catch (e) {
      addTerminalLine('Transmission failed. Swarm link unstable. Retry submission?', 'error');
      setStep('validation');
    } finally {
      setIsProcessing(false);
    }
  }, [addTerminalLine, setStep, unlock]);

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

    // Global Easter Eggs
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
      addTerminalLine('✓ Handshake successful. Neural encryption keys exchanged.', 'success');
      addTerminalLine('', 'system');
      addTerminalLine('Now, tell me who I\'m talking to. Are you here to master the stack yourself, or are we architecting a fleet for your company?', 'jarvis');
      addTerminalLine('[ 1: PERSONAL_BUILDER ]', 'choice');
      addTerminalLine('[ 2: BUSINESS_ARCHITECT ]', 'choice');
      setStep('handshake');
      return;
    }

    if (step === 'handshake') {
      const isPersonal = lower === '1' || 
                        lower.includes('personal') || 
                        lower.includes('myself') || 
                        lower.includes('me') || 
                        lower.includes('just me') ||
                        lower.includes('individual') ||
                        lower.includes('master the stack');
      
      const isBusiness = lower === '2' || 
                         lower.includes('business') || 
                         lower.includes('company') || 
                         lower.includes('team') || 
                         lower.includes('fleet') || 
                         lower.includes('organization') ||
                         lower.includes('architecting');

      if (isPersonal) {
        setPersona('PERSONAL');
        addTerminalLine('✓ Profile: PERSONAL_BUILDER. Initializing individual arbitrage metrics.', 'success');
        addTerminalLine('Right. Let\'s turn you into a one-man production powerhouse. The goal is technical sovereignty—zero dependencies, infinite velocity.', 'jarvis');
        addTerminalLine('', 'system');
        addTerminalLine('# 03 Mission Parameter: What is your weapon of choice? Which stack will you use to dominate your niche? (e.g., Next.js, Rust, Python):', 'system');
        setStep('dynamic_discovery');
      } else if (isBusiness) {
        setPersona('BUSINESS');
        addTerminalLine('✓ Profile: BUSINESS_ARCHITECT. Allocating market sovereignty resources.', 'success');
        addTerminalLine('Director. Let\'s architect an outcome that eliminates burn and CTO-dependency. We\'re building a fleet, not a department.', 'jarvis');
        addTerminalLine('', 'system');
        addTerminalLine('# 03 Strategic Audit: What is the primary friction point in your current operations? (High burn, slow velocity, or talent gaps?):', 'system');
        setStep('dynamic_discovery');
      } else {
        addTerminalLine('I need to categorize your intent, Sir. Are we building for [1] YOU or [2] THE COMPANY?', 'jarvis');
      }
      return;
    }

    if (step === 'dynamic_discovery') {
      setFormData((p: any) => ({ ...p, discovery: trimmed }));
      addTerminalLine('✓ Intel captured. Analyzing friction points...', 'success');
      addTerminalLine('', 'system');
      addTerminalLine('Now, the most important part. What is your primary 10-day build goal?', 'jarvis');
      addTerminalLine('Note: Be specific. Ambition requires depth (Min 50 characters).', 'system');
      setStep('validation');
      return;
    }

    if (step === 'validation') {
      if (trimmed.length < 50) {
        addTerminalLine(`I can't architect a solution based on a single word, Sir. Give me some depth so I can allocate the right agents. (${trimmed.length}/50 chars).`, 'jarvis');
        return;
      }
      setGoal(trimmed);
      addTerminalLine('✓ Mission profile recognized. Initiating swarm synchronization...', 'success');
      void performHandshake({ ...formData, email, goal: trimmed, persona });
      return;
    }

    if (step === 'unlocked') {
      if (lower === 'greuceanu') {
        addTerminalLine('SECRET PROTOCOL: GREUCEANU ACTIVATED', 'matrix');
        addTerminalLine('Accessing Private Resource Vault...', 'jarvis');
        addTerminalLine('UNLOCKED: Direct Signal Channel & Founder Bible.', 'success');
        setVaultOpen(true);
        return;
      }

      if (lower === 'help') {
        addTerminalLine('[SYSTEM] Available Commands:', 'system');
        addTerminalLine('  clear  - Clear screen', 'system');
        addTerminalLine('  status - Check sync status', 'system');
        addTerminalLine('  jarvis - Direct AI link', 'system');
        addTerminalLine('  about  - APEX OS mission', 'system');
        return;
      }

      if (lower === 'status') {
        addTerminalLine('[SYSTEM] 17 Agents Synchronized. All systems nominal.', 'success');
        return;
      }

      if (lower === 'about') {
        addTerminalLine('APEX OS is the sovereign orchestrator for founders. We build at AI speed, using agent swarms instead of dev teams.', 'success');
        return;
      }

      void handleChat(trimmed);
      return;
    }
  };

  const currentColor = persona === 'BUSINESS' ? '#8b5cf6' : COLOR_CYCLE[colorIndex]!;

  return (
    <motion.div 
      className={`flex-1 bg-black/90 backdrop-blur-2xl border-2 rounded-3xl overflow-hidden flex flex-col shadow-2xl transition-all duration-1000 relative min-h-[500px] ${glitchActive ? 'animate-glitch' : ''}`}
      style={{ borderColor: `${currentColor}40`, boxShadow: `0 0 100px ${currentColor}10` }}
    >
      {glitchActive && (
        <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay z-50 pointer-events-none animate-pulse" />
      )}
      
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

      <div ref={terminalRef} className="flex-1 overflow-y-auto p-8 font-mono space-y-3 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        <AnimatePresence>
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-sm leading-relaxed ${
                line.type === 'input' ? 'text-cyan-400' :
                line.type === 'error' ? 'text-red-400 font-bold' :
                line.type === 'success' ? 'text-emerald-400' :
                line.type === 'jarvis' ? 'text-violet-400 font-black' :
                line.type === 'choice' ? 'text-cyan-300 font-black underline cursor-pointer hover:text-white transition-colors' :
                line.type === 'matrix' ? 'text-green-400' :
                'text-white/70'
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
