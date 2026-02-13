import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star, Zap } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL CARD - Tool showcase cards for the 8 powers
// ═══════════════════════════════════════════════════════════════════════════════

interface ToolCardProps {
  name: string;
  category: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  buildWith: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  index?: number;
  onClick?: () => void;
}

const difficultyConfig = {
  beginner: { label: 'Beginner', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  intermediate: { label: 'Intermediate', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  advanced: { label: 'Advanced', color: 'text-rose-400', bg: 'bg-rose-500/10' },
};

export const ToolCard: React.FC<ToolCardProps> = ({
  name,
  category,
  description,
  icon: Icon,
  color,
  gradient,
  buildWith,
  difficulty = 'beginner',
  index = 0,
  onClick,
}) => {
  const diff = difficultyConfig[difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      {/* Card Container */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 transition-all duration-500 hover:border-zinc-600/50 h-full">
        {/* Gradient Glow on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className={`absolute inset-0 bg-gradient-to-br ${gradient} pointer-events-none`}
        />

        {/* Animated Border Glow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: `0 0 40px ${color}15, inset 0 0 40px ${color}05` }}
        />

        {/* Content */}
        <div className="relative p-6 flex flex-col h-full">
          {/* Header with Icon and Category */}
          <div className="flex items-start justify-between mb-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
              className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 group-hover:border-zinc-600/50 transition-colors"
            >
              <Icon className="w-7 h-7 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
            </motion.div>

            <div className="flex flex-col items-end gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full bg-zinc-900 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                {category}
              </span>
              <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${diff.bg} ${diff.color}`}>
                {diff.label}
              </span>
            </div>
          </div>

          {/* Tool Name */}
          <h3 className="text-xl font-bold mb-2 text-zinc-300 group-hover:text-white transition-colors">
            {name}
          </h3>

          {/* Description */}
          <p className="text-sm text-zinc-500 mb-4 leading-relaxed flex-grow">
            {description}
          </p>

          {/* Build With Section */}
          <motion.div
            initial={{ opacity: 0.7 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="pt-4 border-t border-zinc-800/50 group-hover:border-zinc-700/50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                You&apos;ll Build
              </span>
            </div>
            <p className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">
              {buildWith}
            </p>
          </motion.div>

          {/* Action Link */}
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-6 right-6 flex items-center gap-1 text-xs font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors"
          >
            <span>Explore</span>
            <ExternalLink className="w-3 h-3" />
          </motion.div>
        </div>

        {/* Corner Accent */}
        <div
          className="absolute top-0 right-0 w-20 h-20 opacity-10 pointer-events-none"
          style={{
            background: `radial-gradient(circle at top right, ${color}, transparent 70%)`,
          }}
        />
      </div>
    </motion.div>
  );
};

// Compact tool card for grid layouts
interface ToolCardCompactProps {
  name: string;
  icon: React.ElementType;
  color: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const ToolCardCompact: React.FC<ToolCardCompactProps> = ({
  name,
  icon: Icon,
  color,
  isActive = false,
  onClick,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative p-4 rounded-xl border transition-all duration-300 ${
        isActive
          ? 'bg-white/10 border-white/30'
          : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <span className="text-sm font-medium text-white/80">{name}</span>
      </div>
      
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute inset-0 rounded-xl border-2 border-cyan-500/50"
        />
      )}
    </motion.button>
  );
};

export default ToolCard;
