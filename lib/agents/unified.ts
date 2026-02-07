// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  🔥 APEX OS - UNIFIED AGENT REGISTRY v1.0                                    ║
// ║  Status: [████████████████████] 100% OPERATIONAL                             ║
// ║  Agents: 25 | Modules: 8 | Tiers: 3                                          ║
// ╚══════════════════════════════════════════════════════════════════════════════╝
//
// MERGED FROM:
// - /hooks/useAgentSwarm.ts (runtime state management)
// - /lib/agents/config.ts (static agent definitions)
//
// PURPOSE: Single source of truth for all agent configurations + runtime state

export type AgentStatus = 'online' | 'offline' | 'busy' | 'error' | 'maintenance';
export type AgentTier = 'free' | 'pro' | 'business';
export type AgentType = 'orchestrator' | 'devops' | 'curriculum' | 'foundation' | 'frontend' | 'backend' | 'advanced' | 'ai' | 'specialized';

export interface UnifiedAgent {
  // Core Identity (from config.ts)
  id: string;
  name: string;
  module: string;
  tier: AgentTier;
  credits: number;
  description: string;
  capabilities: string[];
  model: string;

  // Runtime State (from useAgentSwarm.ts)
  status: AgentStatus;
  type: AgentType;
  lastHeartbeat: string;
  mcpConnected: boolean;
  tasksCompleted: number;
  tasksFailed: number;
  currentTask?: string;
  taskStatus?: 'idle' | 'running' | 'completed' | 'failed';

  // Compliance & Quality Metrics
  complianceScore: number; // 0-100
  lastComplianceCheck?: string;
  qualityRating?: number; // 0-5 stars
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT DEFINITIONS - 25 AGENTS ACROSS 8 MODULES
// ═══════════════════════════════════════════════════════════════════════════════

export const UNIFIED_AGENTS: UnifiedAgent[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 1: ORCHESTRATOR (System Coordination)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    module: 'System Coordination',
    tier: 'business',
    credits: 1000,
    description: 'Central coordination hub for all agent operations. Manages task distribution, health monitoring, and system-wide optimization.',
    capabilities: ['coordination', 'monitoring', 'optimization', 'task-distribution', 'health-checks', 'swarm-management'],
    model: 'claude-3-opus',
    status: 'online',
    type: 'orchestrator',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 98,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 00: FOUNDATION (Free Tier)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'config-agent',
    name: 'Config Agent',
    module: 'Foundation',
    tier: 'free',
    credits: 5,
    description: 'Environment setup, configuration files, and project initialization',
    capabilities: ['env-setup', 'config', 'dotfiles', 'initialization', 'package-management'],
    model: 'claude-3-5-sonnet',
    status: 'online',
    type: 'foundation',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 92,
  },
  {
    id: 'doc-agent',
    name: 'Doc Agent',
    module: 'Foundation',
    tier: 'free',
    credits: 5,
    description: 'Documentation, README files, and technical writing',
    capabilities: ['docs', 'markdown', 'readme', 'technical-writing', 'api-docs'],
    model: 'claude-3-5-sonnet',
    status: 'online',
    type: 'foundation',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 90,
  },
  {
    id: 'readme-agent',
    name: 'README Agent',
    module: 'Foundation',
    tier: 'pro',
    credits: 15,
    description: 'Generates, validates, and maintains README documentation with Tony Stark visual style compliance',
    capabilities: ['readme-generation', 'documentation-validation', 'ascii-formatting', 'compliance-checking', 'markdown-synthesis', 'project-analysis'],
    model: 'claude-3-5-sonnet',
    status: 'online',
    type: 'foundation',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 96,
  },
  {
    id: 'golden-standard-enforcer',
    name: 'Golden Standard Enforcer',
    module: 'Foundation',
    tier: 'business',
    credits: 25,
    description: 'Validates all output against Golden Standard Visual Protocol. Mandatory compliance enforcement.',
    capabilities: ['ascii-validation', 'progress-bar-formatting', 'tone-checking', 'auto-formatting', 'compliance-reporting', 'golden-standard-enforcement'],
    model: 'claude-3-5-sonnet',
    status: 'online',
    type: 'foundation',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 100,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 01: FRONTEND (Free/Pro Tier)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ui-agent',
    name: 'UI Agent',
    module: 'Frontend',
    tier: 'free',
    credits: 10,
    description: 'UI components, React, Vue, and design systems',
    capabilities: ['ui', 'components', 'react', 'vue', 'design-systems', 'css', 'tailwind'],
    model: 'claude-3-5-sonnet',
    status: 'online',
    type: 'frontend',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 94,
  },
  {
    id: 'frontend-agent',
    name: 'Frontend Agent',
    module: 'Frontend',
    tier: 'free',
    credits: 10,
    description: 'Frontend architecture, state management, and SPA development',
    capabilities: ['frontend', 'spa', 'state-management', 'architecture', 'routing', 'performance'],
    model: 'claude-3-5-sonnet',
    status: 'online',
    type: 'frontend',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 93,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 02: BACKEND (Pro Tier)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'backend-agent',
    name: 'Backend Agent',
    module: 'Backend',
    tier: 'pro',
    credits: 10,
    description: 'API design, server architecture, and backend services',
    capabilities: ['api', 'backend', 'server', 'rest', 'graphql', 'microservices'],
    model: 'claude-3-5-sonnet',
    status: 'online',
    type: 'backend',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 95,
  },
  {
    id: 'database-agent',
    name: 'Database Agent',
    module: 'Backend',
    tier: 'pro',
    credits: 10,
    description: 'Schema design, queries, and database optimization',
    capabilities: ['database', 'sql', 'nosql', 'schema', 'optimization', 'indexing'],
    model: 'claude-3-5-sonnet',
    status: 'online',
    type: 'backend',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 94,
  },
  {
    id: 'security-agent',
    name: 'Security Agent',
    module: 'Backend',
    tier: 'pro',
    credits: 15,
    description: 'Authentication, encryption, and security best practices',
    capabilities: ['security', 'auth', 'encryption', 'jwt', 'oauth', 'vulnerability-scanning'],
    model: 'claude-3-5-sonnet',
    status: 'online',
    type: 'backend',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 97,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 03: DEVOPS (Pro Tier)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'devops-agent',
    name: 'DevOps Agent',
    module: 'DevOps',
    tier: 'pro',
    credits: 15,
    description: 'CI/CD pipelines, Docker, and Kubernetes',
    capabilities: ['devops', 'cicd', 'docker', 'kubernetes', 'pipelines', 'automation'],
    model: 'claude-3-5-sonnet',
    status: 'online',
    type: 'devops',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 95,
  },
  {
    id: 'infrastructure-agent',
    name: 'Infrastructure Agent',
    module: 'DevOps',
    tier: 'pro',
    credits: 15,
    description: 'Terraform, cloud architecture, and infrastructure as code',
    capabilities: ['infrastructure', 'terraform', 'cloud', 'aws', 'gcp', 'azure'],
    model: 'claude-3-5-sonnet',
    status: 'online',
    type: 'devops',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 94,
  },
  {
    id: 'monitoring-agent',
    name: 'Monitoring Agent',
    module: 'DevOps',
    tier: 'pro',
    credits: 10,
    description: 'Observability, logging, metrics, and alerting',
    capabilities: ['monitoring', 'logging', 'metrics', 'observability', 'alerting', 'tracing'],
    model: 'claude-3-5-sonnet',
    status: 'online',
    type: 'devops',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 93,
  },
  {
    id: 'deployment-automation',
    name: 'Deployment Automation',
    module: 'DevOps',
    tier: 'pro',
    credits: 850,
    description: 'Automated deployment pipelines, release management, and production operations',
    capabilities: ['deployment', 'automation', 'testing', 'release-management', 'rollback', 'blue-green'],
    model: 'claude-3-5-sonnet',
    status: 'online',
    type: 'devops',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 96,
  },
  {
    id: 'security-monitor',
    name: 'Security Monitor',
    module: 'DevOps',
    tier: 'pro',
    credits: 750,
    description: 'Continuous security monitoring, threat detection, and incident response',
    capabilities: ['security', 'monitoring', 'auditing', 'threat-detection', 'incident-response'],
    model: 'claude-3-5-sonnet',
    status: 'online',
    type: 'devops',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 98,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 04: ADVANCED (Pro Tier)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'architecture-agent',
    name: 'Architecture Agent',
    module: 'Advanced',
    tier: 'pro',
    credits: 20,
    description: 'System design, patterns, and scalability',
    capabilities: ['architecture', 'patterns', 'scalability', 'microservices', 'distributed-systems'],
    model: 'claude-3-5-sonnet',
    status: 'online',
    type: 'advanced',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 96,
  },
  {
    id: 'performance-agent',
    name: 'Performance Agent',
    module: 'Advanced',
    tier: 'pro',
    credits: 15,
    description: 'Optimization, caching, and profiling',
    capabilities: ['performance', 'optimization', 'caching', 'profiling', 'load-testing'],
    model: 'claude-3-5-sonnet',
    status: 'online',
    type: 'advanced',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 94,
  },
  {
    id: 'testing-agent',
    name: 'Testing Agent',
    module: 'Advanced',
    tier: 'pro',
    credits: 10,
    description: 'Test strategies, TDD, and coverage',
    capabilities: ['testing', 'tdd', 'coverage', 'e2e', 'unit-tests', 'integration-tests'],
    model: 'claude-3-5-sonnet',
    status: 'online',
    type: 'advanced',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 95,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 05: AI (Business Tier)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ai-agent',
    name: 'AI Agent',
    module: 'AI',
    tier: 'business',
    credits: 25,
    description: 'ML models, AI integration, and prompt engineering',
    capabilities: ['ai', 'ml', 'llm', 'prompts', 'fine-tuning', 'model-deployment'],
    model: 'claude-3-opus',
    status: 'online',
    type: 'ai',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 97,
  },
  {
    id: 'data-agent',
    name: 'Data Agent',
    module: 'AI',
    tier: 'business',
    credits: 20,
    description: 'Data pipelines, ETL, and analytics',
    capabilities: ['data', 'etl', 'analytics', 'pipelines', 'warehouse', 'visualization'],
    model: 'claude-3-opus',
    status: 'online',
    type: 'ai',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 95,
  },
  {
    id: 'nlp-agent',
    name: 'NLP Agent',
    module: 'AI',
    tier: 'business',
    credits: 20,
    description: 'Text processing, sentiment analysis, and classification',
    capabilities: ['nlp', 'text', 'sentiment', 'classification', 'ner', 'summarization'],
    model: 'claude-3-opus',
    status: 'online',
    type: 'ai',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 96,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 06: SPECIALIZED (Business Tier)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'blockchain-agent',
    name: 'Blockchain Agent',
    module: 'Specialized',
    tier: 'business',
    credits: 30,
    description: 'Smart contracts, Web3, and crypto development',
    capabilities: ['blockchain', 'web3', 'solidity', 'smart-contracts', 'defi', 'nft'],
    model: 'claude-3-opus',
    status: 'online',
    type: 'specialized',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 94,
  },
  {
    id: 'embedded-agent',
    name: 'Embedded Agent',
    module: 'Specialized',
    tier: 'business',
    credits: 25,
    description: 'IoT, firmware, and hardware interfaces',
    capabilities: ['embedded', 'iot', 'firmware', 'hardware', 'rust', 'c', 'cpp'],
    model: 'claude-3-opus',
    status: 'online',
    type: 'specialized',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 93,
  },
  {
    id: 'game-agent',
    name: 'Game Agent',
    module: 'Specialized',
    tier: 'business',
    credits: 25,
    description: 'Game logic, physics, and AI behaviors',
    capabilities: ['game', 'physics', 'unity', 'unreal', 'game-ai', 'multiplayer'],
    model: 'claude-3-opus',
    status: 'online',
    type: 'specialized',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 94,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 07: CURRICULUM (Pro Tier)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'curriculum-architect',
    name: 'Curriculum Architect',
    module: 'Curriculum',
    tier: 'pro',
    credits: 900,
    description: 'Learning path design, educational content architecture, and skill progression mapping',
    capabilities: ['curriculum', 'design', 'pedagogy', 'learning-paths', 'skill-mapping', 'assessment-design'],
    model: 'claude-3-5-sonnet',
    status: 'online',
    type: 'curriculum',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 96,
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    module: 'Curriculum',
    tier: 'pro',
    credits: 800,
    description: 'Educational content production, multimedia creation, and documentation',
    capabilities: ['content', 'media', 'documentation', 'video-scripts', 'tutorials', 'examples'],
    model: 'claude-3-5-sonnet',
    status: 'online',
    type: 'curriculum',
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0,
    complianceScore: 94,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const getAgentById = (id: string): UnifiedAgent | undefined => {
  return UNIFIED_AGENTS.find(agent => agent.id === id);
};

export const getAgentsByModule = (module: string): UnifiedAgent[] => {
  return UNIFIED_AGENTS.filter(agent => agent.module === module);
};

export const getAgentsByTier = (tier: AgentTier): UnifiedAgent[] => {
  return UNIFIED_AGENTS.filter(agent => agent.tier === tier);
};

export const getAgentsByType = (type: AgentType): UnifiedAgent[] => {
  return UNIFIED_AGENTS.filter(agent => agent.type === type);
};

export const getAgentsByStatus = (status: AgentStatus): UnifiedAgent[] => {
  return UNIFIED_AGENTS.filter(agent => agent.status === status);
};

export const getOnlineAgents = (): UnifiedAgent[] => {
  return UNIFIED_AGENTS.filter(agent => agent.status === 'online' && agent.mcpConnected);
};

export const getTotalCredits = (): number => {
  return UNIFIED_AGENTS.reduce((sum, agent) => sum + agent.credits, 0);
};

export const getAverageComplianceScore = (): number => {
  const total = UNIFIED_AGENTS.reduce((sum, agent) => sum + agent.complianceScore, 0);
  return Math.round(total / UNIFIED_AGENTS.length);
};

export const getModuleStats = (): Record<string, { count: number; avgCredits: number }> => {
  const modules = [...new Set(UNIFIED_AGENTS.map(a => a.module))];
  const stats: Record<string, { count: number; avgCredits: number }> = {};
  
  modules.forEach(module => {
    const agents = getAgentsByModule(module);
    stats[module] = {
      count: agents.length,
      avgCredits: Math.round(agents.reduce((sum, a) => sum + a.credits, 0) / agents.length),
    };
  });
  
  return stats;
};

export const getTierDistribution = (): Record<AgentTier, number> => {
  return {
    free: UNIFIED_AGENTS.filter(a => a.tier === 'free').length,
    pro: UNIFIED_AGENTS.filter(a => a.tier === 'pro').length,
    business: UNIFIED_AGENTS.filter(a => a.tier === 'business').length,
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// SWARM STATE INTERFACE (for use with hooks)
// ═══════════════════════════════════════════════════════════════════════════════

export interface AgentTask {
  id: string;
  agentId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  prompt: string;
  startedAt: number;
  completedAt?: number;
  result?: string;
  error?: string;
}

export interface SwarmState {
  agents: UnifiedAgent[];
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

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default UNIFIED_AGENTS;

// Agent count constant for quick reference
export const AGENT_COUNT = UNIFIED_AGENTS.length;
export const MODULE_COUNT = 8;
export const TIER_COUNT = 3;
