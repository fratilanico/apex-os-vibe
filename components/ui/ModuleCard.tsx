import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, CheckCircle, Lock, Play, Trophy } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE CARD - Curriculum cards with levels and gamification
// ═══════════════════════════════════════════════════════════════════════════════

interface ModuleCardProps {
  number: number;
  title: string;
  description: string;
  duration?: string;
  lessons?: number;
  xp?: number;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  status?: 'locked' | 'available' | 'in-progress' | 'completed';
  onClick?: () => void;
  className?: string;
  index?: number;
}

const statusConfig = {
  locked: {
    icon: Lock,
    color: 'text-white/30',
    borderColor: 'border-white/10',
    bgColor: 'bg-white/5',
    badge: 'LOCKED',
    badgeColor: 'bg-zinc-800 text-zinc-500',
  },
  available: {
    icon: Play,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    bgColor: 'bg-cyan-500/10',
    badge: 'START',
    badgeColor: 'bg-cyan-500/20 text-cyan-400',
  },
  'in-progress': {
    icon: BookOpen,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/10',
    badge: 'IN PROGRESS',
    badgeColor: 'bg-amber-500/20 text-amber-400',
  },
  completed: {
    icon: CheckCircle,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    badge: 'COMPLETED',
    badgeColor: 'bg-emerald-500/20 text-emerald-400',
  },
};

const levelConfig = {
  beginner: { label: 'Beginner', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  intermediate: { label: 'Intermediate', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  advanced: { label: 'Advanced', color: 'text-rose-400', bg: 'bg-rose-500/10' },
  expert: { label: 'Expert', color: 'text-violet-400', bg: 'bg-violet-500/10' },
};

export const ModuleCard: React.FC<ModuleCardProps> = ({
  number,
  title,
  description,
  duration,
  lessons,
  xp = 100,
  level = 'beginner',
  status = 'available',
  onClick,
  className = '',
  index = 0,
}) => {
  const config = statusConfig[status];
  const levelInfo = levelConfig[level];
  const StatusIcon = config.icon;
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      onClick={onClick}
      whileHover={{ scale: isLocked ? 1 : 1.02, y: isLocked ? 0 : -4 }}
      className={`
        group relative p-6 rounded-xl border transition-all duration-300 cursor-pointer
        ${isLocked ? 'opacity-60' : 'hover:shadow-lg'}
        ${config.borderColor}
        ${config.bgColor}
        ${className}
      `}
      style={{
        boxShadow: status === 'available' || status === 'in-progress' 
          ? '0 0 30px rgba(6, 182, 212, 0.1)' 
          : undefined,
      }}
    >
      {/* Module Number - Large Background */}
      <div className="absolute top-4 right-4 text-6xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
        {String(number).padStart(2, '0')}
      </div>

      {/* Status Badge */}
      <div className={`absolute top-4 left-4 px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider ${config.badgeColor}`}>
        {config.badge}
      </div>

      {/* Content */}
      <div className="relative z-10 mt-8">
        {/* Status Icon */}
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${config.bgColor} ${config.color} mb-4`}>
          <StatusIcon className="w-5 h-5" />
        </div>

        {/* Title */}
        <h3 className={`text-lg font-bold mb-2 ${isLocked ? 'text-white/50' : 'text-white'}`}>
          {title}
        </h3>

        {/* Description */}
        <p className={`text-sm leading-relaxed mb-4 ${isLocked ? 'text-white/30' : 'text-white/60'}`}>
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-white/40 mb-4">
          {duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{duration}</span>
            </div>
          )}
          {lessons && (
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>{lessons} lessons</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            <span>{xp} XP</span>
          </div>
        </div>

        {/* Level Badge */}
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs ${levelInfo.bg} ${levelInfo.color}`}
        >
          <span className="font-medium">{levelInfo.label}</span>
        </div>
      </div>

      {/* Hover Glow */}
      {!isLocked && (
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${
              isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(6, 182, 212, 0.1)'
            }, transparent 70%)`,
          }}
        />
      )}

      {/* Progress Bar (if in progress) */}
      {status === 'in-progress' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '45%' }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-500"
          />
        </div>
      )}
    </motion.div>
  );
};

// Module Card Grid for displaying multiple modules
interface ModuleGridProps {
  modules: ModuleCardProps[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const ModuleGrid: React.FC<ModuleGridProps> = ({
  modules,
  columns = 3,
  className = '',
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {modules.map((module, idx) => (
        <ModuleCard key={idx} {...module} index={idx} />
      ))}
    </div>
  );
};

export default ModuleCard;
