import React from 'react';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// GLOW BUTTON - Anti-contrast glowing button component
// ═══════════════════════════════════════════════════════════════════════════════

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'terminal';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const variantStyles = {
  primary: {
    base: 'bg-cyan-500 text-black',
    glow: '0 0 40px rgba(6, 182, 212, 0.5), 0 0 80px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(255,255,255,0.2)',
    hover: 'from-cyan-400 via-emerald-400 to-cyan-400',
  },
  secondary: {
    base: 'bg-white/10 text-white border border-white/20',
    glow: '0 0 30px rgba(255, 255, 255, 0.1)',
    hover: 'from-white/20 to-white/10',
  },
  terminal: {
    base: 'bg-black text-cyan-400 border border-cyan-500/50 font-mono',
    glow: '0 0 30px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(6, 182, 212, 0.1)',
    hover: 'from-cyan-500/20 to-transparent',
  },
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon,
}) => {
  const styles = variantStyles[variant];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        group relative inline-flex items-center justify-center gap-2
        rounded-lg font-semibold
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${styles.base}
        ${sizeStyles[size]}
        ${className}
      `}
      style={{
        boxShadow: styles.glow,
      }}
    >
      {/* Hover gradient overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r ${styles.hover} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg`} 
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span className="relative z-10">{icon}</span>}
        <span className="relative z-10">{children}</span>
      </span>
    </motion.button>
  );
};

export default GlowButton;
