import { motion } from 'framer-motion';
import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { 
  Lock, 
  Unlock, 
  Star, 
  Layers, 
  ChevronRight 
} from 'lucide-react';
import { curriculumData } from '../../data/curriculumData';
const { modules } = curriculumData;
import type { Module } from '../../types/curriculum';

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
  },
  visionary: {
    label: 'VISIONARY',
    color: 'from-amber-500 to-amber-400',
    borderColor: 'border-amber-500/50',
    bgColor: 'bg-amber-500/10',
    glowColor: 'shadow-amber-500/20',
  },
  accelerator: {
    label: 'LEGEND',
    color: 'from-rose-500 via-amber-500 to-emerald-500',
    borderColor: 'border-rose-500/50',
    bgColor: 'bg-gradient-to-br from-rose-500/10 via-amber-500/10 to-emerald-500/10',
    glowColor: 'shadow-rose-500/30',
  },
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

function ModuleCard({ module, index, statusOverride }: { module: Module; index: number; statusOverride?: 'locked' | 'available' | 'completed' }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const Icon = (LucideIcons as any)[module.icon] || LucideIcons.Zap;
  const phase = phaseConfig[module.phase];
  const currentStatus = statusOverride || (module.number === '00' ? 'completed' : module.number === '01' ? 'available' : 'locked');
  const status = statusConfig[currentStatus as keyof typeof statusConfig];
  const StatusIcon = status.icon;
  const isAccelerator = module.phase === 'accelerator';

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
        ${isAccelerator ? 'col-span-1 sm:col-span-2 lg:col-span-4' : ''}
      `}
    >
      {index < modules.length - 1 && !isAccelerator && (
        <div className="hidden lg:block absolute -right-4 top-1/2 w-8 h-px bg-gradient-to-r from-zinc-700 to-transparent z-0" />
      )}

      <div className={`
        relative overflow-hidden rounded-xl backdrop-blur-md transition-all duration-500
        ${currentStatus === 'completed' 
          ? `bg-gradient-to-br ${phase.bgColor} border-2 ${phase.borderColor}` 
          : currentStatus === 'available'
          ? 'bg-zinc-900/60 border-2 border-cyan-500/30 hover:border-cyan-500/60'
          : 'bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700/50'
        }
        ${isAccelerator ? 'p-8' : 'p-5'}
      `}>
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={`
            absolute inset-0 pointer-events-none
            ${currentStatus === 'locked' 
              ? 'bg-gradient-to-br from-zinc-500/5 via-transparent to-transparent'
              : `bg-gradient-to-br ${phase.bgColor}`
            }
          `}
        />

        <div className="absolute top-3 left-3">
          <div className={`
            flex items-center gap-1.5 px-2 py-1 rounded-full
            ${currentStatus === 'completed' 
              ? `bg-gradient-to-r ${phase.bgColor} ${phase.borderColor} border`
              : currentStatus === 'available'
              ? 'bg-cyan-500/10 border border-cyan-500/30'
              : 'bg-zinc-800/80 border border-zinc-700/50'
            }
          `}>
            <span className={`
              text-[10px] font-mono font-bold uppercase tracking-wider
              ${currentStatus === 'completed' ? 'text-white' : currentStatus === 'available' ? 'text-cyan-400' : 'text-zinc-500'}
            `}>
              LVL {module.level}
            </span>
          </div>
        </div>

        <div className="absolute top-3 right-3">
          <div className={`
            flex items-center gap-1.5 px-2 py-0.5 rounded-full
            ${currentStatus === 'completed' ? 'bg-emerald-500/20 border border-emerald-500/30' : currentStatus === 'available' ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-zinc-800/80 border border-zinc-700/50'}
          `}>
            <StatusIcon className={`w-3 h-3 ${currentStatus === 'completed' ? 'text-emerald-400' : currentStatus === 'available' ? 'text-cyan-400' : 'text-zinc-500'}`} />
            <span className={`text-[9px] font-mono uppercase tracking-wider ${currentStatus === 'completed' ? 'text-emerald-400' : currentStatus === 'available' ? 'text-cyan-400' : 'text-zinc-500'}`}>
              {status.text}
            </span>
          </div>
        </div>

        <div className={`relative ${isAccelerator ? 'mt-8' : 'mt-8'} flex flex-col`}>
          <div className={`text-[10px] font-mono uppercase tracking-widest mb-2 ${currentStatus === 'locked' ? 'text-zinc-600' : `text-transparent bg-clip-text bg-gradient-to-r ${phase.color}`}`}>
            {phase.label} PHASE
          </div>

          <div className="flex items-start gap-3 mb-3">
            <motion.div
              animate={{ scale: isHovered && currentStatus !== 'locked' ? 1.1 : 1, rotate: isHovered && currentStatus !== 'locked' ? 5 : 0 }}
              transition={{ duration: 0.3 }}
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${currentStatus === 'completed' ? `bg-gradient-to-br ${phase.bgColor} ${phase.borderColor} border` : currentStatus === 'available' ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-zinc-800/50 border border-zinc-700/50'}`}
            >
              <Icon className={`w-6 h-6 ${currentStatus === 'completed' ? 'text-white' : currentStatus === 'available' ? 'text-cyan-400' : 'text-zinc-600'}`} />
            </motion.div>
            
            <div className="flex-1">
              <h3 className={`font-bold mb-1 ${isAccelerator ? 'text-2xl' : 'text-lg'} ${currentStatus === 'locked' ? 'text-zinc-500' : 'text-white'}`}>
                {module.title}
              </h3>
              <p className={`text-sm leading-relaxed ${currentStatus === 'locked' ? 'text-zinc-600' : 'text-zinc-400'}`}>
                {module.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {module.keyTakeaways.slice(0, 3).map((skill, i) => (
              <span key={i} className={`text-[10px] font-mono px-2 py-1 rounded ${currentStatus === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : currentStatus === 'available' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-zinc-800/50 text-zinc-600 border border-zinc-700/30'}`}>
                {skill}
              </span>
            ))}
          </div>

          <motion.div animate={{ x: isHovered && currentStatus !== 'locked' ? 4 : 0 }} transition={{ duration: 0.2 }} className={`absolute bottom-0 right-0 ${currentStatus === 'completed' ? 'text-emerald-400' : currentStatus === 'available' ? 'text-cyan-400' : 'text-zinc-600'}`}>
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function PhaseDivider({ label }: { label: string }) {
  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex items-center gap-4 my-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
      <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">{label}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
    </div>
  );
}

export function CurriculumGrid() {
  const foundationModules = modules.filter(m => m.phase === 'foundation');
  const learnerModules = modules.filter(m => m.phase === 'learner');
  const builderModules = modules.filter(m => m.phase === 'builder');
  const visionaryModules = modules.filter(m => m.phase === 'visionary');
  const acceleratorModule = modules.filter(m => m.phase === 'accelerator');

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-violet-500/5 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">The Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">12 Levels to <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-amber-400 bg-clip-text text-transparent">Sovereign Mastery</span></h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">Progress through 5 phases of transformation. Each level unlocks new powers and brings you closer to becoming a true AI orchestrator.</p>
        </motion.div>

        <div className="space-y-12">
          {foundationModules.length > 0 && (
            <div>
              <PhaseDivider label="Foundation Phase" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {foundationModules.map((module, index) => (
                  <ModuleCard key={module.id} module={module} index={index} />
                ))}
              </div>
            </div>
          )}
          {learnerModules.length > 0 && (
            <div>
              <PhaseDivider label="Learner Phase" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {learnerModules.map((module, index) => (
                  <ModuleCard key={module.id} module={module} index={index + foundationModules.length} />
                ))}
              </div>
            </div>
          )}
          {builderModules.length > 0 && (
            <div>
              <PhaseDivider label="Builder Phase" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {builderModules.map((module, index) => (
                  <ModuleCard key={module.id} module={module} index={index + foundationModules.length + learnerModules.length} />
                ))}
              </div>
            </div>
          )}
          {visionaryModules.length > 0 && (
            <div>
              <PhaseDivider label="Visionary Phase" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {visionaryModules.map((module, index) => (
                  <ModuleCard key={module.id} module={module} index={index + foundationModules.length + learnerModules.length + builderModules.length} />
                ))}
              </div>
            </div>
          )}
          {acceleratorModule.length > 0 && (
            <div>
              <PhaseDivider label="The Ultimate Goal" />
              <div className="grid grid-cols-1">
                {acceleratorModule.map((module) => (
                  <ModuleCard key={module.id} module={module} index={12} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CurriculumGrid;
