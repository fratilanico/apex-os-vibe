import React from 'react';
import { useColorCycle } from '../../hooks/useColorCycle';
import { useOnboardingStore } from '../../stores/useOnboardingStore';
import { Terminal } from 'lucide-react';

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
        
        {/* LEFT: LOGO + GEEK MODE (Mobile) / LOGO ONLY (Desktop) */}
        <div className="flex items-center gap-3 z-20">
          {/* Main Logo Image */}
          <div className="relative flex items-center">
            <img 
              src="/logo.png" 
              alt="APEX OS" 
              className="h-10 md:h-12 w-auto object-contain hover:opacity-80 transition-opacity cursor-pointer"
            />
          </div>
          
          {/* GEEK MODE TOGGLE - Mobile only (left side) */}
          <div className="md:hidden">
            <button
              onClick={() => setMode(mode === 'GEEK' ? 'STANDARD' : 'GEEK')}
              className={`flex items-center gap-1 px-2 py-1 rounded-full border transition-all duration-300 ${
                mode === 'GEEK' 
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.2)]' 
                  : 'bg-white/5 border-white/10 text-white/40'
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span className="text-[8px] font-mono font-bold tracking-wider uppercase">
                {mode === 'GEEK' ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>

        {/* CENTER: GEEK MODE TOGGLE - Desktop only */}
        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <button
            onClick={() => setMode(mode === 'GEEK' ? 'STANDARD' : 'GEEK')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-300 group whitespace-nowrap ${
              mode === 'GEEK' 
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]' 
                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60'
            }`}
          >
            <Terminal className={`w-3.5 h-3.5 transition-transform duration-300 ${mode === 'GEEK' ? 'rotate-0' : '-rotate-12 group-hover:rotate-0'}`} />
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase">
              {mode === 'GEEK' ? 'Geek: ON' : 'Geek: OFF'}
            </span>
          </button>
        </div>

        {/* RIGHT: GOOGLE AI BADGE + SIGNAL & PLAYER 1 */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Google AI Startup Badge (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-full 
                          bg-gradient-to-r from-blue-500/10 to-green-500/10 
                          border border-blue-500/20 backdrop-blur-sm shadow-[0_0_10px_rgba(59,130,246,0.15)]
                          hover:scale-105 transition-transform duration-300 cursor-default">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
            <span className="text-[9px] font-mono font-bold text-blue-400/90 tracking-wider uppercase">
              Google AI Startup
            </span>
          </div>
          <div className="hidden md:flex items-end gap-2 lg:gap-3 bg-white/5 px-2 lg:px-3 py-1.5 rounded-lg border border-white/5">
            {/* Signal Bars - Static to prevent layout shifts */}
            <div className="flex gap-[2px] lg:gap-0.5 items-end h-4 pb-[2px]">
              {[0.3, 0.5, 0.7, 0.85, 1].map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] lg:w-1 rounded-[1px] origin-bottom"
                  style={{
                    height: `${h * 100}%`,
                    backgroundColor: accentHex,
                    boxShadow: i === 4 ? `0 0 8px ${accentHex}` : 'none',
                    transform: 'scaleY(1)',
                    willChange: 'auto'
                  }}
                />
              ))}
            </div>
            {/* Player ID */}
            <span
              className="font-mono font-bold text-[10px] lg:text-xs tracking-widest uppercase transition-colors duration-500 leading-none mb-[1px]"
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
