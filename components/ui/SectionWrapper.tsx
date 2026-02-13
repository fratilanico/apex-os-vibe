import React from 'react';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION WRAPPER - Consistent section padding and max-width
// ═══════════════════════════════════════════════════════════════════════════════

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  fullWidth?: boolean;
  noPadding?: boolean;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  className = '',
  id,
  fullWidth = false,
  noPadding = false,
}) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`
        ${noPadding ? '' : 'py-24'}
        ${fullWidth ? 'w-full' : 'px-4 sm:px-6 lg:px-8'}
        ${className}
      `}
    >
      <div className={fullWidth ? 'w-full' : 'max-w-7xl mx-auto'}>
        {children}
      </div>
    </motion.section>
  );
};

export default SectionWrapper;
