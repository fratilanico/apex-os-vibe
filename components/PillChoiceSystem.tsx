import React from 'react';
import { motion } from 'framer-motion';

type PillChoiceSystemProps = {
  activeOption: 'blue' | 'red';
  onSelect: (choice: 'personal' | 'business') => void;
};

// Sparkle component for magical effect
const Sparkle = ({ delay, color, position }: { delay: number; color: string; position: { top?: string; left?: string; right?: string; bottom?: string } }) => (
  <motion.div
    className={`absolute w-1 h-1 rounded-full ${color}`}
    style={position}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      rotate: [0, 180, 360]
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 2 + 1,
      ease: "easeInOut"
    }}
  />
);

// Shimmer overlay for glossy effect
const Shimmer = ({ className }: { className?: string }) => (
  <motion.div
    className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent ${className}`}
    initial={{ x: '-100%' }}
    animate={{ x: '100%' }}
    transition={{
      duration: 2.5,
      repeat: Infinity,
      repeatDelay: 3,
      ease: "easeInOut"
    }}
    style={{ skewX: -20 }}
  />
);

export const PillChoiceSystem: React.FC<PillChoiceSystemProps> = ({ onSelect }) => {
  return (
    <motion.div 
      className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
      </div>
      
      {/* Header with Wonderland typography */}
      <div className="relative z-10 text-center mb-8">
        <motion.h3 
          className="font-serif italic text-xl text-white/90 tracking-wide"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Which Path Will You Choose?
        </motion.h3>
        <motion.p 
          className="mt-2 text-sm text-white/50 font-light"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Curiouser and curiouser...
        </motion.p>
      </div>

      {/* Pill Buttons Container */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* BLUE PILL - Azure/Cyan Wonderland Magic */}
        <motion.button
          type="button"
          onClick={() => onSelect('personal')}
          className="group relative"
          whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Glow container */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-cyan-400/30 to-blue-500/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Pill shape container */}
          <div className="relative h-28 rounded-full overflow-hidden shadow-2xl shadow-cyan-900/50 group-hover:shadow-cyan-400/40 transition-shadow duration-500">
            {/* Main gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 via-blue-400 to-cyan-600" />
            
            {/* Glossy 3D highlight - top */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-t-full" />
            
            {/* Inner shine - crescent */}
            <div className="absolute top-3 left-6 w-12 h-8 bg-white/30 rounded-full blur-md transform -rotate-12" />
            
            {/* Bottom shadow for 3D depth */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent rounded-b-full" />
            
            {/* Shimmer animation */}
            <Shimmer className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Sparkles */}
            <Sparkle delay={0} color="bg-white" position={{ top: '20%', left: '15%' }} />
            <Sparkle delay={0.5} color="bg-cyan-200" position={{ top: '60%', right: '20%' }} />
            <Sparkle delay={1.2} color="bg-blue-100" position={{ bottom: '25%', left: '25%' }} />
            <Sparkle delay={1.8} color="bg-white" position={{ top: '40%', right: '15%' }} />
            
            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span 
                className="font-serif text-white text-lg font-bold drop-shadow-lg tracking-wide"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
              >
                Blue Pill
              </span>
              <span 
                className="mt-1 text-xs text-white/80 font-light"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                Build & Learn Solo
              </span>
            </div>
          </div>
          
          {/* Bottom text */}
          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0.6 }}
            whileHover={{ opacity: 1 }}
          >
            <p className="text-xs text-cyan-200/70 font-light italic">
              Personal leverage begins here
            </p>
          </motion.div>
        </motion.button>

        {/* RED PILL - Crimson/Garnet Wonderland Magic */}
        <motion.button
          type="button"
          onClick={() => onSelect('business')}
          className="group relative"
          whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Glow container */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-red-400/30 to-rose-500/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          
          {/* Pill shape container */}
          <div className="relative h-28 rounded-full overflow-hidden shadow-2xl shadow-rose-900/50 group-hover:shadow-rose-400/40 transition-shadow duration-500">
            {/* Main gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-red-500 to-red-700" />
            
            {/* Glossy 3D highlight - top */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-t-full" />
            
            {/* Inner shine - crescent */}
            <div className="absolute top-3 left-6 w-12 h-8 bg-white/30 rounded-full blur-md transform -rotate-12" />
            
            {/* Bottom shadow for 3D depth */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent rounded-b-full" />
            
            {/* Shimmer animation */}
            <Shimmer className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Sparkles */}
            <Sparkle delay={0.3} color="bg-white" position={{ top: '25%', right: '18%' }} />
            <Sparkle delay={0.8} color="bg-rose-200" position={{ top: '50%', left: '20%' }} />
            <Sparkle delay={1.5} color="bg-red-100" position={{ bottom: '30%', right: '25%' }} />
            <Sparkle delay={2.1} color="bg-white" position={{ top: '35%', left: '12%' }} />
            
            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span 
                className="font-serif text-white text-lg font-bold drop-shadow-lg tracking-wide"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
              >
                Red Pill
              </span>
              <span 
                className="mt-1 text-xs text-white/80 font-light"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                Architect & Scale
              </span>
            </div>
          </div>
          
          {/* Bottom text */}
          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0.6 }}
            whileHover={{ opacity: 1 }}
          >
            <p className="text-xs text-rose-200/70 font-light italic">
              Business outcomes await
            </p>
          </motion.div>
        </motion.button>
      </div>

      {/* Footer hint */}
      <motion.div 
        className="relative z-10 mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-[10px] text-white/30 font-light tracking-widest uppercase">
          Choose Wisely — The Rabbit Hole Goes Deep
        </p>
      </motion.div>
    </motion.div>
  );
};
