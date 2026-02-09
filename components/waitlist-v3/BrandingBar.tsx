import React from 'react';
import { motion } from 'framer-motion';
import { useColorCycle } from '../../hooks/useColorCycle';
import { useOnboardingStore } from '../../stores/useOnboardingStore';
import { Terminal } from 'lucide-react';
import { ChromaticLogo } from '../ui/ChromaticLogo';

const COLOR_HEX: Record<string, string> = {
  cyan: '#22d3ee', emerald: '#10b981', violet: '#8b5cf6',
  amber: '#fbbf24', pink: '#f472b6',
};

export const BrandingBar: React.FC = () => {
  const accent = useColorCycle();
  const { mode, setMode } = useOnboardingStore();
  const accentHex = COLOR_HEX[accent] || '#22d3ee';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-md md:backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">
        
        {/* LEFT: LOGO & BADGE */}
        <div className="flex items-center gap-6">
          {/* Chromatic ASCII Logo (Scaled for Navbar) */}
          <div className="relative group cursor-pointer hover:opacity-80 transition-opacity">
            <ChromaticLogo type="apex" size="sm" className="scale-[0.6] origin-left -ml-2" />
          </div>

          {/* Google AI Badge (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full 
                          bg-gradient-to-r from-blue-500/10 to-green-500/10 
                          border border-blue-500/20 backdrop-blur-sm shadow-[0_0_10px_rgba(59,130,246,0.15)]
                          hover:scale-105 transition-transform duration-300 cursor-default">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
            <span className="text-[10px] font-mono font-bold text-blue-400/90 tracking-wider uppercase">
              Google AI
            </span>
          </div>
        </div>

        {/* CENTER: GEEK MODE TOGGLE */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <button
            onClick={() => setMode(mode === 'GEEK' ? 'STANDARD' : 'GEEK')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-300 group ${
              mode === 'GEEK' 
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.15)] md:shadow-[0_0_20px_rgba(34,211,238,0.2)]' 
                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60'
            }`}
          >
            <Terminal className={`w-3.5 h-3.5 transition-transform duration-300 ${mode === 'GEEK' ? 'rotate-0' : '-rotate-12 group-hover:rotate-0'}`} />
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase">
              {mode === 'GEEK' ? 'Geek Mode: ON' : 'Geek Mode: OFF'}
            </span>
          </button>
        </div>

        {/* RIGHT: SIGNAL & PLAYER 1 */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-end gap-3 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            {/* Signal Bars */}
            <div className="flex gap-0.5 items-end h-4 pb-[2px]">
              {[0.3, 0.5, 0.7, 0.85, 1].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                  className="w-1 rounded-[1px] origin-bottom transition-colors duration-500"
                  style={{
                    height: `${h * 100}%`,
                    backgroundColor: accentHex,
                    boxShadow: i === 4 ? `0 0 8px ${accentHex}` : 'none'
                  }}
                />
              ))}
            </div>
            {/* Player ID */}
            <span
              className="font-mono font-bold text-xs tracking-widest uppercase transition-colors duration-500 leading-none mb-[1px]"
              style={{ color: accentHex, textShadow: `0 0 10px ${accentHex}40` }}
            >
              PLAYER 1
            </span>
          </div>

          {/* Mobile Menu Trigger (Pixelated Grid) */}
          <div className="md:hidden w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center border border-white/10 active:bg-white/20">
             <div className="w-4 h-4 grid grid-cols-2 gap-1">
                <div className="bg-white/80 w-1.5 h-1.5 rounded-[1px]" />
                <div className="bg-white/40 w-1.5 h-1.5 rounded-[1px]" />
                <div className="bg-white/40 w-1.5 h-1.5 rounded-[1px]" />
                <div className="bg-white/80 w-1.5 h-1.5 rounded-[1px]" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
