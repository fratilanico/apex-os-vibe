import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Wifi, Shield, Terminal } from 'lucide-react';
import { InlineRenderer } from './ui/Terminal/InlineRenderer';
import { useOnboardingStore } from '../stores/useOnboardingStore';
import { APEX_LOGO_ASCII_LINES, PLAYER_ONE_ASCII } from '../lib/terminal/constants';
import { PillChoiceSystem } from './PillChoiceSystem';
import { PILL_CONFIG } from '../config/pillConfig';
import { processAdminCommand } from '../lib/admin/terminalAdmin';

// ═══════════════════════════════════════════════════════════════════════════════
// SPECTACULAR TERMINAL - GOLDEN STANDARD v6.4.2
// 3-Step Flow: Name → Email → Handshake → Red/Blue Pill
// ═══════════════════════════════════════════════════════════════════════════════

const chromaticStyle = `
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
  .animate-glitch { animation: glitch 0.25s linear infinite; }
`;

interface TerminalLine {
  id: string;
  text: string;
  type: 'input' | 'output' | 'error' | 'system' | 'success' | 'jarvis' | 'matrix' | 'ascii' | 'brand-logo';
  className?: string;
}

type TerminalStep = 'boot' | 'name' | 'email' | 'processing' | 'unlocked';

const BOOT_SEQUENCE = [
  { text: 'Initializing APEX_OS Kernel v6.4.2...', delay: 100, type: 'system' as const },
  { text: 'Loading Neural Interface Protocol...', delay: 400, type: 'system' as const },
  { text: 'Connecting to 17-Agent Swarm...', delay: 700, type: 'matrix' as const },
  { text: '[OK] FULL WIRE ENGAGED', delay: 1000, type: 'success' as const },
  { text: '', delay: 1100, type: 'system' as const },
  { text: 'Protocol Active. Establishing Identity Node...', delay: 1200, type: 'jarvis' as const },
  { text: '', delay: 1300, type: 'system' as const },
];

export const SpectacularTerminal: React.FC = () => {
  const { 
    step, setStep,
    setPersona,
    setEmail,
    unlock,
    addHistory
  } = useOnboardingStore();

  const [bootLine, setBootLine] = useState(0);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [glitchActive, setGlitchActive] = useState(false);
  const [scanActive, setScanActive] = useState(false);
  const [showPillChoice, setShowPillChoice] = useState(false);

  // Rotating engaging prompts based on step
  const [promptIndex, setPromptIndex] = useState(0);
  
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

  // Cycle through prompts every 4 seconds
  useEffect(() => {
    const currentStep = step as TerminalStep;
    if (currentStep === 'boot' || currentStep === 'processing') return;
    
    const prompts = stepPrompts[currentStep] || ['Type response...'];
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % prompts.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [step]);

  // Get current placeholder based on step
  const getPlaceholder = () => {
    const currentStep = step as TerminalStep;
    if (currentStep === 'boot') return 'Initializing...';
    if (currentStep === 'processing') return 'Processing...';
    const prompts = stepPrompts[currentStep] || ['Type response...'];
    return prompts[promptIndex % prompts.length];
  };

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logoRenderedRef = useRef(false);

  useEffect(() => {
    if (!document.getElementById('spectacular-chromatic-style')) {
      const style = document.createElement('style');
      style.id = 'spectacular-chromatic-style';
      style.textContent = chromaticStyle;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [lines, showPillChoice]);

  const addLine = useCallback((text: string, type: TerminalLine['type'] = 'output') => {
    const id = Math.random().toString(36).substr(2, 9);
    setLines(prev => [...prev, { id, text, type }]);
    addHistory(`[${type.toUpperCase()}] ${text}`);
  }, [addHistory]);

  const addAscii = useCallback((art: string, className: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setLines(prev => [...prev, { id, text: art, type: 'ascii', className }]);
  }, []);

  const addMultiColorAscii = useCallback((data: Array<{text: string, color: string}>, className: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setLines(prev => [...prev, { id, text: JSON.stringify(data), type: 'brand-logo', className }]);
  }, []);

  // Boot sequence
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if ((step as TerminalStep) === 'boot') {
      if (bootLine === 0 && !logoRenderedRef.current) {
        logoRenderedRef.current = true;
        addMultiColorAscii(APEX_LOGO_ASCII_LINES, 'text-[8px] sm:text-xs leading-none');
      }
      if (bootLine < BOOT_SEQUENCE.length) {
        const line = BOOT_SEQUENCE[bootLine];
        if (!line) return;
        timer = setTimeout(() => {
          addLine(line.text, line.type);
          setBootLine(p => p + 1);
          if (bootLine === BOOT_SEQUENCE.length - 1) {
            addLine('# 01 IDENTIFY PROTOCOL: Enter your full name:', 'system');
            setStep('name' as any);
          }
        }, line.delay);
      }
    }
    return () => clearTimeout(timer);
  }, [bootLine, step, addLine, addMultiColorAscii, setStep]);

  const performHandshake = async (name: string) => {
    setIsProcessing(true);
    addLine('ENCRYPTING PAYLOAD...', 'matrix');
    addLine('ESTABLISHING NEURAL LINK...', 'matrix');

    const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

    // Phase 1: Glitch
    setGlitchActive(true);
    addLine('▓▓▓ PHASE 1: CHROMATIC ABERRATION ▓▓▓', 'matrix');
    await wait(500);
    setGlitchActive(false);

    // Phase 2: Biometric Scan
    setScanActive(true);
    addLine('SCANNING... BIOMETRIC VALIDATION IN PROGRESS', 'matrix');
    await wait(1500);
    addLine('[████████████████████] 100%', 'success');
    setScanActive(false);
    await wait(200);

    // Phase 3: Player 1 Connected
    addLine('✓ IDENTITY CONFIRMED', 'success');
    await wait(300);

    // Type out PLAYER 1 - CONNECTED
    const connectMsg = '. . . PLAYER 1 - CONNECTED';
    const typeId = 'typing-connect';
    setLines(prev => [...prev, { id: typeId, text: '', type: 'success' }]);
    
    for (let i = 1; i <= connectMsg.length; i++) {
      setLines(prev => prev.map(l => l.id === typeId ? { ...l, text: connectMsg.slice(0, i) + '█' } : l));
      await wait(40);
    }
    setLines(prev => prev.map(l => l.id === typeId ? { ...l, text: connectMsg } : l));
    await wait(500);

    // Show stats
    addLine('', 'system');
    addLine('━━━━━━━━━ ACCESS GRANTED ━━━━━━━━━', 'success');
    addLine('✓ AI READINESS SCORE: Calculated', 'success');
    addLine('✓ QUEUE POSITION: Reserved', 'success');
    addLine('✓ MODULE 00: The Shift — UNLOCKED', 'success');
    await wait(400);

    addAscii(PLAYER_ONE_ASCII, 'text-emerald-400 text-[6px] sm:text-xs');
    await wait(300);

    addLine('', 'system');
    addLine(`Welcome to the Swarm, ${name}. Standard protocols are offline.`, 'jarvis');
    addLine('Choose your path:', 'jarvis');
    
    setShowPillChoice(true);
    setIsProcessing(false);
    unlock();
    setStep('unlocked');
  };

  const handlePillChoice = (choice: 'personal' | 'business') => {
    setPersona(choice.toUpperCase() as any);
    setShowPillChoice(false);
    
    if (choice === 'business') {
      addLine('', 'system');
      addLine('🔴 RED PILL SELECTED: BUSINESS_ARCHITECT', 'success');
      addLine('Orchestrating fleet-scale outcomes...', 'jarvis');
      addLine('', 'system');
      addLine('┌─── BUSINESS MODULES UNLOCKED ───┐', 'matrix');
      addLine('│ ⚡ MARKET_TAM         — ACTIVE   │', 'matrix');
      addLine('│ 🤖 SWARM_MATRIX       — ACTIVE   │', 'matrix');
      addLine('│ 📊 INVESTOR_RADAR     — ACTIVE   │', 'matrix');
      addLine('│ 🔒 REVENUE_ENGINE     — TIER 2   │', 'matrix');
      addLine('└─────────────────────────────────┘', 'matrix');
    } else {
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
      
      // HIDDEN ADMIN COMMANDS - Not shown in help
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
        // Trigger vault open
        return;
      }

      addLine('Command not recognized. Type "help" for options.', 'error');
    }
  };

  return (
    <motion.div 
      className={`flex-1 bg-black/90 backdrop-blur-2xl border-2 border-cyan-500/30 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl transition-all duration-1000 relative min-h-[400px] sm:min-h-[500px] ${glitchActive ? 'animate-glitch' : ''}`}
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
            APEX_OS // {(step as TerminalStep) === 'unlocked' ? 'OPERATOR_MODE' : 'HANDSHAKE_PROTOCOL'}
          </span>
        </div>
        <div className="flex gap-4 text-[10px] font-mono text-white/30 uppercase tracking-widest">
          <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-emerald-400" /> Online</span>
          <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-cyan-400" /> Secure</span>
        </div>
      </div>

      {/* Output */}
      <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 sm:p-8 font-mono space-y-2 sm:space-y-3 custom-scrollbar">
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
                <pre className="font-mono whitespace-pre leading-[0.85] text-[6px] sm:text-xs">
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

        {/* Red/Blue Pill Choice - Matrix Style */}
        {showPillChoice && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <PillChoiceSystem 
              activeOption={PILL_CONFIG.activeOption} 
              onSelect={handlePillChoice} 
            />
          </motion.div>
        )}

        {isProcessing && (
          <div className="flex items-center gap-3 text-cyan-400 text-xs animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" /> PROCESSING...
          </div>
        )}
      </div>

      {/* FUTURISTIC TERMINAL INPUT - Wire Animation & Glow */}
      <div className="relative border-t border-white/10 bg-black/40 backdrop-blur-xl">
        {/* Animated wire border - travels around the input area */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top wire */}
          <motion.div
            className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            initial={{ width: "0%", left: "0%" }}
            animate={{ 
              width: ["0%", "30%", "30%", "0%"],
              left: ["0%", "0%", "70%", "100%"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.4, 0.6, 1]
            }}
            style={{ boxShadow: "0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(34, 211, 238, 0.4)" }}
          />
          {/* Right wire */}
          <motion.div
            className="absolute top-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
            initial={{ height: "0%", top: "0%" }}
            animate={{ 
              height: ["0%", "100%", "100%", "0%"],
              top: ["0%", "0%", "0%", "100%"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.75,
              times: [0, 0.4, 0.6, 1]
            }}
            style={{ boxShadow: "0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(34, 211, 238, 0.4)" }}
          />
          {/* Bottom wire */}
          <motion.div
            className="absolute bottom-0 right-0 h-[2px] bg-gradient-to-l from-transparent via-cyan-400 to-transparent"
            initial={{ width: "0%", right: "0%" }}
            animate={{ 
              width: ["0%", "30%", "30%", "0%"],
              right: ["0%", "0%", "70%", "100%"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
              times: [0, 0.4, 0.6, 1]
            }}
            style={{ boxShadow: "0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(34, 211, 238, 0.4)" }}
          />
          {/* Left wire */}
          <motion.div
            className="absolute bottom-0 left-0 w-[2px] bg-gradient-to-t from-transparent via-cyan-400 to-transparent"
            initial={{ height: "0%", bottom: "0%" }}
            animate={{ 
              height: ["0%", "100%", "100%", "0%"],
              bottom: ["0%", "0%", "0%", "100%"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.25,
              times: [0, 0.4, 0.6, 1]
            }}
            style={{ boxShadow: "0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(34, 211, 238, 0.4)" }}
          />
        </div>

        {/* Ambient glow pulse */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-cyan-500/5"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Input form */}
        <form onSubmit={(e) => { e.preventDefault(); handleCommand(inputValue); }} className="relative flex items-center gap-4 p-4">
          {/* Animated lambda symbol */}
          <motion.span 
            className="text-2xl font-bold text-cyan-400"
            animate={{
              textShadow: [
                "0 0 10px rgba(34, 211, 238, 0.5)",
                "0 0 20px rgba(34, 211, 238, 0.8)",
                "0 0 10px rgba(34, 211, 238, 0.5)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            λ
          </motion.span>
          
          {/* Enhanced input with glow */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-transparent outline-none text-white text-base font-mono placeholder-white/30"
              placeholder={getPlaceholder()}
              disabled={(step as TerminalStep) === 'boot' || isProcessing || showPillChoice}
              autoFocus
            />
            {/* Cursor glow effect */}
            {!inputValue && (step as TerminalStep) !== 'boot' && !isProcessing && !showPillChoice && (
              <motion.div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-cyan-400"
                animate={{
                  opacity: [1, 0, 1],
                  boxShadow: [
                    "0 0 10px rgba(34, 211, 238, 1)",
                    "0 0 20px rgba(34, 211, 238, 0.5)",
                    "0 0 10px rgba(34, 211, 238, 1)"
                  ]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            )}
          </div>

          {/* Enter hint */}
          {!inputValue && (step as TerminalStep) !== 'boot' && !isProcessing && !showPillChoice && (
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
    </motion.div>
  );
};
