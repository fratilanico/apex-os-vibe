/**
 * WebSocket Utilities - Helper functions for WebSocket operations
 */

import type { WebSocketMessage, WebSocketMessageType } from '../../types/websocket';

/**
 * Generate unique message ID
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate unique client ID
 */
export function generateClientId(): string {
  return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a WebSocket message
 */
export function createMessage<T>(
  type: WebSocketMessageType,
  payload: T,
  options: { userId?: string; sessionId?: string } = {}
): WebSocketMessage<T> {
  return {
    type,
    payload,
    timestamp: Date.now(),
    id: generateMessageId(),
    ...options,
  };
}

/**
 * Validate WebSocket message
 */
export function isValidMessage(data: unknown): data is WebSocketMessage {
  if (typeof data !== 'object' || data === null) return false;
  
  const msg = data as WebSocketMessage;
  return (
    typeof msg.type === 'string' &&
    typeof msg.timestamp === 'number' &&
    typeof msg.id === 'string'
  );
}

/**
 * Throttle function for high-frequency events (like cursor movement)
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Debounce function for input events
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Serialize message for storage
 */
export function serializeMessage(message: WebSocketMessage): string {
  return JSON.stringify(message);
}

/**
 * Deserialize message from storage
 */
export function deserializeMessage(data: string): WebSocketMessage | null {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Compress messages for batch sending
 */
export function compressMessages(messages: WebSocketMessage[]): string {
  // Simple compression - remove redundant fields
  const compressed = messages.map(msg => ({
    t: msg.type,
    p: msg.payload,
    ts: msg.timestamp,
    id: msg.id,
  }));
  
  return JSON.stringify(compressed);
}

/**
 * Calculate message priority based on type
 */
export function getMessagePriority(type: WebSocketMessageType): 'high' | 'normal' | 'low' {
  const highPriority: WebSocketMessageType[] = [
    'system:auth',
    'system:ping',
    'system:pong',
    'terminal:command',
    'agent:message',
  ];
  
  const lowPriority: WebSocketMessageType[] = [
    'collab:cursor',
    'matrix:sync',
    'progress:update',
  ];
  
  if (highPriority.includes(type)) return 'high';
  if (lowPriority.includes(type)) return 'low';
  return 'normal';
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) break;
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Queue manager for offline support
 */
export class MessageQueue {
  private queue: WebSocketMessage[] = [];
  private maxSize: number;
  private storageKey: string;

  constructor(maxSize: number = 100, storageKey: string = 'apex-ws-queue') {
    this.maxSize = maxSize;
    this.storageKey = storageKey;
    this.loadFromStorage();
  }

  enqueue(message: WebSocketMessage): void {
    this.queue.push(message);
    
    // Trim to max size
    if (this.queue.length > this.maxSize) {
      this.queue = this.queue.slice(-this.maxSize);
    }
    
    this.saveToStorage();
  }

  dequeue(): WebSocketMessage | undefined {
    const message = this.queue.shift();
    this.saveToStorage();
    return message;
  }

  peek(): WebSocketMessage | undefined {
    return this.queue[0];
  }

  getAll(): WebSocketMessage[] {
    return [...this.queue];
  }

  clear(): void {
    this.queue = [];
    this.saveToStorage();
  }

  get size(): number {
    return this.queue.length;
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
    } catch (e) {
      console.warn('[MessageQueue] Failed to save to storage:', e);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('[MessageQueue] Failed to load from storage:', e);
    }
  }
}
