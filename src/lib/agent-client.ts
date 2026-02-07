/**
 * Agent Client - TypeScript client for DevOps Agent Swarm
 * Provides unified interface to communicate with all 7 agents
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export interface AgentConfig {
  name: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export interface TaskPayload {
  taskType: string;
  payload: Record<string, unknown>;
  priority?: number;
}

export interface AgentResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  taskId?: string;
}

export class AgentClient {
  private clients: Map<string, Client> = new Map();
  private transports: Map<string, StdioClientTransport> = new Map();

  private agentConfigs: AgentConfig[] = [
    {
      name: 'orchestrator',
      command: 'node',
      args: ['../devops-agents/orchestrator/src/index.ts'],
    },
    {
      name: 'infrastructure-architect',
      command: 'node',
      args: ['../devops-agents/infrastructure-architect/src/index.ts'],
    },
    {
      name: 'security-monitor',
      command: 'node',
      args: ['../devops-agents/security-monitor/src/index.ts'],
    },
    {
      name: 'compliance-guardian',
      command: 'node',
      args: ['../devops-agents/compliance-guardian/src/index.ts'],
    },
    {
      name: 'deployment-automation',
      command: 'node',
      args: ['../devops-agents/deployment-automation/src/index.ts'],
    },
    {
      name: 'incident-response',
      command: 'node',
      args: ['../devops-agents/incident-response/src/index.ts'],
    },
    {
      name: 'cost-optimizer',
      command: 'node',
      args: ['../devops-agents/cost-optimizer/src/index.ts'],
    },
  ];

  async connect(agentName?: string): Promise<void> {
    const configs = agentName 
      ? this.agentConfigs.filter(c => c.name === agentName)
      : this.agentConfigs;

    for (const config of configs) {
      const transport = new StdioClientTransport({
        command: config.command,
        args: config.args,
        env: config.env,
      });

      const client = new Client({
        name: `client-${config.name}`,
        version: '1.0.0',
      });

      await client.connect(transport);
      this.clients.set(config.name, client);
      this.transports.set(config.name, transport);
    }
  }

  async disconnect(agentName?: string): Promise<void> {
    if (agentName) {
      const client = this.clients.get(agentName);
      if (client) {
        await client.close();
        this.clients.delete(agentName);
        this.transports.delete(agentName);
      }
    } else {
      for (const [name, client] of this.clients) {
        await client.close();
        this.clients.delete(name);
        this.transports.delete(name);
      }
    }
  }

  async callAgent(agentName: string, toolName: string, args: Record<string, unknown>): Promise<AgentResponse> {
    const client = this.clients.get(agentName);
    if (!client) {
      throw new Error(`Agent ${agentName} not connected`);
    }

    try {
      const result = await client.callTool({
        name: toolName,
        arguments: args,
      });

      const text = result.content.find((c: any) => c.type === 'text')?.text;
      const data = text ? JSON.parse(text) : {};

      return {
        success: !result.isError,
        data: data,
        error: result.isError ? data.error : undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async delegateTask(task: TaskPayload): Promise<AgentResponse> {
    return this.callAgent('orchestrator', 'delegate_task', {
      taskType: task.taskType,
      payload: task.payload,
      priority: task.priority || 5,
    });
  }

  async coordinateAgents(workflow: Array<{
    step: number;
    agent: string;
    task: string;
    dependsOn?: number[];
  }>): Promise<AgentResponse> {
    return this.callAgent('orchestrator', 'coordinate_agents', { workflow });
  }

  async getAgentStatus(agentName?: string): Promise<AgentResponse> {
    return this.callAgent('orchestrator', 'get_agent_status', { agentName });
  }

  async designInfrastructure(projectType: string, requirements?: Record<string, unknown>): Promise<AgentResponse> {
    return this.callAgent('infrastructure-architect', 'design_infrastructure', {
      projectType,
      requirements,
    });
  }

  async scanVulnerabilities(path: string, scanType?: string): Promise<AgentResponse> {
    return this.callAgent('security-monitor', 'scan_vulnerabilities', {
      path,
      scanType,
    });
  }

  async checkCompliance(standard: string): Promise<AgentResponse> {
    return this.callAgent('compliance-guardian', 'check_compliance', {
      standard,
    });
  }

  async deployApplication(environment: string, version?: string): Promise<AgentResponse> {
    return this.callAgent('deployment-automation', 'deploy_application', {
      environment,
      version,
    });
  }

  async createIncident(title: string, severity: string, description?: string): Promise<AgentResponse> {
    return this.callAgent('incident-response', 'create_incident', {
      title,
      severity,
      description,
    });
  }

  async analyzeCosts(): Promise<AgentResponse> {
    return this.callAgent('cost-optimizer', 'analyze_costs', {});
  }

  getConnectedAgents(): string[] {
    return Array.from(this.clients.keys());
  }
}

// Singleton instance
let agentClient: AgentClient | null = null;

export function getAgentClient(): AgentClient {
  if (!agentClient) {
    agentClient = new AgentClient();
  }
  return agentClient;
}

export async function initializeAgents(): Promise<void> {
  const client = getAgentClient();
  await client.connect();
}

export async function shutdownAgents(): Promise<void> {
  if (agentClient) {
    await agentClient.disconnect();
    agentClient = null;
  }
}

// Error handler mode - DISABLED for browser compatibility
// if (import.meta.env.VITE_AGENT_MODE === 'error-handler') {
//   console.error('Error Handler Agent running...');
// }
