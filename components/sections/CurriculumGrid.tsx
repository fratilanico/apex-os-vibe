import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Cpu, 
  Users, 
  Rocket, 
  Shield, 
  Brain, 
  Zap,
  ChevronRight,
  Lock,
  Unlock,
  Star,
  Target,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import { modules as restoredModules } from '../../data/curriculumData';

interface DisplayModule {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  status: 'locked' | 'available' | 'completed';
  icon: any;
  skills: string[];
  xpRequired: number;
  phase: 'foundation' | 'learner' | 'builder';
}

const ICON_MAP: Record<string, any> = {
  Zap,
  Box: Cpu,
  Terminal: Cpu,
  GitBranch: Rocket,
  Layers,
  Award
};

const displayModules: DisplayModule[] = restoredModules.map((m, idx) => ({
  id: m.id,
  number: m.number,
  title: m.title,
  subtitle: m.subtitle,
  description: m.objective,
  status: idx === 0 ? 'completed' : idx === 1 ? 'available' : 'locked',
  icon: ICON_MAP[m.icon] || Cpu,
  skills: m.keyTakeaways.slice(0, 3),
  xpRequired: idx * 500,
  phase: idx < 2 ? 'foundation' : idx < 4 ? 'learner' : 'builder'
}));

const phaseConfig = {
  foundation: {
    label: 'START',
    color: 'from-emerald-500 to-emerald-400',
    borderColor: 'border-emerald-500/50',
    bgColor: 'bg-emerald-500/10',
    glowColor: 'shadow-emerald-500/20',
  },
  learner: {
    label: 'LEARNER',
    color: 'from-cyan-500 to-cyan-400',
    borderColor: 'border-cyan-500/50',
    bgColor: 'bg-cyan-500/10',
    glowColor: 'shadow-cyan-500/20',
  },
  builder: {
    label: 'BUILDER',
    color: 'from-violet-500 to-violet-400',
    borderColor: 'border-violet-500/50',
    bgColor: 'bg-violet-500/10',
    glowColor: 'shadow-violet-500/20',
  }
};

const statusConfig = {
  locked: {
    icon: Lock,
    text: 'LOCKED',
    opacity: 'opacity-50',
  },
  available: {
    icon: Unlock,
    text: 'AVAILABLE',
    opacity: 'opacity-100',
  },
  completed: {
    icon: Star,
    text: 'COMPLETED',
    opacity: 'opacity-100',
  },
};

function XPBar({ current, required }: { current: number; required: number }) {
  const progress = required === 0 ? 100 : Math.min((current / required) * 100, 100);
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] font-mono mb-1">
        <span className="text-zinc-500">XP</span>
        <span className="text-zinc-400">{current} / {required}</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${progress}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full"
        />
      </div>
    </div>
  );
}

function ModuleCard({ module, index }: { module: DisplayModule; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = module.icon;
  const phase = phaseConfig[module.phase];
  const status = statusConfig[module.status];
  const StatusIcon = status.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative group cursor-pointer
        ${status.opacity}
      `}
    >
      {/* Card */}
      <div className={`
        relative overflow-hidden rounded-xl backdrop-blur-md transition-all duration-500 h-full
        ${module.status === 'completed' 
          ? `bg-gradient-to-br ${phase.bgColor} border-2 ${phase.borderColor}` 
          : module.status === 'available'
          ? 'bg-zinc-900/60 border-2 border-cyan-500/30 hover:border-cyan-500/60'
          : 'bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700/50'
        }
        p-5
      `}>
        {/* Animated glow */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={`
            absolute inset-0 pointer-events-none
            ${module.status === 'locked' 
              ? 'bg-gradient-to-br from-zinc-500/5 via-transparent to-transparent'
              : `bg-gradient-to-br ${phase.bgColor}`
            }
          `}
        />

        {/* Scanline effect */}
        {isHovered && module.status !== 'locked' && (
          <motion.div
            initial={{ top: '-100%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 0.8, ease: 'linear' }}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent z-10"
          />
        )}

        {/* Level badge */}
        <div className="absolute top-3 left-3">
          <div className={`
            flex items-center gap-1.5 px-2 py-1 rounded-full
            ${module.status === 'completed' 
              ? `bg-gradient-to-r ${phase.bgColor} ${phase.borderColor} border`
              : module.status === 'available'
              ? 'bg-cyan-500/10 border border-cyan-500/30'
              : 'bg-zinc-800/80 border border-zinc-700/50'
            }
          `}>
            <span className={`
              text-[10px] font-mono font-bold uppercase tracking-wider
              ${module.status === 'completed' 
                ? 'text-white'
                : module.status === 'available'
                ? 'text-cyan-400'
                : 'text-zinc-500'
              }
            `}>
              MOD {module.number}
            </span>
          </div>
        </div>

        {/* Status indicator */}
        <div className="absolute top-3 right-3">
          <div className={`
            flex items-center gap-1.5 px-2 py-0.5 rounded-full
            ${module.status === 'completed' 
              ? 'bg-emerald-500/20 border border-emerald-500/30'
              : module.status === 'available'
              ? 'bg-cyan-500/20 border border-cyan-500/30'
              : 'bg-zinc-800/80 border border-zinc-700/50'
            }
          `}>
            <StatusIcon className={`
              w-3 h-3
              ${module.status === 'completed' 
                ? 'text-emerald-400'
                : module.status === 'available'
                ? 'text-cyan-400'
                : 'text-zinc-500'
              }
            `} />
            <span className={`
              text-[9px] font-mono uppercase tracking-wider
              ${module.status === 'completed' 
                ? 'text-emerald-400'
                : module.status === 'available'
                ? 'text-cyan-400'
                : 'text-zinc-500'
              }
            `}>
              {status.text}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className={`relative mt-8 flex flex-col`}>
          {/* Phase label */}
          <div className={`
            text-[10px] font-mono uppercase tracking-widest mb-2
            ${module.status === 'locked' ? 'text-zinc-600' : `text-transparent bg-clip-text bg-gradient-to-r ${phase.color}`}
          `}>
            {phase.label} PHASE
          </div>

          {/* Icon and Title row */}
          <div className="flex items-start gap-3 mb-3">
            <motion.div
              animate={{ 
                scale: isHovered && module.status !== 'locked' ? 1.1 : 1,
                rotate: isHovered && module.status !== 'locked' ? 5 : 0
              }}
              transition={{ duration: 0.3 }}
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                ${module.status === 'completed' 
                  ? `bg-gradient-to-br ${phase.bgColor} ${phase.borderColor} border`
                  : module.status === 'available'
                  ? 'bg-cyan-500/10 border border-cyan-500/30'
                  : 'bg-zinc-800/50 border border-zinc-700/50'
                }
              `}
            >
              <Icon className={`
                w-6 h-6
                ${module.status === 'completed' 
                  ? 'text-white'
                  : module.status === 'available'
                  ? 'text-cyan-400'
                  : 'text-zinc-600'
                }
              `} />
            </motion.div>
            
            <div className="flex-1">
              <h3 className={`
                font-bold mb-1 text-lg
                ${module.status === 'locked' ? 'text-zinc-500' : 'text-white'}
              `}>
                {module.title}
              </h3>
              <p className={`
                text-sm leading-relaxed
                ${module.status === 'locked' ? 'text-zinc-600' : 'text-zinc-400'}
              `}>
                {module.subtitle}
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {module.skills.map((skill, i) => (
              <span
                key={i}
                className={`
                  text-[10px] font-mono px-2 py-1 rounded
                  ${module.status === 'completed' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : module.status === 'available'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'bg-zinc-800/50 text-zinc-600 border border-zinc-700/30'
                  }
                `}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* XP Bar */}
          {module.status !== 'completed' && (
            <div className="mt-auto">
              <XPBar 
                current={module.status === 'available' ? module.xpRequired : 0} 
                required={module.xpRequired} 
              />
            </div>
          )}

          {/* Action indicator */}
          <motion.div
            animate={{ x: isHovered && module.status !== 'locked' ? 4 : 0 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute bottom-0 right-0
              ${module.status === 'completed' 
                ? 'text-emerald-400'
                : module.status === 'available'
                ? 'text-cyan-400'
                : 'text-zinc-600'
              }
            `}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function CurriculumGrid() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `
          linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px'
      }} />

      {/* Radial gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-violet-500/5 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">The Journey</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            6 Modules to{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-amber-400 bg-clip-text text-transparent">
              Sovereign Mastery
            </span>
          </h2>
          
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
            Progress through the core curriculum designed for rapid transformation. 
            Each module unlocks new specialized capabilities in your agentic workflow.
          </p>
        </motion.div>

        {/* Module grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayModules.map((module, index) => (
            <ModuleCard key={module.id} module={module} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-zinc-300">Module 00: Completed</span>
            </div>
            <div className="w-px h-4 bg-zinc-700" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm text-zinc-300">Module 01: Available Now</span>
            </div>
            <div className="w-px h-4 bg-zinc-700" />
            <span className="text-sm text-zinc-500">Next unlock: 150 XP</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CurriculumGrid;
