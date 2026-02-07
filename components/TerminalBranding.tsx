import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// APEX OS TERMINAL BRANDING
// Top corner branding with typing animation and color cycling
// ═══════════════════════════════════════════════════════════════════════════════

const colorCycle = [
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ec4899', // pink
];

export const TerminalBranding: React.FC = () => {
  const [apexText, setApexText] = useState('');
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [, setIsTypingComplete] = useState(false);

  // APEX_OS typing animation
  useEffect(() => {
    const text = 'APEX_OS';
    let index = 0;
    
    const typeInterval = setInterval(() => {
      if (index <= text.length) {
        setApexText(text.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
        setIsTypingComplete(true);
      }
    }, 150);

    return () => clearInterval(typeInterval);
  }, []);

  // Color cycling for both logos
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setCurrentColorIndex((prev) => (prev + 1) % colorCycle.length);
    }, 2000);

    return () => clearInterval(colorInterval);
  }, []);

  // Cursor blink
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  const currentColor = colorCycle[currentColorIndex];

  return (
    <>
      {/* Left Corner - APEX_OS */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-6 left-6 z-50 flex items-center gap-2"
      >
        <div className="relative">
          {/* Glow effect */}
          <div
            className="absolute inset-0 blur-lg opacity-50 transition-colors duration-1000"
            style={{ backgroundColor: currentColor }}
          />
          
          {/* Text */}
          <span
            className="relative font-mono text-sm font-bold tracking-[0.3em] transition-colors duration-1000"
            style={{ 
              color: currentColor,
              textShadow: `0 0 20px ${currentColor}40, 0 0 40px ${currentColor}20`
            }}
          >
            {apexText}
            {showCursor && (
              <span className="animate-pulse">▮</span>
            )}
          </span>
        </div>

        {/* Status indicator */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: currentColor }}
        />
      </motion.div>

      {/* Right Corner - PLAYER 1 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-6 right-6 z-50 flex items-center gap-3"
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

        {/* Glitch effect overlay (occasional) */}
        <motion.div
          animate={{
            x: [0, 2, -2, 0],
            opacity: [0, 0.8, 0, 0]
          }}
          transition={{ 
            duration: 0.2, 
            repeat: Infinity, 
            repeatDelay: 5,
            times: [0, 0.25, 0.5, 1]
          }}
          className="absolute inset-0 font-mono text-xs font-bold tracking-wider"
          style={{ color: currentColor }}
        >
          PLAYER 1
        </motion.div>
      </motion.div>

      {/* Mobile: Simplified version */}
      <style>{`
        @media (max-width: 768px) {
          .terminal-branding-desktop {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

// Simplified mobile version
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
