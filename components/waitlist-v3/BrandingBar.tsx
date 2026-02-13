import React from 'react';
import { ChromaticLogo } from '../ui/ChromaticLogo';
import { useColorCycle } from '../../hooks/useColorCycle';

interface BrandingBarProps {
  geekMode?: boolean;
  onToggleGeek?: () => void;
}

export const BrandingBar: React.FC<BrandingBarProps> = ({ 
  geekMode = true, 
  onToggleGeek 
}) => {
  const accentColor = useColorCycle();
  
  const getBarColor = () => {
    switch (accentColor) {
      case 'cyan': return 'bg-cyan-500';
      case 'emerald': return 'bg-emerald-500';
      case 'violet': return 'bg-violet-500';
      case 'amber': return 'bg-amber-500';
      case 'pink': return 'bg-pink-500';
      default: return 'bg-cyan-500';
    }
  };
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left: APEX_OS Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer hover:opacity-80 transition-opacity -ml-4 md:-ml-6">
            <ChromaticLogo type="apex" size="sm" className="scale-[0.55] md:scale-[0.6] origin-left" />
          </div>
        </div>

        {/* Center: GEEK Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-white/50">GEEK:</span>
          <button 
            onClick={onToggleGeek}
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all duration-300 ${
              geekMode 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
                : 'bg-white/5 text-white/30 border border-white/10'
            }`}
          >
            {geekMode ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Right Side: Google AI Startup + Player 1 */}
        <div className="flex items-center gap-4">
          {/* GOOGLE AI STARTUP Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-xs font-medium text-white/80">AI STARTUP</span>
          </div>

          {/* PLAYER 1 with Signal Bars */}
          <div className="flex items-center gap-2">
            <ChromaticLogo type="player-one" size="sm" className="scale-[0.5] md:scale-[0.55] origin-right" />
            <div className="flex items-end gap-0.5 h-4">
              <div className={`w-1 h-1 ${getBarColor()} rounded-sm animate-pulse transition-colors duration-500`} />
              <div className={`w-1 h-2 ${getBarColor()} rounded-sm animate-pulse delay-75 transition-colors duration-500`} />
              <div className={`w-1 h-3 ${getBarColor()} rounded-sm animate-pulse delay-150 transition-colors duration-500`} />
              <div className={`w-1 h-4 ${getBarColor()} rounded-sm animate-pulse delay-200 transition-colors duration-500`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingBar;
