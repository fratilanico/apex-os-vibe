// APEX OS WebSocket Server
// Real-time updates for Agent Swarm and Second Brain
// Following AGENTS.md Agent Swarm Architecture

import { Server as SocketServer } from 'socket.io';
import { createClient } from '@supabase/supabase-js';
import type { Server as HTTPServer } from 'http';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

interface WebSocketClient {
  userId: string;
  tier: string;
  socket: any;
  subscriptions: Set<string>;
}

const clients = new Map<string, WebSocketClient>();

export function initializeWebSocket(server: HTTPServer) {
  const io = new SocketServer(server, {
    cors: {
      origin: process.env.APP_URL || 'https://apex-os.vercel.app',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/ws',
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return next(new Error('Invalid token'));
      }

      // Get user tier
      const { data: quota } = await supabase
        .from('user_quotas')
        .select('tier')
        .eq('user_id', user.id)
        .single();

      socket.data.userId = user.id;
      socket.data.tier = quota?.tier || 'free';
      
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId;
    const tier = socket.data.tier;

    console.log(`[WebSocket] Client connected: ${userId} (${tier})`);

    // Store client
    clients.set(socket.id, {
      userId,
      tier,
      socket,
      subscriptions: new Set(),
    });

    // Subscribe to real-time updates
    subscribeToUpdates(socket, userId);

    // Handle agent status subscription
    socket.on('subscribe:agents', () => {
      socket.join(`agents:${userId}`);
      console.log(`[WebSocket] ${userId} subscribed to agent updates`);
    });

    // Handle workflow updates subscription
    socket.on('subscribe:workflows', () => {
      socket.join(`workflows:${userId}`);
      console.log(`[WebSocket] ${userId} subscribed to workflow updates`);
    });

    // Handle quota updates subscription
    socket.on('subscribe:quota', () => {
      socket.join(`quota:${userId}`);
      console.log(`[WebSocket] ${userId} subscribed to quota updates`);
    });

    // Handle memory updates subscription
    socket.on('subscribe:memory', () => {
      socket.join(`memory:${userId}`);
      console.log(`[WebSocket] ${userId} subscribed to memory updates`);
    });

    // Handle agent invocation from dashboard
    socket.on('agent:invoke', async (data) => {
      try {
        const { agentId, prompt, context } = data;
        
        // Broadcast invocation start
        io.to(`agents:${userId}`).emit('agent:invoking', {
          agentId,
          timestamp: new Date().toISOString(),
        });

        // TODO: Call actual agent service
        // For now, simulate response
        setTimeout(() => {
          io.to(`agents:${userId}`).emit('agent:response', {
            agentId,
            response: `[Agent ${agentId} would process: ${prompt}]`,
            creditsUsed: 5,
            timestamp: new Date().toISOString(),
          });
        }, 2000);

      } catch (error) {
        socket.emit('agent:error', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`[WebSocket] Client disconnected: ${userId}`);
      clients.delete(socket.id);
    });
  });

  // Set up Supabase real-time subscriptions
  setupRealtimeSubscriptions(io);

  return io;
}

function subscribeToUpdates(socket: any, userId: string) {
  // Subscribe to agent status changes
  const agentChannel = supabase
    .channel(`agent-status-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_agent_usage',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        socket.emit('agent:update', payload.new);
      }
    )
    .subscribe();

  // Subscribe to file changes
  const fileChannel = supabase
    .channel(`files-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'files',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        socket.emit('memory:new', {
          type: 'file',
          data: payload.new,
        });
      }
    )
    .subscribe();

  // Subscribe to analytics events
  const analyticsChannel = supabase
    .channel(`analytics-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'analytics_events',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        socket.emit('activity:new', payload.new);
      }
    )
    .subscribe();

  // Subscribe to quota changes
  const quotaChannel = supabase
    .channel(`quota-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_quotas',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        socket.emit('quota:update', payload.new);
      }
    )
    .subscribe();

  // Cleanup on disconnect
  socket.on('disconnect', () => {
    supabase.removeChannel(agentChannel);
    supabase.removeChannel(fileChannel);
    supabase.removeChannel(analyticsChannel);
    supabase.removeChannel(quotaChannel);
  });
}

function setupRealtimeSubscriptions(io: SocketServer) {
  // Broadcast system-wide updates
  setInterval(async () => {
    // Check for system health changes
    const { data: healthIssues } = await supabase
      .from('system_health')
      .select('*')
      .neq('status', 'healthy')
      .limit(10);

    if (healthIssues && healthIssues.length > 0) {
      io.emit('system:alert', {
        type: 'health',
        issues: healthIssues,
        timestamp: new Date().toISOString(),
      });
    }
  }, 30000); // Every 30 seconds
}

// Export broadcast functions for use in API routes
export function broadcastAgentUpdate(userId: string, data: any) {
  const io = global.io as SocketServer;
  if (io) {
    io.to(`agents:${userId}`).emit('agent:update', data);
  }
}

export function broadcastWorkflowUpdate(userId: string, data: any) {
  const io = global.io as SocketServer;
  if (io) {
    io.to(`workflows:${userId}`).emit('workflow:update', data);
  }
}

export function broadcastQuotaUpdate(userId: string, data: any) {
  const io = global.io as SocketServer;
  if (io) {
    io.to(`quota:${userId}`).emit('quota:update', data);
  }
}

export function broadcastMemoryUpdate(userId: string, data: any) {
  const io = global.io as SocketServer;
  if (io) {
    io.to(`memory:${userId}`).emit('memory:update', data);
  }
}
