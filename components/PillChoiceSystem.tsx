import React from 'react';
import { motion } from 'framer-motion';

type PillChoiceSystemProps = {
  activeOption: 'blue' | 'red';
  onSelect: (choice: 'personal' | 'business') => void;
};

export const PillChoiceSystem: React.FC<PillChoiceSystemProps> = ({ activeOption, onSelect }) => {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-mono tracking-widest text-white/60">
          TRAJECTORY SELECTOR
        </div>
        <div className="text-[10px] font-mono tracking-widest text-white/40">
          active={activeOption.toUpperCase()}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSelect('personal')}
          className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-left hover:bg-cyan-500/15 transition-colors"
        >
          <div className="text-[11px] font-mono tracking-widest text-cyan-200">BLUE PILL</div>
          <div className="mt-2 text-xs text-white/70">Learn + build solo. Personal leverage.</div>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSelect('business')}
          className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 text-left hover:bg-violet-500/15 transition-colors"
        >
          <div className="text-[11px] font-mono tracking-widest text-violet-200">RED PILL</div>
          <div className="mt-2 text-xs text-white/70">Architect a fleet. Business outcomes.</div>
        </motion.button>
      </div>
    </div>
  );
};
