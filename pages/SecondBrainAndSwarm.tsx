// APEX OS - Second Brain & Agent Swarm Integration
// Golden Rule of Design: Mobile-First, Performance-Optimized, Dark Theme
// Brand: Zinc-950 background, Cyan/Violet/Emerald accents

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Bot, 
  Terminal, 
  Activity, 
  Zap,
  ChevronUp,
  Menu,
  X
} from 'lucide-react';

// Types
interface Agent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy';
  module: string;
  credits: number;
}

interface MemoryNode {
  id: string;
  type: 'file' | 'agent_output' | 'conversation';
  title: string;
  content: string;
  timestamp: string;
  connections: number;
}

interface SwarmState {
  agents: Agent[];
  memories: MemoryNode[];
  isConnected: boolean;
  activeAgents: number;
  totalMemories: number;
}

// WebSocket Hook
const useSwarmWebSocket = () => {
  const [state, setState] = useState<SwarmState>({
    agents: [],
    memories: [],
    isConnected: false,
    activeAgents: 0,
    totalMemories: 0
  });

  useEffect(() => {
    const ws = new WebSocket('wss://apex-os.vercel.app/ws');
    
    ws.onopen = () => {
      setState(prev => ({ ...prev, isConnected: true }));
      ws.send(JSON.stringify({ action: 'subscribe:swarm' }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'swarm:update') {
        setState({
          ...data.payload,
          isConnected: true
        });
      }
    };

    ws.onclose = () => {
      setState(prev => ({ ...prev, isConnected: false }));
    };

    return () => ws.close();
  }, []);

  return state;
};

// Second Brain Panel
const SecondBrainPanel: React.FC = () => {
  const { memories, totalMemories } = useSwarmWebSocket();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredMemories = memories.filter(m => {
    const matchesSearch = !searchQuery || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || m.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur border-b border-zinc-800 p-4">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-cyan-400" />
          <div>
            <h2 className="text-lg font-bold text-white">Second Brain</h2>
            <p className="text-xs text-zinc-400">{totalMemories} memories indexed</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 
                       text-sm text-white placeholder-zinc-500
                       focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Type Filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          {['file', 'agent_output', 'conversation'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? null : type)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all
                ${selectedType === type 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Memory List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {filteredMemories.map((memory) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 
                         hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                  ${memory.type === 'file' ? 'bg-violet-500/20 text-violet-400' :
                    memory.type === 'agent_output' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-cyan-500/20 text-cyan-400'}`}
                >
                  {memory.type === 'file' ? '📄' : 
                   memory.type === 'agent_output' ? '🤖' : '💬'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-white truncate">{memory.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{memory.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                    <span>{new Date(memory.timestamp).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {memory.connections} connections
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Agent Swarm Panel
const AgentSwarmPanel: React.FC = () => {
  const { agents, activeAgents, isConnected } = useSwarmWebSocket();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const modules = ['Foundation', 'Frontend', 'Backend', 'DevOps', 'AI', 'Specialized'];
  
  const filteredAgents = selectedModule 
    ? agents.filter(a => a.module === selectedModule)
    : agents;

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur border-b border-zinc-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-violet-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Agent Swarm</h2>
              <p className="text-xs text-zinc-400">{activeAgents} active agents</p>
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}`} />
        </div>

        {/* Module Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedModule(null)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all
              ${!selectedModule 
                ? 'bg-violet-500/20 text-violet-400 border border-violet-500/50' 
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}
          >
            All
          </button>
          {modules.map(module => (
            <button
              key={module}
              onClick={() => setSelectedModule(module)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all
                ${selectedModule === module 
                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/50' 
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}
            >
              {module}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence>
            {filteredAgents.map((agent) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4
                           hover:border-violet-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full
                      ${agent.status === 'online' ? 'bg-emerald-400' :
                        agent.status === 'busy' ? 'bg-amber-400' : 'bg-zinc-600'}`} 
                    />
                    <div>
                      <h3 className="font-medium text-sm text-white">{agent.name}</h3>
                      <p className="text-xs text-zinc-500">{agent.module}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-400">
                    <Zap className="w-3 h-3" />
                    {agent.credits}cr
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Main Integration Component
export const SecondBrainAndSwarm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'brain' | 'swarm' | 'terminal'>('brain');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  return (
    <div className="h-screen bg-zinc-950 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'brain' && (
            <motion.div
              key="brain"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full"
            >
              <SecondBrainPanel />
            </motion.div>
          )}
          {activeTab === 'swarm' && (
            <motion.div
              key="swarm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full"
            >
              <AgentSwarmPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-zinc-900 border-t border-zinc-800 px-4 py-2">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab('brain')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all
              ${activeTab === 'brain' ? 'text-cyan-400' : 'text-zinc-500'}`}
          >
            <Brain className="w-5 h-5" />
            <span className="text-xs">Brain</span>
          </button>

          <button
            onClick={() => setActiveTab('swarm')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all
              ${activeTab === 'swarm' ? 'text-violet-400' : 'text-zinc-500'}`}
          >
            <Bot className="w-5 h-5" />
            <span className="text-xs">Swarm</span>
          </button>

          <button
            onClick={() => setIsTerminalOpen(!isTerminalOpen)}
            className="flex flex-col items-center gap-1 p-2 rounded-lg 
                       bg-cyan-500/20 text-cyan-400 transition-all"
          >
            <Terminal className="w-5 h-5" />
            <span className="text-xs">Terminal</span>
          </button>
        </div>
      </div>

      {/* Terminal Panel */}
      <AnimatePresence>
        {isTerminalOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-16 left-0 right-0 bg-zinc-900 border-t border-cyan-500/30
                       h-64 flex flex-col"
          >
            <div className="flex items-center justify-between p-3 border-b border-zinc-800">
              <span className="text-sm font-medium text-cyan-400">Terminal</span>
              <button 
                onClick={() => setIsTerminalOpen(false)}
                className="p-1 hover:bg-zinc-800 rounded"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
            <div className="flex-1 p-4 font-mono text-sm text-zinc-300 overflow-y-auto">
              <div className="text-zinc-500">$ apex-os --version</div>
              <div className="text-emerald-400">APEX OS v1.0.0 - Agent Swarm & Second Brain Active</div>
              <div className="text-zinc-500 mt-2">$ swarm status</div>
              <div className="text-cyan-400">19 agents online • 1,247 memories indexed</div>
              <div className="text-zinc-500 mt-2">$ <span className="animate-pulse">_</span></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecondBrainAndSwarm;
