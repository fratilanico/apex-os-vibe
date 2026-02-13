/**
 * WebSocket Client - Client-side WebSocket connection manager for APEX OS Academy
 * 
 * @description Handles real-time communication with features including:
 * - Automatic reconnection with exponential backoff
 * - Message batching for mobile optimization
 * - Authentication over WebSocket
 * - Background/foreground state handling
 * - Battery and network-aware optimizations
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  WebSocketMessage,
  WebSocketMessageType,
  WebSocketConnectionState,
  WebSocketConnectionStatus,
  MobileState,
  BatchedMessage,
  SystemPingPayload,
  SystemPongPayload,
  SystemAuthPayload,
  SystemErrorPayload,
  TerminalOutputPayload,
  AgentMessagePayload,
  AgentStatusPayload,
  MatrixSyncPayload,
  MatrixUpdatePayload,
  CollabPresencePayload,
  ProgressUpdatePayload,
} from '../types/websocket';

// ============================================================================
// Configuration
// ============================================================================

const WS_CONFIG = {
  RECONNECT_BASE_DELAY: 1000,
  RECONNECT_MAX_DELAY: 30000,
  RECONNECT_MAX_ATTEMPTS: 10,
  PING_INTERVAL: 30000,
  PONG_TIMEOUT: 10000,
  MESSAGE_BATCH_SIZE: 10,
  MESSAGE_BATCH_INTERVAL: 100,
  MOBILE_BATCH_INTERVAL: 500,
  IDLE_TIMEOUT: 300000, // 5 minutes
} as const;

// ============================================================================
// Message Handlers Registry
// ============================================================================

type MessageHandler<T = unknown> = (message: WebSocketMessage<T>) => void;

interface HandlerRegistry {
  [key: string]: MessageHandler[];
}

// ============================================================================
// WebSocket Store State
// ============================================================================

interface WebSocketStore {
  // Connection state
  connectionStatus: WebSocketConnectionStatus;
  isConnected: boolean;
  isConnecting: boolean;
  
  // Mobile state
  mobileState: MobileState;
  
  // Message queue for offline support
  messageQueue: WebSocketMessage[];
  
  // Actions
  connect: (token: string) => void;
  disconnect: () => void;
  send: <T>(type: WebSocketMessageType, payload: T) => void;
  sendBatch: (messages: WebSocketMessage[]) => void;
  updateMobileState: (state: Partial<MobileState>) => void;
  clearMessageQueue: () => void;
}

// ============================================================================
// WebSocket Client Class
// ============================================================================

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: number | null = null;
  private pingTimer: number | null = null;
  private pongTimer: number | null = null;
  private messageBatch: WebSocketMessage[] = [];
  private batchTimer: number | null = null;
  private handlers: HandlerRegistry = {};
  private lastActivity = Date.now();
  private isBackground = false;
  private sessionId: string | null = null;
  
  // Store reference for state updates
  private store: ReturnType<typeof useWebSocketStore> | null = null;

  constructor(url: string) {
    this.url = url;
    this.setupMobileListeners();
  }

  // ========================================================================
  // Connection Management
  // ========================================================================

  public connect(token: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] Already connected');
      return;
    }

    this.token = token;
    this.updateConnectionState('connecting');

    try {
      // Include token in connection URL for authentication
      const authUrl = `${this.url}?token=${encodeURIComponent(token)}`;
      this.ws = new WebSocket(authUrl);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      this.scheduleReconnect();
    }
  }

  public disconnect(): void {
    this.clearTimers();
    
    if (this.ws) {
      // Send disconnect message
      if (this.ws.readyState === WebSocket.OPEN) {
        this.send('system:disconnect', { reason: 'client_disconnect' });
      }
      
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    this.token = null;
    this.sessionId = null;
    this.reconnectAttempts = 0;
    this.updateConnectionState('disconnected');
  }

  // ========================================================================
  // Event Handlers
  // ========================================================================

  private handleOpen(): void {
    console.log('[WebSocket] Connected');
    this.reconnectAttempts = 0;
    this.updateConnectionState('connected');
    this.startPingInterval();
    this.flushMessageQueue();
    
    // Send authentication message
    if (this.token) {
      this.send('system:auth', { token: this.token } as SystemAuthPayload);
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log(`[WebSocket] Disconnected: ${event.code} - ${event.reason}`);
    this.updateConnectionState('disconnected');
    
    // Don't reconnect if it was a clean close
    if (event.code === 1000 || event.code === 1001) {
      return;
    }

    this.scheduleReconnect();
  }

  private handleError(error: Event): void {
    console.error('[WebSocket] Error:', error);
    this.updateConnectionState('error', 'WebSocket error occurred');
  }

  private handleMessage(event: MessageEvent): void {
    this.lastActivity = Date.now();
    
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      this.processMessage(message);
    } catch (error) {
      console.error('[WebSocket] Failed to parse message:', error);
    }
  }

  // ========================================================================
  // Message Processing
  // ========================================================================

  private processMessage(message: WebSocketMessage): void {
    // Handle system messages
    switch (message.type) {
      case 'system:pong':
        this.handlePong(message.payload as SystemPongPayload);
        return;
      case 'system:auth':
        this.handleAuthResponse(message.payload as SystemAuthPayload);
        return;
      case 'system:error':
        this.handleSystemError(message.payload as SystemErrorPayload);
        return;
      case 'system:reconnect':
        this.handleReconnectRequest(message.payload);
        return;
    }

    // Dispatch to registered handlers
    const handlers = this.handlers[message.type] || [];
    handlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error(`[WebSocket] Handler error for ${message.type}:`, error);
      }
    });

    // Update store with message for specific types
    this.updateStoreFromMessage(message);
  }

  private handlePong(payload: SystemPongPayload): void {
    if (this.pongTimer) {
      clearTimeout(this.pongTimer);
      this.pongTimer = null;
    }
    
    const latency = Date.now() - payload.clientTime;
    this.updateLatency(latency);
  }

  private handleAuthResponse(payload: SystemAuthPayload): void {
    this.sessionId = payload.sessionId;
    console.log('[WebSocket] Authenticated, session:', payload.sessionId);
  }

  private handleSystemError(payload: SystemErrorPayload): void {
    console.error('[WebSocket] System error:', payload);
    
    if (!payload.recoverable) {
      this.disconnect();
    }
  }

  private handleReconnectRequest(payload: unknown): void {
    console.log('[WebSocket] Server requested reconnect');
    this.disconnect();
    setTimeout(() => {
      if (this.token) {
        this.connect(this.token);
      }
    }, 1000);
  }

  // ========================================================================
  // Message Sending
  // ========================================================================

  public send<T>(type: WebSocketMessageType, payload: T): void {
    const message: WebSocketMessage<T> = {
      type,
      payload,
      timestamp: Date.now(),
      id: crypto.randomUUID(),
      sessionId: this.sessionId || undefined,
    };

    // Check if we should batch this message
    if (this.shouldBatchMessage(type)) {
      this.queueMessage(message);
    } else {
      this.sendImmediate(message);
    }
  }

  private sendImmediate<T>(message: WebSocketMessage<T>): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue for later if not connected
      this.queueMessage(message);
    }
  }

  private queueMessage(message: WebSocketMessage): void {
    this.messageBatch.push(message);
    
    if (!this.batchTimer) {
      const interval = this.isMobile() 
        ? WS_CONFIG.MOBILE_BATCH_INTERVAL 
        : WS_CONFIG.MESSAGE_BATCH_INTERVAL;
      
      this.batchTimer = window.setTimeout(() => {
        this.flushBatch();
      }, interval);
    }

    // Flush immediately if batch is full
    if (this.messageBatch.length >= WS_CONFIG.MESSAGE_BATCH_SIZE) {
      this.flushBatch();
    }
  }

  private flushBatch(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    if (this.messageBatch.length === 0) return;

    const batch: BatchedMessage = {
      messages: [...this.messageBatch],
      batchId: crypto.randomUUID(),
      timestamp: Date.now(),
      priority: this.calculateBatchPriority(),
    };

    this.messageBatch = [];

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'system:batch',
        payload: batch,
        timestamp: Date.now(),
        id: crypto.randomUUID(),
      }));
    } else {
      // Store in persistent queue for offline support
      this.storeQueuedMessages(batch.messages);
    }
  }

  private flushMessageQueue(): void {
    // Send any queued messages from previous sessions
    const queue = this.getQueuedMessages();
    if (queue.length > 0) {
      queue.forEach(msg => this.sendImmediate(msg));
      this.clearQueuedMessages();
    }
  }

  // ========================================================================
  // Message Batching Logic
  // ========================================================================

  private shouldBatchMessage(type: WebSocketMessageType): boolean {
    // Don't batch critical messages
    const noBatchTypes: WebSocketMessageType[] = [
      'system:auth',
      'system:ping',
      'system:pong',
      'terminal:command',
      'agent:message',
    ];
    
    if (noBatchTypes.includes(type)) return false;
    
    // Always batch on mobile with slow connections
    if (this.isMobile() && this.isSlowConnection()) return true;
    
    // Batch non-critical updates
    const batchTypes: WebSocketMessageType[] = [
      'collab:cursor',
      'matrix:sync',
      'progress:update',
    ];
    
    return batchTypes.includes(type);
  }

  private calculateBatchPriority(): 'high' | 'normal' | 'low' {
    const hasCritical = this.messageBatch.some(msg => 
      msg.type === 'terminal:command' || msg.type === 'agent:message'
    );
    
    if (hasCritical) return 'high';
    if (this.isBackground) return 'low';
    return 'normal';
  }

  // ========================================================================
  // Reconnection Logic
  // ========================================================================

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= WS_CONFIG.RECONNECT_MAX_ATTEMPTS) {
      console.error('[WebSocket] Max reconnection attempts reached');
      this.updateConnectionState('error', 'Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    this.updateConnectionState('reconnecting');

    // Exponential backoff with jitter
    const delay = Math.min(
      WS_CONFIG.RECONNECT_BASE_DELAY * Math.pow(2, this.reconnectAttempts - 1),
      WS_CONFIG.RECONNECT_MAX_DELAY
    );
    const jitter = Math.random() * 1000;
    const totalDelay = delay + jitter;

    console.log(`[WebSocket] Reconnecting in ${totalDelay}ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimer = window.setTimeout(() => {
      if (this.token) {
        this.connect(this.token);
      }
    }, totalDelay);
  }

  // ========================================================================
  // Ping/Pong Heartbeat
  // ========================================================================

  private startPingInterval(): void {
    this.pingTimer = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        const pingPayload: SystemPingPayload = {
          timestamp: Date.now(),
          clientTime: Date.now(),
        };
        
        this.send('system:ping', pingPayload);
        
        // Set timeout for pong response
        this.pongTimer = window.setTimeout(() => {
          console.warn('[WebSocket] Pong timeout, reconnecting...');
          this.ws?.close();
        }, WS_CONFIG.PONG_TIMEOUT);
      }
    }, WS_CONFIG.PING_INTERVAL);
  }

  // ========================================================================
  // Mobile & Battery Optimizations
  // ========================================================================

  private setupMobileListeners(): void {
    // Page visibility
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        this.isBackground = document.hidden;
        
        if (document.hidden) {
          // Flush any pending messages before going to background
          this.flushBatch();
        } else {
          // Reconnect if we've been idle too long
          const idleTime = Date.now() - this.lastActivity;
          if (idleTime > WS_CONFIG.IDLE_TIMEOUT && this.token) {
            this.disconnect();
            this.connect(this.token);
          }
        }
      });
    }

    // Online/offline
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('[WebSocket] Network online');
        if (this.token && this.ws?.readyState !== WebSocket.OPEN) {
          this.connect(this.token);
        }
      });

      window.addEventListener('offline', () => {
        console.log('[WebSocket] Network offline');
        this.updateConnectionState('disconnected', 'Network offline');
      });
    }

    // Battery status (if available)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        this.updateMobileState({
          batteryLevel: battery.level,
          isCharging: battery.charging,
        });

        battery.addEventListener('levelchange', () => {
          this.updateMobileState({ batteryLevel: battery.level });
        });

        battery.addEventListener('chargingchange', () => {
          this.updateMobileState({ isCharging: battery.charging });
        });
      });
    }

    // Connection type (if available)
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        this.updateMobileState({
          connectionType: connection.effectiveType,
          saveData: connection.saveData,
        });

        connection.addEventListener('change', () => {
          this.updateMobileState({
            connectionType: connection.effectiveType,
            saveData: connection.saveData,
          });
        });
      }
    }
  }

  private isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  private isSlowConnection(): boolean {
    const connection = (navigator as any).connection;
    if (!connection) return false;
    
    return ['2g', 'slow-2g'].includes(connection.effectiveType) || connection.saveData;
  }

  // ========================================================================
  // Handler Registration
  // ========================================================================

  public on<T>(type: WebSocketMessageType, handler: MessageHandler<T>): () => void {
    if (!this.handlers[type]) {
      this.handlers[type] = [];
    }
    
    this.handlers[type].push(handler as MessageHandler);
    
    // Return unsubscribe function
    return () => {
      const index = this.handlers[type].indexOf(handler as MessageHandler);
      if (index > -1) {
        this.handlers[type].splice(index, 1);
      }
    };
  }

  public off(type: WebSocketMessageType, handler: MessageHandler): void {
    if (!this.handlers[type]) return;
    
    const index = this.handlers[type].indexOf(handler);
    if (index > -1) {
      this.handlers[type].splice(index, 1);
    }
  }

  // ========================================================================
  // Store Integration
  // ========================================================================

  public setStore(store: ReturnType<typeof useWebSocketStore>): void {
    this.store = store;
  }

  private updateConnectionState(state: WebSocketConnectionState, error?: string): void {
    if (this.store) {
      this.store.updateConnectionStatus({
        state,
        error,
        connectedAt: state === 'connected' ? Date.now() : undefined,
      });
    }
  }

  private updateLatency(latency: number): void {
    if (this.store) {
      this.store.updateConnectionStatus({ latency });
    }
  }

  private updateMobileState(state: Partial<MobileState>): void {
    if (this.store) {
      this.store.updateMobileState(state);
    }
  }

  private updateStoreFromMessage(message: WebSocketMessage): void {
    // This will be implemented based on specific store requirements
    // For now, we dispatch to handlers which can update stores
  }

  // ========================================================================
  // Queue Management (for offline support)
  // ========================================================================

  private storeQueuedMessages(messages: WebSocketMessage[]): void {
    const existing = this.getQueuedMessages();
    const combined = [...existing, ...messages];
    
    // Limit queue size
    const limited = combined.slice(-100);
    
    try {
      localStorage.setItem('apex-ws-queue', JSON.stringify(limited));
    } catch (e) {
      console.warn('[WebSocket] Failed to store message queue:', e);
    }
  }

  private getQueuedMessages(): WebSocketMessage[] {
    try {
      const stored = localStorage.getItem('apex-ws-queue');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  private clearQueuedMessages(): void {
    try {
      localStorage.removeItem('apex-ws-queue');
    } catch (e) {
      console.warn('[WebSocket] Failed to clear message queue:', e);
    }
  }

  // ========================================================================
  // Cleanup
  // ========================================================================

  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
    if (this.pongTimer) {
      clearTimeout(this.pongTimer);
      this.pongTimer = null;
    }
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
  }
}

// ============================================================================
// Zustand Store
// ============================================================================

export const useWebSocketStore = create<WebSocketStore>()(
  persist(
    (set, get) => ({
      // Initial state
      connectionStatus: {
        state: 'disconnected',
        latency: 0,
        reconnectAttempts: 0,
      },
      isConnected: false,
      isConnecting: false,
      mobileState: {
        isVisible: true,
        isOnline: true,
        saveData: false,
      },
      messageQueue: [],

      // Actions
      connect: (token: string) => {
        set({ isConnecting: true });
        wsClient.connect(token);
      },

      disconnect: () => {
        wsClient.disconnect();
        set({ isConnected: false, isConnecting: false });
      },

      send: <T>(type: WebSocketMessageType, payload: T) => {
        wsClient.send(type, payload);
      },

      sendBatch: (messages: WebSocketMessage[]) => {
        messages.forEach(msg => wsClient.send(msg.type, msg.payload));
      },

      updateMobileState: (state: Partial<MobileState>) => {
        set((prev) => ({
          mobileState: { ...prev.mobileState, ...state },
        }));
      },

      clearMessageQueue: () => {
        set({ messageQueue: [] });
      },

      // Internal methods (exposed for client)
      updateConnectionStatus: (status: Partial<WebSocketConnectionStatus>) => {
        set((prev) => ({
          connectionStatus: { ...prev.connectionStatus, ...status },
          isConnected: status.state === 'connected' || prev.connectionStatus.state === 'connected',
          isConnecting: status.state === 'connecting',
        }));
      },
    }),
    {
      name: 'apex-websocket-storage',
      version: 1,
      partialize: (state) => ({
        messageQueue: state.messageQueue,
      }),
    }
  )
);

// ============================================================================
// Singleton Instance
// ============================================================================

const wsUrl = import.meta.env.VITE_WS_URL || 'wss://apex-os.vercel.app/ws';
export const wsClient = new WebSocketClient(wsUrl);

// Set store reference
wsClient.setStore(useWebSocketStore.getState() as any);

// ============================================================================
// React Hook
// ============================================================================

import { useEffect, useCallback } from 'react';

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  autoConnect?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { onMessage, onConnect, onDisconnect, onError, autoConnect = true } = options;
  const store = useWebSocketStore();

  useEffect(() => {
    if (autoConnect && !store.isConnected && !store.isConnecting) {
      const token = localStorage.getItem('apex-session');
      if (token) {
        store.connect(token);
      }
    }

    return () => {
      if (store.isConnected) {
        store.disconnect();
      }
    };
  }, [autoConnect]);

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    if (onMessage) {
      // Subscribe to all messages
      const unsub = wsClient.on('system:batch', (msg) => {
        const batch = msg.payload as BatchedMessage;
        batch.messages.forEach(onMessage);
      });
      unsubscribers.push(unsub);
    }

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [onMessage]);

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
// Specialized Hooks
// ============================================================================

export function useTerminalWebSocket() {
  const { send, subscribe, isConnected } = useWebSocket();

  const sendCommand = useCallback((command: string, nodeId?: string) => {
    send('terminal:command', { content: command, nodeId });
  }, [send]);

  const onOutput = useCallback((handler: (payload: TerminalOutputPayload) => void) => {
    return subscribe('terminal:output', handler);
  }, [subscribe]);

  const onStatus = useCallback((handler: (payload: { status: string; progress?: number }) => void) => {
    return subscribe('terminal:status', handler);
  }, [subscribe]);

  return { sendCommand, onOutput, onStatus, isConnected };
}

export function useAgentWebSocket() {
  const { send, subscribe, isConnected } = useWebSocket();

  const sendMessage = useCallback((agentId: string, content: string) => {
    send('agent:message', { agentId, content, timestamp: Date.now() });
  }, [send]);

  const onMessage = useCallback((handler: (payload: AgentMessagePayload) => void) => {
    return subscribe('agent:message', handler);
  }, [subscribe]);

  const onStatus = useCallback((handler: (payload: AgentStatusPayload) => void) => {
    return subscribe('agent:status', handler);
  }, [subscribe]);

  return { sendMessage, onMessage, onStatus, isConnected };
}

export function useMatrixWebSocket() {
  const { send, subscribe, isConnected } = useWebSocket();

  const sync = useCallback(() => {
    send('matrix:sync', { timestamp: Date.now() });
  }, [send]);

  const updateNode = useCallback((nodeId: string, updates: Record<string, unknown>) => {
    send('matrix:node:update', { nodeId, updates });
  }, [send]);

  const onSync = useCallback((handler: (payload: MatrixSyncPayload) => void) => {
    return subscribe('matrix:sync', handler);
  }, [subscribe]);

  const onUpdate = useCallback((handler: (payload: MatrixUpdatePayload) => void) => {
    return subscribe('matrix:update', handler);
  }, [subscribe]);

  return { sync, updateNode, onSync, onUpdate, isConnected };
}

export function useCollabWebSocket() {
  const { send, subscribe, isConnected } = useWebSocket();

  const updateCursor = useCallback((x: number, y: number, nodeId?: string) => {
    send('collab:cursor', { x, y, nodeId });
  }, [send]);

  const updatePresence = useCallback((status: 'online' | 'away' | 'offline') => {
    send('collab:presence', { status, lastSeen: Date.now() });
  }, [send]);

  const onPresence = useCallback((handler: (payload: CollabPresencePayload[]) => void) => {
    return subscribe('collab:presence', handler);
  }, [subscribe]);

  return { updateCursor, updatePresence, onPresence, isConnected };
}

export function useProgressWebSocket() {
  const { subscribe } = useWebSocket();

  const onUpdate = useCallback((handler: (payload: ProgressUpdatePayload) => void) => {
    return subscribe('progress:update', handler);
  }, [subscribe]);

  return { onUpdate };
}
