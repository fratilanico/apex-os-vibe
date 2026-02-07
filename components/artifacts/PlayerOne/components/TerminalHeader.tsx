'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { SYSTEM_MESSAGES } from '@/lib/terminal/constants';

interface TerminalHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({ className = '', children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center justify-between px-3 py-2 bg-zinc-900/80 border-b border-cyan-500/20 ${className}`}
    >
      {/* Minimal left side - just icon and title */}
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30"
        >
          <Terminal className="w-3 h-3 text-cyan-400" />
        </motion.div>
        <span className="text-xs font-semibold text-cyan-400 tracking-wider">
          {SYSTEM_MESSAGES.APEX_OS}
        </span>
      </div>

      {/* Right side - just children (provider badge) */}
      <div className="flex items-center gap-2">
        {children}
      </div>
    </motion.div>
  );
};
