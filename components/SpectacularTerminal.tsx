import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Bot, ArrowRight, Wifi, Shield
} from 'lucide-react';
import * as CLIFormatter from '../lib/cliFormatter';
import { InlineRenderer } from './ui/Terminal/InlineRenderer';
import { useOnboardingStore } from '../stores/useOnboardingStore';

// ═══════════════════════════════════════════════════════════════════════════════
// SPECTACULAR TERMINAL WAITLIST - GEEK MODE EVOLVED (STARK-V2)
// Onboarding Journey | Tony Stark Persona | Real-time UI Morphing
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

export const SpectacularTerminal: React.FC = () => {
  const { 
    step, setStep, 
    persona, setPersona, 
    email, setEmail,
    setGoal,
    isUnlocked, unlock,
    addHistory
  } = useOnboardingStore();

  const [bootLine, setBootLine] = useState(0);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [colorIndex, setColorIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<any>({});

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

  const finalizeWaitlist = useCallback(async (data: any) => {
    setStep('processing');
    setIsProcessing(true);
    addTerminalLine('TRANSMITTING TO APEX SWARM...', 'matrix');
    
    try {
      const res = await fetch('/api/waitlist/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, mode: 'GEEK_V2', version: '21eb428_EVOLVED' }),
      });
      const result = await res.json();
      addTerminalLine(`✓ [PROTOCOL: ENCRYPTION_KEYS_SWAPPED]`, 'success');
      addTerminalLine(`✓ AI READINESS SCORE: ${result.ai_score}/100`, 'success');
      addTerminalLine(`✓ QUEUE RANK: #${result.rank}`, 'success');
      addTerminalLine('', 'system');
      addTerminalLine('You\'re in the system now, Player One. Standard protocols are offline.', 'jarvis');
      addTerminalLine('I\'m all yours. What are we building today?', 'jarvis');
      addTerminalLine('Tip: Ask about Module 00: The Shift or Module 01: The Environment.', 'system');
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
          context: `User persona: ${persona}. Access granted to Module 00/01. System: Stark-V2.` 
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
      if (trimmed === '1' || trimmed.toLowerCase().includes('personal')) {
        setPersona('PERSONAL');
        addTerminalLine('✓ Profile: PERSONAL_BUILDER. Initializing individual arbitrage metrics.', 'success');
        addTerminalLine('Right. Let\'s turn you into a one-man production powerhouse.', 'jarvis');
        addTerminalLine('# 03 What is your Dream Stack? (e.g., Next.js, Python, Rust):', 'system');
        setStep('dynamic_discovery');
      } else if (trimmed === '2' || trimmed.toLowerCase().includes('business')) {
        setPersona('BUSINESS');
        addTerminalLine('✓ Profile: BUSINESS_ARCHITECT. Allocating market sovereignty resources.', 'success');
        addTerminalLine('Director. Let\'s talk about orchestrating outcomes and dominating the market.', 'jarvis');
        addTerminalLine('# 03 Current Tech Debt or Bottleneck? (e.g., slow dev cycles, high burn):', 'system');
        setStep('dynamic_discovery');
      } else {
        addTerminalLine('Invalid input. Select [1] PERSONAL or [2] BUSINESS.', 'error');
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
        addTerminalLine(`[!] Input length: ${trimmed.length}/50. This is a blueprint for a legacy hobby, not a 10-day sprint. Give me depth or give me the exit.`, 'error');
        return;
      }
      setGoal(trimmed);
      addTerminalLine('✓ Visionary intent recognized. Processing mission profile...', 'success');
      void finalizeWaitlist({ ...formData, email, goal: trimmed, persona });
      return;
    }

    if (step === 'unlocked') {
      if (trimmed.toLowerCase() === 'greuceanu') {
        addTerminalLine('SECRET PROTOCOL: GREUCEANU ACTIVATED', 'matrix');
        addTerminalLine('Accessing Private Resource Vault...', 'jarvis');
        addTerminalLine('UNLOCKED: Direct Signal Channel & Founder Bible.', 'success');
        addTerminalLine('LINK: https://notion.so/apex-os-private-vault (PLACEHOLDER)', 'choice');
        return;
      }
      void handleChat(trimmed);
      return;
    }
  };

  const currentColor = persona === 'BUSINESS' ? '#8b5cf6' : COLOR_CYCLE[colorIndex]!;

  return (
    <div className="flex-1 bg-black/90 backdrop-blur-2xl border-2 rounded-3xl overflow-hidden flex flex-col shadow-2xl transition-all duration-1000 relative min-h-[500px]"
         style={{ borderColor: `${currentColor}40`, boxShadow: `0 0 100px ${currentColor}10` }}>
      
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
    </div>
  );
};
