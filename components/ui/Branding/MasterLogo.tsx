import React from 'react';
import { motion } from 'framer-motion';

interface MasterLogoProps {
  className?: string;
  glow?: boolean;
}

export const MasterLogo: React.FC<MasterLogoProps> = ({ className = '', glow = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative inline-block ${className}`}
    >
      <img 
        src="/assets/apex-ascii-logo-ultra.png" 
        alt="APEX OS"
        className={`w-full h-auto ${glow ? 'drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]' : ''}`}
      />
    </motion.div>
  );
};
