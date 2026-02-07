import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Cpu, 
  Users, 
  Rocket, 
  Shield, 
  Brain, 
  Wrench, 
  Gauge, 
  Server, 
  Trophy, 
  Crown,
  Zap,
  ChevronRight,
  Lock,
  Unlock,
  Star,
  Target,
  Layers,
  Sparkles
} from 'lucide-react';

interface Module {
  id: string;
  level: number;
  number: string;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'completed';
  icon: typeof Zap;
  skills: string[];
  xpRequired: number;
  phase: 'foundation' | 'learner' | 'builder' | 'visionary' | 'accelerator';
}

const modules: Module[] = [
  {
    id: 'module-00',
    level: 1,
    number: '00',
    title: 'Foundation',
    description: 'Environment setup, tool installation, and the orchestrator mindset',
    status: 'completed',
    icon: Zap,
    skills: ['CLI Mastery', 'Git Basics', 'Node.js Setup'],
    xpRequired: 0,
    phase: 'foundation',
  },
  {
    id: 'module-01',
    level: 2,
    number: '01',
    title: 'AI Agent Architecture',
    description: 'Design patterns for autonomous agent systems',
    status: 'available',
    icon: Cpu,
    skills: ['Agent Design', 'State Management', 'Event Loops'],
    xpRequired: 100,
    phase: 'learner',
  },
  {
    id: 'module-02',
    level: 3,
    number: '02',
    title: 'Neural Networks',
    description: 'Understanding LLM internals and reasoning patterns',
    status: 'available',
    icon: Brain,
    skills: ['Transformers', 'Attention', 'Embeddings'],
    xpRequired: 250,
    phase: 'learner',
  },
  {
    id: 'module-03',
    level: 4,
    number: '03',
    title: 'Multi-Agent Systems',
    description: 'Coordination protocols and agent communication',
    status: 'locked',
    icon: Users,
    skills: ['Swarm Design', 'Consensus', 'Task Routing'],
    xpRequired: 450,
    phase: 'learner',
  },
  {
    id: 'module-04',
    level: 5,
    number: '04',
    title: 'Deployment Mastery',
    description: 'Production deployment strategies and infrastructure',
    status: 'locked',
    icon: Rocket,
    skills: ['Vercel Edge', 'Docker', 'CI/CD'],
    xpRequired: 700,
    phase: 'builder',
  },
  {
    id: 'module-05',
    level: 6,
    number: '05',
    title: 'Security & Ethics',
    description: 'Secure agent design and responsible AI practices',
    status: 'locked',
    icon: Shield,
    skills: ['Prompt Injection', 'Data Privacy', 'Guardrails'],
    xpRequired: 1000,
    phase: 'builder',
  },
  {
    id: 'module-06',
    level: 7,
    number: '06',
    title: 'Advanced Reasoning',
    description: 'Chain-of-thought, reflection, and meta-cognition',
    status: 'locked',
    icon: Target,
    skills: ['CoT Prompting', 'Self-Reflection', 'Planning'],
    xpRequired: 1350,
    phase: 'builder',
  },
  {
    id: 'module-07',
    level: 8,
    number: '07',
    title: 'Tool Integration',
    description: 'MCP, APIs, and external service orchestration',
    status: 'locked',
    icon: Wrench,
    skills: ['MCP Protocol', 'API Design', 'Function Calling'],
    xpRequired: 1750,
    phase: 'builder',
  },
  {
    id: 'module-08',
    level: 9,
    number: '08',
    title: 'Performance Optimization',
    description: 'Latency reduction and cost optimization strategies',
    status: 'locked',
    icon: Gauge,
    skills: ['Caching', 'Batching', 'Model Selection'],
    xpRequired: 2200,
    phase: 'visionary',
  },
  {
    id: 'module-09',
    level: 10,
    number: '09',
    title: 'Production Systems',
    description: 'Monitoring, observability, and reliability engineering',
    status: 'locked',
    icon: Server,
    skills: ['Observability', 'Alerting', 'SLOs'],
    xpRequired: 2700,
    phase: 'visionary',
  },
  {
    id: 'module-10',
    level: 11,
    number: '10',
    title: 'Capstone Project',
    description: 'Build and deploy a complete AI-powered application',
    status: 'locked',
    icon: Trophy,
    skills: ['Full Stack', 'Integration', 'Launch'],
    xpRequired: 3250,
    phase: 'visionary',
  },
  {
    id: 'module-11',
    level: 12,
    number: '11',
    title: 'Sovereign Mastery',
    description: 'Advanced patterns and becoming a true AI architect',
    status: 'locked',
    icon: Crown,
    skills: ['Architecture', 'Leadership', 'Innovation'],
    xpRequired: 3850,
    phase: 'visionary',
  },
  {
    id: 'accelerator',
    level: 13,
    number: '∞',
    title: 'The Accelerator',
    description: 'Launch your own AI-powered venture',
    status: 'locked',
    icon: Sparkles,
    skills: ['Business', 'Growth', 'Impact'],
    xpRequired: 5000,
    phase: 'accelerator',
  },
];

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

function XPBar({ current, required }: { current: number; required: number }) {
  const progress = Math.min((current / required) * 100, 100);
  
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

function ModuleCard({ module, index }: { module: Module; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = module.icon;
  const phase = phaseConfig[module.phase];
  const status = statusConfig[module.status];
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
      {/* Connection line to next module */}
      {index < modules.length - 1 && !isAccelerator && (
        <div className="hidden lg:block absolute -right-4 top-1/2 w-8 h-px bg-gradient-to-r from-zinc-700 to-transparent z-0" />
      )}
      
      {/* Phase divider for first module of each phase */}
      {(index === 1 || index === 4 || index === 8) && (
        <div className="hidden lg:block absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />
      )}

      {/* Card */}
      <div className={`
        relative overflow-hidden rounded-xl backdrop-blur-md transition-all duration-500
        ${module.status === 'completed' 
          ? `bg-gradient-to-br ${phase.bgColor} border-2 ${phase.borderColor}` 
          : module.status === 'available'
          ? 'bg-zinc-900/60 border-2 border-cyan-500/30 hover:border-cyan-500/60'
          : 'bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700/50'
        }
        ${isAccelerator ? 'p-8' : 'p-5'}
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
              LVL {module.level}
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
        <div className={`relative ${isAccelerator ? 'mt-8' : 'mt-8'} flex flex-col`}>
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
                font-bold mb-1
                ${isAccelerator ? 'text-2xl' : 'text-lg'}
                ${module.status === 'locked' ? 'text-zinc-500' : 'text-white'}
              `}>
                {module.title}
              </h3>
              <p className={`
                text-sm leading-relaxed
                ${module.status === 'locked' ? 'text-zinc-600' : 'text-zinc-400'}
              `}>
                {module.description}
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

          {/* Preview on hover */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered && module.status !== 'locked' ? 1 : 0, 
              height: isHovered && module.status !== 'locked' ? 'auto' : 0 
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-3"
          >
            <div className={`
              pt-3 border-t text-xs font-mono
              ${module.status === 'completed' 
                ? 'border-emerald-500/30 text-emerald-300/80'
                : 'border-cyan-500/30 text-cyan-300/80'
              }
            `}>
              <span className="opacity-60">{'>'}</span> Click to {module.status === 'completed' ? 'review' : 'start'} module
            </div>
          </motion.div>

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

        {/* Border glow for active/completed */}
        {module.status !== 'locked' && (
          <div className={`
            absolute inset-0 rounded-xl pointer-events-none
            ${module.status === 'completed' 
              ? `shadow-[0_0_30px_rgba(16,185,129,0.15)]`
              : `shadow-[0_0_30px_rgba(6,182,212,0.15)]`
            }
          `} />
        )}

        {/* Accelerator special effects */}
        {isAccelerator && module.status !== 'locked' && (
          <>
            <div className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-emerald-500/10 animate-pulse" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full border border-rose-500/20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full border border-emerald-500/20"
            />
          </>
        )}
      </div>
    </motion.div>
  );
}

function PhaseDivider({ label }: { phase: string; label: string }) {
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
            12 Levels to{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-amber-400 bg-clip-text text-transparent">
              Sovereign Mastery
            </span>
          </h2>
          
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
            Progress through 5 phases of transformation. Each level unlocks new powers 
            and brings you closer to becoming a true AI orchestrator.
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Target className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <div className="text-sm text-zinc-500 mb-1">Current Progress</div>
                <div className="text-2xl font-bold text-white">Level 2 <span className="text-zinc-500">/ 13</span></div>
              </div>
            </div>
            
            <div className="flex-1 max-w-md w-full">
              <div className="flex justify-between text-xs font-mono text-zinc-500 mb-2">
                <span>Total XP</span>
                <span>250 / 5,000</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '5%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-cyan-500 via-violet-500 to-amber-500 rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-400">1</div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">2</div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-zinc-600">10</div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Locked</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Module grid with phase dividers */}
        <div className="space-y-8">
          {/* Foundation Phase */}
          <div>
            <PhaseDivider phase="foundation" label="Foundation Phase" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {foundationModules.map((module, index) => (
                <ModuleCard key={module.id} module={module} index={index} />
              ))}
            </div>
          </div>

          {/* Learner Phase */}
          <div>
            <PhaseDivider phase="learner" label="Learner Phase (Levels 2-4)" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {learnerModules.map((module, index) => (
                <ModuleCard key={module.id} module={module} index={index + 1} />
              ))}
            </div>
          </div>

          {/* Builder Phase */}
          <div>
            <PhaseDivider phase="builder" label="Builder Phase (Levels 5-8)" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {builderModules.map((module, index) => (
                <ModuleCard key={module.id} module={module} index={index + 4} />
              ))}
            </div>
          </div>

          {/* Visionary Phase */}
          <div>
            <PhaseDivider phase="visionary" label="Visionary Phase (Levels 9-12)" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {visionaryModules.map((module, index) => (
                <ModuleCard key={module.id} module={module} index={index + 8} />
              ))}
            </div>
          </div>

          {/* Accelerator */}
          <div>
            <PhaseDivider phase="accelerator" label="The Ultimate Goal" />
            <div className="grid grid-cols-1">
              {acceleratorModule.map((module) => (
                <ModuleCard key={module.id} module={module} index={12} />
              ))}
            </div>
          </div>
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
