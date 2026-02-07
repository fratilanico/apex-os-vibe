import React from 'react';
import { LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface StatCardProps {
  icon: LucideIcon;
  number: string | number;
  label: string;
  accent?: 'cyan' | 'emerald' | 'violet' | 'amber' | 'pink';
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  number,
  label,
  accent = 'cyan',
  delay = 0,
}) => {
  const iconColors = {
    cyan: 'text-cyan-400',
    emerald: 'text-emerald-400',
    violet: 'text-violet-400',
    amber: 'text-amber-400',
    pink: 'text-pink-400',
  };

  const numberColors = {
    cyan: 'text-cyan-400',
    emerald: 'text-emerald-400',
    violet: 'text-violet-400',
    amber: 'text-amber-400',
    pink: 'text-pink-400',
  };

  return (
    <GlassCard accent={accent} delay={delay} className="p-6">
      <div className="flex items-center gap-4">
        <div className={`${iconColors[accent]}`}>
          <Icon className="w-10 h-10" />
        </div>
        <div>
          <div className={`text-3xl font-black ${numberColors[accent]}`}>
            {number}
          </div>
          <div className="text-white/60 text-sm font-medium mt-1">
            {label}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
