import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Wifi, Shield, ArrowRight } from 'lucide-react';
import * as CLIFormatter from '../lib/cliFormatter';
import { InlineRenderer } from './ui/Terminal/InlineRenderer';

// ═══════════════════════════════════════════════════════════════════════════════
// TERMINAL HERO - FULL IMMERSIVE ONBOARDING
// ═══════════════════════════════════════════════════════════════════════════════

export interface CommandRecord {
  command: string;
  intent: 'navigation' | 'module' | 'contact' | 'social' | 'faq' | 'system';
  timestamp: number;
  sessionId: string;
}

interface TerminalHeroProps {
  onSuccess?: (data: any) => void;
  onCommandRecord?: (record: CommandRecord) => void;
}

type TerminalState = 'boot' | 'idle' | 'onboarding_name' | 'onboarding_email' | 'onboarding_linkedin' | 'onboarding_goal' | 'onboarding_details' | 'onboarding_consent' | 'processing' | 'success' | 'chat';

const COLOR_CYCLE = ['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

const BOOT_SEQUENCE = [
  { text: '> boot APEX_OS --safe', color: '#06b6d4', delay: 0 },
  { text: '> load agents --count 17 --mode build', color: '#06b6d4', delay: 400 },
  { text: '> set objective "Ship in 30 days"', color: '#06b6d4', delay: 800 },
  { text: '> attach GTM --channels infoacademy, partners, b2b', color: '#06b6d4', delay: 1200 },
  { text: '> run diagnostics', color: '#06b6d4', delay: 1600 },
  { text: '[OK] architecture stable', color: '#10b981', delay: 2000 },
  { text: '[OK] ai-swarm online', color: '#10b981', delay: 2400 },
  { text: '[OK] launch window open', color: '#10b981', delay: 2800 },
  { text: '', color: '#ffffff', delay: 3200 },
  { text: '// Module 00: Orchestrator Cockpit', color: '#8b5cf6', delay: 3400 },
  { text: '// Status: READY FOR FOUNDER INPUT', color: '#8b5cf6', delay: 3600 },
];

const GOAL_OPTIONS = [
  { id: 'ship', label: '🚀 Ship an AI product' },
  { id: 'accelerator', label: '🎓 Join the Accelerator' },
  { id: 'b2b', label: '🤝 Partner for B2B' },
  { id: 'hire', label: '🛠️ Hire APEX to build' },
  { id: 'other', label: '💡 Other' },
];

export const TerminalHero: React.FC<TerminalHeroProps> = ({ onSuccess, onCommandRecord }) => {
  const [state, setState] = useState<TerminalState>('boot');
  const [history, setHistory] = useState<Array<{text: string, type: string}>>([]);
  const [input, setInput] = useState('');
  const [colorIndex, setColorIndex] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef(`session_${Date.now()}`);

  const addLine = useCallback((text: string, type: string = 'output') => {
    setHistory(prev => [...prev, { text, type }].slice(-100));
  }, []);

  // Boot sequence
  useEffect(() => {
    BOOT_SEQUENCE.forEach((line, index) => {
      setTimeout(() => {
        addLine(line.text, 'system');
        if (index === BOOT_SEQUENCE.length - 1) setState('idle');
      }, line.delay);
    });
  }, [addLine]);

  // Auto-scroll
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Color cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex(p => (p + 1) % COLOR_CYCLE.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCommand = async (val: string) => {
    addLine(`> ${val}`, 'input');
    setInput('');

    if (onCommandRecord) {
        onCommandRecord({
            command: val,
            intent: state === 'chat' ? 'faq' : 'system',
            timestamp: Date.now(),
            sessionId: sessionId.current
        });
    }

    if (state.startsWith('onboarding_')) {
      handleOnboarding(val);
      return;
    }

    const cmd = val.toLowerCase().trim();
    if (cmd === 'help') {
      addLine('Available commands: help, join, about, modules, clear, status', 'system');
    } else if (cmd === 'join' || cmd === 'contact') {
      setState('onboarding_name');
      addLine('', 'system');
      addLine('╔══════════════════════════════════════════════════════════╗', 'system');
      addLine('║           INITIALIZING ONBOARDING PROTOCOL               ║', 'system');
      addLine('╚══════════════════════════════════════════════════════════╝', 'system');
      addLine('Enter your full name:', 'system');
    } else if (cmd === 'clear') {
      setHistory([]);
    } else if (cmd === 'about') {
      addLine('APEX OS: The Operating System for the AI Age. 17-agent swarm at your service.', 'output');
    } else if (cmd === 'modules') {
      addLine('Module 00: [ACCESS GRANTED]', 'success');
      addLine('Module 01-11: [LOCKED] - Join waitlist for access.', 'error');
    } else {
      // AI Fallback
      setLoading(true);
      try {
        const res = await fetch('/api/ai-unified', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: val }),
        });
        const data = await res.json();
        const content = data?.content || 'No response from intelligence.';
        const formatted = CLIFormatter.convertMarkdownToCLI(content);
        formatted.split('\n').forEach(l => addLine(l, 'output'));
      } catch (e) {
        addLine('Connection error. Swarm unreachable.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOnboarding = async (val: string) => {
    const step = state.split('_')[1];
    switch (step) {
      case 'name':
        setFormData((p: any) => ({ ...p, name: val }));
        addLine('✓ Name captured.', 'success');
        addLine('Enter your professional email:', 'system');
        setState('onboarding_email');
        break;
      case 'email':
        if (!val.includes('@')) { addLine('Invalid email.', 'error'); return; }
        setFormData((p: any) => ({ ...p, email: val }));
        addLine('✓ Email verified.', 'success');
        addLine('Enter your LinkedIn URL (or skip):', 'system');
        setState('onboarding_linkedin');
        break;
      case 'linkedin':
        setFormData((p: any) => ({ ...p, linkedin: val }));
        addLine('✓ Profile linked.', 'success');
        addLine('What is your primary goal?', 'system');
        GOAL_OPTIONS.forEach((o, i) => addLine(`${i+1}. ${o.label}`, 'system'));
        setState('onboarding_goal');
        break;
      case 'goal':
        let goal = val;
        const idx = parseInt(val) - 1;
        if (GOAL_OPTIONS[idx]) goal = GOAL_OPTIONS[idx]!.label;
        setFormData((p: any) => ({ ...p, goal }));
        addLine('✓ Objective locked.', 'success');
        addLine('Tell us about what you\'re building (or skip):', 'system');
        setState('onboarding_details');
        break;
      case 'details':
        setFormData((p: any) => ({ ...p, details: val }));
        addLine('✓ Details logged.', 'success');
        addLine('Do you agree to be contacted? (Y/n):', 'system');
        setState('onboarding_consent');
        break;
      case 'consent':
        if (val.toLowerCase() === 'n') { addLine('Consent required.', 'error'); return; }
        submitFinal({ ...formData, consent: true });
        break;
    }
  };

  const submitFinal = async (data: any) => {
    setState('processing');
    setLoading(true);
    addLine('Transmitting to APEX OS swarm...', 'matrix');
    try {
      const res = await fetch('/api/waitlist/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, platform: 'terminal_hero' }),
      });
      const result = await res.json();
      addLine(`✓ Success. Score: ${result.ai_score}/100. Rank: #${result.rank}`, 'success');
      addLine('Check your email for next steps.', 'jarvis');
      setState('chat');
      onSuccess?.(result);
    } catch (e) {
      addLine('Transmission failed. Try again.', 'error');
      setState('onboarding_consent');
    } finally {
      setLoading(false);
    }
  };

  const currentColor = COLOR_CYCLE[colorIndex]!;

  return (
    <div className="w-full max-w-5xl mx-auto bg-black/90 border-2 rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-2xl transition-colors duration-1000"
         style={{ borderColor: `${currentColor}40` }}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: currentColor }} />
          <span className="font-mono text-xs tracking-widest uppercase text-white/60">APEX_OS // TERMINAL</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-white/40">
          <div className="flex items-center gap-1"><Wifi className="w-3 h-3 text-emerald-400" /> ONLINE</div>
          <div className="flex items-center gap-1"><Shield className="w-3 h-3 text-cyan-400" /> SECURE</div>
        </div>
      </div>

      <div ref={terminalRef} className="flex-1 overflow-y-auto p-6 font-mono space-y-2 custom-scrollbar">
        {history.map((line, i) => (
          <div key={i} className={`text-sm ${
            line.type === 'input' ? 'text-cyan-400' :
            line.type === 'error' ? 'text-red-400' :
            line.type === 'success' ? 'text-emerald-400' :
            line.type === 'jarvis' ? 'text-violet-400' :
            line.type === 'matrix' ? 'text-green-400' :
            'text-white/80'
          }`}>
            {line.type === 'input' && <span className="text-white/40 mr-2">λ</span>}
            <InlineRenderer text={line.text} />
          </div>
        ))}
        {loading && <div className="text-cyan-400 animate-pulse text-xs">ORCHESTRATING...</div>}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleCommand(input); }} 
            className="px-6 py-4 border-t border-white/10 flex items-center gap-3 bg-white/5">
        <span className="font-mono font-bold text-lg" style={{ color: currentColor }}>λ</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-white font-mono text-sm"
          placeholder={state === 'idle' ? "Type 'join' to begin..." : "Type response..."}
          disabled={loading || state === 'boot'}
          autoFocus
        />
        <button type="submit" className="text-white/40 hover:text-cyan-400 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default TerminalHero;
