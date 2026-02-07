'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  lines?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  lines = 3,
  className = '' 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
          }}
          className="h-4 bg-white/10 rounded"
          style={{
            width: `${Math.random() * 40 + 60}%`,
          }}
        />
      ))}
    </div>
  );
};

// Specialized skeleton for terminal
export const TerminalSkeleton: React.FC = () => (
  <div className="space-y-2 p-4">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-3 h-3 rounded-full bg-red-500/20 animate-pulse" />
      <div className="w-3 h-3 rounded-full bg-yellow-500/20 animate-pulse" />
      <div className="w-3 h-3 rounded-full bg-green-500/20 animate-pulse" />
    </div>
    <SkeletonLoader lines={5} />
  </div>
);

// Specialized skeleton for skill tree
export const SkillTreeSkeleton: React.FC = () => (
  <div className="space-y-4 p-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/10 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-white/10 rounded w-1/2 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

// Specialized skeleton for DM sidebar
export const DMSidebarSkeleton: React.FC = () => (
  <div className="space-y-4 p-4">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
      <div className="flex-1">
        <div className="h-4 bg-white/10 rounded w-2/3 mb-2 animate-pulse" />
        <div className="h-3 bg-white/10 rounded w-1/3 animate-pulse" />
      </div>
    </div>
    <SkeletonLoader lines={4} />
  </div>
);
