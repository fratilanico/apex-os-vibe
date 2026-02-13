import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Cloud, 
  Database, 
  CreditCard, 
  Sparkles, 
  Search, 
  Bot, 
  Code2,
  ArrowRight,
  ExternalLink,
  Zap,
  Shield,
  Brain,
  Cpu,
  Terminal,
  Lock,
  Unlock,
  Star
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  power: string;
  category: string;
  description: string;
  ability: string;
  icon: typeof Cloud;
  color: string;
  gradient: string;
  unlocked: boolean;
  xpBonus: number;
  synergy: string[];
}

const tools: Tool[] = [
  {
    id: 'vercel',
    name: 'Vercel',
    power: 'Deployment Mastery',
    category: 'Infrastructure',
    description: 'Zero-config deployments with automatic preview environments and edge functions.',
    ability: 'Deploy AI agents globally in seconds with zero downtime',
    icon: Cloud,
    color: '#ffffff',
    gradient: 'from-zinc-400/20 to-zinc-600/10',
    unlocked: true,
    xpBonus: 50,
    synergy: ['supabase', 'cursor'],
  },
  {
    id: 'supabase',
    name: 'Supabase',
    power: 'Database Sorcery',
    category: 'Data',
    description: 'PostgreSQL with real-time subscriptions, vector embeddings, and row-level security.',
    ability: 'Store agent memory and enable real-time collaborative AI',
    icon: Database,
    color: '#3ecf8e',
    gradient: 'from-emerald-400/20 to-emerald-600/10',
    unlocked: true,
    xpBonus: 75,
    synergy: ['vercel', 'google-ai'],
  },
  {
    id: 'polar',
    name: 'Polar.sh',
    power: 'Payment Wizardry',
    category: 'Monetization',
    description: 'Developer-first payment infrastructure with usage-based billing.',
    ability: 'Monetize AI agents with subscription and usage-based pricing',
    icon: CreditCard,
    color: '#f59e0b',
    gradient: 'from-amber-400/20 to-amber-600/10',
    unlocked: false,
    xpBonus: 100,
    synergy: ['vercel', 'supabase'],
  },
  {
    id: 'google-ai',
    name: 'APEX Intel',
    power: 'Intelligence Augmentation',
    category: 'Models',
    description: 'APEX multimodal models with 1M token context and proprietary cloud deployment.',
    ability: 'Process entire codebases and generate from images/video',
    icon: Sparkles,
    color: '#4285f4',
    gradient: 'from-blue-400/20 to-blue-600/10',
    unlocked: true,
    xpBonus: 150,
    synergy: ['claude', 'openai'],
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    power: 'Research Omniscience',
    category: 'Research',
    description: 'AI-powered search with real-time citations and grounded responses.',
    ability: 'Give agents real-time knowledge with verified sources',
    icon: Search,
    color: '#22d3ee',
    gradient: 'from-cyan-400/20 to-cyan-600/10',
    unlocked: false,
    xpBonus: 80,
    synergy: ['google-ai', 'claude'],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    power: 'Language Mastery',
    category: 'Models',
    description: 'GPT-4, GPT-5.2, and Codex. The gold standard for reasoning.',
    ability: 'Complex reasoning, debugging, and code generation',
    icon: Bot,
    color: '#10a37f',
    gradient: 'from-emerald-400/20 to-emerald-600/10',
    unlocked: true,
    xpBonus: 120,
    synergy: ['claude', 'cursor'],
  },
  {
    id: 'claude',
    name: 'Claude',
    power: 'Reasoning Perfection',
    category: 'Models',
    description: 'Anthropic\'s Claude with 72.7% SWE-Bench verified performance.',
    ability: 'Architecture decisions and complex refactoring tasks',
    icon: Brain,
    color: '#d97757',
    gradient: 'from-orange-400/20 to-orange-600/10',
    unlocked: true,
    xpBonus: 130,
    synergy: ['openai', 'cursor'],
  },
  {
    id: 'cursor',
    name: 'Cursor',
    power: 'Code Telepathy',
    category: 'Editor',
    description: 'The AI-native code editor with full codebase context awareness.',
    ability: 'Flow state development with AI pair programming',
    icon: Code2,
    color: '#06b6d4',
    gradient: 'from-cyan-400/20 to-cyan-600/10',
    unlocked: true,
    xpBonus: 100,
    synergy: ['openai', 'claude'],
  },
];

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = tool.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative cursor-pointer
        ${tool.unlocked ? '' : 'opacity-60'}
      `}
    >
      {/* Connection lines to synergies */}
      {tool.synergy.map((synId, i) => {
        const synIndex = tools.findIndex(t => t.id === synId);
        if (synIndex === -1 || synIndex <= index) return null;
        
        const isAdjacent = Math.abs(synIndex - index) === 1;
        const isBelow = synIndex - index === 4;
        
        if (!isAdjacent && !isBelow) return null;
        
        return (
          <motion.div
            key={synId}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.5 : 0.2 }}
            className={`
              absolute pointer-events-none z-0
              ${isAdjacent 
                ? '-right-3 top-1/2 w-6 h-px' 
                : 'bottom-0 left-1/2 w-px h-6 -translate-x-1/2 translate-y-full'
              }
              bg-gradient-to-r from-transparent via-zinc-600 to-transparent
            `}
          />
        );
      })}

      {/* Card */}
      <div className={`
        relative overflow-hidden rounded-2xl backdrop-blur-xl transition-all duration-500
        ${tool.unlocked 
          ? 'bg-zinc-900/60 border border-zinc-700/50 hover:border-zinc-500/50' 
          : 'bg-zinc-900/40 border border-zinc-800/50'
        }
      `}>
        {/* Gradient glow on hover */}
        <motion.div
          animate={{ opacity: isHovered && tool.unlocked ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} pointer-events-none`}
        />

        {/* Animated border glow */}
        <motion.div
          animate={{ opacity: isHovered && tool.unlocked ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={isHovered && tool.unlocked ? { 
            boxShadow: `0 0 40px ${tool.color}20, inset 0 0 40px ${tool.color}08` 
          } : undefined}
        />

        {/* Unlock scanline */}
        {isHovered && tool.unlocked && (
          <motion.div
            initial={{ top: '-100%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 0.8, ease: 'linear' }}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent z-10"
          />
        )}

        {/* Content */}
        <div className="relative p-6">
          {/* Header with icon and unlock status */}
          <div className="flex items-start justify-between mb-4">
            <motion.div
              animate={{ 
                scale: isHovered && tool.unlocked ? 1.1 : 1,
                rotate: isHovered && tool.unlocked ? 5 : 0
              }}
              transition={{ duration: 0.3 }}
              className={`
                w-14 h-14 rounded-xl flex items-center justify-center
                ${tool.unlocked 
                  ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-600/50' 
                  : 'bg-zinc-800/50 border border-zinc-700/30'
                }
              `}
            >
              <Icon 
                className="w-7 h-7 transition-colors duration-300" 
                style={{ color: tool.unlocked ? tool.color : '#52525b' }}
              />
            </motion.div>

            {/* Unlock status */}
            <div className={`
              flex items-center gap-1.5 px-2 py-1 rounded-full
              ${tool.unlocked 
                ? 'bg-emerald-500/10 border border-emerald-500/30' 
                : 'bg-zinc-800/80 border border-zinc-700/50'
              }
            `}>
              {tool.unlocked ? (
                <>
                  <Unlock className="w-3 h-3 text-emerald-400" />
                  <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider">Unlocked</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-zinc-500" />
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Locked</span>
                </>
              )}
            </div>
          </div>

          {/* Power name */}
          <div className="mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              {tool.category}
            </span>
          </div>

          {/* Tool name */}
          <h3 className={`
            text-xl font-bold mb-1 transition-colors duration-300
            ${tool.unlocked ? 'text-white' : 'text-zinc-500'}
          `}>
            {tool.name}
          </h3>

          {/* Power title */}
          <p className={`
            text-sm font-medium mb-3
            ${tool.unlocked ? 'text-cyan-400' : 'text-zinc-600'}
          `}>
            {tool.power}
          </p>

          {/* Description */}
          <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
            {tool.description}
          </p>

          {/* Ability section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered && tool.unlocked ? 1 : 0.7, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`
              pt-4 border-t
              ${tool.unlocked ? 'border-zinc-700/50' : 'border-zinc-800/30'}
            `}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3 h-3" style={{ color: tool.color }} />
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                Special Ability
              </span>
            </div>
            <p className={`
              text-sm font-medium
              ${tool.unlocked ? 'text-zinc-300' : 'text-zinc-600'}
            `}>
              {tool.ability}
            </p>
          </motion.div>

          {/* XP Bonus */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className={`
                w-4 h-4
                ${tool.unlocked ? 'text-amber-400' : 'text-zinc-700'}
              `} />
              <span className={`
                text-xs font-mono
                ${tool.unlocked ? 'text-amber-400' : 'text-zinc-600'}
              `}>
                +{tool.xpBonus} XP
              </span>
            </div>

            {/* Action link */}
            <motion.div
              animate={{ x: isHovered && tool.unlocked ? 4 : 0 }}
              transition={{ duration: 0.2 }}
              className={`
                flex items-center gap-1 text-xs font-mono
                ${tool.unlocked ? 'text-zinc-400' : 'text-zinc-600'}
              `}
            >
              <span>{tool.unlocked ? 'Equip' : 'Unlock'}</span>
              <ArrowRight className="w-3 h-3" />
            </motion.div>
          </div>
        </div>

        {/* Corner accent */}
        <div 
          className="absolute top-0 right-0 w-20 h-20 opacity-10 pointer-events-none"
          style={{
            background: `radial-gradient(circle at top right, ${tool.color}, transparent 70%)`,
          }}
        />

        {/* Synergy indicators */}
        {tool.unlocked && (
          <div className="absolute bottom-4 left-4 flex -space-x-1">
            {tool.synergy.slice(0, 2).map((synId, i) => {
              const synTool = tools.find(t => t.id === synId);
              if (!synTool) return null;
              const SynIcon = synTool.icon;
              return (
                <div
                  key={synId}
                  className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center"
                  title={`Synergy: ${synTool.name}`}
                >
                  <SynIcon className="w-3 h-3" style={{ color: synTool.color }} />
                </div>
              );
            })}
            {tool.synergy.length > 2 && (
              <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <span className="text-[8px] text-zinc-500">+{tool.synergy.length - 2}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function ToolsShowcase() {
  const unlockedCount = tools.filter(t => t.unlocked).length;
  const totalXP = tools.filter(t => t.unlocked).reduce((acc, t) => acc + t.xpBonus, 0);

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] overflow-hidden">
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-cyan-500/5" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `
          linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px'
      }} />

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
            <Terminal className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-mono text-violet-400 uppercase tracking-wider">The Arsenal</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            8 Powers.{' '}
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              One Visionary.
            </span>
          </h2>
          
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
            Master the modern AI development stack. Each tool is a power you wield 
            to build, deploy, and scale your vision.
          </p>
        </motion.div>

        {/* Arsenal Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { label: 'Powers Unlocked', value: `${unlockedCount}/8`, color: 'text-emerald-400' },
            { label: 'XP From Tools', value: `+${totalXP}`, color: 'text-amber-400' },
            { label: 'Synergies Active', value: '12', color: 'text-cyan-400' },
            { label: 'Categories', value: '6', color: 'text-violet-400' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              className="text-center p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm"
            >
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </div>

        {/* Connection legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex items-center justify-center gap-6 text-xs text-zinc-500"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-gradient-to-r from-zinc-600 to-transparent" />
            <span>Tool Synergies</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Unlocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zinc-600" />
            <span>Locked</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <a
            href="#curriculum"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-all duration-300 group"
          >
            <span className="text-sm font-medium">Unlock More Powers</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default ToolsShowcase;
