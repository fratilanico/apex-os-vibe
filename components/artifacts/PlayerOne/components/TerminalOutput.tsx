'use client';

import { forwardRef, useMemo } from 'react';
import { InlineRenderer } from '@/components/ui/Terminal/InlineRenderer';
import { Loader2 } from 'lucide-react';
import type { ApexTerminalLine } from '@/lib/terminal/types';
import { NeuralPixelBranding } from './NeuralPixelBranding';

interface TerminalOutputProps {
  lines: ApexTerminalLine[];
  isProcessing: boolean;
  className?: string;
}

const getLineStyles = (type: ApexTerminalLine['type']): string => {
  switch (type) {
    case 'input':
      return 'text-cyan-400 font-mono';
    case 'error':
      return 'text-red-400 font-mono';
    case 'output':
      return 'text-emerald-400 font-mono';
    case 'system':
      return 'text-zinc-300 font-mono';
    case 'branding':
      return 'text-cyan-400 font-mono whitespace-pre';
    case 'ai':
      return 'text-emerald-300 font-mono';
    default:
      return 'text-zinc-300 font-mono';
  }
};

export const TerminalOutput = forwardRef<HTMLDivElement, TerminalOutputProps>(
  ({ lines, isProcessing, className = '' }, ref) => {
    // Filter lines to only show one branding element (the first one)
    const filteredLines = useMemo(() => {
      let brandingFound = false;
      return lines.filter((line) => {
        if (line.type === 'branding') {
          if (brandingFound) return false;
          brandingFound = true;
        }
        return true;
      });
    }, [lines]);

    return (
      <div
        ref={ref}
        className={`flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent ${className}`}
      >
        {filteredLines.map((line) => (
          <div
            key={line.id}
            className={getLineStyles(line.type)}
          >
            {line.type === 'branding' ? (
              <NeuralPixelBranding isAuthorized={true} />
            ) : (
              <span className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                {typeof line.content === 'string' ? <InlineRenderer text={line.content} /> : line.content}
              </span>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-cyan-400/60">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-mono animate-pulse">Processing...</span>
          </div>
        )}

        <div className="h-4" />
      </div>
    );
  }
);

TerminalOutput.displayName = 'TerminalOutput';
