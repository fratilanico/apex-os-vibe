'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Wifi, Shield, Terminal } from 'lucide-react';
import { useOnboardingStore, OnboardingStep } from '../stores/useOnboardingStore';
import { processAdminCommand } from '../lib/admin/terminalAdmin';
import { PILL_CONFIG } from '../config/pillConfig';
import { PillChoiceSystem } from './PillChoiceSystem';
import { InlineRenderer } from './ui/Terminal/InlineRenderer';
import { queryAI } from '../lib/ai/globalAIService';
import { APEX_LOGO_ASCII_LINES } from '../lib/terminal/constants';
import { convertMarkdownToCLI } from '../lib/cliFormatter';

interface TerminalLine {
  id: string;
  text: string;
  type: 'input' | 'output' | 'error' | 'system' | 'success' | 'jarvis' | 'matrix' | 'ascii' | 'brand-logo';
}

const BOOT_SEQUENCE = [
  { text: JSON.stringify(APEX_LOGO_ASCII_LINES), delay: 0, type: 'brand-logo' as const },
  { text: '', delay: 100, type: 'system' as const },
  { text: '╔══════════════════════════════════════════════════════════════════════════════╗', delay: 200, type: 'system' as const },
  { text: '║  🔥 APEX_OS KERNEL v6.4.2 — INITIALIZING NEURAL INTERFACE                    ║', delay: 300, type: 'system' as const },
  { text: '╚══════════════════════════════════════════════════════════════════════════════╝', delay: 400, type: 'system' as const },
  { text: '', delay: 500, type: 'system' as const },
  { text: '> [SYSTEM] Loading Neural Interface Protocol...', delay: 700, type: 'system' as const },
  { text: '> [SWARM]  Connecting to 17-Agent Swarm Intelligence...', delay: 1000, type: 'matrix' as const },
  { text: '> [LINK]   Establishing secure tunneling via GCP Cloud Run...', delay: 1300, type: 'system' as const },
  { text: '✓ [OK] FULL WIRE ENGAGED', delay: 1600, type: 'success' as const },
  { text: '', delay: 1700, type: 'system' as const },
  { text: 'Identity node awaits. Who joins the swarm today?', delay: 1900, type: 'jarvis' as const },
  { text: '', delay: 2000, type: 'system' as const },
];

const stepPrompts: Record<string, string[]> = {
  boot: ['Initializing...', 'Connecting...'],
  idle: [
    'What is your name?',
    'Enter your name...',
    'Awaiting identification...',
    'Who is joining us?'
  ],
  email_guard: [
    'What is your email?',
    'Where can we reach you?',
    'Enter your coordinates...',
    'Secure link?'
  ],
  processing: ['Syncing...', 'Validating...'],
  unlocked: [
    'Try "help" for commands...',
    'Ask me anything...',
    'Ready for your mission?',
    'Vault access: type "vault"...',
    'Admin? Try "admin"...',
    'Status check? Type "status"...',
    'Next move?',
    'Awaiting command...'
  ]
};

export const useTerminal = (onComplete?: (data: { name: string; email: string; persona: 'PERSONAL' | 'BUSINESS' }) => void) => {
  const { step, setStep, setPersona, setEmail, unlock, addHistory, trackTerminalCommand, persona, isUnlocked, email } = useOnboardingStore();
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

  const addLine = useCallback((text: string, type: TerminalLine['type'] = 'output') => {
    const id = Math.random().toString(36).substr(2, 9);
    setLines(prev => [...prev, { id, text, type }]);
    addHistory(`[${type.toUpperCase()}] ${text}`);
  }, [addHistory]);

  const performHandshake = async (name: string) => {
    setStep('processing');
    setScanActive(true);
    setIsProcessing(true);
    
    // Epic Scroll & Focus
    requestAnimationFrame(() => {
      terminalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    addLine('', 'system');
    addLine('┌───────────────────────────────────────┐', 'matrix');
    addLine('│  SYSTEM HANDSHAKE: PHASE 1/3          │', 'matrix');
    addLine('│  Syncing configuration...             │', 'matrix');
    addLine('└───────────────────────────────────────┘', 'matrix');
    addLine('[██░░░░░░░░] 20%', 'matrix');
    
    await new Promise(r => setTimeout(r, 1200));
    setScanActive(false);
    setGlitchActive(true);
    
    addLine('┌───────────────────────────────────────┐', 'matrix');
    addLine('│  SYSTEM HANDSHAKE: PHASE 2/3          │', 'matrix');
    addLine('│  Scanning details...                  │', 'matrix');
    addLine('└───────────────────────────────────────┘', 'matrix');
    addLine('[██████░░░░] 60%', 'matrix');
    
    await new Promise(r => setTimeout(r, 1500));
    setGlitchActive(false);
    
    addLine('┌───────────────────────────────────────┐', 'matrix');
    addLine('│  SYSTEM HANDSHAKE: PHASE 3/3          │', 'matrix');
    addLine('│  System: CONNECTED                    │', 'matrix');
    addLine('└───────────────────────────────────────┘', 'matrix');
    addLine('[██████████] 100%', 'success');
    
    await new Promise(r => setTimeout(r, 800));
    setIsProcessing(false);
    setStep('unlocked');
    unlock();
    
    addLine('', 'system');
    addLine(`✓ SYSTEM ACTIVE: ${name.toUpperCase()}`, 'success');
    addLine('✓ CONNECTION ESTABLISHED', 'success');
    addLine('', 'system');
    addLine('Alright, you\'re in. Choose your journey below.', 'jarvis');
    
    setShowPillChoice(true);
  };

  const handlePillChoice = (choice: 'red' | 'blue') => {
    setShowPillChoice(false);
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 500);
    
    const chosenPersona = choice === 'red' ? 'BUSINESS' : 'PERSONAL';
    
    if (choice === 'red') {
      setPersona('BUSINESS');
      addLine('', 'system');
      addLine('🔴 RED PILL SELECTED: BUSINESS ARCHITECT', 'success');
      addLine('Initializing business dashboards and metrics.', 'jarvis');
      addLine('', 'system');
      addLine('┌──────────────────────────────────────────┐', 'matrix');
      addLine('│  BUSINESS MODULES UNLOCKED               │', 'matrix');
      addLine('├──────────┬─────────────────┬─────────────┤', 'matrix');
      addLine('│ Module   │ Description     │ Status      │', 'matrix');
      addLine('├──────────┼─────────────────┼─────────────┤', 'matrix');
      addLine('│ TEAM     │ Agent Network   │ 🟢 READY    │', 'matrix');
      addLine('│ BUILD    │ Systems Setup   │ 🟢 READY    │', 'matrix');
      addLine('│ STATS    │ ROI & Growth    │ 🟢 READY    │', 'matrix');
      addLine('│ VAULT    │ Tier 2 Access   │ 🔒 LOCKED   │', 'matrix');
      addLine('└──────────┴─────────────────┴─────────────┘', 'matrix');
    } else {
      setPersona('PERSONAL');
      addLine('', 'system');
      addLine('🔵 BLUE PILL SELECTED: PERSONAL BUILDER', 'success');
      addLine('Initializing personal building tools.', 'jarvis');
      addLine('', 'system');
      addLine('┌──────────────────────────────────────────┐', 'matrix');
      addLine('│  PERSONAL MODULES UNLOCKED               │', 'matrix');
      addLine('├──────────┬─────────────────┬─────────────┤', 'matrix');
      addLine('│ Module   │ Description     │ Status      │', 'matrix');
      addLine('├──────────┼─────────────────┼─────────────┤', 'matrix');
      addLine('│ SKILLS   │ Tool Mastery    │ 🟢 READY    │', 'matrix');
      addLine('│ VIBE     │ Modern Dev      │ 🟢 READY    │', 'matrix');
      addLine('│ PROJECTS │ Simple Theory   │ 🟢 READY    │', 'matrix');
      addLine('│ FORGE    │ Tier 2 Access   │ 🔒 LOCKED   │', 'matrix');
      addLine('└──────────┴─────────────────┴─────────────┘', 'matrix');
    }
    
    addLine('', 'system');
    addLine('The terminal is hot. Try "help" or access the "vault".', 'system');

    // Trigger completion callback
    if (onComplete) {
      onComplete({
        name: formData.name,
        email: formData.email,
        persona: chosenPersona
      });
    }
  };

  useEffect(() => {
    if (step === 'boot' || step === 'processing') return;
    
    const prompts = stepPrompts[step] || ['Type response...'];
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % prompts.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [step]);

  const getPlaceholder = useCallback(() => {
    if (step === 'boot') return 'Initializing...';
    if (step === 'processing') return 'Processing...';
    const prompts = stepPrompts[step] || ['Type response...'];
    return prompts[promptIndex % prompts.length] || 'Type response...';
  }, [step, promptIndex]);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [lines, showPillChoice]);

  // Boot sequence
  useEffect(() => {
    if (bootLine < BOOT_SEQUENCE.length) {
      const line = BOOT_SEQUENCE[bootLine];
      if (!line) return;
      const prevLine = bootLine > 0 ? BOOT_SEQUENCE[bootLine - 1] : null;
      const delay = line.delay - (prevLine?.delay ?? 0);
      
      const timer = setTimeout(() => {
        addLine(line.text, line.type);
        setBootLine(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else if (step === 'boot') {
      setStep('idle');
      addLine('# 01 Identity Node: Enter your designation:', 'system');
    }
    return undefined;
  }, [bootLine, step, addLine, setStep]);

  const handleCommand = async (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;

    addLine(`> ${trimmed}`, 'input');
    setInputValue('');

    if (step === 'idle') {
      if (trimmed.length < 2) {
        addLine('Name too short. Try again:', 'error');
        trackTerminalCommand(trimmed, 'input', 'Name too short', 'error');
        return;
      }
      setFormData(p => ({ ...p, name: trimmed }));
      addLine(`✓ Identity Logged: ${trimmed}`, 'success');
      trackTerminalCommand(trimmed, 'input', 'Identity Logged', 'success');
      addLine('', 'system');
      addLine('# 02 Email Guard: Enter your primary email:', 'system');
      setStep('email_guard');
      return;
    }

    if (step === 'email_guard') {
      if (!/\S+@\S+\.\S+/.test(trimmed)) {
        addLine('Invalid email format. Retry:', 'error');
        trackTerminalCommand(trimmed, 'input', 'Invalid email format', 'error');
        return;
      }

      // Check if email already exists in our system (Welcome Back logic)
      setIsProcessing(true);
      try {
        const response = await fetch(`/api/waitlist/status?email=${encodeURIComponent(trimmed)}`);
        const result = await response.json();
        
        if (result.exists) {
          setFormData(p => ({ ...p, email: trimmed, name: result.name || p.name }));
          setEmail(trimmed);
          if (result.persona) setPersona(result.persona.toUpperCase());
          
          addLine(`✓ Welcome back, operator ${result.name || ''}.`, 'success');
          addLine('> [SYNC] Restoring neural configuration...', 'matrix');
          await new Promise(r => setTimeout(r, 1000));
          
          setStep('unlocked');
          unlock();
          
          addLine('', 'system');
          addLine('Identity verified via remote node.', 'jarvis');
          addLine('Link established. Swarm access granted.', 'success');
          
          if (onComplete) {
            onComplete({
              name: result.name || formData.name,
              email: trimmed,
              persona: result.persona?.toUpperCase() || 'PERSONAL'
            });
          }
          return;
        }
      } catch (err) {
        console.warn('Failed to check email status:', err);
      } finally {
        setIsProcessing(false);
      }

      setFormData(p => ({ ...p, email: trimmed }));
      setEmail(trimmed);
      addLine('✓ Email Locked.', 'success');
      trackTerminalCommand(trimmed, 'input', 'Email Locked', 'success');
      await performHandshake(formData.name);
      return;
    }

    if (step === 'unlocked') {
      const lower = trimmed.toLowerCase();
      
      const adminResult = processAdminCommand(lower);
      if (adminResult.isAdmin) {
        if (Array.isArray(adminResult.response)) {
          adminResult.response.forEach(line => addLine(line, 'system'));
        } else {
          addLine(adminResult.response, 'system');
        }
        trackTerminalCommand(trimmed, 'admin', Array.isArray(adminResult.response) ? adminResult.response.join('\n') : adminResult.response);
        return;
      }
      
      if (lower === 'help') {
        addLine('╔══════════════════════════════════════════════════════════════════════════════╗', 'system');
        addLine('║  AVAILABLE COMMANDS — SYSTEM INTERFACE                                       ║', 'system');
        addLine('╚══════════════════════════════════════════════════════════════════════════════╝', 'system');
        addLine('', 'system');
        addLine('  status   - View system diagnostics', 'system');
        addLine('  vault    - Access your personal resources', 'system');
        addLine('  academy  - Visit the Learning Matrix', 'system');
        addLine('  clear    - Clear the terminal', 'system');
        addLine('  admin    - Admin access (requires password)', 'system');
        addLine('', 'system');
        addLine('You can also ask me anything, and I will route it to our AI network.', 'jarvis');
        trackTerminalCommand(trimmed, 'system', 'HELP displayed');
        return;
      }

      if (lower === 'status') {
        addLine('╔═══════════════════════════════════════╗', 'matrix');
        addLine('║  SYSTEM STATUS: ONLINE                ║', 'matrix');
        addLine('╠═══════════════════════════════════════╣', 'matrix');
        addLine('║  ✓ ASSISTANT: [██████████] 100%       ║', 'matrix');
        addLine('║  ✓ ARCHITECT: [████████░░] 80%        ║', 'matrix');
        addLine('║  ! NETWORK  : [████░░░░░░] 40%        ║', 'matrix');
        addLine('╚═══════════════════════════════════════╝', 'matrix');
        addLine('', 'system');
        addLine(`User:      ${formData.name || 'Unknown'}`, 'system');
        addLine(`Persona:   ${persona || 'Pending'}`, 'system');
        addLine(`Link:      ${isUnlocked ? 'CONNECTED' : 'STANDBY'}`, 'system');
        trackTerminalCommand(trimmed, 'system', 'STATUS displayed');
        return;
      }

      if (lower === 'clear') {
        setLines([]);
        trackTerminalCommand(trimmed, 'system', 'Terminal cleared');
        return;
      }

      if (lower === 'vault') {
        addLine('╔══════════════════════════════════════════════════════════════════════════════╗', 'jarvis');
        addLine('║  ACCESSING RESOURCE VAULT...                                                 ║', 'jarvis');
        addLine('╚══════════════════════════════════════════════════════════════════════════════╝', 'jarvis');
        addLine('', 'system');
        addLine('> [SECURITY] Checking access level...', 'system');
        addLine('> [SECURITY] Additional steps required.', 'error');
        addLine('', 'system');
        addLine('Looks like you haven\'t unlocked the full vault yet. Let\'s keep building.', 'jarvis');
        trackTerminalCommand(trimmed, 'system', 'VAULT accessed (denied)');
        return;
      }

      // NO RECOGNIZED COMMAND -> Query AI Swarm
      setIsProcessing(true);
      try {
        const response = await queryAI({
          message: trimmed,
          history: lines.slice(-5).map(l => ({
            role: l.type === 'input' ? 'user' : 'assistant',
            content: l.text
          })),
          userEmail: email || undefined,
          context: `Terminal Operator Session. Step: ${step}. Persona: ${persona}. Sync Level: ${isUnlocked ? 'TIER 1' : 'TIER 0'}.`
        });
        
        const formatted = convertMarkdownToCLI(response.content);
        addLine(formatted, 'jarvis');
        trackTerminalCommand(trimmed, 'input', response.content, 'success');
      } catch (error) {
        addLine('Communication error. Swarm link unstable.', 'error');
        trackTerminalCommand(trimmed, 'input', 'AI Query failed', 'error');
      } finally {
        setIsProcessing(false);
      }
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

export const TerminalContent: React.FC<{
  lines: TerminalLine[];
  step: OnboardingStep;
  isProcessing: boolean;
  showPillChoice: boolean;
  glitchActive: boolean;
  scanActive: boolean;
  onPillChoice: (choice: 'red' | 'blue') => void;
  terminalRef: React.RefObject<HTMLDivElement | null>;
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
      className={`bg-black/90 backdrop-blur-2xl border-2 border-cyan-500/30 overflow-hidden flex flex-col justify-between shadow-2xl transition-all duration-1000 relative h-full ${glitchActive ? 'animate-glitch' : ''}`}
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
              onSelect={(choice) => onPillChoice(choice === 'personal' ? 'blue' : 'red')} 
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

export const TerminalInput: React.FC<{
  inputValue: string;
  setInputValue: (value: string) => void;
  step: OnboardingStep;
  isProcessing: boolean;
  showPillChoice: boolean;
  getPlaceholder: () => string;
  onSubmit: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
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

export const SpectacularTerminal: React.FC<{ onComplete?: (data: any) => void }> = ({ onComplete }) => {
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
  } = useTerminal(onComplete);

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

export default SpectacularTerminal;
