import React from 'react';
import { motion } from 'framer-motion';
import { User, Video, Terminal, ArrowRight, Rocket } from 'lucide-react';

interface JourneyStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'future';
}

export const CustomerJourney: React.FC = () => {
  const steps: JourneyStep[] = [
    {
      icon: <User className="w-6 h-6" />,
      title: 'You',
      description: 'Aspiring builder ready to transform',
      status: 'completed'
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: 'Webinar Registration',
      description: 'Join live session to learn the system',
      status: 'current'
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      title: 'Terminal Whitelist',
      description: 'Get early access to the platform',
      status: 'future'
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: 'Accelerator Ready',
      description: 'Build projects that get funded',
      status: 'future'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto mb-12"
    >
      <div className="text-center mb-8">
        <h3 className="font-mono text-lg text-cyan-400 mb-2">
          YOUR TRANSFORMATION JOURNEY
        </h3>
        <p className="text-white/60 text-sm">
          From curious newbie to accelerator-ready visionary
        </p>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/20 via-cyan-500/40 to-violet-500/20">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400"
            initial={{ width: '0%' }}
            animate={{ width: '33%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Icon Circle */}
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 relative z-10 border-2 transition-all duration-500 ${
                  step.status === 'completed'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                    : step.status === 'current'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] animate-pulse'
                    : 'bg-white/5 border-white/20 text-white/40'
                }`}
              >
                {step.icon}
                
                {/* Status Indicator */}
                <div
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step.status === 'completed'
                      ? 'bg-emerald-500 text-white'
                      : step.status === 'current'
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/20 text-white/60'
                  }`}
                >
                  {step.status === 'completed' ? '✓' : step.status === 'current' ? '●' : '○'}
                </div>
              </div>

              {/* Title */}
              <h4
                className={`font-mono text-sm mb-1 ${
                  step.status === 'completed'
                    ? 'text-emerald-400'
                    : step.status === 'current'
                    ? 'text-cyan-400'
                    : 'text-white/60'
                }`}
              >
                {step.title}
              </h4>

              {/* Description */}
              <p className="text-xs text-white/40 max-w-[120px]">
                {step.description}
              </p>

              {/* Arrow (except last) */}
              {index < steps.length - 1 && (
                <div className="absolute top-10 -right-2 text-white/20 hidden md:block">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerJourney;