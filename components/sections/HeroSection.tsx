import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Zap, Rocket, Crown, TrendingUp, Code2, Briefcase, Clock, BookOpen, Wrench, Sparkles, ArrowRight } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// HERO SECTION - GAMIFICATION PROGRESSION EDITION
// Newbie → Learner → Builder → Visionary → Accelerator
// ═══════════════════════════════════════════════════════════════════════════════

interface HeroSectionProps {
  onStartJourney?: () => void;
  onCtaClick?: () => void;
}

const TypewriterText: React.FC<{ text: string; delay?: number; className?: string }> = ({ 
  text, 
  delay = 0, 
  className = '' 
}) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let currentIndex = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">▊</span>
    </span>
  );
};

const TerminalWindow: React.FC<{ onStartJourney?: () => void }> = ({ onStartJourney }) => {
  const [booted, setBooted] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);

  const bootSequence = [
    '> initializing APEX_OS kernel...',
    '> loading sovereign modules...',
    '> connecting to neural network...',
    '> [OK] All systems operational',
    '> Welcome, Founder.',
  ];

  useEffect(() => {
    bootSequence.forEach((line, i) => {
      setTimeout(() => {
        setBootLines(prev => [...prev, line]);
        if (i === bootSequence.length - 1) setBooted(true);
      }, i * 400);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="relative z-20 w-full max-w-md mx-auto"
    >
      {/* Terminal Glow */}
      <div className="absolute -inset-4 bg-cyan-500/20 blur-3xl rounded-full" />
      
      <div className="relative bg-black/90 border-2 border-cyan-500/50 rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/20">
        {/* Header */}
        <div className="px-4 py-3 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase">
              APEX_OS v1.0
            </span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 font-mono text-sm min-h-[200px]">
          {bootLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`mb-1 ${
                line.includes('OK') ? 'text-emerald-400' :
                line.includes('Welcome') ? 'text-cyan-400 font-bold' :
                'text-cyan-400/70'
              }`}
            >
              {line}
            </motion.div>
          ))}
          
          {booted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <div className="text-white/60 mb-2">Choose your path:</div>
              <button
                onClick={onStartJourney}
                className="w-full py-3 px-4 bg-cyan-500/20 border border-cyan-500/50 rounded-lg 
                         text-cyan-400 font-bold hover:bg-cyan-500/30 hover:border-cyan-400
                         transition-all duration-300 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Start Your Journey
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 
                              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const OldWorldCard: React.FC = () => {
  const features = [
    { icon: Briefcase, text: 'Corporate drone life' },
    { icon: Clock, text: '9-5 grind forever' },
    { icon: Code2, text: 'Outdated skills' },
    { icon: Zap, text: 'Linear growth only' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="relative h-full flex flex-col justify-center p-8"
    >
      {/* Grayscale overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-800/90" />
      
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-700/50 
                     border border-gray-600 text-gray-400 text-xs font-mono mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-gray-500" />
          THE OLD WAY
        </motion.div>

        <h2 className="font-mono text-3xl md:text-4xl font-bold text-gray-400 mb-4">
          <TypewriterText text="Corporate Slavery" delay={500} />
        </h2>

        <p className="text-gray-500 text-lg mb-8 max-w-md">
          Trade your time for money. Learn skills that expire. Hope for a 3% raise.
        </p>

        <div className="space-y-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-3 text-gray-500"
            >
              <feature.icon className="w-5 h-5 text-gray-600" />
              <span>{feature.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
        >
          <div className="font-mono text-xs text-gray-500 mb-2">CAREER TRAJECTORY</div>
          <div className="flex items-end gap-1 h-16">
            {[30, 35, 38, 40, 42, 43, 44].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-gray-700 rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-600 font-mono">Linear. Boring. Dead-end.</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ApexWayCard: React.FC = () => {
  const features = [
    { icon: Crown, text: 'AI-powered builder', color: 'text-cyan-400' },
    { icon: Rocket, text: 'Sovereign creator', color: 'text-emerald-400' },
    { icon: TrendingUp, text: 'Exponential growth', color: 'text-purple-400' },
    { icon: Zap, text: 'Infinite leverage', color: 'text-amber-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="relative h-full flex flex-col justify-center p-8"
    >
      {/* Neon glow */}
      <div className="absolute inset-0 bg-gradient-to-bl from-cyan-500/10 via-purple-500/5 to-emerald-500/10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full" />
      
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 
                     border border-cyan-500/50 text-cyan-400 text-xs font-mono mb-6
                     shadow-lg shadow-cyan-500/20"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          THE APEX OS WAY
        </motion.div>

        <h2 className="font-mono text-3xl md:text-4xl font-bold text-white mb-4">
          <TypewriterText text="Digital Sovereignty" delay={800} className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400" />
        </h2>

        <p className="text-cyan-200/70 text-lg mb-8 max-w-md">
          Build with AI. Own your destiny. Compound your knowledge. Scale infinitely.
        </p>

        <div className="space-y-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-3 text-white/80"
            >
              <feature.icon className={`w-5 h-5 ${feature.color}`} />
              <span>{feature.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg
                     shadow-lg shadow-cyan-500/10"
        >
          <div className="font-mono text-xs text-cyan-400 mb-2">CAREER TRAJECTORY</div>
          <div className="flex items-end gap-1 h-16">
            {[20, 35, 55, 80, 120, 180, 280].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 1.4 + i * 0.1, duration: 0.5 }}
                className="flex-1 bg-gradient-to-t from-cyan-500 to-emerald-400 rounded-t"
              />
            ))}
          </div>
          <div className="mt-2 text-xs text-cyan-400/70 font-mono">Exponential. Explosive. Unstoppable.</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartJourney }) => {
  return (
    <section className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* CRT Effect */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Old World */}
        <div className="hidden lg:block w-1/2 border-r border-gray-800">
          <OldWorldCard />
        </div>

        {/* Center - Terminal */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-full max-w-lg px-4">
          <TerminalWindow onStartJourney={onStartJourney} />
        </div>

        {/* Right Side - APEX Way */}
        <div className="hidden lg:block w-1/2">
          <ApexWayCard />
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden w-full flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4">
            <TerminalWindow onStartJourney={onStartJourney} />
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 2, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 text-cyan-500/20"
      >
        <Terminal className="w-12 h-12" />
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, 10, 0],
          rotate: [0, -2, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 text-emerald-500/20"
      >
        <Code2 className="w-16 h-16" />
      </motion.div>

      {/* Scan Line */}
      <motion.div
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent z-40 pointer-events-none"
      />
    </section>
  );
};

export default HeroSection;
