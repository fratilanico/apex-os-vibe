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
  { text: '║  [gold]🔥 APEX_OS KERNEL v6.4.2 — INITIALIZING NEURAL INTERFACE[/gold]                    ║', delay: 300, type: 'system' as const },
  { text: '╚══════════════════════════════════════════════════════════════════════════════╝', delay: 400, type: 'system' as const },
  { text: '', delay: 500, type: 'system' as const },
  { text: '> [[cyan]SYSTEM[/cyan]] Loading [violet]Neural Interface Protocol[/violet]...', delay: 700, type: 'system' as const },
  { text: '> [[pink]SWARM[/pink]]  Connecting to [emerald]17-Agent Swarm Intelligence[/emerald]...', delay: 1000, type: 'matrix' as const },
  { text: '> [[indigo]LINK[/indigo]]   Establishing secure tunneling via [blue]GCP Cloud Run[/blue]...', delay: 1300, type: 'system' as const },
  { text: '✓ [[emerald]OK[/emerald]] [lime]FULL WIRE ENGAGED[/lime]', delay: 1600, type: 'success' as const },
  { text: '', delay: 1700, type: 'system' as const },
  { text: '[violet]Identity node awaits.[/violet] Who joins the swarm today?', delay: 1900, type: 'jarvis' as const },
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, showPillChoice, isProcessing, scrollToBottom]);

  const addLine = useCallback((text: string, type: TerminalLine['type'] = 'output') => {
    const id = Math.random().toString(36).substr(2, 9);
    setLines(prev => [...prev, { id, text, type }]);
    addHistory(`[${type.toUpperCase()}] ${text}`);
  }, [addHistory]);

  const performHandshake = async (name: string) => {
    setStep('processing');
    setScanActive(true);
    setIsProcessing(true);
    
    requestAnimationFrame(() => {
      terminalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    addLine('', 'system');
    addLine('┌───────────────────────────────────────┐', 'matrix');
    addLine('│  [violet]NEURAL HANDSHAKE: PHASE 1/3[/violet]          │', 'matrix');
    addLine('│  [cyan]Chromatic Aberration Syncing...[/cyan]      │', 'matrix');
    addLine('└───────────────────────────────────────┘', 'matrix');
    addLine('[[emerald]██[/emerald]░░░░░░░░] 20%', 'matrix');
    
    await new Promise(r => setTimeout(r, 1200));
    setScanActive(false);
    setGlitchActive(true);
    
    addLine('┌───────────────────────────────────────┐', 'matrix');
    addLine('│  [violet]NEURAL HANDSHAKE: PHASE 2/3[/violet]          │', 'matrix');
    addLine('│  [pink]Biometric Signature Scan...[/pink]          │', 'matrix');
    addLine('└───────────────────────────────────────┘', 'matrix');
    addLine('[[emerald]██████[/emerald]░░░░] 60%', 'matrix');
    
    await new Promise(r => setTimeout(r, 1500));
    setGlitchActive(false);
    
    addLine('┌───────────────────────────────────────┐', 'matrix');
    addLine('│  [violet]NEURAL HANDSHAKE: PHASE 3/3[/violet]          │', 'matrix');
    addLine('│  [lime]Identity Node: CONNECTED[/lime]             │', 'matrix');
    addLine('└───────────────────────────────────────┘', 'matrix');
    addLine('[[emerald]██████████[/emerald]] 100%', 'success');
    
    await new Promise(r => setTimeout(r, 800));
    setIsProcessing(false);
    setStep('unlocked');
    unlock();
    
    addLine('', 'system');
    addLine(`✓ [emerald]IDENTITY CONFIRMED[/emerald]: [gold]${name.toUpperCase()}[/gold]`, 'success');
    addLine('✓ [lime]FULL WIRE ENGAGED[/lime]', 'success');
    addLine('', 'system');
    addLine("Alright, you're in. [violet]Choose your path now.[/violet]", 'jarvis');
    
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
      addLine('Initializing enterprise dashboards.', 'jarvis');
      addLine('', 'system');
      addLine('┌──────────────────────────────────────────┐', 'matrix');
      addLine('│  BUSINESS MODULES UNLOCKED               │', 'matrix');
      addLine('├──────────┬─────────────────┬─────────────┤', 'matrix');
      addLine('│ Module   │ Description     │ Status      │', 'matrix');
      addLine('├──────────┼─────────────────┼─────────────┤', 'matrix');
      addLine('│ SWARM    │ Agent Network   │ 🟢 READY    │', 'matrix');
      addLine('│ ORG      │ Systems Setup   │ 🟢 READY    │', 'matrix');
      addLine('│ STATS    │ ROI & Growth    │ 🟢 READY    │', 'matrix');
      addLine('│ VAULT    │ Tier 2 Access   │ 🔒 LOCKED   │', 'matrix');
      addLine('└──────────┴─────────────────┴─────────────┘', 'matrix');
    } else {
      setPersona('PERSONAL');
      addLine('', 'system');
      addLine('🔵 BLUE PILL SELECTED: PERSONAL BUILDER', 'success');
      addLine('Initializing individual building tools.', 'jarvis');
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
    addLine('Link established. Try "help" or access the "vault".', 'system');

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
        return;
      }
      setFormData(p => ({ ...p, name: trimmed }));
      addLine(`✓ Identity Logged: ${trimmed}`, 'success');
      addLine('', 'system');
      addLine('# 02 Email Guard: Enter your primary email:', 'system');
      setStep('email_guard');
      return;
    }

    if (step === 'email_guard') {
      if (!/\S+@\S+\.\S+/.test(trimmed)) {
        addLine('Invalid email format. Retry:', 'error');
        return;
      }
      setIsProcessing(true);
      try {
        const response = await fetch(`/api/waitlist/status?email=${encodeURIComponent(trimmed)}`);
        const result = await response.json();
        if (result.exists) {
          setFormData(p => ({ ...p, email: trimmed, name: result.name || p.name }));
          setEmail(trimmed);
          if (result.persona) setPersona(result.persona.toUpperCase());
          addLine(`✓ Welcome back, operator ${result.name || ''}.`, 'success');
          addLine('> [SYNC] Restoring configuration...', 'matrix');
          await new Promise(r => setTimeout(r, 1000));
          setStep('unlocked');
          unlock();
          addLine('', 'system');
          addLine('Identity verified via remote node.', 'jarvis');
          addLine('The link is hot. Access granted.', 'success');
          if (onComplete) {
            onComplete({
              name: result.name || formData.name,
              email: trimmed,
              persona: (result.persona?.toUpperCase() as any) || 'PERSONAL'
            });
          }
          return;
        }
      } catch (err) {
        console.warn('Email check failed', err);
      } finally {
        setIsProcessing(false);
      }
      setFormData(p => ({ ...p, email: trimmed }));
      setEmail(trimmed);
      addLine('✓ Coordinates Locked.', 'success');
      await performHandshake(formData.name);
      return;
    }

    if (step === 'unlocked') {
      const lower = trimmed.toLowerCase();
      const adminResult = processAdminCommand(lower);
      if (adminResult.isAdmin) {
        if (Array.isArray(adminResult.response)) adminResult.response.forEach(l => addLine(l, 'system'));
        else addLine(adminResult.response, 'system');
        return;
      }
      if (lower === 'help') {
        addLine('╔══════════════════════════════════════════════════════════════════════════════╗', 'system');
        addLine('║  [cyan]AVAILABLE COMMANDS — SYSTEM INTERFACE[/cyan]                                       ║', 'system');
        addLine('╚══════════════════════════════════════════════════════════════════════════════╝', 'system');
        addLine('', 'system');
        addLine('  [emerald]status[/emerald]   - [cyan]View system diagnostics & neural sync[/cyan]', 'system');
        addLine('  [emerald]vault[/emerald]    - [cyan]Access encrypted resource modules[/cyan]', 'system');
        addLine('  [emerald]academy[/emerald]  - [cyan]Visit the Learning Matrix[/cyan]', 'system');
        addLine('  [emerald]clear[/emerald]    - [cyan]Flush terminal buffer[/cyan]', 'system');
        addLine('  [emerald]admin[/emerald]    - [rose]Admin access (Tier 2 required)[/rose]', 'system');
        addLine('', 'system');
        addLine('[violet]Any other input will be routed to the Swarm Intelligence.[/violet]', 'jarvis');
        return;
      }
      if (lower === 'status') {
        addLine('╔═══════════════════════════════════════╗', 'matrix');
        addLine('║  [cyan]SYSTEM STATUS:[/cyan] [gold]ONLINE[/gold]                ║', 'matrix');
        addLine('╠═══════════════════════════════════════╣', 'matrix');
        addLine('║  ✓ [emerald]ASSISTANT[/emerald]: [██████████] 100%       ║', 'matrix');
        addLine('║  ✓ [violet]ARCHITECT[/violet]: [████████░░] 80%        ║', 'matrix');
        addLine('║  ! [pink]NETWORK[/pink]  : [████░░░░░░] 40%        ║', 'matrix');
        addLine('╚═══════════════════════════════════════╝', 'matrix');
        addLine('', 'system');
        addLine(`[cyan]User:[/cyan]      [gold]${formData.name || 'Unknown'}[/gold]`, 'system');
        addLine(`[cyan]Persona:[/cyan]   [violet]${persona || 'Pending'}[/violet]`, 'system');
        addLine(`[cyan]Neural:[/cyan]    ${isUnlocked ? '[emerald]CONNECTED[/emerald]' : '[rose]STANDBY[/rose]'}`, 'system');
        return;
      }
      if (lower === 'clear') { setLines([]); return; }
      if (lower === 'vault') {
        addLine('╔══════════════════════════════════════════════════════════════════════════════╗', 'jarvis');
        addLine('║  ACCESSING RESOURCE VAULT...                                                 ║', 'jarvis');
        addLine('╚══════════════════════════════════════════════════════════════════════════════╝', 'jarvis');
        addLine('', 'system');
        addLine('> [SECURITY] Checking access...', 'system');
        addLine('> [SECURITY] Additional steps required.', 'error');
        return;
      }
      setIsProcessing(true);
      try {
        const response = await queryAI({
          message: trimmed,
          history: lines.slice(-5).map(l => ({ role: l.type === 'input' ? 'user' : 'assistant', content: l.text })),
          userEmail: email || undefined,
          context: `Terminal Session. Persona: ${persona}. Sync: ${isUnlocked}.`
        });
        addLine(convertMarkdownToCLI(response.content), 'jarvis');
      } catch (error) {
        addLine('Communication error. Swarm link unstable.', 'error');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return {
    lines, inputValue, setInputValue, step, isProcessing, showPillChoice, glitchActive, scanActive, getPlaceholder, terminalRef, scrollRef, inputRef, handleCommand, handlePillChoice,
  };
};

export const TerminalContent: React.FC<{
  lines: TerminalLine[]; step: OnboardingStep; isProcessing: boolean; showPillChoice: boolean; glitchActive: boolean; scanActive: boolean; onPillChoice: (choice: 'red' | 'blue') => void; terminalRef: React.RefObject<HTMLDivElement | null>; scrollRef: React.RefObject<HTMLDivElement | null>;
}> = ({ lines, step, isProcessing, showPillChoice, glitchActive, scanActive, onPillChoice, terminalRef, scrollRef }) => {
  return (
    <div ref={terminalRef} className={`bg-black/90 backdrop-blur-2xl border-2 border-cyan-500/30 overflow-hidden flex flex-col justify-between shadow-2xl transition-all duration-1000 relative h-full ${glitchActive ? 'animate-glitch' : ''}`}>
      {scanActive && (
        <motion.div initial={{ top: 0 }} animate={{ top: '100%' }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.8)] z-50 pointer-events-none" />
      )}
      {glitchActive && <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay z-50 pointer-events-none animate-pulse" />}
      
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full animate-pulse bg-cyan-400" />
          <span className="text-[10px] font-mono font-bold text-white/40 tracking-widest uppercase">
            [cyan]APEX_OS[/cyan] // {step === 'unlocked' ? '[emerald]OPERATOR_MODE[/emerald]' : '[violet]HANDSHAKE_PROTOCOL[/violet]'}
          </span>
        </div>
        <div className="flex gap-4 text-[10px] font-mono text-white/30 uppercase tracking-widest">
          <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-emerald-400" /> [emerald]Online[/emerald]</span>
          <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-cyan-400" /> [cyan]Secure[/cyan]</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 font-mono space-y-2 sm:space-y-3 custom-scrollbar min-h-0 scroll-smooth">
        <AnimatePresence>
          {lines.map((line) => (
            <motion.div key={line.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`text-xs sm:text-sm leading-relaxed ${line.type === 'input' ? 'text-cyan-400' : line.type === 'error' ? 'text-red-400 font-bold' : line.type === 'success' ? 'text-emerald-400 font-bold' : line.type === 'jarvis' ? 'text-violet-400 font-semibold' : line.type === 'matrix' ? 'text-green-400' : 'text-white/70'}`}>
              {line.type === 'ascii' || line.type === 'brand-logo' ? (
                <pre className="font-mono whitespace-pre leading-[0.85] text-[6px] sm:text-xs" style={{ fontFamily: '"Courier New", Courier, monospace', letterSpacing: '0px', textRendering: 'geometricPrecision' }}>
                  {line.type === 'brand-logo' ? (() => { try { const data = JSON.parse(line.text); return data.map((l: any, i: number) => ( <span key={i} style={{ color: l.color, display: 'block' }}>{l.text}</span> )); } catch { return line.text; } })() : line.text}
                </pre>
              ) : (
                <><InlineRenderer text={line.text} /></>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {showPillChoice && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <PillChoiceSystem activeOption={PILL_CONFIG.activeOption} onSelect={(choice) => onPillChoice(choice === 'personal' ? 'blue' : 'red')} />
          </motion.div>
        )}
        {isProcessing && <div className="flex items-center gap-3 text-cyan-400 text-xs animate-pulse"><Loader2 className="w-4 h-4 animate-spin" /> PROCESSING...</div>}
        <div ref={scrollRef} className="h-4 w-full opacity-0 pointer-events-none" />
      </div>
    </div>
  );
};

export const TerminalInput: React.FC<{
  inputValue: string; setInputValue: (value: string) => void; step: OnboardingStep; isProcessing: boolean; showPillChoice: boolean; getPlaceholder: () => string; onSubmit: (value: string) => void; inputRef: React.RefObject<HTMLInputElement | null>;
}> = ({ inputValue, setInputValue, step, isProcessing, showPillChoice, getPlaceholder, onSubmit, inputRef }) => {
  return (
    <div className="relative border-t border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" animate={{ width: ["0%", "30%", "30%", "0%"], left: ["0%", "0%", "70%", "100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.6, 1] }} style={{ boxShadow: "0 0 10px rgba(34, 211, 238, 0.8)" }} />
        <motion.div className="absolute top-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent" animate={{ height: ["0%", "100%", "100%", "0%"], top: ["0%", "0%", "0%", "100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.75, times: [0, 0.4, 0.6, 1] }} style={{ boxShadow: "0 0 10px rgba(34, 211, 238, 0.8)" }} />
        <motion.div className="absolute bottom-0 right-0 h-[2px] bg-gradient-to-l from-transparent via-cyan-400 to-transparent" animate={{ width: ["0%", "30%", "30%", "0%"], right: ["0%", "0%", "70%", "100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5, times: [0, 0.4, 0.6, 1] }} style={{ boxShadow: "0 0 10px rgba(34, 211, 238, 0.8)" }} />
        <motion.div className="absolute bottom-0 left-0 w-[2px] bg-gradient-to-t from-transparent via-cyan-400 to-transparent" animate={{ height: ["0%", "100%", "100%", "0%"], bottom: ["0%", "0%", "0%", "100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2.25, times: [0, 0.4, 0.6, 1] }} style={{ boxShadow: "0 0 10px rgba(34, 211, 238, 0.8)" }} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(inputValue); }} className="relative flex items-center gap-4 p-4">
        <span className="text-2xl font-bold text-cyan-400">λ</span>
        <div className="flex-1 relative">
          <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full bg-transparent outline-none text-white text-base font-mono placeholder-white/30" placeholder={getPlaceholder()} disabled={step === 'boot' || isProcessing || showPillChoice} autoFocus />
        </div>
      </form>
    </div>
  );
};

export const SpectacularTerminal: React.FC<{ onComplete?: (data: any) => void }> = ({ onComplete }) => {
  const { lines, inputValue, setInputValue, step, isProcessing, showPillChoice, glitchActive, scanActive, getPlaceholder, terminalRef, scrollRef, inputRef, handleCommand, handlePillChoice } = useTerminal(onComplete);
  return (
    <div className="flex flex-col h-full">
      <TerminalContent lines={lines} step={step} isProcessing={isProcessing} showPillChoice={showPillChoice} glitchActive={glitchActive} scanActive={scanActive} onPillChoice={handlePillChoice} terminalRef={terminalRef} scrollRef={scrollRef} />
      <TerminalInput inputValue={inputValue} setInputValue={setInputValue} step={step} isProcessing={isProcessing} showPillChoice={showPillChoice} getPlaceholder={getPlaceholder} onSubmit={handleCommand} inputRef={inputRef} />
    </div>
  );
};

export default SpectacularTerminal;
