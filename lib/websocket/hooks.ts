/**
 * WebSocket Hooks - React hooks for WebSocket integration
 * 
 * @description Provides easy-to-use React hooks for:
 * - Terminal real-time updates
 * - Agent communication
 * - Matrix synchronization
 * - Collaborative features
 * - Progress tracking
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { wsClient, useWebSocketStore } from './client';
import type {
  WebSocketMessageType,
  TerminalOutputPayload,
  TerminalStatusPayload,
  AgentMessagePayload,
  AgentStatusPayload,
  AgentTypingPayload,
  MatrixSyncPayload,
  MatrixUpdatePayload,
  MatrixNodeUpdatePayload,
  CollabCursorPayload,
  CollabSelectionPayload,
  CollabPresencePayload,
  ProgressUpdatePayload,
  ProgressMilestonePayload,
  ProgressAchievementPayload,
} from '../../types/websocket';
import type { MatrixNode } from '../../types/matrix';

// ============================================================================
// Base WebSocket Hook
// ============================================================================

interface UseWebSocketOptions {
  autoConnect?: boolean;
  onConnect?: () => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { autoConnect = true, onConnect } = options;
  const store = useWebSocketStore();
  const hasConnected = useRef(false);

  useEffect(() => {
    if (autoConnect && !hasConnected.current) {
      hasConnected.current = true;
      
      // Get token from localStorage
      const token = localStorage.getItem('apex-session');
      if (token && !store.isConnected && !store.isConnecting) {
        store.connect(token);
      }
    }

    return () => {
      // Don't disconnect on unmount to maintain connection across navigation
    };
  }, [autoConnect]);

  // Connection status effects
  useEffect(() => {
    if (store.isConnected && onConnect) {
      onConnect();
    }
  }, [store.isConnected, onConnect]);

  const send = useCallback(<T>(type: WebSocketMessageType, payload: T) => {
    store.send(type, payload);
  }, [store]);

  const subscribe = useCallback(<T>(type: WebSocketMessageType, handler: (payload: T) => void) => {
    return wsClient.on(type, (msg) => handler(msg.payload as T));
  }, []);

  return {
    isConnected: store.isConnected,
    isConnecting: store.isConnecting,
    connectionStatus: store.connectionStatus,
    mobileState: store.mobileState,
    send,
    subscribe,
    connect: store.connect,
    disconnect: store.disconnect,
  };
}

// ============================================================================
// Terminal WebSocket Hook
// ============================================================================

interface UseTerminalWebSocketOptions {
  nodeId?: string;
  onOutput?: (output: TerminalOutputPayload) => void;
  onStatusChange?: (status: TerminalStatusPayload) => void;
}

export function useTerminalWebSocket(options: UseTerminalWebSocketOptions = {}) {
  const { nodeId, onOutput, onStatusChange } = options;
  const { send, subscribe, isConnected } = useWebSocket();
  const [status, setStatus] = useState<TerminalStatusPayload['status']>('idle');

  // Subscribe to terminal updates
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    if (onOutput) {
      unsubs.push(subscribe('terminal:output', onOutput));
    }

    unsubs.push(subscribe('terminal:status', (payload: TerminalStatusPayload) => {
      setStatus(payload.status);
      onStatusChange?.(payload);
    }));

    return () => unsubs.forEach(unsub => unsub());
  }, [subscribe, onOutput, onStatusChange]);

  const sendCommand = useCallback((command: string) => {
    const commandId = crypto.randomUUID();
    
    send('terminal:command', {
      content: command,
      commandId,
      nodeId,
    });

    return commandId;
  }, [send, nodeId]);

  const sendInput = useCallback((input: string) => {
    send('terminal:input', {
      content: input,
      commandId: crypto.randomUUID(),
      nodeId,
    });
  }, [send, nodeId]);

  return {
    sendCommand,
    sendInput,
    status,
    isConnected,
  };
}

// ============================================================================
// Agent WebSocket Hook
// ============================================================================

interface UseAgentWebSocketOptions {
  agentId?: string;
  onMessage?: (message: AgentMessagePayload) => void;
  onStatusChange?: (status: AgentStatusPayload) => void;
  onTypingChange?: (typing: AgentTypingPayload) => void;
}

export function useAgentWebSocket(options: UseAgentWebSocketOptions = {}) {
  const { agentId, onMessage, onStatusChange, onTypingChange } = options;
  const { send, subscribe, isConnected } = useWebSocket();
  const [messages, setMessages] = useState<AgentMessagePayload[]>([]);
  const [status, setStatus] = useState<AgentStatusPayload['status']>('idle');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const unsubs: (() => void)[] = [];

    if (onMessage) {
      unsubs.push(subscribe('agent:message', onMessage));
    }

    unsubs.push(subscribe('agent:message', (payload: AgentMessagePayload) => {
      setMessages(prev => [...prev, payload]);
    }));

    unsubs.push(subscribe('agent:status', (payload: AgentStatusPayload) => {
      if (!agentId || payload.agentId === agentId) {
        setStatus(payload.status);
        onStatusChange?.(payload);
      }
    }));

    unsubs.push(subscribe('agent:typing', (payload: AgentTypingPayload) => {
      if (!agentId || payload.agentId === agentId) {
        setIsTyping(payload.isTyping);
        onTypingChange?.(payload);
      }
    }));

    return () => unsubs.forEach(unsub => unsub());
  }, [subscribe, agentId, onMessage, onStatusChange, onTypingChange]);

  const sendMessage = useCallback((content: string, targetAgentId?: string) => {
    const targetId = targetAgentId || agentId;
    if (!targetId) {
      throw new Error('Agent ID required');
    }

    const messageId = crypto.randomUUID();
    
    send('agent:message', {
      agentId: targetId,
      agentName: targetId, // Will be resolved server-side
      content,
      type: 'text',
      timestamp: Date.now(),
      messageId,
    });

    return messageId;
  }, [send, agentId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    status,
    isTyping,
    sendMessage,
    clearMessages,
    isConnected,
  };
}

// ============================================================================
// Matrix WebSocket Hook
// ============================================================================

interface UseMatrixWebSocketOptions {
  onSync?: (sync: MatrixSyncPayload) => void;
  onUpdate?: (update: MatrixUpdatePayload) => void;
  onNodeUpdate?: (update: MatrixNodeUpdatePayload) => void;
  autoSync?: boolean;
}

export function useMatrixWebSocket(options: UseMatrixWebSocketOptions = {}) {
  const { onSync, onUpdate, onNodeUpdate, autoSync = true } = options;
  const { send, subscribe, isConnected } = useWebSocket();
  const [matrixState, setMatrixState] = useState<MatrixSyncPayload | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsubs: (() => void)[] = [];

    unsubs.push(subscribe('matrix:sync', (payload: MatrixSyncPayload) => {
      setMatrixState(payload);
      setIsSyncing(false);
      onSync?.(payload);
    }));

    unsubs.push(subscribe('matrix:update', (payload: MatrixUpdatePayload) => {
      onUpdate?.(payload);
    }));

    unsubs.push(subscribe('matrix:node:update', (payload: MatrixNodeUpdatePayload) => {
      setMatrixState(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          nodes: prev.nodes.map((node: MatrixNode) => 
            node.id === payload.nodeId 
              ? { ...node, data: { ...node.data, ...payload.updates } }
              : node
          ),
        };
      });
      onNodeUpdate?.(payload);
    }));

    return () => unsubs.forEach(unsub => unsub());
  }, [subscribe, onSync, onUpdate, onNodeUpdate]);

  // Auto-sync on connect
  useEffect(() => {
    if (autoSync && isConnected && !matrixState) {
      sync();
    }
  }, [autoSync, isConnected, matrixState]);

  const sync = useCallback(() => {
    setIsSyncing(true);
    send('matrix:sync', { timestamp: Date.now() });
  }, [send]);

  const updateNode = useCallback((nodeId: string, updates: Record<string, unknown>) => {
    send('matrix:node:update', {
      nodeId,
      updates,
      timestamp: Date.now(),
    });
  }, [send]);

  return {
    matrixState,
    isSyncing,
    sync,
    updateNode,
    isConnected,
  };
}

// ============================================================================
// Collaboration WebSocket Hook
// ============================================================================

interface UseCollabWebSocketOptions {
  roomId?: string;
  userName?: string;
  userColor?: string;
  onCursorMove?: (cursor: CollabCursorPayload) => void;
  onSelectionChange?: (selection: CollabSelectionPayload) => void;
  onPresenceChange?: (presence: CollabPresencePayload[]) => void;
}

export function useCollabWebSocket(options: UseCollabWebSocketOptions = {}) {
  const { 
    roomId, 
    userName = 'Anonymous', 
    userColor = '#3b82f6',
    onCursorMove, 
    onSelectionChange, 
    onPresenceChange 
  } = options;
  const { send, subscribe, isConnected } = useWebSocket();
  const [presence, setPresence] = useState<CollabPresencePayload[]>([]);
  const [cursors, setCursors] = useState<Record<string, CollabCursorPayload>>({});
  const throttleTimer = useRef<number | null>(null);

  useEffect(() => {
    const unsubs: (() => void)[] = [];

    unsubs.push(subscribe('collab:cursor', (payload: CollabCursorPayload) => {
      setCursors(prev => ({ ...prev, [payload.userId]: payload }));
      onCursorMove?.(payload);
    }));

    unsubs.push(subscribe('collab:selection', (payload: CollabSelectionPayload) => {
      onSelectionChange?.(payload);
    }));

    unsubs.push(subscribe('collab:presence', (payload: CollabPresencePayload) => {
      setPresence(prev => {
        const filtered = prev.filter(p => p.userId !== payload.userId);
        if (payload.status !== 'offline') {
          return [...filtered, payload];
        }
        return filtered;
      });
      onPresenceChange?.(presence);
    }));

    // Subscribe to room
    if (roomId) {
      send('subscribe:collab', { roomId });
    }

    return () => {
      unsubs.forEach(unsub => unsub());
      if (roomId) {
        send('unsubscribe', { room: `collab:${roomId}` });
      }
    };
  }, [subscribe, roomId, onCursorMove, onSelectionChange, onPresenceChange]);

  const updateCursor = useCallback((x: number, y: number, nodeId?: string) => {
    // Throttle cursor updates
    if (throttleTimer.current) return;

    throttleTimer.current = window.setTimeout(() => {
      throttleTimer.current = null;
    }, 50);

    send('collab:cursor', {
      x,
      y,
      nodeId,
      userName,
      userColor,
    });
  }, [send, userName, userColor]);

  const updateSelection = useCallback((nodeIds: string[], edgeIds?: string[]) => {
    send('collab:selection', {
      nodeIds,
      edgeIds,
      userName,
      userColor,
    });
  }, [send, userName, userColor]);

  const updatePresence = useCallback((status: 'online' | 'away' | 'offline') => {
    send('collab:presence', {
      status,
      lastSeen: Date.now(),
    });
  }, [send]);

  return {
    presence,
    cursors,
    updateCursor,
    updateSelection,
    updatePresence,
    isConnected,
  };
}

// ============================================================================
// Progress WebSocket Hook
// ============================================================================

interface UseProgressWebSocketOptions {
  onUpdate?: (update: ProgressUpdatePayload) => void;
  onMilestone?: (milestone: ProgressMilestonePayload) => void;
  onAchievement?: (achievement: ProgressAchievementPayload) => void;
}

export function useProgressWebSocket(options: UseProgressWebSocketOptions = {}) {
  const { onUpdate, onMilestone, onAchievement } = options;
  const { send, subscribe } = useWebSocket();
  const [progress, setProgress] = useState<Record<string, ProgressUpdatePayload>>({});

  useEffect(() => {
    const unsubs: (() => void)[] = [];

    unsubs.push(subscribe('progress:update', (payload: ProgressUpdatePayload) => {
      setProgress(prev => ({
        ...prev,
        [payload.moduleId]: payload,
      }));
      onUpdate?.(payload);
    }));

    unsubs.push(subscribe('progress:milestone', (payload: ProgressMilestonePayload) => {
      onMilestone?.(payload);
    }));

    unsubs.push(subscribe('progress:achievement', (payload: ProgressAchievementPayload) => {
      onAchievement?.(payload);
    }));

    return () => unsubs.forEach(unsub => unsub());
  }, [subscribe, onUpdate, onMilestone, onAchievement]);

  const updateProgress = useCallback((
    moduleId: string, 
    progress: number, 
    completedTasks: number, 
    totalTasks: number,
    lessonId?: string
  ) => {
    send('progress:update', {
      moduleId,
      lessonId,
      progress,
      completedTasks,
      totalTasks,
    });
  }, [send]);

  return {
    progress,
    updateProgress,
  };
}

// ============================================================================
// Combined Hook for All Features
// ============================================================================

export function useApexWebSocket() {
  const terminal = useTerminalWebSocket();
  const agent = useAgentWebSocket();
  const matrix = useMatrixWebSocket();
  const collab = useCollabWebSocket();
  const progress = useProgressWebSocket();
  const { isConnected, connectionStatus, mobileState } = useWebSocket();

  return {
    terminal,
    agent,
    matrix,
    collab,
    progress,
    isConnected,
    connectionStatus,
    mobileState,
  };
}
