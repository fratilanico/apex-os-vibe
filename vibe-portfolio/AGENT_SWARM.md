# DevOps Agent Swarm Integration

This project is integrated with the DevOps Agent Swarm - a collection of 7 specialized agents that automate infrastructure, security, compliance, deployment, incident response, and cost optimization tasks.

## Overview

The DevOps Agent Swarm consists of:

1. **Orchestrator** - Coordinates all agents, delegates tasks, manages workflow
2. **Infrastructure Architect** - Designs cloud infrastructure, generates Terraform
3. **Security Monitor** - Scans vulnerabilities, monitors threats, compliance
4. **Compliance Guardian** - SOC2/ISO27001 audits, policy enforcement
5. **Deployment Automation** - CI/CD pipelines, releases, rollbacks
6. **Incident Response** - Creates incidents, runs playbooks, alerts on-call
7. **Cost Optimizer** - Analyzes spending, finds savings, budgets

## Quick Start

### Using Agents in Cursor

All agents are available via MCP in `.cursor/mcp.json`. You can interact with them directly in Cursor.

### Using the React Hook

```typescript
import { useAgents } from '@/hooks/useAgents';

function MyComponent() {
  const { 
    isConnected, 
    isLoading, 
    error,
    connect,
    scanVulnerabilities,
    deployApplication 
  } = useAgents();

  useEffect(() => {
    connect();
  }, [connect]);

  const handleScan = async () => {
    const result = await scanVulnerabilities('.', 'full');
    console.log(result);
  };

  return (
    <button onClick={handleScan} disabled={!isConnected || isLoading}>
      Scan for Vulnerabilities
    </button>
  );
}
```

### Using the TypeScript Client

```typescript
import { AgentClient, initializeAgents, shutdownAgents } from '@/lib/agent-client';

async function main() {
  await initializeAgents();
  
  const client = new AgentClient();
  await client.connect();
  
  // Delegate a task
  const result = await client.delegateTask({
    taskType: 'security-scan',
    payload: { path: '.', scanType: 'full' },
    priority: 5,
  });
  
  console.log(result);
  
  await client.disconnect();
  await shutdownAgents();
}
```

### Using the CLI Orchestrator

```bash
# Start all agents
node scripts/agent-orchestrator.js start

# Start specific agent
node scripts/agent-orchestrator.js start security-monitor

# Check status
node scripts/agent-orchestrator.js status

# Run a task
node scripts/agent-orchestrator.js task security-monitor scan_vulnerabilities '{"path": "."}'

# Run a workflow
node scripts/agent-orchestrator.js workflow deploy-workflow.json

# Stop all agents
node scripts/agent-orchestrator.js stop
```

## Agent Capabilities

### Orchestrator

| Tool | Description |
|------|-------------|
| `register_agent` | Register a new agent with the orchestrator |
| `delegate_task` | Delegate a task to the most appropriate agent |
| `get_agent_status` | Get status of all agents or specific agent |
| `broadcast_message` | Send message to all agents or specific agents |
| `coordinate_agents` | Coordinate multiple agents for complex workflow |
| `get_task_queue` | View current task queue and assignments |
| `retry_failed_task` | Retry a failed task with same or different agent |

### Infrastructure Architect

| Tool | Description |
|------|-------------|
| `design_infrastructure` | Design infrastructure architecture for a project |
| `generate_terraform` | Generate Terraform configuration |
| `optimize_costs` | Analyze and optimize infrastructure costs |
| `validate_compliance` | Validate infrastructure against compliance standards |
| `scale_resources` | Recommend scaling strategies |

### Security Monitor

| Tool | Description |
|------|-------------|
| `scan_vulnerabilities` | Scan codebase for security vulnerabilities |
| `check_compliance` | Check compliance against security standards |
| `audit_access` | Audit access controls and permissions |
| `monitor_threats` | Monitor for security threats |
| `generate_report` | Generate security assessment report |

### Compliance Guardian

| Tool | Description |
|------|-------------|
| `audit_compliance` | Run compliance audit against standards |
| `check_policy` | Check if code meets policy requirements |
| `generate_evidence` | Generate compliance evidence |

### Deployment Automation

| Tool | Description |
|------|-------------|
| `deploy_application` | Deploy application to environment |
| `rollback` | Rollback to previous version |
| `run_tests` | Run test suite |
| `build_artifacts` | Build deployment artifacts |

### Incident Response

| Tool | Description |
|------|-------------|
| `create_incident` | Create new incident |
| `alert_oncall` | Alert on-call personnel |
| `run_playbook` | Run incident response playbook |

### Cost Optimizer

| Tool | Description |
|------|-------------|
| `analyze_costs` | Analyze current infrastructure costs |
| `find_savings` | Find cost optimization opportunities |
| `detect_anomalies` | Detect cost anomalies |

## GitHub Actions Integration

The project includes GitHub Actions workflows for automated agent tasks:

- **Security Scan** - Runs daily vulnerability scans
- **Compliance Check** - Validates SOC2/ISO27001 compliance
- **Cost Analysis** - Analyzes infrastructure costs
- **Deployment** - Automated deployments to production

### Manual Trigger

You can manually trigger agent tasks from the GitHub Actions tab:

1. Go to Actions → Agent Tasks
2. Click "Run workflow"
3. Select the agent and task to run
4. Click "Run workflow"

## Configuration

### MCP Configuration

The `.cursor/mcp.json` file configures all agents for Cursor IDE:

```json
{
  "mcpServers": {
    "orchestrator": {
      "command": "node",
      "args": ["../devops-agents/orchestrator/src/index.ts"]
    },
    // ... other agents
  }
}
```

### Environment Variables

Create a `.env` file for agent configuration:

```env
# Agent Configuration
AGENT_MODE=production
AGENT_LOG_LEVEL=info

# Security
SECURITY_SCAN_PATH=.
COMPLIANCE_STANDARD=SOC2

# Deployment
DEPLOY_ENVIRONMENT=production
DEPLOY_TOKEN=your-token

# Cost Optimization
COST_TARGET_SAVINGS=20
```

## Workflow Examples

### Security-First Deployment

```json
[
  { "step": 1, "agent": "security-monitor", "task": "scan_vulnerabilities" },
  { "step": 2, "agent": "compliance-guardian", "task": "check_compliance", "dependsOn": [1] },
  { "step": 3, "agent": "deployment-automation", "task": "deploy_application", "dependsOn": [2] }
]
```

### Infrastructure Update

```json
[
  { "step": 1, "agent": "infrastructure-architect", "task": "design_infrastructure" },
  { "step": 2, "agent": "cost-optimizer", "task": "optimize_costs", "dependsOn": [1] },
  { "step": 3, "agent": "deployment-automation", "task": "deploy_application", "dependsOn": [2] }
]
```

## Troubleshooting

### Agents Not Starting

1. Check that the devops-agents directory exists at `../devops-agents`
2. Ensure all dependencies are installed: `npm ci`
3. Check agent logs: `node scripts/agent-orchestrator.js status`

### Task Failures

1. Check agent status
2. Review error messages in logs
3. Retry failed tasks: `node scripts/agent-orchestrator.js retry <task-id>`

### Connection Issues

1. Verify MCP configuration in `.cursor/mcp.json`
2. Check that agent ports are not in use
3. Restart agents: `node scripts/agent-orchestrator.js stop && node scripts/agent-orchestrator.js start`

## Best Practices

1. **Always run security scans** before deploying to production
2. **Use workflows** for complex multi-agent operations
3. **Monitor agent status** regularly
4. **Keep agents updated** with the latest versions
5. **Use appropriate priority levels** for tasks (1-10, where 1 is highest)
6. **Handle errors gracefully** in your application code
7. **Log all agent interactions** for audit purposes

## Support

For issues or questions about the DevOps Agent Swarm:

1. Check the logs: `node scripts/agent-orchestrator.js status`
2. Review the agent documentation in `../devops-agents/README.md`
3. Create an issue in the project repository

## License

This integration follows the same license as the main project.
