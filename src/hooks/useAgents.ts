/**
 * useAgents Hook - React hook for DevOps Agent Swarm integration
 * Provides reactive interface to agent operations
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { AgentClient, TaskPayload, AgentResponse } from '../lib/agent-client';

interface UseAgentsState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastResponse: AgentResponse | null;
}

interface UseAgentsReturn extends UseAgentsState {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  delegateTask: (task: TaskPayload) => Promise<AgentResponse>;
  coordinateAgents: (workflow: Array<{
    step: number;
    agent: string;
    task: string;
    dependsOn?: number[];
  }>) => Promise<AgentResponse>;
  getAgentStatus: (agentName?: string) => Promise<AgentResponse>;
  designInfrastructure: (projectType: string, requirements?: Record<string, unknown>) => Promise<AgentResponse>;
  scanVulnerabilities: (path: string, scanType?: string) => Promise<AgentResponse>;
  checkCompliance: (standard: string) => Promise<AgentResponse>;
  deployApplication: (environment: string, version?: string) => Promise<AgentResponse>;
  createIncident: (title: string, severity: string, description?: string) => Promise<AgentResponse>;
  analyzeCosts: () => Promise<AgentResponse>;
}

export function useAgents(): UseAgentsReturn {
  const clientRef = useRef<AgentClient | null>(null);
  const [state, setState] = useState<UseAgentsState>({
    isConnected: false,
    isLoading: false,
    error: null,
    lastResponse: null,
  });

  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setResponse = useCallback((response: AgentResponse) => {
    setState(prev => ({ ...prev, lastResponse: response, error: response.error || null }));
  }, []);

  const connect = useCallback(async () => {
    if (!clientRef.current) {
      const { AgentClient } = await import('../lib/agent-client');
      clientRef.current = new AgentClient();
    }

    setLoading(true);
    setError(null);

    try {
      await clientRef.current.connect();
      setState(prev => ({ ...prev, isConnected: true }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to agents');
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (clientRef.current) {
      setLoading(true);
      try {
        await clientRef.current.disconnect();
        setState(prev => ({ ...prev, isConnected: false }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to disconnect');
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const delegateTask = useCallback(async (task: TaskPayload) => {
    if (!clientRef.current) throw new Error('Not connected');
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await clientRef.current.delegateTask(task);
      setResponse(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Task delegation failed';
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const coordinateAgents = useCallback(async (workflow: Array<{
    step: number;
    agent: string;
    task: string;
    dependsOn?: number[];
  }>) => {
    if (!clientRef.current) throw new Error('Not connected');
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await clientRef.current.coordinateAgents(workflow);
      setResponse(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Agent coordination failed';
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const getAgentStatus = useCallback(async (agentName?: string) => {
    if (!clientRef.current) throw new Error('Not connected');
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await clientRef.current.getAgentStatus(agentName);
      setResponse(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to get agent status';
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const designInfrastructure = useCallback(async (projectType: string, requirements?: Record<string, unknown>) => {
    if (!clientRef.current) throw new Error('Not connected');
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await clientRef.current.designInfrastructure(projectType, requirements);
      setResponse(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Infrastructure design failed';
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const scanVulnerabilities = useCallback(async (path: string, scanType?: string) => {
    if (!clientRef.current) throw new Error('Not connected');
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await clientRef.current.scanVulnerabilities(path, scanType);
      setResponse(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Vulnerability scan failed';
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const checkCompliance = useCallback(async (standard: string) => {
    if (!clientRef.current) throw new Error('Not connected');
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await clientRef.current.checkCompliance(standard);
      setResponse(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Compliance check failed';
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const deployApplication = useCallback(async (environment: string, version?: string) => {
    if (!clientRef.current) throw new Error('Not connected');
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await clientRef.current.deployApplication(environment, version);
      setResponse(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Deployment failed';
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const createIncident = useCallback(async (title: string, severity: string, description?: string) => {
    if (!clientRef.current) throw new Error('Not connected');
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await clientRef.current.createIncident(title, severity, description);
      setResponse(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Incident creation failed';
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeCosts = useCallback(async () => {
    if (!clientRef.current) throw new Error('Not connected');
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await clientRef.current.analyzeCosts();
      setResponse(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Cost analysis failed';
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    delegateTask,
    coordinateAgents,
    getAgentStatus,
    designInfrastructure,
    scanVulnerabilities,
    checkCompliance,
    deployApplication,
    createIncident,
    analyzeCosts,
  };
}

export default useAgents;
