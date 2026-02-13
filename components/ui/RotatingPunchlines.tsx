'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PUNCHLINES = [
  'Build at AI Speed. Ship at Light Speed.',
  'Configuration beats manual prompting',
  'Parallel agents beat sequential execution',
  'From idea to deployed feature in 72 hours',
  'Multi-agent judging auto-selects best output',
  '70% faster than manual coding. Verified.',
  '17 AI agents. One unified command center.',
  'The Operating System for the AI Age',
  'Neural handshake. Authenticated. Build mode activated.',
  'Cursor for flow state. Claude for reasoning. Gemini for context.',
  'Cost optimization through intelligent routing',
  'Debug cycles reduced by 10x',
  'CLAUDE.md provides persistent context',
  'NotebookLM preserves knowledge across features',
  'From research to deployment. Fully orchestrated.',
  'Real features. Real code. Real deployments.',
  'You used every tool in the stack',
  'MCP servers enable external integrations',
  'Architecture plan → Code → Tests → Deploy',
  'The swarm is waiting. Will you orchestrate?',
];

/**
 * PolychromaticText - Text with animated gradient
 */
export const PolychromaticText: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <span 
    className={`bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400 ${className}`}
    style={{
      backgroundSize: '200% 200%',
      animation: 'gradient-shift 3s ease infinite',
    }}
  >
    {children}
  </span>
);

/**
 * RotatingPunchlines - 3D flip animation for hero punchlines
 * Full GEEK MODE immersive experience
 */
export const RotatingPunchlines: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PUNCHLINES.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-16 perspective-1000">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ rotateX: -90, opacity: 0, y: 20 }}
          animate={{ rotateX: 0, opacity: 1, y: 0 }}
          exit={{ rotateX: 90, opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.43, 0.13, 0.23, 0.96] // Smooth cubic bezier
          }}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center whitespace-nowrap">
            <PolychromaticText>
              {PUNCHLINES[currentIndex]}
            </PolychromaticText>
          </h2>
        </motion.div>
      </AnimatePresence>
      
      {/* Progress indicator removed per Golden Standard instructions */}
    </div>
  );
};

export default RotatingPunchlines;
