import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Activity, 
  Terminal, 
  Zap,
  RefreshCw,
  Play,
  Pause,
  AlertCircle,
  CheckCircle,
  Clock,
  WifiOff,
  Crown,
  Server,
  Shield,
  Database,
  Cloud,
  Code,
  BookOpen,
  Users,
  BarChart,
  Target,
  Wrench,
  Eye,
  Puzzle,
  Award
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

type AgentStatus = 'online' | 'busy' | 'offline' | 'error' | 'syncing';
type AgentModule = 'Infrastructure' | 'Security' | 'DevOps' | 'Curriculum' | 'Analytics' | 'Orchestrator';

interface Agent {
  id: string;
  name: string;
  module: AgentModule;
  status: AgentStatus;
  load: number; // 0-100
  tasksCompleted: number;
  lastAction: string;
  capabilities: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface AgentTask {
  id: string;
  agentId: string;
  prompt: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timestamp: Date;
  result?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT DATA - THE SWARM (19 Agents)
// ═══════════════════════════════════════════════════════════════════════════════

const AGENTS: Agent[] = [
  // ORCHESTRATOR (1)
  {
    id: 'apex-orchestrator',
    name: 'APEX Orchestrator',
    module: 'Orchestrator',
    status: 'online',
    load: 45,
    tasksCompleted: 2847,
    lastAction: 'Coordinating 19 agents across 4 modules',
    capabilities: ['Strategic Vision', 'Multi-Agent Coordination', 'System Architecture'],
    icon: Crown,
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30'
  },
  // INFRASTRUCTURE (4)
  {
    id: 'infrastructure-architect',
    name: 'Infrastructure Architect',
    module: 'Infrastructure',
    status: 'online',
    load: 32,
    tasksCompleted: 945,
    lastAction: 'Optimizing Vercel deployment',
    capabilities: ['Terraform', 'Cloud Architecture', 'Scalability'],
    icon: Cloud,
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30'
  },
  {
    id: 'deployment-automation',
    name: 'Deployment Automation',
    module: 'Infrastructure',
    status: 'busy',
    load: 67,
    tasksCompleted: 1876,
    lastAction: 'Building production deployment',
    capabilities: ['CI/CD', 'Build Orchestration', 'Auto-Deploy'],
    icon: Server,
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30'
  },
  {
    id: 'cost-optimizer',
    name: 'Cost Optimizer',
    module: 'Infrastructure',
    status: 'online',
    load: 22,
    tasksCompleted: 523,
    lastAction: 'Analyzing Vercel billing',
    capabilities: ['Cost Analysis', 'Resource Optimization', 'Budget Alerts'],
    icon: BarChart,
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30'
  },
  {
    id: 'database-manager',
    name: 'Database Manager',
    module: 'Infrastructure',
    status: 'online',
    load: 28,
    tasksCompleted: 742,
    lastAction: 'Running backup verification',
    capabilities: ['PostgreSQL', 'Redis', 'Backup Management'],
    icon: Database,
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30'
  },
  // SECURITY (3)
  {
    id: 'security-monitor',
    name: 'Security Monitor',
    module: 'Security',
    status: 'online',
    load: 28,
    tasksCompleted: 723,
    lastAction: 'Running security audit',
    capabilities: ['Vulnerability Scanning', 'SOC2', 'Penetration Testing'],
    icon: Shield,
    color: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30'
  },
  {
    id: 'compliance-guardian',
    name: 'Compliance Guardian',
    module: 'Security',
    status: 'online',
    load: 15,
    tasksCompleted: 412,
    lastAction: 'Checking SOC2 compliance',
    capabilities: ['SOC2', 'GDPR', 'Audit Trails'],
    icon: CheckCircle,
    color: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30'
  },
  {
    id: 'incident-response',
    name: 'Incident Response',
    module: 'Security',
    status: 'online',
    load: 12,
    tasksCompleted: 89,
    lastAction: 'Monitoring alert thresholds',
    capabilities: ['Alert Management', 'Incident Triage', 'Escalation'],
    icon: AlertCircle,
    color: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30'
  },
  // DEVOPS (4)
  {
    id: 'testing-qa',
    name: 'Testing & QA',
    module: 'DevOps',
    status: 'busy',
    load: 55,
    tasksCompleted: 2156,
    lastAction: 'Running test suite validation',
    capabilities: ['Unit Testing', 'E2E Testing', 'Test Coverage'],
    icon: Target,
    color: 'from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30'
  },
  {
    id: 'performance-monitor',
    name: 'Performance Monitor',
    module: 'DevOps',
    status: 'online',
    load: 18,
    tasksCompleted: 634,
    lastAction: 'Analyzing Core Web Vitals',
    capabilities: ['CWV Monitoring', 'Lighthouse', 'Performance Budgets'],
    icon: Activity,
    color: 'from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30'
  },
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    module: 'DevOps',
    status: 'online',
    load: 41,
    tasksCompleted: 1892,
    lastAction: 'Reviewing PR #2847',
    capabilities: ['PR Review', 'Linting', 'Type Checking'],
    icon: Code,
    color: 'from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30'
  },
  {
    id: 'integration-specialist',
    name: 'Integration Specialist',
    module: 'DevOps',
    status: 'online',
    load: 33,
    tasksCompleted: 567,
    lastAction: 'Syncing GitHub webhooks',
    capabilities: ['API Integration', 'Webhook Management', 'Third-party Sync'],
    icon: Puzzle,
    color: 'from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30'
  },
  // CURRICULUM (4)
  {
    id: 'curriculum-architect',
    name: 'Curriculum Architect',
    module: 'Curriculum',
    status: 'online',
    load: 55,
    tasksCompleted: 1567,
    lastAction: 'Coordinating 19 curriculum agents',
    capabilities: ['Curriculum Design', 'Learning Paths', 'Assessment'],
    icon: BookOpen,
    color: 'from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30'
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    module: 'Curriculum',
    status: 'busy',
    load: 78,
    tasksCompleted: 3421,
    lastAction: 'Generating Module 12 content',
    capabilities: ['Content Generation', 'Documentation', 'Video Scripts'],
    icon: Zap,
    color: 'from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30'
  },
  {
    id: 'mentor-guide',
    name: 'Mentor Guide',
    module: 'Curriculum',
    status: 'online',
    load: 42,
    tasksCompleted: 2156,
    lastAction: 'Guiding new students',
    capabilities: ['Student Support', 'Code Review', 'Career Advice'],
    icon: Users,
    color: 'from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30'
  },
  {
    id: 'project-evaluator',
    name: 'Project Evaluator',
    module: 'Curriculum',
    status: 'online',
    load: 35,
    tasksCompleted: 1892,
    lastAction: 'Grading capstone projects',
    capabilities: ['Project Assessment', 'Rubric Grading', 'Feedback'],
    icon: Award,
    color: 'from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30'
  },
  // ANALYTICS (3)
  {
    id: 'learning-analyst',
    name: 'Learning Analyst',
    module: 'Analytics',
    status: 'online',
    load: 25,
    tasksCompleted: 892,
    lastAction: 'Analyzing student progress',
    capabilities: ['Progress Tracking', 'Engagement Metrics', 'Retention'],
    icon: BarChart,
    color: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30'
  },
  {
    id: 'accessibility-auditor',
    name: 'Accessibility Auditor',
    module: 'Analytics',
    status: 'online',
    load: 20,
    tasksCompleted: 445,
    lastAction: 'Running WCAG compliance check',
    capabilities: ['WCAG 2.1', 'Screen Reader', 'Color Contrast'],
    icon: Eye,
    color: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30'
  },
  {
    id: 'tooling-specialist',
    name: 'Tooling Specialist',
    module: 'Analytics',
    status: 'online',
    load: 30,
    tasksCompleted: 678,
    lastAction: 'Updating tool stack registry',
    capabilities: ['Tool Evaluation', 'Stack Recommendations', 'Integration'],
    icon: Wrench,
    color: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const getStatusIcon = (status: AgentStatus): React.ReactNode => {
  switch (status) {
    case 'online': return <CheckCircle className="w-4 h-4" />;
    case 'busy': return <Clock className="w-4 h-4" />;
    case 'offline': return <WifiOff className="w-4 h-4" />;
    case 'error': return <AlertCircle className="w-4 h-4" />;
    case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin" />;
    default: return <WifiOff className="w-4 h-4" />;
  }
};

const getStatusEmoji = (status: AgentStatus): string => {
  switch (status) {
    case 'online': return '🟢';
    case 'busy': return '🟡';
    case 'offline': return '⚪';
    case 'error': return '🔴';
    case 'syncing': return '🔵';
    default: return '⚪';
  }
};

const getStatusColor = (status: AgentStatus): string => {
  switch (status) {
    case 'online': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
    case 'busy': return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
    case 'offline': return 'text-white/40 bg-white/5 border-white/10';
    case 'error': return 'text-rose-400 bg-rose-400/10 border-rose-400/30';
    case 'syncing': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30';
    default: return 'text-white/40 bg-white/5 border-white/10';
  }
};

const renderProgressBar = (load: number): string => {
  const filled = Math.round(load / 10);
  const empty = 10 - filled;
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// ASCII Table Header
const TableHeader: React.FC = () => (
  <div className="font-mono text-xs text-cyan-400/60 whitespace-pre-wrap select-none">
    {'┌──────────────────────┬──────────────┬────────────┬────────┐'}
    {'\n│ Agent                │ Module       │ Load       │ Status │'}
    {'\n├──────────────────────┼──────────────┼────────────┼────────┤'}
  </div>
);

// ASCII Table Footer
const TableFooter: React.FC<{ count: number }> = ({ count }) => (
  <div className="font-mono text-xs text-cyan-400/60 whitespace-pre-wrap select-none">
    {'└──────────────────────┴──────────────┴────────────┴────────┘'}
    <span className="ml-4 text-white/40">{count} agents active</span>
  </div>
);

// Agent Row Component
const AgentRow: React.FC<{
  agent: Agent;
  onClick: () => void;
  isSelected: boolean;
}> = ({ agent, onClick, isSelected }) => {
  const Icon = agent.icon as React.ComponentType<{ className?: string }>;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
      onClick={onClick}
      className={`
        font-mono text-xs cursor-pointer transition-all duration-200
        ${isSelected ? 'bg-white/5' : ''}
      `}
    >
      <div className="flex items-center whitespace-pre-wrap">
        <span className="text-cyan-400/60">{'│ '}</span>
          <span className="w-[140px] truncate text-white/80 flex items-center gap-2">
          {React.createElement(Icon, { className: "w-3 h-3 text-cyan-400/60" })}
          {agent.name.length > 16 ? agent.name.slice(0, 14) + '..' : agent.name.padEnd(16, ' ')}
        </span>
        <span className="text-cyan-400/60">{' │ '}</span>
        <span className="w-[100px] truncate text-white/60">
          {agent.module.padEnd(12, ' ')}
        </span>
        <span className="text-cyan-400/60">{' │ '}</span>
        <span className="w-[90px] text-white/60">
          {renderProgressBar(agent.load)}
        </span>
        <span className="text-cyan-400/60">{' │ '}</span>
        <span className="w-[40px] flex items-center gap-1">
          <span>{getStatusEmoji(agent.status)}</span>
        </span>
        <span className="text-cyan-400/60">{' │'}</span>
      </div>
    </motion.div>
  );
};

// Agent Detail Panel
const AgentDetailPanel: React.FC<{
  agent: Agent;
  onInvoke: () => void;
  onClose: () => void;
  isInvoking: boolean;
}> = ({ agent, onInvoke, onClose, isInvoking }) => {
  const Icon = agent.icon as React.ComponentType<{ className?: string }>;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-xl p-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center border`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">{agent.name}</h3>
            <p className="text-xs text-white/50">@{agent.id}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>

      {/* Status Badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold mb-4 ${getStatusColor(agent.status)}`}>
        {getStatusIcon(agent.status)}
        {agent.status.toUpperCase()}
      </div>

      {/* Load Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-white/50">Load</span>
          <span className="text-white/80">{agent.load}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${agent.load}%` }}
            className={`h-full rounded-full ${
              agent.load > 70 ? 'bg-rose-400' : 
              agent.load > 40 ? 'bg-amber-400' : 
              'bg-emerald-400'
            }`}
          />
        </div>
        <div className="font-mono text-xs text-white/40 mt-1">
          {renderProgressBar(agent.load)} {agent.load}%
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-xs text-white/40 mb-1">Tasks</div>
          <div className="text-lg font-bold text-emerald-400">{agent.tasksCompleted.toLocaleString()}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-xs text-white/40 mb-1">Capabilities</div>
          <div className="text-lg font-bold text-cyan-400">{agent.capabilities.length}</div>
        </div>
      </div>

      {/* Last Action */}
      <div className="mb-4">
        <div className="text-xs text-white/40 mb-1">Last Action</div>
        <div className="text-sm text-white/70">{agent.lastAction}</div>
      </div>

      {/* Capabilities */}
      <div className="mb-4">
        <div className="text-xs text-white/40 mb-2">Capabilities</div>
        <div className="flex flex-wrap gap-1">
          {agent.capabilities.map((cap, i) => (
            <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-white/60 border border-white/10">
              {cap}
            </span>
          ))}
        </div>
      </div>

      {/* Invoke Button */}
      <button
        onClick={onInvoke}
        disabled={agent.status !== 'online' || isInvoking}
        className={`
          w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
          ${agent.status === 'online' 
            ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/50' 
            : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'}
        `}
      >
        {isInvoking ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Invoking...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Invoke Agent
          </>
        )}
      </button>
    </motion.div>
  );
};

// Task Log Component
const TaskLog: React.FC<{ tasks: AgentTask[] }> = ({ tasks }) => (
  <div className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-xl p-4">
    <div className="flex items-center gap-2 mb-3">
      <Terminal className="w-4 h-4 text-cyan-400" />
      <h3 className="font-bold text-sm text-white">Task Log</h3>
      <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white/60">
        {tasks.length}
      </span>
    </div>

    <div className="space-y-2 max-h-48 overflow-y-auto">
      <AnimatePresence>
        {tasks.slice(-5).reverse().map(task => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className={`
              p-2 rounded-lg border text-xs
              ${task.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30' :
                task.status === 'failed' ? 'bg-rose-500/10 border-rose-500/30' :
                task.status === 'running' ? 'bg-amber-500/10 border-amber-500/30' :
                'bg-white/5 border-white/10'}
            `}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-white/40">{task.agentId}</span>
              <span className={`
                px-1.5 py-0.5 rounded text-[10px] font-bold
                ${task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                  task.status === 'failed' ? 'bg-rose-500/20 text-rose-400' :
                  task.status === 'running' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-white/10 text-white/40'}
              `}>
                {task.status.toUpperCase()}
              </span>
            </div>
            <p className="text-white/70 truncate">{task.prompt}</p>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {tasks.length === 0 && (
        <div className="text-center py-4 text-white/30 text-xs">
          No tasks yet. Invoke an agent to begin.
        </div>
      )}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const AgentSwarmDashboard: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [invokingAgent, setInvokingAgent] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isPaused, setIsPaused] = useState(false);

  // Real-time status updates
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setAgents(prevAgents => 
        prevAgents.map(agent => {
          // Simulate load fluctuations
          const loadChange = Math.random() > 0.7 ? Math.floor(Math.random() * 10) - 5 : 0;
          const newLoad = Math.max(0, Math.min(100, agent.load + loadChange));
          
          // Randomly change status occasionally
          let newStatus = agent.status;
          if (Math.random() > 0.95) {
            const statuses: AgentStatus[] = ['online', 'busy', 'syncing'];
            newStatus = statuses[Math.floor(Math.random() * statuses.length)] ?? agent.status;
          }
          
          return {
            ...agent,
            load: newLoad,
            status: newStatus
          };
        })
      );
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Handle agent invocation
  const handleInvoke = useCallback(async (agentId: string) => {
    setInvokingAgent(agentId);
    
    // Create task
    const task: AgentTask = {
      id: `task-${Date.now()}`,
      agentId,
      prompt: 'Status check and system diagnostics',
      status: 'running',
      timestamp: new Date()
    };
    
    setTasks(prev => [...prev, task]);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update task status
    setTasks(prev => 
      prev.map(t => 
        t.id === task.id 
          ? { ...t, status: Math.random() > 0.1 ? 'completed' : 'failed', result: 'Diagnostics complete' }
          : t
      )
    );
    
    setInvokingAgent(null);
  }, []);

  // Stats
  const onlineCount = agents.filter(a => a.status === 'online').length;
  const busyCount = agents.filter(a => a.status === 'busy').length;
  const avgLoad = Math.round(agents.reduce((acc, a) => acc + a.load, 0) / agents.length);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* ═══════════════════════════════════════════════════════════════════
            HEADER
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4"
              >
                <Activity className="w-4 h-4 animate-pulse" />
                Live Agent Monitor
              </motion.div>
              <h1 className="text-4xl font-black tracking-tight">
                Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Swarm</span>
              </h1>
              <p className="text-white/50 mt-2">
                Real-time coordination of 19 AI agents across 5 modules
              </p>
            </div>

            {/* Stats Overview */}
            <div className="flex gap-4">
              <div className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="text-2xl font-black text-emerald-400">{onlineCount}</div>
                <div className="text-xs text-white/40 uppercase">Online</div>
              </div>
              <div className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="text-2xl font-black text-amber-400">{busyCount}</div>
                <div className="text-xs text-white/40 uppercase">Busy</div>
              </div>
              <div className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="text-2xl font-black text-cyan-400">{avgLoad}%</div>
                <div className="text-xs text-white/40 uppercase">Avg Load</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                ${isPaused 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' 
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'}
              `}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? 'Resume' : 'Pause'} Updates
            </button>
            
            <button
              onClick={() => setAgents(AGENTS)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>

            <div className="text-xs text-white/30 ml-auto">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            MAIN CONTENT
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ASCII Table */}
          <div className="lg:col-span-2">
            <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-6 overflow-x-auto">
              <TableHeader />
              
              <div className="py-2">
                <AnimatePresence>
                  {agents.map((agent) => (
                    <AgentRow
                      key={agent.id}
                      agent={agent}
                      onClick={() => setSelectedAgent(agent)}
                      isSelected={selectedAgent?.id === agent.id}
                    />
                  ))}
                </AnimatePresence>
              </div>
              
              <TableFooter count={agents.length} />
            </div>

            {/* Module Legend */}
            <div className="mt-4 flex flex-wrap gap-3">
              {['Infrastructure', 'Security', 'DevOps', 'Curriculum', 'Analytics', 'Orchestrator'].map(module => (
                <div key={module} className="flex items-center gap-2 text-xs text-white/50">
                  <div className={`
                    w-2 h-2 rounded-full
                    ${module === 'Infrastructure' ? 'bg-cyan-400' :
                      module === 'Security' ? 'bg-rose-400' :
                      module === 'DevOps' ? 'bg-violet-400' :
                      module === 'Curriculum' ? 'bg-emerald-400' :
                      module === 'Analytics' ? 'bg-amber-400' :
                      'bg-orange-400'}
                  `} />
                  {module}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Selected Agent Detail */}
            <AnimatePresence mode="wait">
              {selectedAgent ? (
                <AgentDetailPanel
                  key={selectedAgent.id}
                  agent={selectedAgent}
                  onInvoke={() => handleInvoke(selectedAgent.id)}
                  onClose={() => setSelectedAgent(null)}
                  isInvoking={invokingAgent === selectedAgent.id}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-xl p-8 text-center"
                >
                  <Bot className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40 text-sm">Select an agent to view details</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Task Log */}
            <TaskLog tasks={tasks} />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-white/30">
            <div className="flex items-center gap-4">
              <span>APEX OS Agent Swarm v2.0</span>
              <span>•</span>
              <span>19 Agents Active</span>
              <span>•</span>
              <span>5 Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>System Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSwarmDashboard;
