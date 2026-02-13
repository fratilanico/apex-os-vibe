export type MemoryNodeStatus = 'synced' | 'indexing' | 'error';

export interface MemoryNode {
  id: string;
  type: 'file' | 'agent_output' | 'event' | 'concept' | 'code' | 'conversation';
  title: string;
  content: string;
  timestamp: number;
  tags: string[];
  status: MemoryNodeStatus;
  metadata?: Record<string, any>;
}

export interface MemoryEdge {
  id: string;
  source: string;
  target: string;
  type: 'relates_to' | 'references' | 'derived_from';
  strength: number;
}

export interface SecondBrainStats {
  totalNodes: number;
  totalEdges: number;
  totalConnections: number;
  byType: Record<string, number>;
  memoryTypes: Record<string, number>;
  lastSync: number;
  storageUsed: number;
}

export interface SecondBrainState {
  memoryGraph: {
    nodes: MemoryNode[];
    edges: MemoryEdge[];
  };
  summary: {
    totalNodes: number;
    totalEdges: number;
    lastIndexed: number;
    storageUsage: number;
  };
  stats: SecondBrainStats;
  isSyncing: boolean;
}
