'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Wifi, Shield, Terminal } from 'lucide-react';
import { useOnboardingStore } from '../stores/useOnboardingStore';
import { processAdminCommand } from '../lib/admin/terminalAdmin';
import { PILL_CONFIG } from '../config/pillConfig';
import { PillChoiceSystem } from './PillChoiceSystem';
import { InlineRenderer } from './ui/Terminal/InlineRenderer';
import { APEX_LOGO_ASCII_LINES } from '../lib/terminal/constants';

interface TerminalLine {
  id: string;
  text: string;
  type: 'input' | 'output' | 'error' | 'system' | 'success' | 'jarvis' | 'matrix' | 'ascii' | 'brand-logo';
}

type TerminalStep = 'boot' | 'name' | 'email' | 'processing' | 'unlocked';

const BOOT_SEQUENCE = [
  { text: JSON.stringify(APEX_LOGO_ASCII_LINES), delay: 50, type: 'brand-logo' as const },
  { text: '', delay: 80, type: 'system' as const },
  { text: 'Initializing APEX_OS Kernel v6.4.2...', delay: 200, type: 'system' as const },
  { text: 'Loading Neural Interface Protocol...', delay: 400, type: 'system' as const },
  { text: 'Connecting to 17-Agent Swarm...', delay: 700, type: 'matrix' as const },
  { text: '[OK] FULL WIRE ENGAGED', delay: 1000, type: 'success' as const },
  { text: '', delay: 1100, type: 'system' as const },
  { text: 'Protocol Active. Establishing Identity Node...', delay: 1200, type: 'jarvis' as const },
  { text: '', delay: 1300, type: 'system' as const },
];

// Rotating prompts based on step
const stepPrompts: Record<TerminalStep, string[]> = {
  boot: ['Initializing neural interface...', 'Establishing secure connection...'],
  name: [
    'What should I call you, operator?',
    'Enter your designation...',
    'Identity node awaits input...',
    'Who joins the swarm?'
  ],
  email: [
    'Drop your digital coordinates...',
    'Where can the swarm reach you?',
    'Email for neural link...',
    'Secure comms channel?'
  ],
  processing: ['Processing neural handshake...', 'Syncing with 17-agent swarm...'],
  unlocked: [
    'Try "help" for commands...',
    'Ask about the 10-day protocol...',
    'Ready for your mission?',
    'Vault access: type "vault"...',
    'Admin? Try "admin"...',
    'Status check? Type "status"...',
    'Your move, operator...',
    'Swarm awaiting your command...'
  ]
};

interface SpectacularTerminalProps {
  onCommand?: (command: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  lines: TerminalLine[];
  step: TerminalStep;
  isProcessing: boolean;
  showPillChoice: boolean;
  getPlaceholder: () => string;
  terminalRef: React.RefObject<HTMLDivElement>;
}

export const useTerminal = () => {
  const { step, setStep, setPersona, setEmail, unlock, addHistory } = useOnboardingStore();
  const [bootLine, setBootLine] = useState(0);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [glitchActive, setGlitchActive] = useState(false);
  const [scanActive, setScanActive] = useState(false);
  const [showPillChoice, setShowPillChoice] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cycle through prompts
  useEffect(() => {
    const currentStep = step as TerminalStep;
    if (currentStep === 'boot' || currentStep === 'processing') return;
    
    const prompts = stepPrompts[currentStep] || ['Type response...'];
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % prompts.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [step]);

  const getPlaceholder = useCallback(() => {
    const currentStep = step as TerminalStep;
    if (currentStep === 'boot') return 'Initializing...';
    if (currentStep === 'processing') return 'Processing...';
    const prompts = stepPrompts[currentStep] || ['Type response...'];
    return prompts[promptIndex % prompts.length];
  }, [step, promptIndex]);

  const addLine = useCallback((text: string, type: TerminalLine['type'] = 'output') => {
    const id = Math.random().toString(36).substr(2, 9);
    setLines(prev => [...prev, { id, text, type }]);
    addHistory(`[${type.toUpperCase()}] ${text}`);
  }, [addHistory]);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [lines, showPillChoice]);

  // Boot sequence
  useEffect(() => {
    if (bootLine < BOOT_SEQUENCE.length) {
      const timer = setTimeout(() => {
        const line = BOOT_SEQUENCE[bootLine];
        addLine(line.text, line.type);
        setBootLine(prev => prev + 1);
      }, BOOT_SEQUENCE[bootLine].delay - (bootLine > 0 ? BOOT_SEQUENCE[bootLine - 1].delay : 0));
      return () => clearTimeout(timer);
    } else if (step === 'boot') {
      setStep('name' as any);
      addLine('# 01 Identity Node: Enter your designation:', 'system');
    }
  }, [bootLine, step, addLine, setStep]);

  const performHandshake = async (name: string) => {
    setStep('processing' as any);
    setScanActive(true);
    setIsProcessing(true);
    
    addLine('', 'system');
    addLine('═══════════════════════════════════════', 'matrix');
    addLine('  NEURAL HANDSHAKE PROTOCOL INITIATED', 'matrix');
    addLine('═══════════════════════════════════════', 'matrix');
    addLine('', 'system');
    
    await new Promise(r => setTimeout(r, 1500));
    addLine('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%', 'matrix');
    
    setScanActive(false);
    setGlitchActive(true);
    
    await new Promise(r => setTimeout(r, 800));
    setGlitchActive(false);
    setIsProcessing(false);
    setStep('unlocked' as any);
    unlock();
    
    addLine('', 'system');
    addLine(`✓ IDENTITY CONFIRMED: ${name.toUpperCase()}`, 'success');
    addLine('✓ FULL WIRE ENGAGED', 'success');
    addLine('', 'system');
    addLine('CHOOSE YOUR PATH:', 'jarvis');
    
    setShowPillChoice(true);
  };

  const handlePillChoice = (choice: 'red' | 'blue') => {
    setShowPillChoice(false);
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 500);
    
    if (choice === 'red') {
      setPersona('BUSINESS');
      addLine('', 'system');
      addLine('🔴 RED PILL SELECTED: BUSINESS_ARCHITECT', 'success');
      addLine('Initializing enterprise arbitrage metrics...', 'jarvis');
      addLine('', 'system');
      addLine('┌─── BUSINESS MODULES UNLOCKED ───┐', 'matrix');
      addLine('│ ⚡ AGENT_SWARM       — ACTIVE   │', 'matrix');
      addLine('│ 🏢 ORG_BUILDER       — ACTIVE   │', 'matrix');
      addLine('│ 📊 METRICS_DASH      — ACTIVE   │', 'matrix');
      addLine('│ 🔒 VAULT_ACCESS      — TIER 2   │', 'matrix');
      addLine('└─────────────────────────────────┘', 'matrix');
    } else {
      setPersona('PERSONAL');
      addLine('', 'system');
      addLine('🔵 BLUE PILL SELECTED: PERSONAL_BUILDER', 'success');
      addLine('Initializing individual arbitrage metrics...', 'jarvis');
      addLine('', 'system');
      addLine('┌─── PERSONAL MODULES UNLOCKED ───┐', 'matrix');
      addLine('│ ⚡ VIBE_VELOCITY      — ACTIVE   │', 'matrix');
      addLine('│ 🧠 SKILL_TREE         — ACTIVE   │', 'matrix');
      addLine('│ 🎮 NPC_FEED           — ACTIVE   │', 'matrix');
      addLine('│ 🔒 AGENT_FORGE        — TIER 2   │', 'matrix');
      addLine('└─────────────────────────────────┘', 'matrix');
    }
    
    addLine('', 'system');
    addLine('Type "help" for available commands or "vault" to access your Founder Bible.', 'system');
  };

  const handleCommand = async (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;

    addLine(`> ${trimmed}`, 'input');
    setInputValue('');

    if ((step as TerminalStep) === 'name') {
      if (trimmed.length < 2) {
        addLine('Name too short. Try again:', 'error');
        return;
      }
      setFormData(p => ({ ...p, name: trimmed }));
      addLine(`✓ Identity Logged: ${trimmed}`, 'success');
      addLine('', 'system');
      addLine('# 02 Email Guard: Enter your primary email:', 'system');
      setStep('email' as any);
      return;
    }

    if ((step as TerminalStep) === 'email') {
      if (!/\S+@\S+\.\S+/.test(trimmed)) {
        addLine('Invalid email format. Retry:', 'error');
        return;
      }
      setFormData(p => ({ ...p, email: trimmed }));
      setEmail(trimmed);
      addLine('✓ Email Locked.', 'success');
      await performHandshake(formData.name);
      return;
    }

    if ((step as TerminalStep) === 'unlocked') {
      const lower = trimmed.toLowerCase();
      
      const adminResult = processAdminCommand(lower);
      if (adminResult.isAdmin) {
        if (Array.isArray(adminResult.response)) {
          adminResult.response.forEach(line => addLine(line, 'system'));
        } else {
          addLine(adminResult.response, 'system');
        }
        return;
      }
      
      if (lower === 'help') {
        addLine('AVAILABLE COMMANDS:', 'system');
        addLine('  status   - Check swarm sync', 'system');
        addLine('  vault    - Access Founder Bible', 'system');
        addLine('  clear    - Clear terminal', 'system');
        return;
      }

      if (lower === 'clear') {
        setLines([]);
        return;
      }

      if (lower === 'vault') {
        addLine('ACCESSING PRIVATE RESOURCE VAULT...', 'jarvis');
        return;
      }

      addLine('Command not recognized. Type "help" for options.', 'error');
    }
  };

  return {
    lines,
    inputValue,
    setInputValue,
    step,
    isProcessing,
    showPillChoice,
    glitchActive,
    scanActive,
    getPlaceholder,
    terminalRef,
    inputRef,
    handleCommand,
    handlePillChoice,
  };
};

// Content-only component (no input)
export const TerminalContent: React.FC<{
  lines: TerminalLine[];
  step: TerminalStep;
  isProcessing: boolean;
  showPillChoice: boolean;
  glitchActive: boolean;
  scanActive: boolean;
  onPillChoice: (choice: 'red' | 'blue') => void;
  terminalRef: React.RefObject<HTMLDivElement>;
}> = ({ 
  lines, 
  step, 
  isProcessing, 
  showPillChoice, 
  glitchActive, 
  scanActive,
  onPillChoice,
  terminalRef 
}) => {
  return (
    <div 
      ref={terminalRef}
      className={`bg-black/90 backdrop-blur-2xl border-2 border-cyan-500/30 overflow-hidden flex flex-col shadow-2xl transition-all duration-1000 relative h-full ${glitchActive ? 'animate-glitch' : ''}`}
    >
      {scanActive && (
        <motion.div 
          initial={{ top: 0 }}
          animate={{ top: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.8)] z-50 pointer-events-none"
        />
      )}

      {glitchActive && <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay z-50 pointer-events-none animate-pulse" />}
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full animate-pulse bg-cyan-400" />
          <span className="text-[10px] font-mono font-bold text-white/40 tracking-widest uppercase">
            APEX_OS // {step === 'unlocked' ? 'OPERATOR_MODE' : 'HANDSHAKE_PROTOCOL'}
          </span>
        </div>
        <div className="flex gap-4 text-[10px] font-mono text-white/30 uppercase tracking-widest">
          <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-emerald-400" /> Online</span>
          <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-cyan-400" /> Secure</span>
        </div>
      </div>

      {/* Output */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 font-mono space-y-2 sm:space-y-3 custom-scrollbar min-h-0">
        <AnimatePresence>
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-xs sm:text-sm leading-relaxed ${
                line.type === 'input' ? 'text-cyan-400' :
                line.type === 'error' ? 'text-red-400 font-bold' :
                line.type === 'success' ? 'text-emerald-400 font-bold' :
                line.type === 'jarvis' ? 'text-violet-400 font-semibold' :
                line.type === 'matrix' ? 'text-green-400' :
                'text-white/70'
              }`}
            >
              {line.type === 'ascii' || line.type === 'brand-logo' ? (
                <pre className="font-mono whitespace-pre leading-[0.85] text-[6px] sm:text-xs" style={{ fontFamily: '"Courier New", Courier, monospace', letterSpacing: '0px', textRendering: 'geometricPrecision' as const }}>
                  {line.type === 'brand-logo' ? (
                    (() => {
                      try {
                        const data = JSON.parse(line.text);
                        return data.map((l: any, i: number) => (
                          <span key={i} style={{ color: l.color, display: 'block' }}>{l.text}</span>
                        ));
                      } catch { return line.text; }
                    })()
                  ) : line.text}
                </pre>
              ) : (
                <>
                  {line.type === 'input' && <span className="text-white/20 mr-2">λ</span>}
                  {line.type === 'jarvis' && <Terminal className="w-4 h-4 inline mr-2 mb-1" />}
                  <InlineRenderer text={line.text} />
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Red/Blue Pill Choice */}
        {showPillChoice && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <PillChoiceSystem 
              activeOption={PILL_CONFIG.activeOption} 
              onSelect={onPillChoice} 
            />
          </motion.div>
        )}

        {isProcessing && (
          <div className="flex items-center gap-3 text-cyan-400 text-xs animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" /> PROCESSING...
          </div>
        )}
      </div>
    </div>
  );
};

// Input bar component
export const TerminalInput: React.FC<{
  inputValue: string;
  setInputValue: (value: string) => void;
  step: TerminalStep;
  isProcessing: boolean;
  showPillChoice: boolean;
  getPlaceholder: () => string;
  onSubmit: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}> = ({
  inputValue,
  setInputValue,
  step,
  isProcessing,
  showPillChoice,
  getPlaceholder,
  onSubmit,
  inputRef
}) => {
  return (
    <div className="relative border-t border-white/10 bg-black/40 backdrop-blur-xl">
      {/* Animated wire border */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          initial={{ width: "0%", left: "0%" }}
          animate={{ 
            width: ["0%", "30%", "30%", "0%"],
            left: ["0%", "0%", "70%", "100%"]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.6, 1] }}
          style={{ boxShadow: "0 0 10px rgba(34, 211, 238, 0.8)" }}
        />
        <motion.div
          className="absolute top-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
          initial={{ height: "0%", top: "0%" }}
          animate={{ 
            height: ["0%", "100%", "100%", "0%"],
            top: ["0%", "0%", "0%", "100%"]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.75, times: [0, 0.4, 0.6, 1] }}
          style={{ boxShadow: "0 0 10px rgba(34, 211, 238, 0.8)" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 h-[2px] bg-gradient-to-l from-transparent via-cyan-400 to-transparent"
          initial={{ width: "0%", right: "0%" }}
          animate={{ 
            width: ["0%", "30%", "30%", "0%"],
            right: ["0%", "0%", "70%", "100%"]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5, times: [0, 0.4, 0.6, 1] }}
          style={{ boxShadow: "0 0 10px rgba(34, 211, 238, 0.8)" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[2px] bg-gradient-to-t from-transparent via-cyan-400 to-transparent"
          initial={{ height: "0%", bottom: "0%" }}
          animate={{ 
            height: ["0%", "100%", "100%", "0%"],
            bottom: ["0%", "0%", "0%", "100%"]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2.25, times: [0, 0.4, 0.6, 1] }}
          style={{ boxShadow: "0 0 10px rgba(34, 211, 238, 0.8)" }}
        />
      </div>

      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-cyan-500/5"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Input form */}
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(inputValue); }} className="relative flex items-center gap-4 p-4">
        <motion.span 
          className="text-2xl font-bold text-cyan-400"
          animate={{
            textShadow: [
              "0 0 10px rgba(34, 211, 238, 0.5)",
              "0 0 20px rgba(34, 211, 238, 0.8)",
              "0 0 10px rgba(34, 211, 238, 0.5)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          λ
        </motion.span>
        
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-transparent outline-none text-white text-base font-mono placeholder-white/30"
            placeholder={getPlaceholder()}
            disabled={step === 'boot' || isProcessing || showPillChoice}
            autoFocus
          />
          
          {!inputValue && step !== 'boot' && !isProcessing && !showPillChoice && (
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-cyan-400"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ boxShadow: "0 0 10px rgba(34, 211, 238, 1)" }}
            />
          )}
        </div>

        {!inputValue && step !== 'boot' && !isProcessing && !showPillChoice && (
          <motion.span
            className="text-[10px] font-mono text-cyan-400/50 uppercase tracking-widest hidden sm:block"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            [ENTER] Execute
          </motion.span>
        )}
      </form>
    </div>
  );
};

// Default export for backward compatibility
const SpectacularTerminal: React.FC = () => {
  const {
    lines,
    inputValue,
    setInputValue,
    step,
    isProcessing,
    showPillChoice,
    glitchActive,
    scanActive,
    getPlaceholder,
    terminalRef,
    inputRef,
    handleCommand,
    handlePillChoice,
  } = useTerminal();

  return (
    <div className="flex flex-col h-full">
      <TerminalContent
        lines={lines}
        step={step}
        isProcessing={isProcessing}
        showPillChoice={showPillChoice}
        glitchActive={glitchActive}
        scanActive={scanActive}
        onPillChoice={handlePillChoice}
        terminalRef={terminalRef}
      />
      <TerminalInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        step={step}
        isProcessing={isProcessing}
        showPillChoice={showPillChoice}
        getPlaceholder={getPlaceholder}
        onSubmit={handleCommand}
        inputRef={inputRef}
      />
    </div>
  );
};

export { SpectacularTerminal };
export default SpectacularTerminal;
