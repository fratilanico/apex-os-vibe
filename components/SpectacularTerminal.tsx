import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Bot, ArrowRight, Wifi, Shield
} from 'lucide-react';
import * as CLIFormatter from '../lib/cliFormatter';
import { InlineRenderer } from './ui/Terminal/InlineRenderer';

// ═══════════════════════════════════════════════════════════════════════════════
// SPECTACULAR TERMINAL WAITLIST - THE MASTERPIECE EDITION
// Onboarding Journey | Tony Stark Persona | Financial Quant Engine
// ═══════════════════════════════════════════════════════════════════════════════

type OnboardingStep = 'boot' | 'name' | 'email' | 'linkedin' | 'phone' | 'goal' | 'details' | 'consent' | 'processing' | 'chat';

interface TerminalLine {
  id: string;
  text: string;
  type: 'input' | 'output' | 'error' | 'system' | 'success' | 'jarvis' | 'matrix' | 'quant';
  timestamp?: Date;
}

const COLOR_CYCLE = ['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

const BOOT_SEQUENCE = [
  { text: 'Initializing APEX_OS Kernel v6.4.1...', delay: 100, type: 'system' as const },
  { text: 'Loading Neural Interface Protocol...', delay: 400, type: 'system' as const },
  { text: 'Connecting to 17-Agent Swarm...', delay: 700, type: 'matrix' as const },
  { text: 'Synchronizing with APEX OS Intel...', delay: 1000, type: 'jarvis' as const },
  { text: '[OK] FULL WIRE ENGAGED', delay: 1300, type: 'success' as const },
  { text: '', delay: 1400, type: 'system' as const },
  { text: 'Welcome, Founder. To begin Module 00 access, identify yourself.', delay: 1500, type: 'jarvis' as const },
  { text: '# 01 Enter your full name:', delay: 1600, type: 'system' as const },
];

const JOKES: Record<string, string> = {
  sudo: "Nice try. You are already root here. This is YOUR terminal. You have full control.",
  'rm -rf': "You cannot delete the future. Module 00 is immutable. Nice try though.",
  matrix: "Wake up, Neo... The Matrix has you... Follow the white rabbit.",
  coffee: "☕ COFFEE.exe loaded successfully. Caffeine levels: OPTIMAL.",
  beer: "🍺 Pouring beer... Relaxation mode activated. Ship tomorrow.",
  '42': "The Answer to the Ultimate Question of Life, the Universe, and Everything is 42.",
};

const FINANCIALS = {
  mrr: `[FINANCIALS] MRR Projections (Month 1-12)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Month 1:  $10,000  [INIT]
Month 3:  $45,000  [GROWTH]
Month 6:  $185,000 [SCALE]
Month 12: $847,000 [DOMINANCE]

Blended ARPU: $165 | Target CAC: <$20
LTV:CAC Ratio: 9.8:1 ✓`,
  valuation: `[VALUATION] Berkus Method Rationale
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sound Idea:          $500k
Prototype:           $500k
Quality Management:  $500k
Strategic Relations: $500k
Product Rollout:     $500k

Reverse-Engineered Valuation: $2.5M - $5M Post-Seed`,
};

const COMMANDS: Record<string, { description: string, response: string | (() => string) }> = {
  help: {
    description: 'Show available commands',
    response: `[SYSTEM] Intel Menu:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  help          - Show this help menu
  about         - About APEX OS
  status        - Swarm status
  financials    - Revenue projections
  ltv           - Unit economics
  valuation     - Berkus rationale
  agents        - List active agents
  clear         - Clear terminal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
  },
  about: {
    description: 'About APEX OS',
    response: `╔══════════════════════════════════════════════════════════════╗
║                    APEX OS v6.4                              ║
║           The Operating System for the AI Age                ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Mission: Democratize AI-native software development         ║
║  Stack: 17-Agent Swarm + APEX OS Intel + Multi-Model LLMs    ║
║  Cohort: 1,000 founders • 30-day sprint • Zero equity        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`
  },
  agents: {
    description: 'List active agents',
    response: `[MATRIX] Active Agent Swarm
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👑 APEX-OS-MONSTER (Orchestrator)
🔒 Security-Monitor | 🚀 Deploy-Auto
🧠 Intel-Architect  | 💰 Cost-Optimizer
🔧 Builder-Prime    | 🎨 UI-UX-Synthesizer
... and 10 others active in the cascade.`
  }
};

const GOAL_OPTIONS = [
  { id: '1', label: '🚀 Ship an AI product' },
  { id: '2', label: '🎓 Join the Accelerator' },
  { id: '3', label: '🤝 Partner for B2B' },
  { id: '4', label: '🛠️ Hire APEX to build' },
];

export const SpectacularTerminal: React.FC = () => {
  const [step, setStep] = useState<OnboardingStep>('boot');
  const [bootLine, setBootLine] = useState(0);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [colorIndex, setColorIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', linkedin: '', goal: '', details: '', consent: false
  });
  const [_result, setResult] = useState<any>(null);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addLine = useCallback((text: string, type: TerminalLine['type'] = 'output') => {
    setLines(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), text, type, timestamp: new Date() }].slice(-200));
  }, []);

  // Boot Sequence
  useEffect(() => {
    if (step === 'boot' && bootLine < BOOT_SEQUENCE.length) {
      const line = BOOT_SEQUENCE[bootLine];
      if (!line) return;
      const timer = setTimeout(() => {
        addLine(line.text, line.type);
        setBootLine(p => p + 1);
        if (bootLine === BOOT_SEQUENCE.length - 1) setStep('name');
      }, line.delay);
      return () => clearTimeout(timer);
    }
    return;
  }, [bootLine, step, addLine]);

  // Color Cycle
  useEffect(() => {
    const interval = setInterval(() => setColorIndex(p => (p + 1) % COLOR_CYCLE.length), 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [lines]);

  // Handle Onboarding Flow
  const handleOnboarding = async (val: string) => {
    addLine(`> ${val || '(skipped)'}`, 'input');
    setInputValue('');

    switch (step) {
      case 'name':
        setFormData(p => ({ ...p, name: val }));
        addLine('✓ Identity Captured', 'success');
        addLine('', 'system');
        addLine('# 02 Enter your professional email:', 'system');
        setStep('email');
        break;
      case 'email':
        if (!val.includes('@')) { addLine('✗ Invalid email format.', 'error'); return; }
        setFormData(p => ({ ...p, email: val }));
        addLine('✓ Contact Verified', 'success');
        addLine('', 'system');
        addLine('# 03 Enter your LinkedIn URL (optional, press Enter to skip):', 'system');
        setStep('linkedin');
        break;
      case 'linkedin':
        setFormData(p => ({ ...p, linkedin: val }));
        addLine(val ? '✓ Neural Link established' : '✓ Proceeding without LinkedIn', 'success');
        addLine('', 'system');
        addLine('# 04 Enter your phone number (optional, press Enter to skip):', 'system');
        setStep('phone');
        break;
      case 'phone':
        setFormData(p => ({ ...p, phone: val }));
        addLine(val ? '✓ Signal Channel Set' : '✓ Proceeding with digital only', 'success');
        addLine('', 'system');
        addLine('# 05 What is your primary mission goal?', 'system');
        GOAL_OPTIONS.forEach((opt, i) => addLine(`${i + 1}. ${opt.label}`, 'system'));
        setStep('goal');
        break;
      case 'goal':
        const opt = GOAL_OPTIONS.find(o => o.id === val || o.label.toLowerCase().includes(val.toLowerCase()));
        const goal = opt ? opt.label : val;
        setFormData(p => ({ ...p, goal }));
        addLine(`✓ Objective: ${goal}`, 'success');
        addLine('', 'system');
        addLine('# 06 Tell us more about what you\'re building (optional):', 'system');
        setStep('details');
        break;
      case 'details':
        setFormData(p => ({ ...p, details: val }));
        addLine('✓ Intent Logged', 'success');
        addLine('', 'system');
        addLine('# 07 Do you agree to be contacted about APEX OS? (Y/n):', 'system');
        setStep('consent');
        break;
      case 'consent':
        if (val.toLowerCase() === 'n') { addLine('✗ Consent required.', 'error'); return; }
        setFormData(p => ({ ...p, consent: true }));
        setStep('processing');
        finalizeWaitlist({ ...formData, consent: true, details: val });
        break;
    }
  };

  const finalizeWaitlist = async (data: any) => {
    addLine('', 'system');
    addLine('TRANSMITTING DATA TO APEX OS SWARM...', 'system');
    addLine('CALCULATING AI READINESS SCORE...', 'matrix');
    setIsProcessing(true);

    try {
      // Simulate real-time agent synchronization
      const syncAgents = [
        '👑 Infrastructure-Architect SYNCING...',
        '🔒 Security-Monitor VALIDATING...',
        '📋 Compliance-Guardian AUDITING...',
        '💰 Cost-Optimizer PROJECTING...',
        '🧠 Intel-Architect SYNTHESIZING...'
      ];
      
      for (const agent of syncAgents) {
        await new Promise(r => setTimeout(r, 400));
        addLine(agent, 'matrix');
      }

      const response = await fetch('/api/waitlist/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, platform: 'masterpiece_terminal' }),
      });
      const res = await response.json();
      setResult(res);
      
      addLine('', 'system');
      addLine(`✓ AI READINESS SCORE: ${res.ai_score}/100`, 'success');
      addLine(`✓ QUEUE POSITION: #${res.rank}`, 'success');
      addLine('', 'system');
      addLine(`Congratulations ${data.name || 'Founder'}. Welcome to the APEX OS swarm.`, 'jarvis');
      addLine('Type "financials" to see the projections for your new ecosystem.', 'jarvis');
      setStep('chat');
    } catch (e: any) {
      addLine(`✗ ERROR: ${e.message}`, 'error');
      setStep('consent');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Command Path (after onboarding)
  const handleCommand = async (raw: string) => {
    const val = raw.trim();
    const cmd = val.toLowerCase();
    addLine(`> ${val}`, 'input');
    setInputValue('');

    if (JOKES[cmd]) { addLine(JOKES[cmd]!, 'matrix'); return; }
    if (cmd === 'clear') { setLines([]); return; }
    if (cmd === 'help') { addLine(COMMANDS['help']!.response as string, 'system'); return; }
    if (cmd === 'about' || cmd === 'agents') { addLine(COMMANDS[cmd]!.response as string, 'system'); return; }
    if (cmd === 'financials' || cmd === 'mrr') { addLine(FINANCIALS.mrr, 'quant'); return; }
    if (cmd === 'valuation') { addLine(FINANCIALS.valuation, 'quant'); return; }
    if (cmd === 'status') { addLine('[SYSTEM] 17 Agents Synchronized. All systems nominal.', 'success'); return; }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/ai-unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: val, 
          history: lines.slice(-10).map(l => ({ role: l.type === 'input' ? 'user' : 'assistant', content: l.text })),
          context: 'User is in APEX terminal. Tony Stark mode. Focus on Module 00.' 
        }),
      });
      const data = await res.json();
      const formatted = CLIFormatter.convertMarkdownToCLI(data.content || '');
      formatted.split('\n').forEach(l => addLine(l, 'output'));
    } catch (e: any) {
      addLine(`Error: ${e.message}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentColor = COLOR_CYCLE[colorIndex]!;

  return (
    <div className="flex-1 bg-black/90 backdrop-blur-2xl border-2 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(6,182,212,0.1)]"
         style={{ borderColor: `${currentColor}40` }}>
      {/* Terminal Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <span className="ml-2 text-[10px] font-mono font-bold text-white/40 tracking-widest uppercase">
            APEX_OS // {step === 'chat' ? 'LIVE_INTERFACE' : 'ONBOARDING_PROTOCOL'}
          </span>
        </div>
        <div className="flex gap-6 text-[10px] font-mono text-white/30 uppercase tracking-widest">
          <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-emerald-400" /> Online</span>
          <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-cyan-400" /> Secure</span>
        </div>
      </div>

      {/* Output area */}
      <div ref={terminalRef} className="flex-1 overflow-y-auto p-8 font-mono space-y-3 custom-scrollbar">
        <AnimatePresence>
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-sm leading-relaxed ${
                line.type === 'input' ? 'text-cyan-400' :
                line.type === 'error' ? 'text-red-400' :
                line.type === 'success' ? 'text-emerald-400' :
                line.type === 'jarvis' ? 'text-violet-400 font-bold' :
                line.type === 'matrix' ? 'text-green-400' :
                line.type === 'quant' ? 'text-amber-400' :
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

      {/* Input area */}
      <form 
        onSubmit={(e) => { e.preventDefault(); if (step === 'chat') handleCommand(inputValue); else handleOnboarding(inputValue); }}
        className="p-6 border-t border-white/10 bg-white/5 flex items-center gap-4"
      >
        <span className="text-xl font-bold font-mono" style={{ color: currentColor }}>λ</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 bg-transparent outline-none text-white text-base font-mono placeholder-white/10"
          placeholder={step === 'boot' ? "Initializing..." : "Type response..."}
          disabled={step === 'boot' || isProcessing}
          autoFocus
        />
        <button type="submit" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
          <ArrowRight className="w-6 h-6 text-white/20" />
        </button>
      </form>
    </div>
  );
};
