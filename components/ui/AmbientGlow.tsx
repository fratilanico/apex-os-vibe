import React from 'react';

interface AmbientGlowProps {
  color: 'cyan' | 'emerald' | 'violet' | 'amber' | 'pink' | 'yellow';
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  opacity?: number;
}

export const AmbientGlow: React.FC<AmbientGlowProps> = ({
  color,
  size = 500,
  top,
  left,
  right,
  bottom,
  opacity = 0.15,
}) => {
  const colorMap = {
    cyan: '#06b6d4',
    emerald: '#10b981',
    violet: '#8b5cf6',
    amber: '#f59e0b',
    pink: '#ec4899',
    yellow: '#facc15',
  };

  return (
    <div
      className="absolute pointer-events-none rounded-full ambient-glow"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: colorMap[color],
        filter: `blur(${size / 5}px)`,
        opacity,
        top,
        left,
        right,
        bottom,
        transform: 'translate3d(0, 0, 0)', // Force GPU layer
        willChange: 'opacity', // Hint for browser optimization
      }}
    />
  );
};
