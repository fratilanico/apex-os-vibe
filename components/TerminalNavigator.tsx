import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as CLIFormatter from '@/lib/cliFormatter';
import { InlineRenderer } from '@/components/ui/Terminal/InlineRenderer';

export type CommandRecord = {
  command: string;
  intent: 'navigation' | 'module' | 'contact' | 'social' | 'faq';
  createdAt: number;
};

interface TerminalNavigatorProps {
  onContactRequest: () => void;
  onCommandRecord?: (record: CommandRecord) => void;
}

const heroPhrases = [
  'PRESS HELP TO NAVIGATE MODULE 00',
  'TYPE COMMANDS LIKE A FOUNDER NAVIGATING A LAUNCH',
  'ORCHESTRATE THE AGENT SWARM IN ONE INPUT',
  'MODULE 00 IS YOUR COCKPIT — STAY IN CONTROL',
  'NEED DIRECTION? PRESS HELP, THEN CONTACT',
];

const colorCycle = ['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

const helpLines = [
  'Available commands:',
  '  help      - replay this navigation brief',
  '  modules   - peek Module 00 + locked modules',
  '  contact   - walk the Module 00 waitlist flow',
  '  discord   - open the APEX OS Discord invite',
  '  telegram  - ping the Telegram assistant',
  '  ask [topic] - query Module 00 about orchestration, launch, partners',
];

const knowledgeTriggers = ['ask', 'launch', 'partner', 'approach', 'module 00', 'new age', 'orchestrate'];

const mapIntent = (command: string): CommandRecord['intent'] => {
  if (command.startsWith('contact')) return 'contact';
  if (['discord', 'telegram'].includes(command)) return 'social';
  if (command.startsWith('modules')) return 'module';
  if (command.startsWith('ask') || command.includes('module 00')) return 'faq';
  return 'navigation';
};

const buildCacheKey = (question: string, intent: string) => `${intent}:${question}`;

export const TerminalNavigator: React.FC<TerminalNavigatorProps> = ({ onContactRequest, onCommandRecord }) => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [log, setLog] = useState<string[]>([
    'MODULE 00 NAVIGATION COCKPIT ONLINE',
    'Type `press help` to explore, `contact` to queue.',
    '',
  ]);
  const [input, setInput] = useState('');
  const [knowledgeLoading, setKnowledgeLoading] = useState(false);
  const knowledgeCache = useRef<Record<string, { answer: string; source: string }>>({});

  const currentColor = colorCycle[colorIndex];

  useEffect(() => {
    const heroTimer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroPhrases.length);
      setColorIndex((prev) => (prev + 1) % colorCycle.length);
    }, 2800);
    return () => clearInterval(heroTimer);
  }, []);

  const appendLog = (lines: string[]) => {
    setLog((prev) => {
      const merged = [...prev, ...lines];
      return merged.slice(-140);
    });
  };

  const fetchKnowledge = async (question: string, intent: string) => {
    const cacheKey = buildCacheKey(question, intent);
    if (knowledgeCache.current[cacheKey]) {
      const cached = knowledgeCache.current[cacheKey];
      appendLog(['', cached.answer, '', `Source: ${cached.source.toUpperCase()}`]);
      return;
    }

    appendLog(['', 'Seeking Module 00 intelligence...', '']);
    setKnowledgeLoading(true);
    try {
      const response = await fetch('/api/knowledge/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          intent,
        }),
      });
      const data = await response.json();
      const answer = data.answer?.trim() || 'No answer available.';
      const source = data.source || 'unknown';
      knowledgeCache.current[cacheKey] = { answer, source };
      appendLog(['', answer, '', `Source: ${source.toUpperCase()}`]);
    } catch (error: any) {
      console.error('Knowledge query failed', error);
      appendLog(['', 'Knowledge engine unavailable. Try again soon.', '']);
    } finally {
      setKnowledgeLoading(false);
    }
  };

  const handleKnowledgeCommand = async (command: string) => {
    const intent = command.includes('launch') ? 'launch' : command.includes('partner') ? 'partners' : 'faq';
    await fetchKnowledge(command, intent);
  };

  const handleCommand = async (raw: string) => {
    const command = raw.trim().toLowerCase();
    if (!command) return;
    appendLog([`> ${raw}`]);
    onCommandRecord?.({ command, intent: mapIntent(command), createdAt: Date.now() });

    if (command === 'press help' || command === 'help') {
      appendLog(['', ...helpLines, '']);
      appendLog(['Recommended path: Module 00 → type `contact` → join Discord/Telegram.']);
      return;
    }

    if (command.startsWith('modules')) {
      appendLog([
        'Modules:',
        '  [00] Module 00 · ORCHESTRATOR COCKPIT · ACCESS GRANTED',
        '  [01] Module 01 · AI Agent Architecture · ACCESS DENIED',
        '  [02] Module 02 · GTM Engine · ACCESS DENIED',
        '  [03] Module 03 · Community Protocol · ACCESS DENIED',
        '  [04] Module 04 · Success Metrics · ACCESS DENIED',
        '  [05] Module 05 · Scale & Exit · ACCESS DENIED',
        'Type `contact` to queue for Module 01 and beyond.',
      ]);
      return;
    }

    if (command.includes('module 1')) {
      appendLog(['Nice try; Module 1 is locked. Module 00 is the new path. Type `contact` to join.']);
      return;
    }

    if (command.startsWith('contact')) {
      appendLog([
        'Initializing Module 00 waitlist flow...',
        'We capture name, email, LinkedIn, goal, and an AI readiness score.',
        'Queue rank will appear when your data is processed.',
      ]);
      onContactRequest();
      return;
    }

    if (command === 'discord') {
      appendLog([
        'Discord invite → https://discord.gg/Mbk6vZdy',
        'Run `/waitlist` inside Discord to mirror this Module 00 onboarding.',
        'Recommended: type `contact` here first, then confirm inside Discord.',
      ]);
      return;
    }

    if (command === 'telegram') {
      appendLog([
        'Telegram bot → https://t.me/apexos_bot',
        'Double tap “Join Waitlist” and answer the prompts — same flow.',
      ]);
      return;
    }

    const shouldQueryKnowledge = knowledgeTriggers.some((trigger) => command.includes(trigger));
    if (shouldQueryKnowledge && !knowledgeLoading) {
      await handleKnowledgeCommand(command);
      return;
    }

    appendLog(['', 'Querying intelligence...', '']);
    try {
      const response = await fetch('/api/ai-unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: raw,
          history: log.slice(-10).map((line) => ({ role: 'user', content: line })),
        }),
      });
      if (!response.ok) throw new Error('AI request failed');
      const data = await response.json();
      const formatted = CLIFormatter.stripCliTags(
        CLIFormatter.convertMarkdownToCLI(data.content || '')
      );
      appendLog(['', ...formatted.split('\n'), '']);
    } catch (error: any) {
      appendLog([
        'Command not recognized. Type `help` for the recommended path.',
      ]);
      appendLog([
        `AI Error: ${error?.message || 'Unknown error'}`,
        '',
      ]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void handleCommand(input);
    setInput('');
  };

  return (
    <section className="relative bg-black/60 border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.4)]">
      <div className="flex flex-col gap-3 mb-4">
        <motion.div
          animate={{ color: currentColor }}
          transition={{ duration: 0.6 }}
          className="font-mono font-black text-2xl md:text-3xl"
          style={{ textShadow: `0 0 25px ${currentColor}40` }}
        >
          {heroPhrases[heroIndex]} <span className="animate-pulse">▮</span>
        </motion.div>
        <div className="flex items-center justify-between text-xs text-white/60 font-mono uppercase tracking-[0.4em]">
          <span>Module 00 · Founders Cockpit</span>
          <span>Recommended: contact → social → webinar</span>
        </div>
      </div>

      <div className="h-64 overflow-y-auto rounded-2xl border border-white/5 bg-black/70 p-4 font-mono text-sm space-y-1 text-white/80">
        {log.map((line, index) => (
          <div key={index} className={line.startsWith('ACCESS DENIED') ? 'text-red-400' : line.startsWith('Type `contact`') ? 'text-emerald-300' : 'text-white/80'}>
            <InlineRenderer text={line} />
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <input
          type="text"
          placeholder="Type a command (help / modules / contact / discord / telegram / ask ...)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 font-mono focus:border-cyan-400 focus:outline-none"
        />
        <button type="submit" className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold uppercase tracking-widest text-xs">
          ENTER
        </button>
      </form>
    </section>
  );
};
