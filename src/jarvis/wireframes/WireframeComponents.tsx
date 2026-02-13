/**
 * Wireframe Components - Full System
 * Comprehensive wireframe library for APEX OS JARVIS SLM
 * 
 * Includes:
 * - Model Selector Wireframe
 * - Memory Manager Wireframe  
 * - Agent Sync Dashboard Wireframe
 * - Voice Control Panel Wireframe
 * - Terminal HUD Wireframe
 * - Holographic HUD Wireframe
 */

import React from 'react';
import { 
  Box, 
  Cpu, 
  Mic, 
  Terminal, 
  Activity, 
  Zap, 
  Shield, 
  Users,
  MessageSquare,
  Database,
  Layers
} from 'lucide-react';

// ============================================================================
// BASE WIREFRAME COMPONENTS
// ============================================================================

interface WireframeBoxProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'holographic' | 'terminal' | 'alert';
}

const WireframeBox: React.FC<WireframeBoxProps> = ({ 
  children, 
  title, 
  icon, 
  className = '',
  variant = 'default'
}) => {
  const variantStyles = {
    default: 'border-zinc-700 bg-zinc-900/50',
    holographic: 'border-cyan-500/50 bg-cyan-950/20',
    terminal: 'border-green-500/50 bg-green-950/20',
    alert: 'border-red-500/50 bg-red-950/20',
  };

  return (
    <div className={`rounded-lg border p-4 ${variantStyles[variant]} ${className}`}>
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-current/20">
          {icon && <span className="opacity-60">{icon}</span>}
          {title && <h3 className="font-mono text-sm font-bold uppercase tracking-wider">{title}</h3>}
        </div>
      )}
      {children}
    </div>
  );
};

const Placeholder: React.FC<{ label: string; width?: string; height?: string }> = ({ 
  label, 
  width = '100%', 
  height = '60px' 
}) => (
  <div 
    className="rounded border-2 border-dashed border-zinc-700 flex items-center justify-center text-zinc-600 text-xs font-mono"
    style={{ width, height }}
  >
    {label}
  </div>
);

// ============================================================================
// 1. MODEL SELECTOR WIREFRAME
// ============================================================================

export const ModelSelectorWireframe: React.FC = () => (
  <div className="space-y-4">
    <WireframeBox title="Active Models" icon={<Cpu size={16} />} variant="holographic">
      <div className="space-y-3">
        {/* Model Card 1 - Active */}
        <div className="p-3 rounded bg-cyan-500/10 border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <span className="text-cyan-400 font-bold">Q</span>
              </div>
              <div>
                <div className="font-medium text-cyan-400">Qwen 2.5 7B</div>
                <div className="text-xs text-zinc-500">Orchestrator • 4.2GB VRAM</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-500">Active</span>
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <span className="px-2 py-0.5 rounded text-xs bg-cyan-500/20 text-cyan-400">Chat</span>
            <span className="px-2 py-0.5 rounded text-xs bg-cyan-500/20 text-cyan-400">Reasoning</span>
          </div>
        </div>

        {/* Model Card 2 - Standby */}
        <div className="p-3 rounded bg-zinc-800/50 border border-zinc-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                <span className="text-zinc-500 font-bold">D</span>
              </div>
              <div>
                <div className="font-medium text-zinc-400">DeepSeek Coder 6.7B</div>
                <div className="text-xs text-zinc-600">Code/Finance • Unloaded</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-600" />
              <span className="text-xs text-zinc-600">Standby</span>
            </div>
          </div>
        </div>

        {/* Model Card 3 - Standby */}
        <div className="p-3 rounded bg-zinc-800/50 border border-zinc-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                <span className="text-zinc-500 font-bold">L</span>
              </div>
              <div>
                <div className="font-medium text-zinc-400">Llama 3.1 8B</div>
                <div className="text-xs text-zinc-600">Chat/Creative • Unloaded</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-600" />
              <span className="text-xs text-zinc-600">Standby</span>
            </div>
          </div>
        </div>
      </div>
    </WireframeBox>

    <WireframeBox title="Model Routing" icon={<Layers size={16} />}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Code Queries →</span>
          <span className="text-cyan-400 font-mono">DeepSeek Coder</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Finance →</span>
          <span className="text-cyan-400 font-mono">DeepSeek Coder</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Creative →</span>
          <span className="text-cyan-400 font-mono">Llama 3.1</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">General →</span>
          <span className="text-cyan-400 font-mono">Qwen 2.5</span>
        </div>
      </div>
    </WireframeBox>
  </div>
);

// ============================================================================
// 2. MEMORY MANAGER WIREFRAME
// ============================================================================

export const MemoryManagerWireframe: React.FC = () => (
  <div className="space-y-4">
    <WireframeBox title="VRAM Usage" icon={<Database size={16} />} variant="terminal">
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Total VRAM</span>
          <span className="font-mono text-green-400">16 GB</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Used</span>
          <span className="font-mono text-green-400">4.2 GB (26%)</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Available</span>
          <span className="font-mono text-green-400">11.8 GB</span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full w-[26%] bg-gradient-to-r from-green-600 to-green-400 rounded-full" />
        </div>
      </div>
    </WireframeBox>

    <WireframeBox title="Memory Strategy" icon={<Zap size={16} />}>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-zinc-400">LRU Cache: 2 models max</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-zinc-400">Auto-unload on threshold</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-zinc-400">Context window: 32K tokens</span>
        </div>
      </div>
    </WireframeBox>

    <WireframeBox title="Loaded Contexts">
      <div className="space-y-2">
        <div className="p-2 rounded bg-zinc-800/50 text-xs font-mono">
          <div className="flex justify-between text-zinc-500">
            <span>Session: abc-123</span>
            <span>2.4K tokens</span>
          </div>
          <div className="text-zinc-600 mt-1">Last active: 2s ago</div>
        </div>
        <div className="p-2 rounded bg-zinc-800/50 text-xs font-mono">
          <div className="flex justify-between text-zinc-500">
            <span>Session: xyz-789</span>
            <span>1.8K tokens</span>
          </div>
          <div className="text-zinc-600 mt-1">Last active: 45s ago</div>
        </div>
      </div>
    </WireframeBox>
  </div>
);

// ============================================================================
// 3. AGENT SYNC DASHBOARD WIREFRAME
// ============================================================================

export const AgentSyncDashboardWireframe: React.FC = () => (
  <div className="space-y-4">
    <WireframeBox title="Connected Agents" icon={<Users size={16} />} variant="holographic">
      <div className="space-y-3">
        {/* Agent 1 - Online */}
        <div className="flex items-center justify-between p-3 rounded bg-cyan-500/10 border border-cyan-500/30">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Terminal size={18} className="text-cyan-400" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-zinc-900" />
            </div>
            <div>
              <div className="font-medium text-cyan-400">apex-os-cli-builder</div>
              <div className="text-xs text-zinc-500">CLI v2.0 • 75% complete</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-green-500">Online</div>
            <div className="text-xs text-zinc-600">Sync: 30s</div>
          </div>
        </div>

        {/* Agent 2 - Offline */}
        <div className="flex items-center justify-between p-3 rounded bg-zinc-800/50 border border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-zinc-700 flex items-center justify-center">
                <Shield size={18} className="text-zinc-500" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-zinc-600 border-2 border-zinc-900" />
            </div>
            <div>
              <div className="font-medium text-zinc-400">security-monitor</div>
              <div className="text-xs text-zinc-600">Security Audit • Idle</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-zinc-600">Offline</div>
            <div className="text-xs text-zinc-600">Last seen: 2h ago</div>
          </div>
        </div>
      </div>
    </WireframeBox>

    <WireframeBox title="Sync Status" icon={<Activity size={16} />}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Last Sync</span>
          <span className="font-mono text-zinc-500">2026-02-02 01:52 UTC</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Sync Interval</span>
          <span className="font-mono text-zinc-500">30 seconds</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Messages Queued</span>
          <span className="font-mono text-cyan-400">3</span>
        </div>
      </div>
    </WireframeBox>

    <WireframeBox title="Shared Resources">
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 rounded bg-zinc-800/50 text-center">
          <div className="text-2xl font-mono text-cyan-400">4</div>
          <div className="text-xs text-zinc-500">Model Configs</div>
        </div>
        <div className="p-2 rounded bg-zinc-800/50 text-center">
          <div className="text-2xl font-mono text-cyan-400">12</div>
          <div className="text-xs text-zinc-500">MCP Tools</div>
        </div>
      </div>
    </WireframeBox>
  </div>
);

// ============================================================================
// 4. VOICE CONTROL PANEL WIREFRAME
// ============================================================================

export const VoiceControlPanelWireframe: React.FC = () => (
  <div className="space-y-4">
    <WireframeBox title="Voice Status" icon={<Mic size={16} />} variant="holographic">
      <div className="flex items-center justify-center py-6">
        <div className="relative">
          {/* Animated rings */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-2 rounded-full border-2 border-cyan-500/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
          
          {/* Main button */}
          <button className="relative w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center hover:bg-cyan-500/30 transition-colors">
            <Mic size={32} className="text-cyan-400" />
          </button>
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-cyan-400 font-medium">Listening...</div>
        <div className="text-xs text-zinc-500 mt-1">Say "JARVIS" to activate</div>
      </div>
    </WireframeBox>

    <WireframeBox title="Voice Settings">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Wake Word</span>
          <span className="font-mono text-cyan-400">"JARVIS"</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Accent</span>
          <span className="font-mono text-cyan-400">British</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Speech Rate</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-600">Slow</span>
            <div className="w-20 h-1 bg-zinc-700 rounded-full">
              <div className="w-1/2 h-full bg-cyan-500 rounded-full" />
            </div>
            <span className="text-xs text-zinc-600">Fast</span>
          </div>
        </div>
      </div>
    </WireframeBox>

    <WireframeBox title="Recent Commands">
      <div className="space-y-2">
        {[
          { cmd: 'Analyze unit economics', time: '2m ago' },
          { cmd: 'Switch to Terminal mode', time: '5m ago' },
          { cmd: 'House Party Protocol', time: '1h ago' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded bg-zinc-800/50 text-sm">
            <span className="text-zinc-400">"{item.cmd}"</span>
            <span className="text-xs text-zinc-600">{item.time}</span>
          </div>
        ))}
      </div>
    </WireframeBox>
  </div>
);

// ============================================================================
// 5. TERMINAL HUD WIREFRAME
// ============================================================================

export const TerminalHUDWireframe: React.FC = () => (
  <div className="space-y-4">
    <WireframeBox title="Terminal Output" icon={<Terminal size={16} />} variant="terminal">
      <div className="font-mono text-xs space-y-1 p-3 rounded bg-black border border-green-500/30">
        <div className="text-green-500">$ ollama serve</div>
        <div className="text-zinc-500">[INFO] Starting Ollama server...</div>
        <div className="text-zinc-500">[INFO] Loading model: qwen2.5:7b</div>
        <div className="text-green-400">[SUCCESS] Model loaded (4.2GB)</div>
        <div className="text-zinc-500">[INFO] Listening on :11434</div>
        <div className="text-green-500">$ jarvis --status</div>
        <div className="text-cyan-400">┌─ JARVIS Status ─────────────────┐</div>
        <div className="text-cyan-400">│ Models: 1 active, 3 standby     │</div>
        <div className="text-cyan-400">│ VRAM: 4.2GB / 16GB (26%)        │</div>
        <div className="text-cyan-400">│ Agents: 1 connected             │</div>
        <div className="text-cyan-400">│ Uptime: 2h 34m                  │</div>
        <div className="text-cyan-400">└─────────────────────────────────┘</div>
        <div className="text-green-500 animate-pulse">_</div>
      </div>
    </WireframeBox>

    <WireframeBox title="System Logs" icon={<Activity size={16} />}>
      <div className="space-y-1 text-xs font-mono">
        <div className="flex gap-2">
          <span className="text-zinc-600">[01:52:34]</span>
          <span className="text-green-500">INFO</span>
          <span className="text-zinc-400">Agent sync completed</span>
        </div>
        <div className="flex gap-2">
          <span className="text-zinc-600">[01:52:04]</span>
          <span className="text-cyan-500">MODEL</span>
          <span className="text-zinc-400">Qwen 2.5 loaded to VRAM</span>
        </div>
        <div className="flex gap-2">
          <span className="text-zinc-600">[01:51:45]</span>
          <span className="text-yellow-500">WARN</span>
          <span className="text-zinc-400">High memory usage detected</span>
        </div>
      </div>
    </WireframeBox>

    <WireframeBox title="Quick Commands">
      <div className="grid grid-cols-2 gap-2">
        {['status', 'models', 'agents', 'memory', 'logs', 'help'].map((cmd) => (
          <button 
            key={cmd}
            className="px-3 py-2 rounded bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono hover:bg-green-500/20 transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>
    </WireframeBox>
  </div>
);

// ============================================================================
// 6. HOLOGRAPHIC HUD WIREFRAME
// ============================================================================

export const HolographicHUDWireframe: React.FC = () => (
  <div className="space-y-4">
    <WireframeBox title="Holographic Display" icon={<Box size={16} />} variant="holographic">
      <div className="relative h-48 rounded-lg bg-gradient-to-b from-cyan-950/50 to-black border border-cyan-500/30 overflow-hidden">
        {/* Holographic grid */}
        <div className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `
              linear-gradient(cyan 1px, transparent 1px),
              linear-gradient(90deg, cyan 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Center element */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-2 border-cyan-500/50 animate-spin" style={{ animationDuration: '10s' }} />
            <div className="absolute inset-4 rounded-full border border-cyan-400/30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-cyan-400">J</span>
            </div>
          </div>
        </div>
        
        {/* Status indicators */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs font-mono">
          <span className="text-cyan-400">SYS: ONLINE</span>
          <span className="text-cyan-400">VRAM: 26%</span>
          <span className="text-cyan-400">AGENTS: 1</span>
        </div>
      </div>
    </WireframeBox>

    <WireframeBox title="Neural Activity" icon={<Activity size={16} />}>
      <div className="h-20 flex items-end gap-1">
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i}
            className="flex-1 bg-cyan-500/50 rounded-t"
            style={{ 
              height: `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.7
            }}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-zinc-500 mt-2">
        <span>Token/s: 45.2</span>
        <span>Latency: 120ms</span>
        <span>Queue: 0</span>
      </div>
    </WireframeBox>

    <WireframeBox title="Active Processes">
      <div className="space-y-2">
        {[
          { name: 'Model Inference', status: 'Running', progress: 75 },
          { name: 'Agent Sync', status: 'Idle', progress: 100 },
          { name: 'Voice Recognition', status: 'Listening', progress: 45 },
        ].map((proc, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">{proc.name}</span>
              <span className={proc.status === 'Running' ? 'text-cyan-400' : 'text-zinc-500'}>
                {proc.status}
              </span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-500 rounded-full transition-all"
                style={{ width: `${proc.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </WireframeBox>
  </div>
);

// ============================================================================
// 7. MAIN DASHBOARD WIREFRAME
// ============================================================================

export const JarvisDashboardWireframe: React.FC = () => (
  <div className="p-6 bg-zinc-950 min-h-screen">
    {/* Header */}
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
          <span className="text-2xl font-bold text-cyan-400">J</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">J.A.R.V.I.S.</h1>
          <p className="text-sm text-zinc-500">Just A Rather Very Intelligent System</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm text-green-500">Online</span>
      </div>
    </div>

    {/* Main Grid */}
    <div className="grid grid-cols-12 gap-4">
      {/* Left Column - Models & Memory */}
      <div className="col-span-4 space-y-4">
        <ModelSelectorWireframe />
        <MemoryManagerWireframe />
      </div>

      {/* Center Column - HUD */}
      <div className="col-span-4 space-y-4">
        <HolographicHUDWireframe />
        <TerminalHUDWireframe />
      </div>

      {/* Right Column - Agents & Voice */}
      <div className="col-span-4 space-y-4">
        <AgentSyncDashboardWireframe />
        <VoiceControlPanelWireframe />
      </div>
    </div>

    {/* Footer */}
    <div className="mt-6 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-4">
          <span>Version: 2.0.0-alpha</span>
          <span>Build: 2026.02.02</span>
          <span>Session: apex-os-monster</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Latency: 120ms</span>
          <span>Uptime: 2h 34m</span>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// 8. MOBILE WIREFRAME
// ============================================================================

export const JarvisMobileWireframe: React.FC = () => (
  <div className="w-[375px] mx-auto bg-zinc-950 min-h-screen border-x border-zinc-800">
    {/* Mobile Header */}
    <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
          <span className="font-bold text-cyan-400">J</span>
        </div>
        <span className="font-bold text-zinc-100">JARVIS</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-green-500" />
      </div>
    </div>

    {/* Mobile Content */}
    <div className="p-4 space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-center">
          <div className="text-2xl font-bold text-cyan-400">1</div>
          <div className="text-xs text-zinc-500">Active Model</div>
        </div>
        <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 text-center">
          <div className="text-2xl font-bold text-zinc-400">26%</div>
          <div className="text-xs text-zinc-500">VRAM Used</div>
        </div>
      </div>

      {/* Voice Button */}
      <button className="w-full py-4 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center gap-2">
        <Mic size={24} className="text-cyan-400" />
        <span className="text-cyan-400 font-medium">Tap to Speak</span>
      </button>

      {/* Recent Activity */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-zinc-400">Recent Activity</h3>
        {[
          { action: 'Model loaded', detail: 'Qwen 2.5 7B', time: '2m ago' },
          { action: 'Agent connected', detail: 'cli-builder', time: '5m ago' },
          { action: 'Query processed', detail: 'Status check', time: '12m ago' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
            <div>
              <div className="text-sm text-zinc-300">{item.action}</div>
              <div className="text-xs text-zinc-500">{item.detail}</div>
            </div>
            <span className="text-xs text-zinc-600">{item.time}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Mobile Nav */}
    <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-zinc-800 bg-zinc-950">
      <div className="flex justify-around">
        {[
          { icon: Box, label: 'HUD' },
          { icon: Cpu, label: 'Models' },
          { icon: MessageSquare, label: 'Chat' },
          { icon: Users, label: 'Agents' },
        ].map((item, i) => (
          <button key={i} className="flex flex-col items-center gap-1 text-zinc-500">
            <item.icon size={20} />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  WireframeBox,
  Placeholder,
  ModelSelectorWireframe,
  MemoryManagerWireframe,
  AgentSyncDashboardWireframe,
  VoiceControlPanelWireframe,
  TerminalHUDWireframe,
  HolographicHUDWireframe,
  JarvisDashboardWireframe,
  JarvisMobileWireframe,
};
