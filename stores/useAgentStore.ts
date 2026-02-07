import { create } from 'zustand';

export interface AgentMetrics {
  tasksCompleted: number;
  successRate: number;
  responseTime: string;
}

export interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'busy' | 'syncing';
  lastAction: string;
  metrics: AgentMetrics;
}

interface AgentStore {
  agents: Record<string, Agent>;
  activeAgentsCount: number;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  setAgents: (agents: Record<string, Agent>) => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: {},
  activeAgentsCount: 0,
  updateAgent: (id, updates) => set((state) => {
    const updatedAgent = { ...state.agents[id], ...updates };
    const newAgents = { ...state.agents, [id]: updatedAgent as Agent };
    const activeCount = Object.values(newAgents).filter(a => a.status === 'active' || a.status === 'busy').length;
    return { agents: newAgents, activeAgentsCount: activeCount };
  }),
  setAgents: (agents) => set({ 
    agents, 
    activeAgentsCount: Object.values(agents).filter(a => a.status === 'active' || a.status === 'busy').length 
  }),
}));
