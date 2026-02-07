import React from 'react';

const COLOR_MAP: Record<string, string> = {
  'cyan-400': '#22d3ee',
  'cyan-500': '#06b6d4',
  'emerald-400': '#10b981',
  'emerald-500': '#059669',
  'violet-400': '#a78bfa',
  'violet-500': '#8b5cf6',
  'amber-400': '#fbbf24',
  'amber-500': '#f59e0b',
  'pink-400': '#f472b6',
  'pink-500': '#ec4899',
};

interface GradientTextProps {
  children: React.ReactNode;
  from?: string;
  to?: string;
  className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  from = 'cyan-400',
  to = 'emerald-400',
  className = '',
}) => {
  const fromHex = COLOR_MAP[from] || from;
  const toHex = COLOR_MAP[to] || to;

  return (
    <span
      className={`${className}`}
      style={{
        backgroundImage: `linear-gradient(to right, ${fromHex}, ${toHex})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </span>
  );
};
