import { useEffect, useRef } from 'react';
import { useAgentStore } from '../stores/useAgentStore';

export const useAgentSync = () => {
  const ws = useRef<WebSocket | null>(null);
  const updateAgent = useAgentStore((state) => state.updateAgent);

  useEffect(() => {
    // Connect to the Agent Sync Gateway
    const wsUrl = `ws://${window.location.hostname}:18789`;
    
    const connect = () => {
      try {
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
          console.log('Successfully connected to Agent Sync Gateway');
        };

        ws.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'agent_update' && data.agentId) {
              updateAgent(data.agentId, data.updates);
            }
          } catch (e) {
            console.error('Failed to parse agent sync message', e);
          }
        };

        ws.current.onclose = () => {
          console.log('Agent Sync Gateway connection closed. Retrying in 5s...');
          setTimeout(connect, 5000);
        };

        ws.current.onerror = (err) => {
          console.error('Agent Sync Gateway error:', err);
          ws.current?.close();
        };
      } catch (e) {
        console.error('Failed to initialize WebSocket', e);
      }
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [updateAgent]);

  const sendCommand = (agentId: string, command: string, params: any = {}) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'agent_command',
        agentId,
        command,
        params,
        timestamp: new Date().toISOString()
      }));
    } else {
      console.warn('Cannot send command: WebSocket not connected');
    }
  };

  return { sendCommand };
};
