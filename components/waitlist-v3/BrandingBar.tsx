import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useColorCycle } from '../../hooks/useColorCycle';
import { useOnboardingStore } from '../../stores/useOnboardingStore';
import { Terminal } from 'lucide-react';

const COLOR_HEX: Record<string, string> = {
  cyan: '#22d3ee', emerald: '#10b981', violet: '#8b5cf6',
  amber: '#fbbf24', pink: '#f472b6',
};

const BRAND_TEXT = 'APEX_OS';

export const BrandingBar: React.FC = () => {
  const accent = useColorCycle();
  const { mode, setMode } = useOnboardingStore();
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  // Typewriter effect on mount
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= BRAND_TEXT.length) {
        setDisplayText(BRAND_TEXT.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  // Cursor blink
  useEffect(() => {
    const timer = setInterval(() => setShowCursor(p => !p), 530);
    return () => clearInterval(timer);
  }, []);

  const accentHex = COLOR_HEX[accent] || '#22d3ee';

  return (
    <div className="fixed top-0 left-0 right-0 z-40 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Desktop left: branding + Google AI badge + Geek Mode Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full transition-colors duration-500"
              style={{ backgroundColor: accentHex, boxShadow: `0 0 8px ${accentHex}` }}
            />
            <span className="font-mono font-bold text-white text-sm tracking-wider">
              {displayText}
              <span
                className="transition-opacity duration-100"
                style={{ opacity: showCursor ? 1 : 0 }}
              >
                _
              </span>
            </span>
          </div>

          {/* Google AI Startup Badge Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full 
                          bg-gradient-to-r from-blue-500/10 to-green-500/10 
                          border border-blue-500/20 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_4px_rgba(96,165,250,0.8)]" />
            <span className="text-[9px] font-mono font-bold text-blue-400/80 tracking-wider uppercase">
              Google AI
            </span>
          </div>

          {/* Geek Mode Toggle */}
          <button
            onClick={() => setMode(mode === 'GEEK' ? 'STANDARD' : 'GEEK')}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-300 ${
              mode === 'GEEK' 
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60'
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
              {mode === 'GEEK' ? 'Geek Mode: ON' : 'Geek Mode: OFF'}
            </span>
          </button>
        </div>

        {/* Desktop right: health bars + PLAYER 1 */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex gap-1 items-end">
            {[0.4, 0.6, 0.75, 0.9, 1].map((h, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                className="w-1.5 rounded-sm origin-bottom transition-colors duration-500"
                style={{
                  height: `${h * 20}px`,
                  backgroundColor: accentHex,
                }}
              />
            ))}
          </div>
          <span
            className="font-mono font-bold text-xs tracking-widest uppercase transition-colors duration-500"
            style={{ color: accentHex }}
          >
            PLAYER 1
          </span>
        </div>

        {/* Mobile: centered pill */}
        <div className="flex md:hidden items-center justify-between w-full">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: accentHex }}
            />
            <span className="font-mono text-xs text-white/70 tracking-wider">
              APEX_OS // PLAYER 1
            </span>
          </div>
          
          <button
            onClick={() => setMode(mode === 'GEEK' ? 'STANDARD' : 'GEEK')}
            className={`p-2 rounded-full border transition-all duration-300 ${
              mode === 'GEEK' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-white/5 border-white/10 text-white/40'
            }`}
          >
            <Terminal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
