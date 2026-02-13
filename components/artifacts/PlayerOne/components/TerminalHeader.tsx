'use client';

import React from 'react';

interface TerminalHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Ultra minimal terminal header
 * Updated 2026-02-08: Removed all clutter, macOS-style title bar
 */
export const TerminalHeader: React.FC<TerminalHeaderProps> = ({ className = '', children }) => {
  return (
    <div className={`flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-700/30 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="text-xs font-semibold text-white/90">APEX OS</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400/40" />
        {children}
      </div>
    </div>
  );
};
