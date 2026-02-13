import React from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: string;
  type: 'root' | 'branch' | 'trunk' | 'leaf';
}

interface Link {
  from: string;
  to: string;
}

const nodes: Node[] = [
  { id: 'founder', label: 'FOUNDER (80%)', x: 500, y: 60, color: '#06b6d4', type: 'root' },
  { id: 'advisor', label: 'ADVISOR (5%)', x: 300, y: 200, color: '#10b981', type: 'branch' },
  { id: 'investor', label: 'INVESTOR (15%)', x: 700, y: 200, color: '#10b981', type: 'branch' },
  { id: 'orchestrator', label: 'ORCHESTRATOR', x: 500, y: 350, color: '#06b6d4', type: 'trunk' },
  // Departments (Leaves)
  { id: 'infra', label: 'INFRA-ARCHITECT', x: 100, y: 600, type: 'leaf' },
  { id: 'security', label: 'SECURITY-MONITOR', x: 188, y: 630, type: 'leaf' },
  { id: 'compliance', label: 'COMPLIANCE-GUARDIAN', x: 277, y: 650, type: 'leaf' },
  { id: 'deployment', label: 'DEPLOY-AUTOMATION', x: 366, y: 660, type: 'leaf' },
  { id: 'incident', label: 'INCIDENT-RESPONSE', x: 455, y: 665, type: 'leaf' },
  { id: 'cost', label: 'COST-OPTIMIZER', x: 544, y: 665, type: 'leaf' },
  { id: 'intelligence', label: 'INTEL-ARCHITECT', x: 633, y: 660, type: 'leaf' },
  { id: 'brain', label: 'BRAIN-MONITOR', x: 722, y: 650, type: 'leaf' },
  { id: 'knowledge', label: 'KNOWLEDGE-MONITOR', x: 811, y: 630, type: 'leaf' },
  { id: 'curriculum', label: 'CURRICULUM-META', x: 900, y: 600, type: 'leaf' },
];

const links: Link[] = [
  { from: 'founder', to: 'advisor' },
  { from: 'founder', to: 'investor' },
  { from: 'founder', to: 'orchestrator' },
  { from: 'advisor', to: 'orchestrator' },
  { from: 'investor', to: 'orchestrator' },
  { from: 'orchestrator', to: 'infra' },
  { from: 'orchestrator', to: 'security' },
  { from: 'orchestrator', to: 'compliance' },
  { from: 'orchestrator', to: 'deployment' },
  { from: 'orchestrator', to: 'incident' },
  { from: 'orchestrator', to: 'cost' },
  { from: 'orchestrator', to: 'intelligence' },
  { from: 'orchestrator', to: 'brain' },
  { from: 'orchestrator', to: 'knowledge' },
  { from: 'orchestrator', to: 'curriculum' },
];

const Packet: React.FC<{ path: string, delay: number }> = ({ path, delay }) => (
  <motion.circle
    r="1.5"
    fill="#06b6d4"
    initial={{ opacity: 0 }}
    animate={{ 
      offsetDistance: ["0%", "100%"],
      opacity: [0, 1, 1, 0]
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      delay,
      ease: "linear",
      times: [0, 0.1, 0.9, 1]
    }}
    style={{
      offsetPath: `path('${path}')`,
    }}
    filter="drop-shadow(0 0 2px #06b6d4)"
  />
);

export const RecursiveTreeChart: React.FC = () => {
  const nodeMap = React.useMemo(() => {
    const map: Record<string, Node> = {};
    nodes.forEach(n => map[n.id] = n);
    return map;
  }, []);

  const getPath = (fromId: string, toId: string) => {
    const from = nodeMap[fromId];
    const to = nodeMap[toId];
    if (!from || !to) return '';
    if (to.type === 'leaf') {
      // Orthogonal branching for leaves
      return `M ${from.x} ${from.y} L ${from.x} 450 L ${to.x} 450 L ${to.x} ${to.y}`;
    }
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  };

  return (
    <div className="w-full h-full bg-black/20 rounded-xl border border-cyan-500/30 p-4 relative overflow-hidden font-mono">
      <div className="absolute top-2 left-2 text-[10px] text-cyan-500/50 uppercase">
        ╔══ APEX OS ORCHESTRATION TREE ══╗
      </div>
      
      <svg viewBox="0 0 1000 800" className="w-full h-full">
        {/* Connection Lines */}
        {links.map((link, idx) => {
          const path = getPath(link.from, link.to);
          return (
            <g key={`link-${idx}`}>
              <path
                d={path}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="0.5"
                strokeOpacity="0.2"
              />
              <Packet path={path} delay={idx * 0.4} />
              <Packet path={path} delay={idx * 0.4 + 1.5} />
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            {/* Background Glow */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.type === 'leaf' ? 4 : 6}
              fill={node.color || '#06b6d4'}
              fillOpacity="0.1"
              className="animate-pulse"
            />
            
            {/* Node Box/Circle */}
            {node.type === 'leaf' ? (
              <circle
                cx={node.x}
                cy={node.y}
                r="3"
                fill="black"
                stroke={node.color || '#06b6d4'}
                strokeWidth="1"
              />
            ) : (
              <g>
                <rect
                  x={node.x - 60}
                  y={node.y - 15}
                  width={120}
                  height={30}
                  rx="2"
                  fill="black"
                  stroke={node.color || '#06b6d4'}
                  strokeWidth="1"
                />
                {/* Progress Bar for Root/Branches */}
                {(node.id === 'founder' || node.id === 'advisor' || node.id === 'investor') && (
                  <g>
                    <rect
                      x={node.x - 50}
                      y={node.y + 8}
                      width={100}
                      height={4}
                      fill="none"
                      stroke={node.color || '#06b6d4'}
                      strokeWidth="0.5"
                      opacity="0.3"
                    />
                    <motion.rect
                      x={node.x - 50}
                      y={node.y + 8}
                      height={4}
                      fill={node.color || '#06b6d4'}
                      initial={{ width: 0 }}
                      animate={{ 
                        width: node.id === 'founder' ? 80 : node.id === 'advisor' ? 5 : 15 
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </g>
                )}
              </g>
            )}

            {/* Labels */}
            <text
              x={node.x}
              y={node.type === 'leaf' ? node.y + 20 : node.y + 5}
              textAnchor="middle"
              fill={node.color || '#06b6d4'}
              fontSize={node.type === 'leaf' ? "8" : "10"}
              className="pointer-events-none select-none"
            >
              {node.label}
            </text>

            {/* Type Marker for Non-Leaves */}
            {node.type !== 'leaf' && (
              <text
                x={node.x + 55}
                y={node.y - 10}
                textAnchor="end"
                fill={node.color || '#06b6d4'}
                fontSize="6"
                className="opacity-50"
              >
                {node.type.toUpperCase()}
              </text>
            )}
          </g>
        ))}

        {/* Decorative Elements */}
        <g opacity="0.1">
          <circle cx="500" cy="400" r="380" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="5 5" />
          <circle cx="500" cy="400" r="250" fill="none" stroke="#10b981" strokeWidth="0.5" strokeDasharray="10 5" />
        </g>
      </svg>

      <div className="absolute bottom-2 right-2 text-[8px] text-cyan-500/30">
        STATUS: 🟢 FULL WIRE ENGAGED | VERSION: 4.0
      </div>
    </div>
  );
};
