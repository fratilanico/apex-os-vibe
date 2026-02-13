/**
 * WebSocket Types - Type definitions for APEX OS Academy WebSocket system
 * 
 * @description Real-time communication types for terminal updates, agent communication,
 * matrix synchronization, collaborative features, and progress tracking
 */

// ============================================================================
// WebSocket Message Types
// ============================================================================

export type WebSocketMessageType = 
  // Terminal
  | 'terminal:output'
  | 'terminal:input'
  | 'terminal:command'
  | 'terminal:status'
  // Agent
  | 'agent:message'
  | 'agent:status'
  | 'agent:typing'
  | 'agent:complete'
  | 'agent:error'
  // Matrix
  | 'matrix:sync'
  | 'matrix:update'
  | 'matrix:node:update'
  | 'matrix:edge:update'
  // Collaboration
  | 'collab:cursor'
  | 'collab:selection'
  | 'collab:edit'
  | 'collab:presence'
  // Progress
  | 'progress:update'
  | 'progress:milestone'
  | 'progress:achievement'
  // System
  | 'system:ping'
  | 'system:pong'
  | 'system:reconnect'
  | 'system:auth'
  | 'system:error'
  | 'system:batch'
  | 'system:disconnect'
  // Subscription
  | 'subscribe:terminal'
  | 'subscribe:agent'
  | 'subscribe:matrix'
  | 'subscribe:collab'
  | 'unsubscribe';

// ============================================================================
// Base Message Structure
// ============================================================================

export interface WebSocketMessage<T = unknown> {
  type: WebSocketMessageType;
  payload: T;
  timestamp: number;
  id: string;
  userId?: string;
  sessionId?: string;
}

// ============================================================================
// Terminal Messages
// ============================================================================

export interface TerminalOutputPayload {
  content: string;
  type: 'output' | 'error' | 'success' | 'system' | 'header';
  nodeId?: string;
  commandId?: string;
  metadata?: Record<string, unknown>;
}

export interface TerminalInputPayload {
  content: string;
  commandId: string;
  nodeId?: string;
}

export interface TerminalStatusPayload {
  status: 'idle' | 'processing' | 'error' | 'completed';
  progress?: number;
  commandId?: string;
}

// ============================================================================
// Agent Messages
// ============================================================================

export interface AgentMessagePayload {
  agentId: string;
  agentName: string;
  content: string;
  type: 'text' | 'code' | 'image' | 'file';
  timestamp: number;
  messageId: string;
  parentMessageId?: string;
  metadata?: {
    model?: string;
    tokens?: number;
    latency?: number;
  };
}

export interface AgentStatusPayload {
  agentId: string;
  status: 'idle' | 'typing' | 'processing' | 'error' | 'offline';
  progress?: number;
  currentTask?: string;
}

export interface AgentTypingPayload {
  agentId: string;
  isTyping: boolean;
}

// ============================================================================
// Matrix Messages
// ============================================================================

import type { MatrixNode, MatrixEdge } from './matrix';

export interface MatrixSyncPayload {
  nodes: MatrixNode[];
  edges: MatrixEdge[];
  activeNodeId: string | null;
  version: number;
}

export interface MatrixUpdatePayload {
  type: 'node:add' | 'node:update' | 'node:remove' | 'edge:add' | 'edge:remove';
  data: MatrixNode | MatrixEdge | { id: string };
}

export interface MatrixNodeUpdatePayload {
  nodeId: string;
  updates: Partial<MatrixNode['data']>;
  source?: string; // User ID who made the change
}

// ============================================================================
// Collaboration Messages
// ============================================================================

export interface CollabCursorPayload {
  userId: string;
  userName: string;
  userColor: string;
  x: number;
  y: number;
  nodeId?: string;
}

export interface CollabSelectionPayload {
  userId: string;
  userName: string;
  userColor: string;
  nodeIds: string[];
  edgeIds?: string[];
}

export interface CollabEditPayload {
  userId: string;
  userName: string;
  operation: 'add' | 'update' | 'delete';
  target: 'node' | 'edge' | 'terminal';
  data: unknown;
  timestamp: number;
}

export interface CollabPresencePayload {
  userId: string;
  userName: string;
  userColor: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: number;
  currentNodeId?: string;
}

// ============================================================================
// Progress Messages
// ============================================================================

export interface ProgressUpdatePayload {
  userId: string;
  moduleId: string;
  lessonId?: string;
  progress: number; // 0-100
  completedTasks: number;
  totalTasks: number;
}

export interface ProgressMilestonePayload {
  userId: string;
  milestoneId: string;
  milestoneName: string;
  moduleId: string;
  completedAt: number;
  xpAwarded: number;
}

export interface ProgressAchievementPayload {
  userId: string;
  achievementId: string;
  achievementName: string;
  description: string;
  icon?: string;
  unlockedAt: number;
  xpAwarded: number;
}

// ============================================================================
// System Messages
// ============================================================================

export interface SystemPingPayload {
  timestamp: number;
  clientTime: number;
}

export interface SystemPongPayload {
  timestamp: number;
  serverTime: number;
  latency: number;
}

export interface SystemReconnectPayload {
  reason: string;
  attempt: number;
  maxAttempts: number;
  retryDelay: number;
}

export interface SystemAuthPayload {
  token: string;
  userId: string;
  sessionId: string;
}

export interface SystemErrorPayload {
  code: string;
  message: string;
  details?: unknown;
  recoverable: boolean;
}

// ============================================================================
// Connection State
// ============================================================================

export type WebSocketConnectionState = 
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'error';

export interface WebSocketConnectionStatus {
  state: WebSocketConnectionState;
  connectedAt?: number;
  lastPingAt?: number;
  latency: number;
  reconnectAttempts: number;
  error?: string;
}

// ============================================================================
// Mobile Optimizations
// ============================================================================

export interface MobileState {
  isVisible: boolean;
  isOnline: boolean;
  batteryLevel?: number;
  isCharging?: boolean;
  connectionType?: 'wifi' | '4g' | '3g' | '2g' | 'slow-2g' | 'unknown';
  saveData: boolean;
}

export interface BatchedMessage {
  messages: WebSocketMessage[];
  batchId: string;
  timestamp: number;
  priority: 'high' | 'normal' | 'low';
}

// ============================================================================
// Message Routing
// ============================================================================

export interface MessageRoute {
  type: WebSocketMessageType;
  handler: string; // Handler function name or path
  auth: boolean; // Whether authentication is required
  rateLimit?: number; // Messages per second
  broadcast?: boolean; // Whether to broadcast to other clients
}

export const MESSAGE_ROUTES: MessageRoute[] = [
  // Terminal routes
  { type: 'terminal:output', handler: 'handleTerminalOutput', auth: true, broadcast: false },
  { type: 'terminal:input', handler: 'handleTerminalInput', auth: true, rateLimit: 10 },
  { type: 'terminal:command', handler: 'handleTerminalCommand', auth: true, rateLimit: 5 },
  { type: 'terminal:status', handler: 'handleTerminalStatus', auth: true, broadcast: true },
  
  // Agent routes
  { type: 'agent:message', handler: 'handleAgentMessage', auth: true, broadcast: false },
  { type: 'agent:status', handler: 'handleAgentStatus', auth: true, broadcast: true },
  { type: 'agent:typing', handler: 'handleAgentTyping', auth: true, broadcast: true },
  { type: 'agent:complete', handler: 'handleAgentComplete', auth: true, broadcast: false },
  { type: 'agent:error', handler: 'handleAgentError', auth: true, broadcast: false },
  
  // Matrix routes
  { type: 'matrix:sync', handler: 'handleMatrixSync', auth: true, broadcast: false },
  { type: 'matrix:update', handler: 'handleMatrixUpdate', auth: true, broadcast: true },
  { type: 'matrix:node:update', handler: 'handleMatrixNodeUpdate', auth: true, broadcast: true },
  { type: 'matrix:edge:update', handler: 'handleMatrixEdgeUpdate', auth: true, broadcast: true },
  
  // Collaboration routes
  { type: 'collab:cursor', handler: 'handleCollabCursor', auth: true, rateLimit: 30, broadcast: true },
  { type: 'collab:selection', handler: 'handleCollabSelection', auth: true, broadcast: true },
  { type: 'collab:edit', handler: 'handleCollabEdit', auth: true, broadcast: true },
  { type: 'collab:presence', handler: 'handleCollabPresence', auth: true, broadcast: true },
  
  // Progress routes
  { type: 'progress:update', handler: 'handleProgressUpdate', auth: true, broadcast: false },
  { type: 'progress:milestone', handler: 'handleProgressMilestone', auth: true, broadcast: true },
  { type: 'progress:achievement', handler: 'handleProgressAchievement', auth: true, broadcast: true },
  
  // System routes
  { type: 'system:ping', handler: 'handlePing', auth: false },
  { type: 'system:pong', handler: 'handlePong', auth: false },
  { type: 'system:reconnect', handler: 'handleReconnect', auth: true },
  { type: 'system:auth', handler: 'handleAuth', auth: false },
  { type: 'system:error', handler: 'handleError', auth: false },
];
