import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const COLOR_MAP: Record<string, string> = {
  'cyan-400': '#22d3ee',
  'cyan-500': '#06b6d4',
  'emerald-400': '#10b981',
  'emerald-500': '#059669',
  'violet-400': '#a78bfa',
  'violet-500': '#8b5cf6',
  'amber-400': '#fbbf24',
  'amber-500': '#f59e0b',
  'pink-400': '#f472b6',
  'pink-500': '#ec4899',
};

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  from?: string;
  to?: string;
  icon?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  loading = false,
  disabled = false,
  from = 'cyan-500',
  to = 'emerald-500',
  icon,
  className = '',
  type = 'button',
}) => {
  const fromHex = COLOR_MAP[from] || from;
  const toHex = COLOR_MAP[to] || to;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        relative overflow-hidden
        px-8 py-4 rounded-xl
        text-white font-bold text-lg
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-lg hover:shadow-2xl
        flex items-center justify-center gap-3
        ${className}
      `}
      style={{
        backgroundImage: `linear-gradient(to right, ${fromHex}, ${toHex})`,
      }}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {!loading && icon}
      {children}
    </motion.button>
  );
};
