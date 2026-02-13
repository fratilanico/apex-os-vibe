import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TERMINAL_CTA_PHRASES } from '../../../lib/terminal/constants';

// ═══════════════════════════════════════════════════════════════════════════════
// ROTATING PUNCHLINE CTA
// High-visibility, cycling prompts to compel user interaction
// ═══════════════════════════════════════════════════════════════════════════════

export const RotatingCTA: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % TERMINAL_CTA_PHRASES.length);
    }, 3000); // Rotate every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 select-none pointer-events-none">
      <span className="text-cyan-500/50 text-[10px] uppercase font-bold tracking-widest animate-pulse">
        ›_
      </span>
      <div className="h-4 overflow-hidden relative w-48">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center"
          >
            <span className="text-cyan-400/40 text-xs font-mono font-bold tracking-wide uppercase truncate">
              {TERMINAL_CTA_PHRASES[index]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
