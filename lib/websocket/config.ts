/**
 * WebSocket Configuration - Environment and feature flags
 */

export const WS_CONFIG = {
  // Connection settings
  URL: process.env.VITE_WS_URL || 'wss://apex-os.vercel.app/ws',
  RECONNECT_BASE_DELAY: 1000,
  RECONNECT_MAX_DELAY: 30000,
  RECONNECT_MAX_ATTEMPTS: 10,
  
  // Heartbeat
  PING_INTERVAL: 30000,
  PONG_TIMEOUT: 10000,
  
  // Batching
  MESSAGE_BATCH_SIZE: 10,
  MESSAGE_BATCH_INTERVAL: 100,
  MOBILE_BATCH_INTERVAL: 500,
  
  // Mobile optimizations
  IDLE_TIMEOUT: 300000, // 5 minutes
  BACKGROUND_PING_INTERVAL: 60000, // 1 minute when in background
  
  // Rate limiting (client-side)
  RATE_LIMIT_WINDOW: 60000,
  RATE_LIMIT_MAX: 100,
  
  // Feature flags
  FEATURES: {
    TERMINAL_REALTIME: true,
    AGENT_LIVE_CHAT: true,
    MATRIX_SYNC: true,
    COLLAB_CURSOR: true,
    PROGRESS_LIVE: true,
    OFFLINE_QUEUE: true,
    MOBILE_OPTIMIZATIONS: true,
  },
} as const;

// Mobile detection
export function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// Connection type detection
export function getConnectionType(): 'wifi' | '4g' | '3g' | '2g' | 'slow-2g' | 'unknown' {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const connection = (navigator as any).connection;
  if (!connection) return 'unknown';
  
  return connection.effectiveType || 'unknown';
}

// Check if connection is slow
export function isSlowConnection(): boolean {
  const type = getConnectionType();
  return ['2g', 'slow-2g'].includes(type);
}

// Check if data saver is enabled
export function isDataSaverEnabled(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  const connection = (navigator as any).connection;
  return connection?.saveData || false;
}
