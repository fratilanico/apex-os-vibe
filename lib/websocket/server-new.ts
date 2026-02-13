/**
 * WebSocket Server - Server-side WebSocket implementation for APEX OS Academy
 * 
 * @description Real-time server with features including:
 * - Socket.io-based WebSocket server
 * - JWT authentication middleware
 * - Message routing system
 * - Room-based broadcasting
 * - Rate limiting
 * - Mobile optimizations
 * - Supabase real-time integration
 */

import { WebSocketServer, WebSocket } from 'ws';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { IncomingMessage, Server as HTTPServer } from 'http';
import type { Socket } from 'net';
import jwt from 'jsonwebtoken';
import type {
  WebSocketMessage,
  WebSocketMessageType,
  MessageRoute,
  MESSAGE_ROUTES,
  SystemPingPayload,
  SystemPongPayload,
  SystemAuthPayload,
  SystemErrorPayload,
  BatchedMessage,
  TerminalOutputPayload,
  TerminalInputPayload,
  AgentMessagePayload,
  AgentStatusPayload,
  MatrixSyncPayload,
  MatrixUpdatePayload,
  MatrixNodeUpdatePayload,
  CollabCursorPayload,
  CollabPresencePayload,
  ProgressUpdatePayload,
} from '../types/websocket';

// Re-export routes from types
export { MESSAGE_ROUTES } from '../types/websocket';

// ============================================================================
// Configuration
// ============================================================================

const WS_CONFIG = {
  HEARTBEAT_INTERVAL: 30000,
  HEARTBEAT_TIMEOUT: 60000,
  RATE_LIMIT_WINDOW: 60000, // 1 minute
  RATE_LIMIT_MAX: 100, // messages per window
  BATCH_INTERVAL: 100,
  MAX_BATCH_SIZE: 50,
} as const;

// ============================================================================
// Client Connection
// ============================================================================

interface WebSocketClient {
  id: string;
  userId: string;
  sessionId: string;
  tier: string;
  socket: WebSocket;
  rooms: Set<string>;
  lastActivity: number;
  messageCount: number;
  rateLimitReset: number;
  isAuthenticated: boolean;
  metadata: Record<string, unknown>;
}

// ============================================================================
// Server State
// ============================================================================

class WebSocketServerManager {
  private wss: WebSocketServer | null = null;
  private clients = new Map<string, WebSocketClient>();
  private rooms = new Map<string, Set<string>>(); // room -> client IDs
  private supabase: SupabaseClient;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private messageHandlers = new Map<WebSocketMessageType, Function>();

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
    this.registerHandlers();
  }

  // ========================================================================
  // Server Initialization
  // ========================================================================

  public initialize(server: HTTPServer): WebSocketServer {
    this.wss = new WebSocketServer({
      server,
      path: '/ws',
      perMessageDeflate: {
        zlibDeflateOptions: {
          chunkSize: 1024,
          memLevel: 7,
          level: 3,
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024,
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
      },
    });

    this.wss.on('connection', this.handleConnection.bind(this));
    this.startHeartbeat();

    console.log('[WebSocket] Server initialized on /ws');
    return this.wss;
  }

  // ========================================================================
  // Connection Handling
  // ========================================================================

  private async handleConnection(ws: WebSocket, req: IncomingMessage): Promise<void> {
    const clientId = this.generateClientId();
    
    console.log(`[WebSocket] New connection: ${clientId}`);

    // Extract token from URL query params
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    const client: WebSocketClient = {
      id: clientId,
      userId: '',
      sessionId: '',
      tier: 'free',
      socket: ws,
      rooms: new Set(),
      lastActivity: Date.now(),
      messageCount: 0,
      rateLimitReset: Date.now() + WS_CONFIG.RATE_LIMIT_WINDOW,
      isAuthenticated: false,
      metadata: {},
    };

    this.clients.set(clientId, client);

    // Set up message handler
    ws.on('message', (data) => this.handleMessage(clientId, data));
    ws.on('close', () => this.handleDisconnect(clientId));
    ws.on('error', (error) => this.handleError(clientId, error));
    ws.on('pong', () => this.handlePong(clientId));

    // Authenticate if token provided
    if (token) {
      await this.authenticateClient(clientId, token);
    } else {
      // Allow connection but limit functionality until authenticated
      this.sendToClient(clientId, {
        type: 'system:error',
        payload: {
          code: 'AUTH_REQUIRED',
          message: 'Authentication required for full functionality',
          recoverable: true,
        } as SystemErrorPayload,
        timestamp: Date.now(),
        id: this.generateMessageId(),
      });
    }
  }

  // ========================================================================
  // Authentication
  // ========================================================================

  private async authenticateClient(clientId: string, token: string): Promise<boolean> {
    const client = this.clients.get(clientId);
    if (!client) return false;

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        sessionId: string;
      };

      // Get user info from Supabase
      const { data: user, error } = await this.supabase
        .from('users')
        .select('id, email, tier')
        .eq('id', decoded.userId)
        .single();

      if (error || !user) {
        throw new Error('User not found');
      }

      // Update client
      client.userId = user.id;
      client.sessionId = decoded.sessionId;
      client.tier = user.tier || 'free';
      client.isAuthenticated = true;

      // Join user-specific room
      this.joinRoom(clientId, `user:${user.id}`);

      // Send auth success
      this.sendToClient(clientId, {
        type: 'system:auth',
        payload: {
          token,
          userId: user.id,
          sessionId: decoded.sessionId,
        } as SystemAuthPayload,
        timestamp: Date.now(),
        id: this.generateMessageId(),
      });

      console.log(`[WebSocket] Client authenticated: ${clientId} (user: ${user.id})`);
      return true;

    } catch (error) {
      console.error(`[WebSocket] Authentication failed for ${clientId}:`, error);
      
      this.sendToClient(clientId, {
        type: 'system:error',
        payload: {
          code: 'AUTH_FAILED',
          message: 'Authentication failed',
          recoverable: false,
        } as SystemErrorPayload,
        timestamp: Date.now(),
        id: this.generateMessageId(),
      });

      // Close connection after a short delay
      setTimeout(() => {
        client.socket.close(1008, 'Authentication failed');
      }, 1000);

      return false;
    }
  }

  // ========================================================================
  // Message Handling
  // ========================================================================

  private async handleMessage(clientId: string, data: WebSocket.RawData): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Update activity
    client.lastActivity = Date.now();

    // Rate limiting
    if (!this.checkRateLimit(client)) {
      this.sendToClient(clientId, {
        type: 'system:error',
        payload: {
          code: 'RATE_LIMITED',
          message: 'Rate limit exceeded. Please slow down.',
          recoverable: true,
        } as SystemErrorPayload,
        timestamp: Date.now(),
        id: this.generateMessageId(),
      });
      return;
    }

    try {
      const message: WebSocketMessage = JSON.parse(data.toString());
      
      // Handle system:auth message for late authentication
      if (message.type === 'system:auth' && !client.isAuthenticated) {
        const payload = message.payload as SystemAuthPayload;
        await this.authenticateClient(clientId, payload.token);
        return;
      }

      // Check authentication for protected routes
      const route = MESSAGE_ROUTES.find(r => r.type === message.type);
      if (route?.auth && !client.isAuthenticated) {
        this.sendToClient(clientId, {
          type: 'system:error',
          payload: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
            recoverable: true,
          } as SystemErrorPayload,
          timestamp: Date.now(),
          id: this.generateMessageId(),
        });
        return;
      }

      // Handle batch messages
      if (message.type === 'system:batch') {
        await this.handleBatchMessage(clientId, message.payload as BatchedMessage);
        return;
      }

      // Route to handler
      await this.routeMessage(clientId, message);

    } catch (error) {
      console.error(`[WebSocket] Message handling error for ${clientId}:`, error);
      this.sendToClient(clientId, {
        type: 'system:error',
        payload: {
          code: 'INVALID_MESSAGE',
          message: 'Invalid message format',
          recoverable: true,
        } as SystemErrorPayload,
        timestamp: Date.now(),
        id: this.generateMessageId(),
      });
    }
  }

  private async handleBatchMessage(clientId: string, batch: BatchedMessage): Promise<void> {
    // Process batch based on priority
    const sortedMessages = [...batch.messages].sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      return priorityOrder[a.priority || 'normal'] - priorityOrder[b.priority || 'normal'];
    });

    for (const message of sortedMessages.slice(0, WS_CONFIG.MAX_BATCH_SIZE)) {
      await this.routeMessage(clientId, message);
    }
  }

  private async routeMessage(clientId: string, message: WebSocketMessage): Promise<void> {
    const handler = this.messageHandlers.get(message.type);
    
    if (handler) {
      try {
        await handler(clientId, message);
      } catch (error) {
        console.error(`[WebSocket] Handler error for ${message.type}:`, error);
        this.sendToClient(clientId, {
          type: 'system:error',
          payload: {
            code: 'HANDLER_ERROR',
            message: 'Failed to process message',
            recoverable: true,
          } as SystemErrorPayload,
          timestamp: Date.now(),
          id: this.generateMessageId(),
        });
      }
    } else {
      // No handler registered, broadcast if needed
      const route = MESSAGE_ROUTES.find(r => r.type === message.type);
      if (route?.broadcast) {
        this.broadcastToRoom(`user:${this.clients.get(clientId)?.userId}`, message, [clientId]);
      }
    }
  }

  // ========================================================================
  // Message Handlers
  // ========================================================================

  private registerHandlers(): void {
    // System handlers
    this.messageHandlers.set('system:ping', this.handlePing.bind(this));
    this.messageHandlers.set('system:disconnect', this.handleDisconnectMessage.bind(this));
    
    // Terminal handlers
    this.messageHandlers.set('terminal:command', this.handleTerminalCommand.bind(this));
    this.messageHandlers.set('terminal:input', this.handleTerminalInput.bind(this));
    
    // Agent handlers
    this.messageHandlers.set('agent:message', this.handleAgentMessage.bind(this));
    this.messageHandlers.set('agent:status', this.handleAgentStatus.bind(this));
    
    // Matrix handlers
    this.messageHandlers.set('matrix:sync', this.handleMatrixSync.bind(this));
    this.messageHandlers.set('matrix:node:update', this.handleMatrixNodeUpdate.bind(this));
    
    // Collaboration handlers
    this.messageHandlers.set('collab:cursor', this.handleCollabCursor.bind(this));
    this.messageHandlers.set('collab:presence', this.handleCollabPresence.bind(this));
    
    // Progress handlers
    this.messageHandlers.set('progress:update', this.handleProgressUpdate.bind(this));
    
    // Subscription handlers
    this.messageHandlers.set('subscribe:terminal', this.handleSubscribe.bind(this));
    this.messageHandlers.set('subscribe:agent', this.handleSubscribe.bind(this));
    this.messageHandlers.set('subscribe:matrix', this.handleSubscribe.bind(this));
    this.messageHandlers.set('subscribe:collab', this.handleSubscribe.bind(this));
    this.messageHandlers.set('unsubscribe', this.handleUnsubscribe.bind(this));
  }

  private async handlePing(clientId: string, message: WebSocketMessage): Promise<void> {
    const payload = message.payload as SystemPingPayload;
    
    this.sendToClient(clientId, {
      type: 'system:pong',
      payload: {
        timestamp: Date.now(),
        serverTime: Date.now(),
        latency: Date.now() - payload.clientTime,
      } as SystemPongPayload,
      timestamp: Date.now(),
      id: this.generateMessageId(),
    });
  }

  private async handleDisconnectMessage(clientId: string): Promise<void> {
    this.handleDisconnect(clientId);
  }

  private async handleTerminalCommand(clientId: string, message: WebSocketMessage): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    const payload = message.payload as TerminalInputPayload;
    
    // Broadcast command to other clients in the same session (collaborative)
    this.broadcastToRoom(`user:${client.userId}`, {
      type: 'terminal:status',
      payload: {
        status: 'processing',
        commandId: payload.commandId,
      },
      timestamp: Date.now(),
      id: this.generateMessageId(),
    }, [clientId]);

    // Process command (integrate with terminal service)
    try {
      // TODO: Integrate with actual terminal processing service
      const output: TerminalOutputPayload = {
        content: `Processed: ${payload.content}`,
        type: 'output',
        commandId: payload.commandId,
      };

      this.sendToClient(clientId, {
        type: 'terminal:output',
        payload: output,
        timestamp: Date.now(),
        id: this.generateMessageId(),
      });

      // Broadcast completion
      this.broadcastToRoom(`user:${client.userId}`, {
        type: 'terminal:status',
        payload: {
          status: 'completed',
          commandId: payload.commandId,
        },
        timestamp: Date.now(),
        id: this.generateMessageId(),
      }, [clientId]);

    } catch (error) {
      this.sendToClient(clientId, {
        type: 'terminal:output',
        payload: {
          content: error instanceof Error ? error.message : 'Command failed',
          type: 'error',
          commandId: payload.commandId,
        } as TerminalOutputPayload,
        timestamp: Date.now(),
        id: this.generateMessageId(),
      });
    }
  }

  private async handleTerminalInput(clientId: string, message: WebSocketMessage): Promise<void> {
    // Handle real-time typing indicators
    const client = this.clients.get(clientId);
    if (!client) return;

    // Broadcast typing status to collaborators
    this.broadcastToRoom(`collab:${client.userId}`, {
      type: 'terminal:status',
      payload: { status: 'typing' },
      timestamp: Date.now(),
      id: this.generateMessageId(),
    }, [clientId]);
  }

  private async handleAgentMessage(clientId: string, message: WebSocketMessage): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    const payload = message.payload as AgentMessagePayload;
    
    // Broadcast agent typing status
    this.broadcastToRoom(`user:${client.userId}`, {
      type: 'agent:typing',
      payload: { agentId: payload.agentId, isTyping: true },
      timestamp: Date.now(),
      id: this.generateMessageId(),
    });

    // TODO: Integrate with agent service
    // For now, echo back with processing
    setTimeout(() => {
      this.sendToClient(clientId, {
        type: 'agent:message',
        payload: {
          ...payload,
          content: `[Agent ${payload.agentId} response placeholder]`,
          timestamp: Date.now(),
        } as AgentMessagePayload,
        timestamp: Date.now(),
        id: this.generateMessageId(),
      });

      this.broadcastToRoom(`user:${client.userId}`, {
        type: 'agent:typing',
        payload: { agentId: payload.agentId, isTyping: false },
        timestamp: Date.now(),
        id: this.generateMessageId(),
      });
    }, 1000);
  }

  private async handleAgentStatus(clientId: string, message: WebSocketMessage): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    const payload = message.payload as AgentStatusPayload;
    
    // Broadcast agent status to all user's clients
    this.broadcastToRoom(`user:${client.userId}`, {
      type: 'agent:status',
      payload,
      timestamp: Date.now(),
      id: this.generateMessageId(),
    }, [clientId]);
  }

  private async handleMatrixSync(clientId: string, message: WebSocketMessage): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    // TODO: Fetch current matrix state from database
    const syncPayload: MatrixSyncPayload = {
      nodes: [],
      edges: [],
      activeNodeId: null,
      version: 1,
    };

    this.sendToClient(clientId, {
      type: 'matrix:sync',
      payload: syncPayload,
      timestamp: Date.now(),
      id: this.generateMessageId(),
    });
  }

  private async handleMatrixNodeUpdate(clientId: string, message: WebSocketMessage): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    const payload = message.payload as MatrixNodeUpdatePayload;
    
    // Broadcast update to all collaborators
    this.broadcastToRoom(`collab:${client.userId}`, {
      type: 'matrix:node:update',
      payload: {
        ...payload,
        source: client.userId,
      },
      timestamp: Date.now(),
      id: this.generateMessageId(),
      userId: client.userId,
    }, [clientId]);
  }

  private async handleCollabCursor(clientId: string, message: WebSocketMessage): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    const payload = message.payload as CollabCursorPayload;
    
    // Add user info
    const cursorPayload: CollabCursorPayload = {
      ...payload,
      userId: client.userId,
      userName: client.metadata.userName as string || 'Anonymous',
      userColor: client.metadata.userColor as string || '#3b82f6',
    };

    // Broadcast to collaborators (throttled)
    this.broadcastToRoom(`collab:${client.userId}`, {
      type: 'collab:cursor',
      payload: cursorPayload,
      timestamp: Date.now(),
      id: this.generateMessageId(),
    }, [clientId]);
  }

  private async handleCollabPresence(clientId: string, message: WebSocketMessage): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    const payload = message.payload as { status: string; lastSeen: number };
    
    const presencePayload: CollabPresencePayload = {
      userId: client.userId,
      userName: client.metadata.userName as string || 'Anonymous',
      userColor: client.metadata.userColor as string || '#3b82f6',
      status: payload.status as 'online' | 'away' | 'offline',
      lastSeen: payload.lastSeen,
    };

    this.broadcastToRoom(`collab:${client.userId}`, {
      type: 'collab:presence',
      payload: presencePayload,
      timestamp: Date.now(),
      id: this.generateMessageId(),
    }, [clientId]);
  }

  private async handleProgressUpdate(clientId: string, message: WebSocketMessage): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    const payload = message.payload as ProgressUpdatePayload;
    
    // Update in database
    await this.supabase
      .from('user_progress')
      .upsert({
        user_id: client.userId,
        module_id: payload.moduleId,
        lesson_id: payload.lessonId,
        progress: payload.progress,
        completed_tasks: payload.completedTasks,
        total_tasks: payload.totalTasks,
        updated_at: new Date().toISOString(),
      });

    // Broadcast to user's other devices
    this.broadcastToRoom(`user:${client.userId}`, {
      type: 'progress:update',
      payload: {
        ...payload,
        userId: client.userId,
      },
      timestamp: Date.now(),
      id: this.generateMessageId(),
    }, [clientId]);
  }

  private async handleSubscribe(clientId: string, message: WebSocketMessage): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    const roomType = message.type.split(':')[1]; // terminal, agent, matrix, collab
    const roomId = `${roomType}:${client.userId}`;
    
    this.joinRoom(clientId, roomId);
    
    console.log(`[WebSocket] ${clientId} subscribed to ${roomId}`);
  }

  private async handleUnsubscribe(clientId: string, message: WebSocketMessage): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    const { room } = message.payload as { room: string };
    this.leaveRoom(clientId, room);
  }

  // ========================================================================
  // Room Management
  // ========================================================================

  private joinRoom(clientId: string, roomId: string): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.rooms.add(roomId);
    
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)!.add(clientId);
  }

  private leaveRoom(clientId: string, roomId: string): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.rooms.delete(roomId);
    this.rooms.get(roomId)?.delete(clientId);
    
    // Clean up empty rooms
    if (this.rooms.get(roomId)?.size === 0) {
      this.rooms.delete(roomId);
    }
  }

  private broadcastToRoom(roomId: string, message: WebSocketMessage, excludeClientIds: string[] = []): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const messageStr = JSON.stringify(message);
    
    room.forEach(clientId => {
      if (excludeClientIds.includes(clientId)) return;
      
      const client = this.clients.get(clientId);
      if (client?.socket.readyState === WebSocket.OPEN) {
        client.socket.send(messageStr);
      }
    });
  }

  private sendToClient(clientId: string, message: WebSocketMessage): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    if (client.socket.readyState === WebSocket.OPEN) {
      client.socket.send(JSON.stringify(message));
    }
  }

  // ========================================================================
  // Disconnection & Cleanup
  // ========================================================================

  private handleDisconnect(clientId: string): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    console.log(`[WebSocket] Client disconnected: ${clientId}`);

    // Leave all rooms
    client.rooms.forEach(roomId => {
      this.leaveRoom(clientId, roomId);
    });

    // Notify collaborators of presence change
    if (client.isAuthenticated) {
      this.broadcastToRoom(`collab:${client.userId}`, {
        type: 'collab:presence',
        payload: {
          userId: client.userId,
          userName: client.metadata.userName as string || 'Anonymous',
          userColor: client.metadata.userColor as string || '#3b82f6',
          status: 'offline',
          lastSeen: Date.now(),
        } as CollabPresencePayload,
        timestamp: Date.now(),
        id: this.generateMessageId(),
      }, [clientId]);
    }

    // Close socket if not already closed
    if (client.socket.readyState !== WebSocket.CLOSED) {
      client.socket.close();
    }

    this.clients.delete(clientId);
  }

  private handleError(clientId: string, error: Error): void {
    console.error(`[WebSocket] Error for client ${clientId}:`, error);
  }

  private handlePong(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.lastActivity = Date.now();
    }
  }

  // ========================================================================
  // Heartbeat
  // ========================================================================

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now();
      
      this.clients.forEach((client, clientId) => {
        // Check if client is still alive
        if (now - client.lastActivity > WS_CONFIG.HEARTBEAT_TIMEOUT) {
          console.log(`[WebSocket] Client timeout: ${clientId}`);
          client.socket.terminate();
          this.handleDisconnect(clientId);
          return;
        }

        // Send ping
        if (client.socket.readyState === WebSocket.OPEN) {
          client.socket.ping();
        }
      });
    }, WS_CONFIG.HEARTBEAT_INTERVAL);
  }

  // ========================================================================
  // Rate Limiting
  // ========================================================================

  private checkRateLimit(client: WebSocketClient): boolean {
    const now = Date.now();
    
    // Reset counter if window has passed
    if (now > client.rateLimitReset) {
      client.messageCount = 0;
      client.rateLimitReset = now + WS_CONFIG.RATE_LIMIT_WINDOW;
    }

    // Check limit
    if (client.messageCount >= WS_CONFIG.RATE_LIMIT_MAX) {
      return false;
    }

    client.messageCount++;
    return true;
  }

  // ========================================================================
  // Utility
  // ========================================================================

  private generateClientId(): string {
    return `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ========================================================================
  // Public API
  // ========================================================================

  public broadcastToUser(userId: string, message: WebSocketMessage): void {
    this.broadcastToRoom(`user:${userId}`, message);
  }

  public broadcastToAll(message: WebSocketMessage): void {
    const messageStr = JSON.stringify(message);
    
    this.clients.forEach(client => {
      if (client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(messageStr);
      }
    });
  }

  public getStats(): { clients: number; rooms: number } {
    return {
      clients: this.clients.size,
      rooms: this.rooms.size,
    };
  }

  public shutdown(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Close all connections
    this.clients.forEach((client, clientId) => {
      client.socket.close(1001, 'Server shutting down');
    });

    this.wss?.close();
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

export const wsServer = new WebSocketServerManager();

// ============================================================================
// Express/Vercel Integration
// ============================================================================

export function createWebSocketHandler(server: HTTPServer): WebSocketServer {
  return wsServer.initialize(server);
}

// Helper for Vercel serverless functions
export function getWebSocketStats(): { clients: number; rooms: number } {
  return wsServer.getStats();
}
