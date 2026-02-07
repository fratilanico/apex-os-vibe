'use client';

import React, { forwardRef, useCallback, useEffect } from 'react';
import { COMMANDS } from '@/lib/terminal/constants';
import type { ApexTerminalLine } from '@/lib/terminal/types';

interface TerminalInputProps {
  input: string;
  setInput: (value: string) => void;
  isProcessing: boolean;
  isAuthorized: boolean;
  commandHistory: string[];
  historyIndex: number;
  setHistoryIndex: (index: number) => void;
  processCommand: (cmd: string) => void;
  addLine: (type: ApexTerminalLine['type'], content: ApexTerminalLine['content']) => void;
  className?: string;
}

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  ({
    input,
    setInput,
    isProcessing,
    isAuthorized,
    commandHistory,
    historyIndex,
    setHistoryIndex,
    processCommand,
    addLine,
    className = '',
  }, ref) => {
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !isProcessing && isAuthorized) {
        e.preventDefault();
        processCommand(input);
        setInput('');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex] || '');
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex !== -1) {
          const newIndex = historyIndex === commandHistory.length - 1 ? -1 : historyIndex + 1;
          setHistoryIndex(newIndex);
          setInput(newIndex === -1 ? '' : commandHistory[newIndex] || '');
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const partial = input.toLowerCase();
        const match = COMMANDS.find(cmd => cmd.startsWith(partial));
        if (match && match !== partial) {
          setInput(match + ' ');
        }
      } else if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault();
        addLine('system', '^C\n[ Process interrupted ]');
        setInput('');
      }
    }, [input, isProcessing, isAuthorized, commandHistory, historyIndex, processCommand, setInput, setHistoryIndex, addLine]);

    useEffect(() => {
      const focusInput = () => {
        const timer = setTimeout(() => {
          try {
            if (ref && 'current' in ref && ref.current) {
              ref.current.focus();
            }
          } catch (e) {
            console.warn('Focus error:', e);
          }
        }, 50);
        return () => clearTimeout(timer);
      };

      window.addEventListener('click', focusInput);
      return () => window.removeEventListener('click', focusInput);
    }, [ref]);

    return (
      <div className={`relative ${className}`}>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
        <div className="relative flex items-center gap-2 bg-zinc-900/80 border border-white/10 rounded-lg px-3 py-1.5 focus-within:border-cyan-500/50 shadow-2xl transition-all h-9">
          <span className="text-cyan-400 font-mono text-xs font-black animate-pulse shrink-0">λ</span>
          <input
            ref={ref}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing || !isAuthorized}
            placeholder={isAuthorized ? 'Type command...' : 'Initializing...'}
            className="flex-1 bg-transparent text-white font-mono text-sm placeholder:text-zinc-600 focus:outline-none disabled:opacity-50 min-w-0"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoFocus
          />
          <div className="flex items-center gap-1.5 shrink-0">
            {isProcessing ? (
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
            ) : (
              <div className="w-1.5 h-1.5 bg-emerald-500/40 rounded-full" />
            )}
          </div>
        </div>
      </div>
    );
  }
);

TerminalInput.displayName = 'TerminalInput';
