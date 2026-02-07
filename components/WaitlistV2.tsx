import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as CLIFormatter from '@/lib/cliFormatter';
import { InlineRenderer } from '@/components/ui/Terminal/InlineRenderer';

interface TerminalLine {
  text: string;
  type?: 'input' | 'output' | 'error' | 'system' | 'glitch' | 'matrix' | 'success';
}

const COLOR_CYCLE = ['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

const BOOT_SEQUENCE = [
  { text: '> initializing APEX_OS kernel...', delay: 100, type: 'system' as const },
  { text: '> loading Module 00 curriculum...', delay: 300, type: 'system' as const },
  { text: '> connecting to APEX OS...', delay: 500, type: 'system' as const },
  { text: '[OK] system ready', delay: 900, type: 'success' as const },
];

export const WaitlistV2: React.FC = () => {
  // Removed: const [showIgnition, setShowIgnition] = useState(true);
  const [booted, setBooted] = useState(false);
  const [bootLine, setBootLine] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addLine = useCallback((text: string, type: TerminalLine['type'] = 'output') => {
    setLines(prev => [...prev, { text, type }].slice(-100));
  }, []);

  useEffect(() => {
    // Removed: if (showIgnition) return;

    let timer: NodeJS.Timeout | undefined;
    if (bootLine < BOOT_SEQUENCE.length) {
      const line = BOOT_SEQUENCE[bootLine];
      timer = setTimeout(() => {
        setBootLine(prev => prev + 1);
        if (line && line.text) addLine(line.text, line.type);
        if (bootLine === BOOT_SEQUENCE.length - 1) setBooted(true);
      }, line?.delay || 100);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [bootLine, addLine]); // Removed showIgnition from dependencies

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (booted) {
      interval = setInterval(() => {
        setColorIndex(p => (p + 1) % COLOR_CYCLE.length);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [booted]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCommand = async (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    addLine(`> ${cmd}`, 'input');
    setInput('');

    if (cmd.toLowerCase() === 'help') {
      addLine('[h1]AVAILABLE COMMANDS[/h1]', 'system');
      addLine('  [b]info[/b]     - Product details', 'system');
      addLine('  [b]clear[/b]    - Clear screen', 'system');
      return;
    }

    if (cmd.toLowerCase() === 'clear') {
      setLines([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai-unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: cmd, history: [] }),
      });
      const data = await response.json();
      const content = data?.content || '';
      const formatted = CLIFormatter.convertMarkdownToCLI(content);
      formatted.split('\n').forEach((line) => addLine(line, 'output'));
    } catch (error: any) {
      addLine(`AI Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const currentColor = COLOR_CYCLE[colorIndex] || COLOR_CYCLE[0];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col p-4">
      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col">
        <div 
          className="flex-1 bg-black/90 border-2 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          style={{ borderColor: `${currentColor}30` }}
        >
          <div className="px-6 py-6 border-b border-white/10 bg-white/5 flex items-center justify-center">
            <h1 className="text-cyan-400 font-bold text-xl font-mono">APEX OS</h1>
          </div>
          
          <div ref={terminalRef} className="flex-1 overflow-y-auto p-6 font-mono space-y-2">
            {lines.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap text-white/80">
                <InlineRenderer text={line.text} />
              </div>
            ))}
            {loading && <div className="text-cyan-400 animate-pulse uppercase text-xs tracking-widest font-black">Orchestrating...</div>}
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); if (input.trim() && !loading) handleCommand(input); }}
            className="px-6 py-4 border-t border-white/10 flex items-center gap-3 bg-white/5"
          >
            <span style={{ color: currentColor }} className="font-mono font-bold text-lg leading-none">λ</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white font-mono text-sm sm:text-base"
              placeholder={booted ? "Type command..." : "Initializing..."}
              disabled={loading || !booted}
              autoFocus
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default WaitlistV2;
