'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Zap, Brain, Activity } from 'lucide-react';
import { 
  APEX_LOGO_ASCII,
  APEX_LOGO_ASCII_MOBILE,
  PLAYER_ONE_ASCII,
  PLAYER_ONE_ASCII_MOBILE,
  SYSTEM_MESSAGES,
  UI_LABELS 
} from '@/lib/terminal/constants';

interface NeuralPixelBrandingProps {
  isAuthorized: boolean;
  className?: string;
}

// CSS-based chromatic aberration - much more performant than framer-motion for rapid animations
const chromaticStyle = `
  @keyframes chromatic-cyan {
    0%, 100% { transform: translate(-2px, -1px); opacity: 0.7; }
    25% { transform: translate(2px, 1px); opacity: 0.5; }
    50% { transform: translate(-1px, 0px); opacity: 0.8; }
    75% { transform: translate(1px, -1px); opacity: 0.6; }
  }
  @keyframes chromatic-pink {
    0%, 100% { transform: translate(2px, 1px); opacity: 0.7; }
    25% { transform: translate(-2px, -1px); opacity: 0.5; }
    50% { transform: translate(1px, 0px); opacity: 0.8; }
    75% { transform: translate(-1px, 1px); opacity: 0.6; }
  }
  @keyframes chromatic-main {
    0%, 100% { transform: translate(0px, 0px); opacity: 1; }
    50% { transform: translate(0.5px, -0.5px); opacity: 0.95; }
  }
  @keyframes pulse-dot {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.2); opacity: 1; }
  }
  @keyframes fade-slide-in {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .chromatic-cyan {
    animation: chromatic-cyan 0.15s linear infinite;
  }
  .chromatic-pink {
    animation: chromatic-pink 0.12s linear infinite;
  }
  .chromatic-main {
    animation: chromatic-main 0.1s linear infinite;
  }
  .pulse-dot {
    animation: pulse-dot 1.5s ease-in-out infinite;
  }
  .fade-slide-in {
    animation: fade-slide-in 0.3s ease-out forwards;
  }
`;

export const NeuralPixelBranding: React.FC<NeuralPixelBrandingProps> = ({ 
  isAuthorized, 
  className = '' 
}) => {
  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Inject chromatic CSS once
    if (!document.getElementById('chromatic-style')) {
      const style = document.createElement('style');
      style.id = 'chromatic-style';
      style.textContent = chromaticStyle;
      document.head.appendChild(style);
    }
    
    // Staged reveal for smooth appearance
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setStage(1), 300);
    const t3 = setTimeout(() => setStage(2), 500);
    const t4 = setTimeout(() => setStage(3), 800);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);
  
  // Select appropriate ASCII based on screen size
  const apexLogo = isMobile ? APEX_LOGO_ASCII_MOBILE : APEX_LOGO_ASCII;
  const playerOneLogo = isMobile ? PLAYER_ONE_ASCII_MOBILE : PLAYER_ONE_ASCII;

  return (
    <div
      className={`font-mono text-xs leading-tight transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'} ${className}`}
    >
      {/* APEX Logo with CSS-based chromatic aberration */}
      <div
        className="relative mb-2 overflow-visible transition-all duration-400"
        style={{ 
          opacity: visible ? 1 : 0, 
          transform: visible ? 'translateX(0)' : 'translateX(-20px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease'
        }}
      >
        {/* Cyan layer (offset left) */}
        <pre className="absolute top-0 left-0 text-cyan-400/70 select-none pointer-events-none chromatic-cyan whitespace-pre text-[8px] sm:text-xs">
          {apexLogo}
        </pre>
        
        {/* Pink/Magenta layer (offset right) */}
        <pre className="absolute top-0 left-0 text-pink-500/70 select-none pointer-events-none chromatic-pink whitespace-pre text-[8px] sm:text-xs">
          {apexLogo}
        </pre>
        
        {/* White layer (main) */}
        <pre className="text-white/95 relative z-10 chromatic-main whitespace-pre text-[8px] sm:text-xs">
          {apexLogo}
        </pre>
      </div>

      {/* Status indicators - simplified on mobile */}
      <div
        className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 text-[8px] sm:text-[10px] text-zinc-500 transition-opacity duration-300"
        style={{ opacity: stage >= 1 ? 1 : 0 }}
      >
        <span className="flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
          <span className="hidden sm:inline">{SYSTEM_MESSAGES.NEURAL_ACTIVE}</span>
          <span className="sm:hidden">Neural</span>
        </span>
        <span className="flex items-center gap-1">
          <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
          {SYSTEM_MESSAGES.SOVEREIGN}
        </span>
        {!isMobile && (
          <>
            <span className="flex items-center gap-1">
              <Brain className="w-3 h-3 text-cyan-400" />
              {UI_LABELS.APEX_AI}
            </span>
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" />
              {SYSTEM_MESSAGES.HANDSHAKE_AUTHORIZED}
            </span>
          </>
        )}
      </div>

      {/* PLAYER 1 Badge Container - Centered with Glassmorphism */}
      <div
        className="flex flex-col items-center justify-center mb-4 transition-all duration-500"
        style={{ 
          opacity: stage >= 2 ? 1 : 0,
          transform: stage >= 2 ? 'scale(1)' : 'scale(0.95)'
        }}
      >
        <div className="backdrop-blur-md bg-black/20 border border-zinc-700/50 rounded-lg px-6 py-4 shadow-xl">
          <pre
            className="text-[8px] sm:text-xs leading-tight transition-colors duration-600 whitespace-pre"
            style={{
              color: isAuthorized ? 'rgba(52, 211, 153, 0.9)' : 'rgba(34, 211, 238, 0.9)',
              textShadow: isAuthorized 
                ? '0 0 20px rgba(52, 211, 153, 0.5)'
                : '0 0 20px rgba(34, 211, 238, 0.5)',
            }}
          >
            {playerOneLogo}
          </pre>
          
          {/* SYNCING_SYNAPSES text below badge */}
          <div
            className="text-center mt-2 transition-opacity duration-300"
            style={{ opacity: stage >= 3 ? 1 : 0 }}
          >
            <span 
              className="text-[10px] uppercase tracking-widest transition-colors duration-800"
              style={{
                color: isAuthorized ? 'rgba(52, 211, 153, 0.7)' : 'rgba(34, 211, 238, 0.7)'
              }}
            >
              {isAuthorized 
                ? SYSTEM_MESSAGES.NEURAL_HANDSHAKE_COMPLETE 
                : SYSTEM_MESSAGES.SYNCING_SYNAPSES}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom status row */}
      <div
        className="mt-4 flex items-center gap-3 transition-opacity duration-300"
        style={{ opacity: stage >= 3 ? (isAuthorized ? 1 : 0.3) : 0 }}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isAuthorized ? 'bg-emerald-400 pulse-dot' : 'bg-zinc-600'}`}
          />
          <span className={`text-[10px] ${isAuthorized ? 'text-emerald-400' : 'text-zinc-500'}`}>
            {isAuthorized ? SYSTEM_MESSAGES.NEURAL_HANDSHAKE_COMPLETE : SYSTEM_MESSAGES.SYNCING_SYNAPSES}
          </span>
        </div>

        {isAuthorized && stage >= 3 && (
          <span className="text-[10px] text-cyan-400/60 fade-slide-in">
            Type &apos;help&apos; for available commands
          </span>
        )}
      </div>
    </div>
  );
};
