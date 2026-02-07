import React from 'react';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// PROGRESS BAR - Gamification XP bars for the Academy
// ═══════════════════════════════════════════════════════════════════════════════

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'xp' | 'health' | 'mana';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

const variantStyles = {
  default: {
    bg: 'bg-white/10',
    fill: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    glow: 'shadow-[0_0_10px_rgba(6,182,212,0.5)]',
  },
  xp: {
    bg: 'bg-amber-500/20',
    fill: 'bg-gradient-to-r from-amber-400 to-yellow-500',
    glow: 'shadow-[0_0_10px_rgba(251,191,36,0.5)]',
  },
  health: {
    bg: 'bg-rose-500/20',
    fill: 'bg-gradient-to-r from-rose-500 to-red-600',
    glow: 'shadow-[0_0_10px_rgba(244,63,94,0.5)]',
  },
  mana: {
    bg: 'bg-blue-500/20',
    fill: 'bg-gradient-to-r from-blue-400 to-indigo-500',
    glow: 'shadow-[0_0_10px_rgba(96,165,250,0.5)]',
  },
};

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = true,
  label,
  animated = true,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const styles = variantStyles[variant];

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-white/70">{label}</span>
          )}
          {showLabel && (
            <span className="text-sm font-mono text-white/50">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`relative w-full ${sizeStyles[size]} ${styles.bg} rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1 : 0, ease: 'easeOut' }}
          className={`absolute inset-y-0 left-0 ${styles.fill} ${styles.glow}`}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </motion.div>
      </div>
    </div>
  );
};

// XP Bar with level indicator
interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  title?: string;
  className?: string;
}

export const XPBar: React.FC<XPBarProps> = ({
  currentXP,
  maxXP,
  level,
  title,
  className = '',
}) => {
  const percentage = (currentXP / maxXP) * 100;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Level Badge */}
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <span className="text-black font-bold text-lg">{level}</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-black border-2 border-amber-400 flex items-center justify-center">
          <span className="text-[8px] text-amber-400 font-bold">LVL</span>
        </div>
      </div>

      {/* XP Bar */}
      <div className="flex-1">
        {title && (
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-white/80">{title}</span>
            <span className="text-xs font-mono text-amber-400">
              {currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
            </span>
          </div>
        )}
        <ProgressBar
          value={currentXP}
          max={maxXP}
          variant="xp"
          size="md"
          showLabel={false}
        />
      </div>
    </div>
  );
};

// Multi-segment progress for curriculum tracking
interface CurriculumProgressProps {
  modules: { completed: boolean; current?: boolean }[];
  className?: string;
}

export const CurriculumProgress: React.FC<CurriculumProgressProps> = ({
  modules,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {modules.map((module, idx) => (
        <div
          key={idx}
          className={`flex-1 h-2 rounded-full transition-all duration-300 ${
            module.completed
              ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
              : module.current
              ? 'bg-cyan-500 animate-pulse'
              : 'bg-white/10'
          }`}
        />
      ))}
    </div>
  );
};

export default ProgressBar;
