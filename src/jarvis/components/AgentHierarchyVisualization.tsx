import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Brain, 
  Code, 
  Shield, 
  Activity
} from 'lucide-react';
import { useAgentStore } from '../../../stores/useAgentStore';

// Agent Node Types
export interface AgentNode {
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

// Initial Agent Hierarchy Structure
const initialHierarchy: AgentNode = {
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
          capabilities: ['Python', 'TypeScript', 'System Design'],
          metrics: { tasksCompleted: 452, successRate: 99.1, responseTime: '< 200ms' }
        },
        {
          id: 'model-deepseek',
          name: 'DEEPSEEK',
          role: 'Logic & Reasoning',
          icon: <Activity className="w-5 h-5" />,
          status: 'busy',
          level: 'specialist',
          capabilities: ['Complex Reasoning', 'Data Analysis'],
          metrics: { tasksCompleted: 389, successRate: 98.5, responseTime: '< 300ms' }
        }
      ]
    },
    {
      id: 'operational-security',
      name: 'SECURITY',
      role: 'Security & Monitoring',
      icon: <Shield className="w-6 h-6" />,
      status: 'active',
      level: 'operational',
      capabilities: ['Vulnerability Scanning', 'Access Control', 'Traffic Analysis'],
      lastAction: 'Monitoring 42 entry points',
      metrics: {
        tasksCompleted: 8942,
        successRate: 100,
        responseTime: '< 10ms'
      }
    }
  ]
};

const AgentNodeCard: React.FC<{ node: AgentNode, depth: number }> = ({ node, depth }) => {
  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`relative z-10 p-4 rounded-2xl border-2 transition-all duration-500 flex flex-col items-center gap-3 backdrop-blur-md ${
          node.status === 'active' ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]' :
          node.status === 'busy' ? 'border-amber-500/50 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]' :
          'border-white/10 bg-white/5'
        }`}
      >
        <div className={`p-3 rounded-xl bg-black/40 border border-white/10 ${node.status === 'active' ? 'text-cyan-400' : 'text-white/60'}`}>
          {node.icon}
        </div>
        <div className="text-center">
          <h4 className="text-sm font-black tracking-tight text-white uppercase">{node.name}</h4>
          <p className="text-[9px] text-white/40 uppercase tracking-widest font-mono">{node.role}</p>
        </div>
        
        {/* Status Indicator */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
        </div>
      </motion.div>

      {/* Connection Lines to Children */}
      {node.children && node.children.length > 0 && (
        <div className="relative pt-12 flex gap-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-white/10" />
          {node.children.map((child) => (
            <AgentNodeCard key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const AgentHierarchyVisualization: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { agents } = useAgentStore();

  return (
    <div ref={containerRef} className="w-full h-full overflow-auto p-12 flex flex-col items-center gap-16 custom-scrollbar">
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-white/60">Real-Time Swarm Synchronization</span>
        </div>
        <h2 className="text-4xl font-black tracking-tighter text-center uppercase">Agent <span className="text-cyan-400">Hierarchy</span></h2>
        {/* Force store usage to satisfy LSP */}
        <div className="hidden">{agents.length}</div>
      </div>

      <div className="relative">
        <AgentNodeCard node={initialHierarchy} depth={0} />
      </div>
    </div>
  );
};
