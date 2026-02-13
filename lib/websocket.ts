import { useState, useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// WebSocket Message Types
export type WebSocketMessageType = 
  | 'terminal'
  | 'agent'
  | 'matrix'
  | 'progress'
  | 'collab'
  | 'system'
  | 'ping'
  | 'pong';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: any;
  timestamp: number;
  id: string;
}

export interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  lastPing: number;
  reconnectAttempts: number;
  messages: WebSocketMessage[];
  pendingMessages: WebSocketMessage[];
}

// WebSocket Store
interface WebSocketStore extends WebSocketState {
  socket: WebSocket | null;
  connect: () => void;
  disconnect: () => void;
  send: (message: Omit<WebSocketMessage, 'timestamp' | 'id'>) => void;
  addMessage: (message: WebSocketMessage) => void;
  clearMessages: () => void;
}

export const useWebSocketStore = create<WebSocketStore>()(
  persist(
    (set, get) => ({
      socket: null,
      isConnected: false,
      isConnecting: false,
      lastPing: 0,
      reconnectAttempts: 0,
      messages: [],
      pendingMessages: [],

      connect: () => {
        const { socket, isConnecting } = get();
        if (socket?.readyState === WebSocket.OPEN || isConnecting) return;

        set({ isConnecting: true });

        const wsUrl = process.env.VITE_WS_URL || 'wss://apex-os-core.vercel.app/ws';
        const newSocket = new WebSocket(wsUrl);

        newSocket.onopen = () => {
          console.log('WebSocket connected');
          set({ 
            socket: newSocket, 
            isConnected: true, 
            isConnecting: false,
            reconnectAttempts: 0 
          });
          
          // Send pending messages
          const { pendingMessages } = get();
          pendingMessages.forEach(msg => {
            newSocket.send(JSON.stringify(msg));
          });
          set({ pendingMessages: [] });
        };

        newSocket.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            get().addMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        newSocket.onclose = () => {
          console.log('WebSocket disconnected');
          set({ 
            socket: null, 
            isConnected: false, 
            isConnecting: false 
          });
          
          // Attempt reconnection
          const { reconnectAttempts } = get();
          if (reconnectAttempts < 5) {
            setTimeout(() => {
              set({ reconnectAttempts: reconnectAttempts + 1 });
              get().connect();
            }, Math.min(1000 * Math.pow(2, reconnectAttempts), 30000));
          }
        };

        newSocket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      },

      disconnect: () => {
        const { socket } = get();
        if (socket) {
          socket.close();
          set({ 
            socket: null, 
            isConnected: false, 
            isConnecting: false 
          });
        }
      },

      send: (message) => {
        const { socket, isConnected, pendingMessages } = get();
        const fullMessage: WebSocketMessage = {
          ...message,
          timestamp: Date.now(),
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };

        if (isConnected && socket?.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(fullMessage));
        } else {
          // Queue message for when connection is restored
          set({ pendingMessages: [...pendingMessages, fullMessage] });
        }
      },

      addMessage: (message) => {
        set((state) => ({
          messages: [...state.messages.slice(-99), message]
        }));
      },

      clearMessages: () => {
        set({ messages: [] });
      }
    }),
    {
      name: 'websocket-store',
      partialize: (state) => ({ 
        messages: state.messages.slice(-50) 
      })
    }
  )
);

// WebSocket Hook
export function useWebSocket() {
  const store = useWebSocketStore();

  useEffect(() => {
    store.connect();
    return () => store.disconnect();
  }, []);

  return {
    isConnected: store.isConnected,
    isConnecting: store.isConnecting,
    messages: store.messages,
    send: store.send,
    clearMessages: store.clearMessages
  };
}

// Terminal WebSocket Hook
export function useTerminalWebSocket() {
  const { send, messages, isConnected } = useWebSocket();
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  useEffect(() => {
    const terminalMessages = messages.filter(m => m.type === 'terminal');
    if (terminalMessages.length > 0) {
      const latest = terminalMessages[terminalMessages.length - 1];
      setTerminalOutput(prev => [...prev, latest.payload.output].slice(-100));
    }
  }, [messages]);

  const sendCommand = useCallback((command: string) => {
    send({
      type: 'terminal',
      payload: { command, timestamp: Date.now() }
    });
  }, [send]);

  return {
    terminalOutput,
    sendCommand,
    isConnected,
    clear: () => setTerminalOutput([])
  };
}

// Agent WebSocket Hook
export function useAgentWebSocket() {
  const { send, messages, isConnected } = useWebSocket();
  const [agentResponses, setAgentResponses] = useState<any[]>([]);

  useEffect(() => {
    const agentMessages = messages.filter(m => m.type === 'agent');
    if (agentMessages.length > 0) {
      setAgentResponses(prev => [...prev, ...agentMessages.map(m => m.payload)].slice(-50));
    }
  }, [messages]);

  const sendAgentMessage = useCallback((agentId: string, message: string) => {
    send({
      type: 'agent',
      payload: { agentId, message, timestamp: Date.now() }
    });
  }, [send]);

  return {
    agentResponses,
    sendAgentMessage,
    isConnected,
    clear: () => setAgentResponses([])
  };
}

// Matrix WebSocket Hook
export function useMatrixWebSocket() {
  const { send, messages, isConnected } = useWebSocket();
  const [matrixUpdates, setMatrixUpdates] = useState<any[]>([]);

  useEffect(() => {
    const matrixMessages = messages.filter(m => m.type === 'matrix');
    if (matrixMessages.length > 0) {
      setMatrixUpdates(prev => [...prev, ...matrixMessages.map(m => m.payload)].slice(-20));
    }
  }, [messages]);

  const updateMatrix = useCallback((update: any) => {
    send({
      type: 'matrix',
      payload: { ...update, timestamp: Date.now() }
    });
  }, [send]);

  return {
    matrixUpdates,
    updateMatrix,
    isConnected
  };
}
