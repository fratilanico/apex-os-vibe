/**
 * Matrix Types - Type definitions for the APEX OS Matrix system
 */

import type { LucideIcon } from 'lucide-react';

/**
 * Node status in the Matrix
 */
export type NodeStatus = 'locked' | 'discovered' | 'active' | 'completed' | 'remedial';

/**
 * Matrix node data structure
 */
export interface MatrixNode {
  id: string;
  type: 'oasis' | 'process' | 'file' | 'agent' | 'terminal' | 'challenge' | 'boss';
  position: { x: number; y: number };
  data: {
    id: string;
    label: string;
    type: string;
    status: NodeStatus;
    progress: number;
    icon?: LucideIcon;
    hidden_criteria?: string;
    description?: string;
  };
  selected?: boolean;
}

/**
 * Matrix edge (connection) structure
 */
export interface MatrixEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  label?: string;
}

/**
 * Director payload for graph mutations
 */
export interface DirectorPayload {
  newNodes: MatrixNode[];
  newEdges: MatrixEdge[];
  solvedNodeIds: string[];
  narrativeUpdate: {
    transmission: string;
    traceLevel: number;
  };
}
