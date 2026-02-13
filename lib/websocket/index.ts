/**
 * WebSocket Module - APEX OS Academy Real-time Communication
 * 
 * @description Comprehensive WebSocket implementation providing:
 * - Real-time terminal updates
 * - Live agent communication
 * - Matrix synchronization
 * - Collaborative features
 * - Progress tracking
 * 
 * @example
 * ```typescript
 * import { useWebSocket, useTerminalWebSocket, useAgentWebSocket } from './lib/websocket';
 * 
 * // Basic connection
 * const { isConnected, send } = useWebSocket();
 * 
 * // Terminal updates
 * const { sendCommand, onOutput } = useTerminalWebSocket();
 * 
 * // Agent communication
 * const { sendMessage, messages } = useAgentWebSocket({ agentId: 'claude' });
 * ```
 */

// Client
export { wsClient, useWebSocketStore, useWebSocket } from './client';

// Hooks
export {
  useTerminalWebSocket,
  useAgentWebSocket,
  useMatrixWebSocket,
  useCollabWebSocket,
  useProgressWebSocket,
  useApexWebSocket,
} from './hooks';

// Utilities
export {
  generateMessageId,
  generateClientId,
  createMessage,
  isValidMessage,
  throttle,
  debounce,
  MessageQueue,
} from './utils';

// Configuration
export {
  WS_CONFIG,
  isMobile,
  getConnectionType,
  isSlowConnection,
  isDataSaverEnabled,
} from './config';

// Types (re-exported for convenience)
export type {
  WebSocketMessage,
  WebSocketMessageType,
  WebSocketConnectionState,
  WebSocketConnectionStatus,
  TerminalOutputPayload,
  TerminalInputPayload,
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
