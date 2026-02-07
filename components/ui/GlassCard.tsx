import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  accent?: 'cyan' | 'emerald' | 'violet' | 'amber' | 'pink';
  hover?: boolean;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  accent = 'cyan',
  hover = true,
  delay = 0,
}) => {
  const accentColors = {
    cyan: 'hover:border-cyan-500/30 hover:shadow-cyan-500/20',
    emerald: 'hover:border-emerald-500/30 hover:shadow-emerald-500/20',
    violet: 'hover:border-violet-500/30 hover:shadow-violet-500/20',
    amber: 'hover:border-amber-500/30 hover:shadow-amber-500/20',
    pink: 'hover:border-pink-500/30 hover:shadow-pink-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`
        bg-white/5 backdrop-blur-xl 
        border border-white/10 
        rounded-3xl 
        ${hover ? `transition-all duration-300 ${accentColors[accent]} hover:shadow-2xl` : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};
