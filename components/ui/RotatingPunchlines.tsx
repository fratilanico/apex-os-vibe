'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PUNCHLINES = [
  'Lead with AI. Build the Future.',
  'Digital Sovereignty Starts Here.',
  '17 Agents. One Vision. Zero Limits.',
  'From Code to Empire in 30 Days.',
  'The Operating System for the AI Age.',
  'Build Like Tony Stark. Ship Like a Founder.',
  'Neural Synchronization: ACTIVE',
  'Full Wire Engaged.',
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
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">
            <PolychromaticText>
              {PUNCHLINES[currentIndex]}
            </PolychromaticText>
          </h2>
        </motion.div>
      </AnimatePresence>
      
      {/* Progress indicator */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
        {PUNCHLINES.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? 'w-6 bg-gradient-to-r from-cyan-400 to-violet-400' 
                : 'w-1 bg-zinc-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default RotatingPunchlines;
