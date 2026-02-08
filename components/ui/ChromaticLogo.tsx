'use client';

import React, { useEffect } from 'react';
import { 
  APEX_LOGO_ASCII_LINES,
  PLAYER_ONE_ASCII
} from '@/lib/terminal/constants';

// CSS-based chromatic aberration - 3 layer multicolor effect
const chromaticStyle = `
  @keyframes chromatic-cyan {
    0%, 100% { transform: translate(-3px, -2px); opacity: 0.8; }
    25% { transform: translate(3px, 2px); opacity: 0.6; }
    50% { transform: translate(-2px, 0px); opacity: 0.9; }
    75% { transform: translate(2px, -2px); opacity: 0.7; }
  }
  @keyframes chromatic-pink {
    0%, 100% { transform: translate(3px, 2px); opacity: 0.8; }
    25% { transform: translate(-3px, -2px); opacity: 0.6; }
    50% { transform: translate(2px, 0px); opacity: 0.9; }
    75% { transform: translate(-2px, 2px); opacity: 0.7; }
  }
  @keyframes chromatic-main {
    0%, 100% { transform: translate(0px, 0px); opacity: 1; }
    50% { transform: translate(1px, -1px); opacity: 0.98; }
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
`;

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
  useEffect(() => {
    // Inject chromatic CSS (for PLAYER_ONE chromatic effect)
    if (!document.getElementById('chromatic-logo-style')) {
      const style = document.createElement('style');
      style.id = 'chromatic-logo-style';
      style.textContent = chromaticStyle;
      document.head.appendChild(style);
    }
  }, []);

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
          padding: 0
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

  // PLAYER_ONE uses classic chromatic aberration
  return (
    <div className={`relative overflow-visible font-mono leading-none ${className}`}>
      {/* Cyan layer (offset left) */}
      <pre 
        className={`absolute top-0 left-0 text-cyan-400/80 select-none pointer-events-none chromatic-cyan whitespace-pre ${sizeClasses[size]}`}
        style={{ fontFamily: 'monospace' }}
      >
        {PLAYER_ONE_ASCII}
      </pre>
      
      {/* Pink/Magenta layer (offset right) */}
      <pre 
        className={`absolute top-0 left-0 text-pink-500/80 select-none pointer-events-none chromatic-pink whitespace-pre ${sizeClasses[size]}`}
        style={{ fontFamily: 'monospace' }}
      >
        {PLAYER_ONE_ASCII}
      </pre>
      
      {/* White layer (main) */}
      <pre 
        className={`text-white relative z-10 chromatic-main whitespace-pre ${sizeClasses[size]}`}
        style={{ fontFamily: 'monospace' }}
      >
        {PLAYER_ONE_ASCII}
      </pre>
    </div>
  );
};

export default ChromaticLogo;
