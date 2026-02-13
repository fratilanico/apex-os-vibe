export interface Agent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'error' | 'connecting';
  module: string;
  type: 'devops' | 'curriculum' | 'orchestrator' | 'specialized';
  credits: number;
  capabilities: string[];
  lastHeartbeat: string;
  lastTask?: string;
  taskStatus?: 'idle' | 'running' | 'completed' | 'failed';
  mcpConnected: boolean;
  currentTask?: string;
  tasksCompleted?: number;
  tasksFailed?: number;
}

export interface AgentTask {
  id: string;
  agentId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  prompt: string;
  result?: string;
  error?: string;
  startedAt: number;
  completedAt?: number;
  complianceScore?: number;
  validationPassed?: boolean;
}

export interface AgentTaskResult {
  output?: string;
  result?: string;
  status: 'completed' | 'failed';
  completedAt: number;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface AgentSwarmState {
  agents: Agent[];
  tasks: AgentTask[];
  isConnected: boolean;
  isConnecting: boolean;
  activeAgents: number;
  totalAgents: number;
  onlineAgents: number;
  busyAgents: number;
  errorAgents: number;
  lastUpdate: number;
  mcpStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
  summary: {
    total: number;
    online: number;
    busy: number;
    error: number;
  };
}
