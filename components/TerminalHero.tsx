import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as CLIFormatter from '@/lib/cliFormatter';
import { InlineRenderer } from '@/components/ui/Terminal/InlineRenderer';

// ═══════════════════════════════════════════════════════════════════════════════
// TERMINAL HERO - CENTERPIECE EXPERIENCE
// Full-screen immersive terminal for Module 00
// ═══════════════════════════════════════════════════════════════════════════════

export interface CommandRecord {
  command: string;
  intent: 'navigation' | 'module' | 'contact' | 'social' | 'faq' | 'system';
  timestamp: number;
  sessionId: string;
}

interface TerminalHeroProps {
  onContactRequest?: () => void;
  onCommandRecord?: (record: CommandRecord) => void;
}

// Color cycling for that Apple Intelligence vibe
const COLOR_CYCLE = [
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ec4899', // pink
  '#06b6d4', // back to cyan
];

// Hero phrases that cycle
const HERO_PHRASES = [
  'WELCOME TO MODULE 00',
  'ORCHESTRATOR COCKPIT ONLINE',
  '17 AGENTS AWAITING YOUR COMMAND',
  'TYPE help TO BEGIN NAVIGATION',
  'SHIP IN 30 DAYS OR LESS',
  'PRESS ENTER TO INITIALIZE',
];

// System boot sequence
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

// Knowledge base for smart responses
const KNOWLEDGE_BASE = [
  {
    keywords: ['module 00', 'cockpit', 'orchestrator'],
    response: [
      'Module 00 is your command center.',
      'It orchestrates 17 AI agents across design, code, and GTM.',
      'You maintain full control while the swarm executes.',
      'Type `contact` to claim your cockpit.',
    ],
  },
  {
    keywords: ['orchestrate', 'swarm', 'agents'],
    response: [
      'Orchestration means parallel execution.',
      'While you strategize, agents build, design, and market simultaneously.',
      'The result: 30-day shipping cycles instead of 6-12 months.',
      'Type `contact` to see the swarm in action.',
    ],
  },
  {
    keywords: ['launch', 'gtm', '30 days', 'ship'],
    response: [
      'Module 00 compresses your timeline to 30 days.',
      'GTM strategy starts on Day 1, not after build.',
      'Partners and community feedback loops keep you ahead.',
      'Type `contact` to lock in your launch window.',
    ],
  },
  {
    keywords: ['equity', 'founder', 'control'],
    response: [
      'You keep 100% equity. No VC dilution.',
      'The AI swarm replaces expensive dev teams.',
      'You stay founder-in-control at AI speed.',
      'Type `contact` to protect your equity.',
    ],
  },
  {
    keywords: ['discord', 'community', 'telegram'],
    response: [
      'Join 2,400+ builders in the Neural Network.',
      'Discord: Real-time chat, voice channels, 24/7 support.',
      'Telegram: Async updates, bot commands, private groups.',
      'Type `discord` or `telegram` for invites.',
    ],
  },
];

// Available commands
const COMMANDS = {
  help: {
    description: 'Display available commands',
    usage: 'help',
  },
  modules: {
    description: 'View Module 00 and locked modules',
    usage: 'modules',
  },
  contact: {
    description: 'Start the Module 00 waitlist application',
    usage: 'contact',
  },
  discord: {
    description: 'Get Discord community invite',
    usage: 'discord',
  },
  telegram: {
    description: 'Get Telegram bot link',
    usage: 'telegram',
  },
  clear: {
    description: 'Clear terminal screen',
    usage: 'clear',
  },
};

export const TerminalHero: React.FC<TerminalHeroProps> = ({
  onContactRequest,
  onCommandRecord,
}) => {
  // State
  const [booted, setBooted] = useState(false);
  const [bootLine, setBootLine] = useState(0);
  const [heroPhraseIndex, setHeroPhraseIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Boot sequence
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    BOOT_SEQUENCE.forEach((line, index) => {
      const timeout = setTimeout(() => {
        setBootLine(index + 1);
        if (index === BOOT_SEQUENCE.length - 1) {
          setBooted(true);
        }
      }, line.delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  // Hero phrase cycling
  useEffect(() => {
    if (!booted) return;
    
    const interval = setInterval(() => {
      setHeroPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
      setColorIndex((prev) => (prev + 1) % COLOR_CYCLE.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [booted]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, bootLine]);

  // Focus input on boot
  useEffect(() => {
    if (booted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [booted]);

  const addToHistory = useCallback((lines: string[]) => {
    setHistory((prev) => [...prev, ...lines].slice(-100));
  }, []);

  const findKnowledge = useCallback((query: string): string[] | null => {
    const normalized = query.toLowerCase();
    const match = KNOWLEDGE_BASE.find((entry) =>
      entry.keywords.some((kw) => normalized.includes(kw))
    );
    return match ? match.response : null;
  }, []);

  const executeCommand = useCallback(async (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    if (!command) return;

    // Record command
    const record: CommandRecord = {
      command,
      intent: 'system',
      timestamp: Date.now(),
      sessionId: sessionId.current,
    };

    // Add to history
    addToHistory([`> ${cmd}`]);

    // Determine intent
    if (command === 'help' || command === 'press help') {
      record.intent = 'navigation';
      addToHistory([
        '',
        '╔══════════════════════════════════════════════════════════╗',
        '║              MODULE 00 COMMAND REFERENCE                 ║',
        '╠══════════════════════════════════════════════════════════╣',
        ...Object.entries(COMMANDS).map(([cmd, info]) => 
        `║  ${cmd.padEnd(12)} ${info.description.padEnd(38)} ║`
        ),
        '╚══════════════════════════════════════════════════════════╝',
        '',
        'RECOMMENDED: Type `contact` to join the waitlist',
      ]);
    } else if (command === 'modules') {
      record.intent = 'module';
      addToHistory([
        '',
        '╔══════════════════════════════════════════════════════════╗',
        '║                   MODULE STATUS                          ║',
        '╠══════════════════════════════════════════════════════════╣',
        '║  [00] Module 00 · ORCHESTRATOR COCKPIT    [✓ ACCESS]     ║',
        '║  [01] Module 01 · AI Agent Architecture   [✗ LOCKED]     ║',
        '║  [02] Module 02 · GTM Engine              [✗ LOCKED]     ║',
        '║  [03] Module 03 · Community Protocol      [✗ LOCKED]     ║',
        '║  [04] Module 04 · Success Metrics         [✗ LOCKED]     ║',
        '║  [05] Module 05 · Scale & Exit            [✗ LOCKED]     ║',
        '╚══════════════════════════════════════════════════════════╝',
        '',
        'Type `contact` to unlock Module 01 and beyond.',
      ]);
    } else if (command === 'contact') {
      record.intent = 'contact';
      addToHistory([
        '',
        '╔══════════════════════════════════════════════════════════╗',
        '║           INITIALIZING CONTACT PROTOCOL                  ║',
        '╠══════════════════════════════════════════════════════════╣',
        '║  Collecting founder data...                              ║',
        '║  • Name, Email, LinkedIn                                 ║',
        '║  • Company, Role, Experience                             ║',
        '║  • AI Readiness Score + Referral Code                    ║',
        '╚══════════════════════════════════════════════════════════╝',
        '',
        'Redirecting to application form...',
      ]);
      setTimeout(() => {
        onContactRequest?.();
      }, 800);
    } else if (command === 'discord') {
      record.intent = 'social';
      addToHistory([
        '',
        '╔══════════════════════════════════════════════════════════╗',
        '║              DISCORD NEURAL NETWORK                      ║',
        '╠══════════════════════════════════════════════════════════╣',
        '║  Invite: https://discord.gg/Mbk6vZdy                     ║',
        '║  Members: 2,437 online                                   ║',
        '║  Status: 🟢 ACTIVE                                       ║',
        '╠══════════════════════════════════════════════════════════╣',
        '║  Run `/waitlist` inside Discord to complete onboarding   ║',
        '╚══════════════════════════════════════════════════════════╝',
      ]);
    } else if (command === 'telegram') {
      record.intent = 'social';
      addToHistory([
        '',
        '╔══════════════════════════════════════════════════════════╗',
        '║              TELEGRAM SIGNAL CHANNEL                     ║',
        '╠══════════════════════════════════════════════════════════╣',
        '║  Bot: https://t.me/apexos_bot                            ║',
        '║  Members: 890 subscribed                                 ║',
        '║  Status: 🟢 ACTIVE                                       ║',
        '╠══════════════════════════════════════════════════════════╣',
        '║  Tap "Join Waitlist" to mirror Module 00 flow            ║',
        '╚══════════════════════════════════════════════════════════╝',
      ]);
    } else if (command === 'clear') {
      setHistory([]);
      addToHistory(['Terminal cleared. Type `help` for commands.']);
    } else {
      // Try knowledge base
      const knowledge = findKnowledge(command);
      if (knowledge) {
        record.intent = 'faq';
        addToHistory(['', ...knowledge, '']);
      } else {
        addToHistory(['', 'Querying intelligence...', '']);
        try {
          const response = await fetch('/api/ai-unified', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: cmd,
              history: history.slice(-10).map((line) => ({ role: 'user', content: line })),
            }),
          });
          if (!response.ok) throw new Error('AI request failed');
          const data = await response.json();
          const formatted = CLIFormatter.convertMarkdownToCLI(data.content || '');
          addToHistory(['', ...formatted.split('\n'), '']);
        } catch (error: any) {
          addToHistory([
            '',
            `AI Error: ${error?.message || 'Unknown error'}`,
            'Type `help` for available commands.',
            '',
          ]);
        }
      }
    }

    onCommandRecord?.(record);
  }, [addToHistory, findKnowledge, onContactRequest, onCommandRecord, history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    void executeCommand(input);
    setInput('');
  };

  const currentColor = COLOR_CYCLE[colorIndex];

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col">
      {/* CRT Scanline Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />
      
      {/* Glow Effects */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] rounded-full blur-[150px] opacity-20"
          style={{ background: `radial-gradient(circle, ${currentColor}40, transparent 70%)` }}
        />
      </div>

      {/* Main Terminal Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl bg-black/90 border-2 rounded-2xl overflow-hidden shadow-2xl"
          style={{ 
            borderColor: `${currentColor}40`,
            boxShadow: `0 0 100px ${currentColor}20, inset 0 0 100px ${currentColor}10`,
          }}
        >
          {/* Terminal Header */}
          <div 
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{ 
              background: `linear-gradient(90deg, ${currentColor}10, transparent)`,
              borderColor: `${currentColor}30`,
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: currentColor }}
              />
              <span className="font-mono text-sm tracking-widest uppercase" style={{ color: currentColor }}>
                Module 00 // Orchestrator Cockpit
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-white/40">
              <span>v2.0.0</span>
              <span>•</span>
              <span>Build Ready</span>
            </div>
          </div>

          {/* Hero Text */}
          {booted && (
            <motion.div
              key={heroPhraseIndex}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="px-6 py-4 text-center border-b"
              style={{ borderColor: `${currentColor}20` }}
            >
              <h1 
                className="text-2xl md:text-4xl font-black font-mono tracking-tight"
                style={{ 
                  color: currentColor,
                  textShadow: `0 0 40px ${currentColor}60`,
                }}
              >
                {HERO_PHRASES[heroPhraseIndex]}
                <span className="animate-pulse ml-2">▮</span>
              </h1>
              <p className="mt-2 text-sm text-white/60 font-mono">
                Type `help` to explore • `contact` to join • `modules` to see access levels
              </p>
            </motion.div>
          )}

          {/* Terminal Content */}
          <div
            ref={terminalRef}
            className="h-[50vh] md:h-[60vh] overflow-y-auto p-6 font-mono text-sm md:text-base space-y-1"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Boot Sequence */}
            {!booted && (
              <div className="space-y-1">
                {BOOT_SEQUENCE.slice(0, bootLine).map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ color: line.color }}
                  >
                    {line.text}
                  </motion.div>
                ))}
                {bootLine < BOOT_SEQUENCE.length && (
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    style={{ color: BOOT_SEQUENCE[bootLine]?.color }}
                  >
                    {BOOT_SEQUENCE[bootLine]?.text}
                    <span className="animate-pulse">_</span>
                  </motion.div>
                )}
              </div>
            )}

            {/* Command History */}
            {history.map((line, index) => (
              <div
                key={index}
                className={`whitespace-pre-wrap ${
                  line.startsWith('>') ? 'text-yellow-400' :
                  line.startsWith('╔') || line.startsWith('╠') || line.startsWith('╚') ? 'text-cyan-400' :
                  line.startsWith('║') ? 'text-white/80' :
                  line.includes('[✓]') ? 'text-emerald-400' :
                  line.includes('[✗]') ? 'text-red-400' :
                  line.includes('RECOMMENDED') ? 'text-amber-400 font-bold' :
                  'text-white/70'
                }`}
              >
                <InlineRenderer text={line} />
              </div>
            ))}

            {/* Ready State */}
            {booted && history.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-emerald-400"
              >
                <span className="animate-pulse">_</span> System ready. Awaiting founder input...
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          {booted && (
            <form 
              onSubmit={handleSubmit}
              className="px-6 py-4 border-t flex items-center gap-3"
              style={{ borderColor: `${currentColor}30` }}
            >
              <span style={{ color: currentColor }} className="font-mono font-bold">
                founder@apex-os:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white font-mono"
                placeholder="Type command..."
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
              {showCursor && (
                <span 
                  className="w-2.5 h-5 animate-pulse"
                  style={{ backgroundColor: currentColor }}
                />
              )}
            </form>
          )}
        </motion.div>

        {/* Quick Command Hints */}
        {booted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex flex-wrap justify-center gap-3"
          >
            {['help', 'modules', 'contact', 'discord', 'telegram'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => {
                  setInput(cmd);
                  inputRef.current?.focus();
                }}
                className="px-4 py-2 rounded-lg border font-mono text-xs uppercase tracking-wider transition-all hover:scale-105"
                style={{ 
                  borderColor: `${currentColor}40`,
                  color: currentColor,
                  background: `${currentColor}10`,
                }}
              >
                {cmd}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TerminalHero;
