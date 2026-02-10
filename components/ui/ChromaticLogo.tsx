'use client';

import React from 'react';
import { 
  APEX_LOGO_ASCII_LINES,
  PLAYER_ONE_ASCII
} from '@/lib/terminal/constants';

interface ChromaticLogoProps {
  type?: 'apex' | 'player-one';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ChromaticLogo: React.FC<ChromaticLogoProps> = ({ 
  type = 'apex',
  className = '',
  size = 'lg'
}) => {
  const sizeClasses = {
    sm: 'text-[8px] sm:text-xs',
    md: 'text-[10px] sm:text-sm',
    lg: 'text-xs sm:text-base md:text-lg',
    xl: 'text-sm sm:text-lg md:text-xl lg:text-2xl'
  };

  // APEX logo uses multi-color Gemini style
  if (type === 'apex') {
    return (
      <pre 
        className={`font-mono overflow-visible whitespace-pre leading-[0.85] ${sizeClasses[size]} ${className}`}
        style={{ 
          fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
          fontVariantLigatures: 'none',
          textRendering: 'geometricPrecision',
          margin: 0,
          padding: 0,
          transform: 'translate3d(0, 0, 0)', // GPU acceleration
          willChange: 'auto'
        }}
      >
        {APEX_LOGO_ASCII_LINES.map((l, i) => (
          <span key={i} style={{ color: l.color, display: 'block' }}>
            {l.text}
          </span>
        ))}
      </pre>
    );
  }

  // PLAYER_ONE uses static chromatic aberration (no animations to prevent layout shifts)
  return (
    <div 
      className={`relative overflow-visible font-mono leading-none ${className}`}
      style={{ transform: 'translate3d(0, 0, 0)' }}
    >
      {/* Cyan layer (offset left) - STATIC */}
      <pre 
        className={`absolute top-0 left-0 text-cyan-400/60 select-none pointer-events-none whitespace-pre ${sizeClasses[size]}`}
        style={{ 
          fontFamily: 'monospace',
          transform: 'translate(-2px, -1px)',
          willChange: 'auto'
        }}
      >
        {PLAYER_ONE_ASCII}
      </pre>
      
      {/* Pink/Magenta layer (offset right) - STATIC */}
      <pre 
        className={`absolute top-0 left-0 text-pink-500/60 select-none pointer-events-none whitespace-pre ${sizeClasses[size]}`}
        style={{ 
          fontFamily: 'monospace',
          transform: 'translate(2px, 1px)',
          willChange: 'auto'
        }}
      >
        {PLAYER_ONE_ASCII}
      </pre>
      
      {/* White layer (main) - STATIC */}
      <pre 
        className={`text-white relative z-10 whitespace-pre ${sizeClasses[size]}`}
        style={{ 
          fontFamily: 'monospace',
          willChange: 'auto'
        }}
      >
        {PLAYER_ONE_ASCII}
      </pre>
    </div>
  );
};

export default ChromaticLogo;
