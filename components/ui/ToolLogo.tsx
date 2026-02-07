import React from 'react';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL LOGO - Logo component with hover effect
// ═══════════════════════════════════════════════════════════════════════════════

interface ToolLogoProps {
  name: string;
  icon?: React.ReactNode;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

const sizeStyles = {
  sm: 'w-10 h-10 text-lg',
  md: 'w-14 h-14 text-2xl',
  lg: 'w-20 h-20 text-3xl',
};

export const ToolLogo: React.FC<ToolLogoProps> = ({
  name,
  icon,
  color = '#06b6d4',
  size = 'md',
  onClick,
  className = '',
}) => {
  const initial = name.charAt(0).toUpperCase();

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      className={`
        group relative flex items-center justify-center
        rounded-xl bg-white/5 border border-white/10
        cursor-pointer overflow-hidden
        transition-all duration-300
        hover:border-white/30
        ${sizeStyles[size]}
        ${className}
      `}
      style={{
        boxShadow: `0 0 0 transparent`,
      }}
    >
      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${color}20, transparent 70%)`,
        }}
      />
      
      {/* Icon or Initial */}
      <span 
        className="relative z-10 font-bold transition-colors duration-300 group-hover:text-white"
        style={{ color: icon ? 'currentColor' : color }}
      >
        {icon || initial}
      </span>

      {/* Tooltip */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="text-xs text-white/70 whitespace-nowrap bg-black/80 px-2 py-1 rounded">
          {name}
        </span>
      </div>
    </motion.div>
  );
};

export default ToolLogo;
