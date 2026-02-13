import React from 'react';
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
        
        {/* LEFT: ASCII LOGO + GEEK MODE (Mobile) */}
        <div className="flex items-center gap-3 z-20">
          {/* Full Multi-Color Logo - scaled to fit navbar */}
          <div className="relative group cursor-pointer hover:opacity-80 transition-opacity -ml-4 md:-ml-6">
            <ChromaticLogo type="apex" size="sm" className="scale-[0.55] md:scale-[0.6] origin-left" />
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
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
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
                  className="w-[3px] lg:w-1 rounded-[1px] origin-bottom transition-colors duration-500"
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

export default BrandingBar;
