import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// APEX OS TERMINAL BRANDING
// Top corner branding with chromatic aberration ASCII and color cycling
// ═══════════════════════════════════════════════════════════════════════════════

import { ChromaticLogo } from './ui/ChromaticLogo';

const colorCycle = [
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ec4899', // pink
];

export const TerminalBranding: React.FC = () => {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  // Color cycling for Player 1 UI
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setCurrentColorIndex((prev) => (prev + 1) % colorCycle.length);
    }, 2000);

    return () => clearInterval(colorInterval);
  }, []);

  const currentColor = colorCycle[currentColorIndex];

  return (
    <>
      {/* Left Corner - APEX Logo (Gemini Style) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-4 left-4 md:left-6 z-50 flex flex-col items-start gap-0 pointer-events-none hidden sm:flex"
      >
        <ChromaticLogo type="apex" size="sm" className="drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]" />
      </motion.div>

      {/* Right Corner - PLAYER 1 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-6 right-6 z-50 flex items-center gap-3 pointer-events-none"
      >
        {/* Health Bar */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="w-2 h-4 rounded-sm transition-colors duration-1000"
              style={{ 
                backgroundColor: currentColor,
                boxShadow: `0 0 10px ${currentColor}60`
              }}
            />
          ))}
        </div>

        {/* PLAYER 1 Text */}
        <div className="relative">
          <div
            className="absolute inset-0 blur-md opacity-40 transition-colors duration-1000"
            style={{ backgroundColor: currentColor }}
          />
          <span
            className="relative font-mono text-xs font-bold tracking-wider transition-colors duration-1000"
            style={{ 
              color: currentColor,
              textShadow: `0 0 15px ${currentColor}50`
            }}
          >
            PLAYER 1
          </span>
        </div>
      </motion.div>
    </>
  );
};

export const TerminalBrandingMobile: React.FC = () => {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex((prev) => (prev + 1) % colorCycle.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentColor = colorCycle[currentColorIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-0 right-0 z-50 flex justify-center md:hidden"
    >
      <div 
        className="px-4 py-2 rounded-full font-mono text-xs font-bold tracking-wider border transition-colors duration-1000"
        style={{ 
          color: currentColor,
          borderColor: `${currentColor}40`,
          backgroundColor: 'rgba(0,0,0,0.8)',
          textShadow: `0 0 10px ${currentColor}40`
        }}
      >
        APEX_OS // PLAYER 1
      </div>
    </motion.div>
  );
};
