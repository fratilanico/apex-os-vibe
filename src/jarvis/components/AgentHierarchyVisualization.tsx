import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  Crown, 
  Brain, 
  Code, 
  Shield, 
  Zap, 
  Database, 
  Cloud, 
  Terminal,
  Users,
  Activity,
  Lock,
  Server,
  Cpu,
  Network,
  Layers,
  GitBranch,
  Settings,
  MessageSquare,
  Eye,
  FileCode,
  TestTube,
  Rocket,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Workflow,
  Target
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

// Agent Node Types
interface AgentNode {
  id: string;
  name: string;
  role: string;
  icon: React.ReactNode;
  status: 'active' | 'idle' | 'busy' | 'syncing';
  level: 'founder' | 'executive' | 'operational' | 'devops' | 'specialist';
  children?: AgentNode[];
  capabilities: string[];
  lastAction?: string;
  metrics?: {
    tasksCompleted: number;
    successRate: number;
    responseTime: string;
  };
}

// Agent Hierarchy Data
const agentHierarchy: AgentNode = {
  id: 'founder',
  name: 'APEX OS MONSTER',
  role: 'Founder & Chief Orchestrator',
  icon: <Crown className="w-8 h-8" />,
  status: 'active',
  level: 'founder',
  capabilities: ['Strategic Vision', 'Multi-Agent Coordination', 'System Architecture', 'Decision Authority'],
  lastAction: 'Coordinating 12 active agents across 4 forks',
  metrics: {
    tasksCompleted: 2847,
    successRate: 99.2,
    responseTime: '< 50ms'
  },
  children: [
    {
      id: 'executive-jarvis',
      name: 'J.A.R.V.I.S.',
      role: 'Executive AI Director',
      icon: <Brain className="w-6 h-6" />,
      status: 'active',
      level: 'executive',
      capabilities: ['Model Management', 'Voice Control', 'Agent Synchronization', 'Strategic Planning'],
      lastAction: 'Managing 4 specialist models',
      metrics: {
        tasksCompleted: 1563,
        successRate: 98.7,
        responseTime: '< 100ms'
      },
      children: [
        {
          id: 'model-qwen',
          name: 'QWEN',
          role: 'Code Specialist',
          icon: <Code className="w-5 h-5" />,
          status: 'active',
          level: 'specialist',
          capabilities: ['Code Generation', 'Code Review', 'Refactoring', 'Architecture'],
          lastAction: 'Optimizing React components',
          metrics: {
            tasksCompleted: 892,
            successRate: 97.5,
            responseTime: '< 200ms'
          }
        },
        {
          id: 'model-deepseek',
          name: 'DEEPSEEK',
          role: 'Analysis Specialist',
          icon: <Target className="w-5 h-5" />,
          status: 'active',
          level: 'specialist',
          capabilities: ['Data Analysis', 'Pattern Recognition', 'Predictive Modeling', 'Insights'],
          lastAction: 'Analyzing performance metrics',
          metrics: {
            tasksCompleted: 743,
            successRate: 96.8,
            responseTime: '< 250ms'
          }
        },
        {
          id: 'model-llama',
          name: 'LLAMA',
          role: 'Creative Specialist',
          icon: <Zap className="w-5 h-5" />,
          status: 'active',
          level: 'specialist',
          capabilities: ['Content Creation', 'UX Writing', 'Documentation', 'Ideation'],
          lastAction: 'Generating pitch deck content',
          metrics: {
            tasksCompleted: 621,
            successRate: 98.2,
            responseTime: '< 180ms'
          }
        },
        {
          id: 'model-phi3',
          name: 'PHI-3',
          role: 'Logic Specialist',
          icon: <Activity className="w-5 h-5" />,
          status: 'active',
          level: 'specialist',
          capabilities: ['Logic Validation', 'Testing', 'Debugging', 'Quality Assurance'],
          lastAction: 'Running test suite validation',
          metrics: {
            tasksCompleted: 1054,
            successRate: 99.1,
            responseTime: '< 150ms'
          }
        }
      ]
    },
    {
      id: 'executive-cli',
      name: 'CLI Builder',
      role: 'Executive Operations',
      icon: <Terminal className="w-6 h-6" />,
      status: 'busy',
      level: 'executive',
      capabilities: ['Code Generation', 'Build Orchestration', 'Deployment', 'Automation'],
      lastAction: 'Building MatrixPage.tsx enhancements',
      metrics: {
        tasksCompleted: 1247,
        successRate: 97.9,
        responseTime: '< 120ms'
      },
      children: [
        {
          id: 'op-frontend',
          name: 'Frontend Agent',
          role: 'UI/UX Implementation',
          icon: <Layers className="w-5 h-5" />,
          status: 'busy',
          level: 'operational',
          capabilities: ['React Components', 'Styling', 'Animations', 'Responsive Design'],
          lastAction: 'Implementing premium visual upgrades',
          metrics: {
            tasksCompleted: 534,
            successRate: 98.5,
            responseTime: '< 200ms'
          }
        },
        {
          id: 'op-backend',
          name: 'Backend Agent',
          role: 'API & Services',
          icon: <Server className="w-5 h-5" />,
          status: 'active',
          level: 'operational',
          capabilities: ['API Design', 'Database', 'Authentication', 'Microservices'],
          lastAction: 'Optimizing database queries',
          metrics: {
            tasksCompleted: 423,
            successRate: 99.0,
            responseTime: '< 180ms'
          }
        },
        {
          id: 'op-integration',
          name: 'Integration Agent',
          role: 'System Integration',
          icon: <Network className="w-5 h-5" />,
          status: 'syncing',
          level: 'operational',
          capabilities: ['API Integration', 'WebSocket', 'Event Handling', 'Data Flow'],
          lastAction: 'Syncing with MCP servers',
          metrics: {
            tasksCompleted: 387,
            successRate: 97.2,
            responseTime: '< 220ms'
          }
        }
      ]
    },
    {
      id: 'executive-devops',
      name: 'DevOps Swarm',
      role: 'Executive Infrastructure',
      icon: <Cloud className="w-6 h-6" />,
      status: 'active',
      level: 'executive',
      capabilities: ['Deployment', 'Monitoring', 'Security', 'Scaling'],
      lastAction: 'Monitoring production health',
      metrics: {
        tasksCompleted: 2156,
        successRate: 99.5,
        responseTime: '< 80ms'
      },
      children: [
        {
          id: 'devops-deploy',
          name: 'Deploy Agent',
          role: 'Deployment Automation',
          icon: <Rocket className="w-5 h-5" />,
          status: 'active',
          level: 'devops',
          capabilities: ['CI/CD', 'Vercel', 'Docker', 'Kubernetes'],
          lastAction: 'Preparing production deployment',
          metrics: {
            tasksCompleted: 892,
            successRate: 99.8,
            responseTime: '< 100ms'
          }
        },
        {
          id: 'devops-monitor',
          name: 'Monitor Agent',
          role: 'System Monitoring',
          icon: <Monitor className="w-5 h-5" />,
          status: 'active',
          level: 'devops',
          capabilities: ['Health Checks', 'Metrics', 'Alerting', 'Logging'],
          lastAction: 'Analyzing performance metrics',
          metrics: {
            tasksCompleted: 1567,
            successRate: 99.9,
            responseTime: '< 50ms'
          }
        },
        {
          id: 'devops-security',
          name: 'Security Agent',
          role: 'Security & Compliance',
          icon: <Shield className="w-5 h-5" />,
          status: 'active',
          level: 'devops',
          capabilities: ['Vulnerability Scanning', 'Secrets Management', 'Compliance', 'Audit'],
          lastAction: 'Running security audit',
          metrics: {
            tasksCompleted: 743,
            successRate: 100,
            responseTime: '< 150ms'
          }
        },
        {
          id: 'devops-infra',
          name: 'Infra Agent',
          role: 'Infrastructure Management',
          icon: <Database className="w-5 h-5" />,
          status: 'active',
          level: 'devops',
          capabilities: ['Terraform', 'Cloud Resources', 'Networking', 'Storage'],
          lastAction: 'Optimizing cloud resources',
          metrics: {
            tasksCompleted: 623,
            successRate: 99.3,
            responseTime: '< 200ms'
          }
        }
      ]
    },
    {
      id: 'executive-content',
      name: 'Content Strategist',
      role: 'Executive Content',
      icon: <FileCode className="w-6 h-6" />,
      status: 'active',
      level: 'executive',
      capabilities: ['Content Strategy', 'Copywriting', 'Investor Narratives', 'Documentation'],
      lastAction: 'Preparing pitch deck enhancements',
      metrics: {
        tasksCompleted: 892,
        successRate: 98.9,
        responseTime: '< 150ms'
      },
      children: [
        {
          id: 'content-copy',
          name: 'Copy Agent',
          role: 'Copywriting',
          icon: <MessageSquare className="w-5 h-5" />,
          status: 'active',
          level: 'operational',
          capabilities: ['Sales Copy', 'Technical Writing', 'UX Microcopy', 'Documentation'],
          lastAction: 'Writing investor narratives',
          metrics: {
            tasksCompleted: 456,
            successRate: 98.7,
            responseTime: '< 180ms'
          }
        },
        {
          id: 'content-research',
          name: 'Research Agent',
          role: 'Market Research',
          icon: <Eye className="w-5 h-5" />,
          status: 'active',
          level: 'operational',
          capabilities: ['Competitor Analysis', 'Market Trends', 'User Research', 'Data Gathering'],
          lastAction: 'Analyzing competitor landscape',
          metrics: {
            tasksCompleted: 334,
            successRate: 97.5,
            responseTime: '< 300ms'
          }
        }
      ]
    }
  ]
};

// Status Badge Component
const StatusBadge: React.FC<{ status: AgentNode['status'] }> = ({ status }) => {
  const colors = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    idle: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    busy: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    syncing: 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse'
  };

  const labels = {
    active: 'Active',
    idle: 'Idle',
    busy: 'Busy',
    syncing: 'Syncing'
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-mono rounded border ${colors[status]}`}>
      {labels[status]}
    </span>
  );
};

// Agent Card Component
const AgentCard: React.FC<{ 
  agent: AgentNode; 
  isSelected: boolean; 
  onClick: () => void;
  depth: number;
}> = ({ agent, isSelected, onClick, depth }) => {
  const { isDark } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: depth * 0.1, ease: 'power2.out' }
      );
    }
  }, [depth]);

  const levelColors = {
    founder: 'from-violet-500/20 to-fuchsia-500/20 border-violet-500/40',
    executive: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40',
    operational: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40',
    devops: 'from-orange-500/20 to-amber-500/20 border-orange-500/40',
    specialist: 'from-pink-500/20 to-rose-500/20 border-pink-500/40'
  };

  const glowColors = {
    founder: 'shadow-violet-500/20',
    executive: 'shadow-blue-500/20',
    operational: 'shadow-emerald-500/20',
    devops: 'shadow-orange-500/20',
    specialist: 'shadow-pink-500/20'
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`
        relative p-4 rounded-xl cursor-pointer transition-all duration-300
        bg-gradient-to-br ${levelColors[agent.level]}
        border backdrop-blur-sm
        ${isSelected ? `ring-2 ring-white/30 shadow-lg ${glowColors[agent.level]}` : 'hover:scale-105'}
        ${agent.level === 'founder' ? 'col-span-full' : ''}
      `}
    >
      {/* Connection Lines */}
      {depth > 0 && (
        <div className="absolute -top-4 left-1/2 w-px h-4 bg-gradient-to-b from-white/20 to-transparent" />
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`
          p-2 rounded-lg
          ${agent.level === 'founder' ? 'bg-violet-500/20' : ''}
          ${agent.level === 'executive' ? 'bg-blue-500/20' : ''}
          ${agent.level === 'operational' ? 'bg-emerald-500/20' : ''}
          ${agent.level === 'devops' ? 'bg-orange-500/20' : ''}
          ${agent.level === 'specialist' ? 'bg-pink-500/20' : ''}
        `}>
          {agent.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white truncate">{agent.name}</h3>
          <p className="text-xs text-white/60 truncate">{agent.role}</p>
        </div>
        <StatusBadge status={agent.status} />
      </div>

      {/* Metrics */}
      {agent.metrics && (
        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
          <div className="text-center p-1.5 rounded bg-black/20">
            <div className="text-white/40">Tasks</div>
            <div className="font-mono text-white">{agent.metrics.tasksCompleted.toLocaleString()}</div>
          </div>
          <div className="text-center p-1.5 rounded bg-black/20">
            <div className="text-white/40">Success</div>
            <div className="font-mono text-emerald-400">{agent.metrics.successRate}%</div>
          </div>
          <div className="text-center p-1.5 rounded bg-black/20">
            <div className="text-white/40">Latency</div>
            <div className="font-mono text-blue-400">{agent.metrics.responseTime}</div>
          </div>
        </div>
      )}

      {/* Last Action */}
      {agent.lastAction && (
        <div className="flex items-center gap-2 text-xs text-white/50">
          <Clock className="w-3 h-3" />
          <span className="truncate">{agent.lastAction}</span>
        </div>
      )}

      {/* Capabilities */}
      <div className="mt-3 flex flex-wrap gap-1">
        {agent.capabilities.slice(0, 3).map((cap, i) => (
          <span 
            key={i}
            className="px-1.5 py-0.5 text-[10px] rounded bg-white/5 text-white/60 border border-white/10"
          >
            {cap}
          </span>
        ))}
        {agent.capabilities.length > 3 && (
          <span className="px-1.5 py-0.5 text-[10px] rounded bg-white/5 text-white/40">
            +{agent.capabilities.length - 3}
          </span>
        )}
      </div>
    </div>
  );
};

// Agent Detail Panel
const AgentDetailPanel: React.FC<{ agent: AgentNode | null; onClose: () => void }> = ({ 
  agent, 
  onClose 
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (panelRef.current && agent) {
      gsap.fromTo(panelRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [agent]);

  if (!agent) return null;

  return (
    <div 
      ref={panelRef}
      className="fixed right-0 top-0 h-full w-96 bg-slate-900/95 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto z-50"
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <ArrowRight className="w-5 h-5" />
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
            {agent.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
            <p className="text-white/60">{agent.role}</p>
          </div>
        </div>
        <StatusBadge status={agent.status} />
      </div>

      {agent.metrics && (
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-sm font-semibold text-white/80 mb-3">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Tasks Completed</span>
              <span className="font-mono text-white">{agent.metrics.tasksCompleted.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Success Rate</span>
              <span className="font-mono text-emerald-400">{agent.metrics.successRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Avg Response Time</span>
              <span className="font-mono text-blue-400">{agent.metrics.responseTime}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-white/80 mb-3">Capabilities</h3>
        <div className="flex flex-wrap gap-2">
          {agent.capabilities.map((cap, i) => (
            <span 
              key={i}
              className="px-3 py-1.5 text-sm rounded-full bg-white/5 text-white/80 border border-white/10"
            >
              {cap}
            </span>
          ))}
        </div>
      </div>

      {agent.lastAction && (
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-sm font-semibold text-white/80 mb-2">Current Activity</h3>
          <div className="flex items-center gap-2 text-white/60">
            <Activity className="w-4 h-4" />
            <span>{agent.lastAction}</span>
          </div>
        </div>
      )}

      {agent.children && (
        <div>
          <h3 className="text-sm font-semibold text-white/80 mb-3">
            Subordinate Agents ({agent.children.length})
          </h3>
          <div className="space-y-2">
            {agent.children.map((child) => (
              <div 
                key={child.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="text-white/60">{child.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{child.name}</div>
                  <div className="text-xs text-white/50">{child.role}</div>
                </div>
                <StatusBadge status={child.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Orchestration Flow Visualization
const OrchestrationFlow: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticle = () => {
      const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 3 - 1,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add new particles
      if (particles.length < 50) {
        particles.push(createParticle());
      }

      // Update and draw particles
      particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.01;

        if (p.life <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
        ctx.globalAlpha = 1;

        return true;
      });

      // Draw connection lines
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
      ctx.lineWidth = 1;
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.globalAlpha = (1 - dist / 100) * 0.3;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

// Main Component
export const AgentHierarchyVisualization: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentNode | null>(null);
  const [activeView, setActiveView] = useState<'hierarchy' | 'flow' | 'metrics'>('hierarchy');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, []);

  const renderHierarchy = (agent: AgentNode, depth: number = 0): React.ReactNode => {
    return (
      <div key={agent.id} className={depth > 0 ? 'mt-4' : ''}>
        <AgentCard
          agent={agent}
          isSelected={selectedAgent?.id === agent.id}
          onClick={() => setSelectedAgent(agent)}
          depth={depth}
        />
        {agent.children && (
          <div className={`
            grid gap-4 mt-4
            ${depth === 0 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : ''}
            ${depth === 1 ? 'grid-cols-1 md:grid-cols-3' : ''}
            ${depth >= 2 ? 'grid-cols-1 md:grid-cols-2' : ''}
          `}>
            {agent.children.map(child => renderHierarchy(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-slate-950 text-white p-6 overflow-hidden">
      {/* Background Effects */}
      <OrchestrationFlow />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Multi-Agent Orchestration
            </h1>
            <p className="text-white/60 mt-2 text-lg">
              Hierarchical AI Agent Swarm with Real-Time Coordination
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-emerald-400">12 Agents Active</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Workflow className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">Fork 4</span>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mt-6">
          {(['hierarchy', 'flow', 'metrics'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${activeView === view 
                  ? 'bg-white/10 text-white border border-white/20' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)} View
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {activeView === 'hierarchy' && renderHierarchy(agentHierarchy)}
        
        {activeView === 'flow' && (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <Workflow className="w-16 h-16 text-violet-400 mx-auto mb-4" />
              <p className="text-white/60">Orchestration Flow Visualization</p>
              <p className="text-sm text-white/40 mt-2">Real-time data flow between agents</p>
            </div>
          </div>
        )}

        {activeView === 'metrics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold mb-4">System Health</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Uptime</span>
                  <span className="font-mono text-emerald-400">99.97%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Active Agents</span>
                  <span className="font-mono text-white">12/12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Avg Latency</span>
                  <span className="font-mono text-blue-400">124ms</span>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold mb-4">Task Distribution</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Completed Today</span>
                  <span className="font-mono text-emerald-400">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">In Progress</span>
                  <span className="font-mono text-amber-400">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Queue Depth</span>
                  <span className="font-mono text-white">5</span>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold mb-4">Coordination</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">MCP Handshakes</span>
                  <span className="font-mono text-violet-400">3 Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Sync State</span>
                  <span className="font-mono text-emerald-400">Healthy</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Last Update</span>
                  <span className="font-mono text-white/60">2s ago</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      <AgentDetailPanel 
        agent={selectedAgent} 
        onClose={() => setSelectedAgent(null)} 
      />

      {/* Footer Stats */}
      <div className="relative z-10 mt-12 pt-6 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-violet-400">4</div>
            <div className="text-sm text-white/60">Executive Agents</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">5</div>
            <div className="text-sm text-white/60">Operational Agents</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">4</div>
            <div className="text-sm text-white/60">DevOps Agents</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">4</div>
            <div className="text-sm text-white/60">Specialist Models</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentHierarchyVisualization;
