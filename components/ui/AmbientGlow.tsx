import React from 'react';
import { motion } from 'framer-motion';

interface AmbientGlowProps {
  color: 'cyan' | 'emerald' | 'violet' | 'amber' | 'pink';
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  opacity?: number;
}

export const AmbientGlow: React.FC<AmbientGlowProps> = ({
  color,
  size = 500,
  top,
  left,
  right,
  bottom,
  opacity = 0.15,
}) => {
  const colorMap = {
    cyan: 'bg-cyan-500',
    emerald: 'bg-emerald-500',
    violet: 'bg-violet-500',
    amber: 'bg-amber-500',
    pink: 'bg-pink-500',
  };

  const position = {
    ...(top && { top }),
    ...(left && { left }),
    ...(right && { right }),
    ...(bottom && { bottom }),
  };

  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [opacity * 0.5, opacity, opacity * 0.5],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`
        absolute pointer-events-none
        ${colorMap[color]}
        rounded-full
      `}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        filter: `blur(${size / 5}px)`,
        ...position,
      }}
    />
  );
};
