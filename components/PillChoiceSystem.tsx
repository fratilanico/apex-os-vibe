import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '../stores/useOnboardingStore';

export type PillOption = 'matrix' | 'commander' | 'arcade' | 'dashboard' | 'story';

interface PillChoiceSystemProps {
  activeOption?: PillOption;
  onSelect: (choice: 'personal' | 'business') => void;
}

// Configuration for each option
export const PILL_OPTIONS: Record<PillOption, {
  name: string;
  description: string;
  enabled: boolean;
}> = {
  matrix: {
    name: 'The Matrix Glitch',
    description: 'Direct Matrix reference with journey preview',
    enabled: true,
  },
  commander: {
    name: 'The Commander vs Solo',
    description: 'Action-oriented with clear differentiation',
    enabled: false,
  },
  arcade: {
    name: 'The Minimalist Arcade',
    description: 'Gamified icons with minimal text',
    enabled: false,
  },
  dashboard: {
    name: 'The Data Dashboard',
    description: 'Metrics and progress bars for data-driven users',
    enabled: false,
  },
  story: {
    name: 'The Story Dialogue',
    description: 'Narrative immersion with JARVIS personality',
    enabled: false,
  },
};

// JOURNEY DATA - Shared across all options
const JOURNEY_DATA = {
  personal: {
    icon: '🔵',
    pillNumber: 'PILL 1',
    label: 'INDIVIDUAL',
    subtitle: 'Master the Stack',
    color: 'from-cyan-500 to-blue-600',
    glowColor: 'rgba(6, 182, 212, 0.5)',
    borderColor: 'border-cyan-500/50',
    items: [
      '👤 Solo Builder Track',
      '⚡ Vibe Coding Mastery',
      '🎮 NPC Theory & Hacks',
      '📚 12 Self-Paced Modules',
      '🏆 Personal Arbitrage',
    ],
    tagline: 'Master the stack. Build alone. Win your time back.',
    metrics: [
      { label: 'Solo Focus', value: 95 },
      { label: 'Creative Freedom', value: 90 },
      { label: 'Time Arbitrage', value: 85 },
    ],
    weeks: [
      'Week 1: Vibe Coding',
      'Week 2: AI Agents',
      'Week 3: Ship Projects',
      'Week 4: Arbitrage Time',
    ],
  },
  business: {
    icon: '🔴',
    pillNumber: 'PILL 2',
    label: 'BUSINESS',
    subtitle: 'Orchestrate a Fleet',
    color: 'from-red-500 to-rose-600',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    borderColor: 'border-red-500/50',
    items: [
      '🚀 Fleet Orchestration',
      '📊 Revenue Engine Blueprints',
      '💼 Investor-Ready Frameworks',
      '👥 Team Scaling Playbooks',
      '💰 Enterprise Arbitrage',
    ],
    tagline: 'Orchestrate fleets. Scale systems. Dominate markets.',
    metrics: [
      { label: 'ROI Potential', value: 80 },
      { label: 'Scale Factor', value: 95 },
      { label: 'Enterprise Ready', value: 90 },
    ],
    weeks: [
      'Week 1: Market Analysis',
      'Week 2: Revenue Systems',
      'Week 3: Team Building',
      'Week 4: Investor Prep',
    ],
  },
};

// OPTION 1: THE MATRIX GLITCH
const MatrixGlitchOption: React.FC<{ onSelect: (choice: 'personal' | 'business') => void }> = ({ onSelect }) => {
  const [hoveredPill, setHoveredPill] = useState<string | null>(null);
  const [selectedPill, setSelectedPill] = useState<string | null>(null);

  const handleSelect = (pill: 'personal' | 'business') => {
    setSelectedPill(pill);
    setTimeout(() => onSelect(pill), 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-sans">Choose Your Path</h2>
        <p className="text-white/50 text-sm">Hover to glimpse your journey. Click to commit.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-stretch">
        {(['personal', 'business'] as const).map((pill) => {
          const data = JOURNEY_DATA[pill];
          const isHovered = hoveredPill === pill;
          const isSelected = selectedPill === pill;
          const isOtherSelected = selectedPill && selectedPill !== pill;

          return (
            <motion.div
              key={pill}
              className="relative flex-1 max-w-md"
              onHoverStart={() => setHoveredPill(pill)}
              onHoverEnd={() => setHoveredPill(null)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: isOtherSelected ? 0.3 : 1, scale: isSelected ? 1.02 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${data.color} blur-xl`}
                animate={{ opacity: isHovered ? 0.4 : isSelected ? 0.6 : 0.2, scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.4 }}
              />

              <motion.button
                onClick={() => handleSelect(pill)}
                className={`relative w-full p-6 md:p-8 rounded-2xl border backdrop-blur-xl bg-black/60 overflow-hidden group ${data.borderColor}`}
                style={{
                  boxShadow: isHovered || isSelected 
                    ? `0 0 40px ${data.glowColor}, 0 0 80px ${data.glowColor}40`
                    : `0 0 20px ${data.glowColor}20`,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div className={`absolute inset-0 bg-gradient-to-br ${data.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className="absolute inset-0 pointer-events-none opacity-20" style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                }} />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl filter drop-shadow-lg">{data.icon}</span>
                    <div className="text-left">
                      <div className={`text-xs font-mono font-bold tracking-widest uppercase bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}>
                        {data.pillNumber}
                      </div>
                      <div className="text-xl font-bold text-white">{data.label}</div>
                    </div>
                  </div>

                  <p className="text-white/60 text-sm text-left mb-4">{data.subtitle}</p>

                  <AnimatePresence>
                    {isHovered && !selectedPill && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="pt-4 border-t border-white/10">
                          <div className="text-left space-y-2">
                            {data.items.map((item, idx) => (
                              <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="flex items-center gap-2 text-sm text-white/80">
                                <span className="text-xs opacity-50">{item.split(' ')[0]}</span>
                                <span>{item.split(' ').slice(1).join(' ')}</span>
                              </motion.div>
                            ))}
                          </div>
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className={`mt-4 text-xs italic text-center bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}>
                            "{data.tagline}"
                          </motion.p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isSelected && (
                    <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 0.8 }} className={`absolute inset-0 bg-gradient-to-br ${data.color} rounded-2xl`} />
                  )}
                </div>

                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${data.color} opacity-20 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2`} />
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-8 text-white/30 text-xs font-mono">
        "Remember: all I'm offering is the truth. Nothing more."
      </motion.p>
    </div>
  );
};

// OPTION 2: THE COMMANDER VS SOLO
const CommanderSoloOption: React.FC<{ onSelect: (choice: 'personal' | 'business') => void }> = ({ onSelect }) => {
  const [selectedPill, setSelectedPill] = useState<string | null>(null);

  const handleSelect = (pill: 'personal' | 'business') => {
    setSelectedPill(pill);
    setTimeout(() => onSelect(pill), 600);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(['personal', 'business'] as const).map((pill) => {
          const data = JOURNEY_DATA[pill];
          const isSelected = selectedPill === pill;

          return (
            <motion.button
              key={pill}
              onClick={() => handleSelect(pill)}
              className={`relative p-8 rounded-xl border text-left transition-all duration-300 ${
                pill === 'personal' 
                  ? 'bg-blue-500/5 border-blue-500/30 hover:border-blue-500/60' 
                  : 'bg-red-500/5 border-red-500/30 hover:border-red-500/60'
              }`}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-3xl">{data.icon}</span>
                  <h3 className={`text-lg font-bold mt-2 ${pill === 'personal' ? 'text-blue-400' : 'text-red-400'}`}>
                    {data.label} PATH
                  </h3>
                </div>
                <span className="text-xs font-mono text-white/30 uppercase tracking-wider">{data.pillNumber}</span>
              </div>

              <ul className="space-y-3 mb-6">
                {data.items.slice(0, 4).map((item, idx) => (
                  <li key={idx} className="text-sm text-white/70 flex items-center gap-2">
                    <span className="text-xs opacity-50">{item.split(' ')[0]}</span>
                    {item.split(' ').slice(1).join(' ')}
                  </li>
                ))}
              </ul>

              <p className={`text-xs ${pill === 'personal' ? 'text-blue-400/70' : 'text-red-400/70'}`}>
                18 days until cohort launch →
              </p>

              {isSelected && (
                <motion.div layoutId="selection" className={`absolute inset-0 border-2 rounded-xl ${pill === 'personal' ? 'border-blue-400' : 'border-red-400'}`} />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// OPTION 3: THE MINIMALIST ARCADE
const ArcadeOption: React.FC<{ onSelect: (choice: 'personal' | 'business') => void }> = ({ onSelect }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        {(['personal', 'business'] as const).map((pill) => {
          const data = JOURNEY_DATA[pill];
          const isHovered = hovered === pill;

          return (
            <motion.button
              key={pill}
              onClick={() => onSelect(pill)}
              onHoverStart={() => setHovered(pill)}
              onHoverEnd={() => setHovered(null)}
              className={`relative w-64 h-80 rounded-2xl border-2 flex flex-col items-center justify-center gap-6 transition-all duration-500 ${
                pill === 'personal'
                  ? 'border-cyan-500/40 bg-cyan-500/5 hover:border-cyan-400 hover:bg-cyan-500/10'
                  : 'border-red-500/40 bg-red-500/5 hover:border-red-400 hover:bg-red-500/10'
              }`}
              style={{
                boxShadow: isHovered
                  ? pill === 'personal'
                    ? '0 0 60px rgba(6, 182, 212, 0.3), inset 0 0 60px rgba(6, 182, 212, 0.1)'
                    : '0 0 60px rgba(239, 68, 68, 0.3), inset 0 0 60px rgba(239, 68, 68, 0.1)'
                  : 'none',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="text-6xl"
                animate={{ scale: isHovered ? 1.2 : 1, rotate: isHovered ? [0, -10, 10, 0] : 0 }}
                transition={{ duration: 0.5 }}
              >
                {data.icon}
              </motion.span>

              <div className="text-center">
                <div className={`text-2xl font-bold ${pill === 'personal' ? 'text-cyan-400' : 'text-red-400'}`}>
                  {data.label}
                </div>
                <div className="text-xs font-mono text-white/40 mt-1">{data.pillNumber}</div>
              </div>

              <div className="flex gap-4">
                {['SKILL', 'BUILD'].map((label) => (
                  <div
                    key={label}
                    className={`px-3 py-1 rounded border text-xs font-mono ${
                      pill === 'personal'
                        ? 'border-cyan-500/30 text-cyan-400/70'
                        : 'border-red-500/30 text-red-400/70'
                    }`}
                  >
                    {label}
                  </div>
                ))}
              </div>

              <p className="text-xs text-white/40 text-center px-4">
                {pill === 'personal' ? 'For the solo builder' : 'For the team leader'}
              </p>

              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                  <span className={`text-xs ${pill === 'personal' ? 'text-cyan-400' : 'text-red-400'}`}>
                    [Click to start journey]
                  </span>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// OPTION 4: THE DATA DASHBOARD
const DashboardOption: React.FC<{ onSelect: (choice: 'personal' | 'business') => void }> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(['personal', 'business'] as const).map((pill) => {
          const data = JOURNEY_DATA[pill];

          return (
            <motion.button
              key={pill}
              onClick={() => onSelect(pill)}
              className={`relative p-6 rounded-xl border text-left ${
                pill === 'personal'
                  ? 'bg-slate-900/80 border-cyan-500/30 hover:border-cyan-500/60'
                  : 'bg-slate-900/80 border-red-500/30 hover:border-red-500/60'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{data.icon}</span>
                <div>
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${pill === 'personal' ? 'text-cyan-400' : 'text-red-400'}`}>
                    {data.label} METRICS
                  </h3>
                  <p className="text-xs text-white/40">{data.pillNumber}</p>
                </div>
              </div>

              <div className="space-y-4">
                {data.metrics.map((metric, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/60">{metric.label}</span>
                      <span className={pill === 'personal' ? 'text-cyan-400' : 'text-red-400'}>{metric.value}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${pill === 'personal' ? 'bg-cyan-400' : 'bg-red-400'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ delay: idx * 0.2, duration: 1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <p className={`text-xs ${pill === 'personal' ? 'text-cyan-400/70' : 'text-red-400/70'}`}>
                  "{data.tagline}"
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// OPTION 5: THE STORY DIALOGUE
const StoryOption: React.FC<{ onSelect: (choice: 'personal' | 'business') => void }> = ({ onSelect }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-black/60 border border-violet-500/30 rounded-2xl p-8 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <span className="text-violet-400 font-mono text-sm">JARVIS:</span>
          <span className="text-white/70 text-sm">"I see you're ready to choose your path..."</span>
        </div>

        <div className="space-y-4">
          {(['personal', 'business'] as const).map((pill) => {
            const data = JOURNEY_DATA[pill];
            const isHovered = hovered === pill;

            return (
              <motion.button
                key={pill}
                onClick={() => onSelect(pill)}
                onHoverStart={() => setHovered(pill)}
                onHoverEnd={() => setHovered(null)}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-300 ${
                  pill === 'personal'
                    ? 'border-blue-500/30 bg-blue-500/5 hover:border-blue-500/60 hover:bg-blue-500/10'
                    : 'border-red-500/30 bg-red-500/5 hover:border-red-500/60 hover:bg-red-500/10'
                }`}
                whileHover={{ x: 8 }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{data.icon}</span>
                  <div className="flex-1">
                    <div className={`font-bold ${pill === 'personal' ? 'text-blue-400' : 'text-red-400'}`}>
                      {data.label} PATH
                    </div>
                    <div className="text-xs text-white/40 font-mono mt-1">{data.pillNumber}</div>
                  </div>
                </div>

                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        {data.weeks.map((week, idx) => (
                          <div key={idx} className="text-xs text-white/60 font-mono">
                            {week}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        <p className="text-center mt-6 text-white/30 text-xs font-mono">
          [Select your training protocol]
        </p>
      </motion.div>
    </div>
  );
};

// MAIN COMPONENT - Routes to active option
export const PillChoiceSystem: React.FC<PillChoiceSystemProps> = ({ 
  activeOption = 'matrix', 
  onSelect 
}) => {
  const renderOption = () => {
    switch (activeOption) {
      case 'matrix':
        return <MatrixGlitchOption onSelect={onSelect} />;
      case 'commander':
        return <CommanderSoloOption onSelect={onSelect} />;
      case 'arcade':
        return <ArcadeOption onSelect={onSelect} />;
      case 'dashboard':
        return <DashboardOption onSelect={onSelect} />;
      case 'story':
        return <StoryOption onSelect={onSelect} />;
      default:
        return <MatrixGlitchOption onSelect={onSelect} />;
    }
  };

  return (
    <div className="w-full">
      {renderOption()}
    </div>
  );
};

export default PillChoiceSystem;
