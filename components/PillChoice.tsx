import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '../stores/useOnboardingStore';

interface PillChoiceProps {
  onSelect: (choice: 'personal' | 'business') => void;
}

interface JourneyPreview {
  icon: string;
  title: string;
  items: string[];
  tagline: string;
  color: string;
  glowColor: string;
}

const JOURNEY_DATA: Record<string, JourneyPreview> = {
  personal: {
    icon: '🔵',
    title: 'BLUE PILL - INDIVIDUAL',
    items: [
      '👤 Solo Builder Track',
      '⚡ Vibe Coding Mastery',
      '🎮 NPC Theory & Hacks',
      '📚 12 Self-Paced Modules',
      '🏆 Personal Arbitrage',
    ],
    tagline: 'Master the stack. Build alone. Win your time back.',
    color: 'from-cyan-500 to-blue-600',
    glowColor: 'rgba(6, 182, 212, 0.5)',
  },
  business: {
    icon: '🔴',
    title: 'RED PILL - BUSINESS',
    items: [
      '🚀 Fleet Orchestration',
      '📊 Revenue Engine Blueprints',
      '💼 Investor-Ready Frameworks',
      '👥 Team Scaling Playbooks',
      '💰 Enterprise Arbitrage',
    ],
    tagline: 'Orchestrate fleets. Scale systems. Dominate markets.',
    color: 'from-red-500 to-rose-600',
    glowColor: 'rgba(239, 68, 68, 0.5)',
  },
};

export const PillChoice: React.FC<PillChoiceProps> = ({ onSelect }) => {
  const [hoveredPill, setHoveredPill] = useState<string | null>(null);
  const [selectedPill, setSelectedPill] = useState<string | null>(null);

  const handleSelect = (pill: 'personal' | 'business') => {
    setSelectedPill(pill);
    // Delay to show selection animation
    setTimeout(() => {
      onSelect(pill);
    }, 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-sans">
          Choose Your Path
        </h2>
        <p className="text-white/50 text-sm">
          Hover to glimpse your journey. Click to commit.
        </p>
      </motion.div>

      {/* Pills Container */}
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
              animate={{ 
                opacity: isOtherSelected ? 0.3 : 1,
                scale: isSelected ? 1.02 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Glow Effect */}
              <motion.div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${data.color} blur-xl`}
                animate={{
                  opacity: isHovered ? 0.4 : isSelected ? 0.6 : 0.2,
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Main Pill Button */}
              <motion.button
                onClick={() => handleSelect(pill)}
                className={`relative w-full p-6 md:p-8 rounded-2xl border backdrop-blur-xl
                  bg-black/60 overflow-hidden group
                  ${isHovered || isSelected 
                    ? `border-opacity-100 shadow-2xl` 
                    : 'border-white/20 border-opacity-50'
                  }
                `}
                style={{
                  borderColor: isHovered || isSelected ? data.glowColor : undefined,
                  boxShadow: isHovered || isSelected 
                    ? `0 0 40px ${data.glowColor}, 0 0 80px ${data.glowColor}40`
                    : `0 0 20px ${data.glowColor}20`,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated Background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${data.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Scanline Effect */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl filter drop-shadow-lg">{data.icon}</span>
                    <div className="text-left">
                      <div className={`text-xs font-mono font-bold tracking-widest uppercase bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}>
                        {pill === 'personal' ? 'PILL 1' : 'PILL 2'}
                      </div>
                      <div className="text-xl font-bold text-white">
                        {pill === 'personal' ? 'INDIVIDUAL' : 'BUSINESS'}
                      </div>
                    </div>
                  </div>

                  {/* Subtitle */}
                  <p className="text-white/60 text-sm text-left mb-4">
                    {pill === 'personal' ? 'Master the Stack' : 'Orchestrate a Fleet'}
                  </p>

                  {/* Hover Preview Panel */}
                  <AnimatePresence>
                    {isHovered && !selectedPill && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className={`pt-4 border-t border-white/10`}>
                          {/* Journey Preview */}
                          <div className="text-left space-y-2">
                            {data.items.map((item, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center gap-2 text-sm text-white/80"
                              >
                                <span className="text-xs opacity-50">{item.split(' ')[0]}</span>
                                <span>{item.split(' ').slice(1).join(' ')}</span>
                              </motion.div>
                            ))}
                          </div>

                          {/* Tagline */}
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className={`mt-4 text-xs italic text-center bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}
                          >
                            "{data.tagline}"
                          </motion.p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Selection Ripple */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 3, opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className={`absolute inset-0 bg-gradient-to-br ${data.color} rounded-2xl`}
                    />
                  )}
                </div>

                {/* Corner Accent */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${data.color} opacity-20 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2`} />
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Matrix Reference Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8 text-white/30 text-xs font-mono"
      >
        "Remember: all I'm offering is the truth. Nothing more."
      </motion.p>
    </div>
  );
};

export default PillChoice;
