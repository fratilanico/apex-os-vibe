/**
 * JARVIS Model Registry
 * Central configuration for all SLM models
 */

export interface ModelConfig {
  id: string;
  name: string;
  size: string; // GB
  quantization: string;
  purpose: string;
  keywords: string[];
  loadPriority: number; // 0 = on-demand, 1 = keep loaded
  minRAM: number; // GB
  tier: 'premium' | 'standard' | 'minimal';
  ollamaId: string;
  llamaCppId?: string;
}

export const JARVIS_MODELS: Record<string, ModelConfig> = {
  // ORCHESTRATOR - Always loaded, routes queries
  orchestrator: {
    id: 'orchestrator',
    name: 'Qwen 2.5 7B Instruct',
    size: '4.5',
    quantization: 'Q4_K_M',
    purpose: 'Query routing, personality, orchestration, general intelligence',
    keywords: ['route', 'orchestrate', 'personality', 'general', 'help'],
    loadPriority: 1,
    minRAM: 6,
    tier: 'standard',
    ollamaId: 'qwen2.5:7b',
    llamaCppId: 'qwen2.5-7b-instruct-q4_k_m.gguf',
  },

  // SPECIALIST: Code & Finance
  code: {
    id: 'code',
    name: 'DeepSeek Coder V2 6.7B',
    size: '4.0',
    quantization: 'Q4_K_M',
    purpose: 'Code generation, financial analysis, technical tasks',
    keywords: ['code', 'finance', 'numbers', 'technical', 'model', 'calculate', 'analyze'],
    loadPriority: 0,
    minRAM: 6,
    tier: 'premium',
    ollamaId: 'deepseek-coder-v2:6.7b',
    llamaCppId: 'deepseek-coder-v2-6.7b-instruct-q4_k_m.gguf',
  },

  // SPECIALIST: Chat & Creativity
  chat: {
    id: 'chat',
    name: 'Llama 3.1 8B Instruct',
    size: '5.0',
    quantization: 'Q4_K_M',
    purpose: 'Conversation, storytelling, creative tasks, explanations',
    keywords: ['chat', 'story', 'creative', 'explain', 'write', 'narrative'],
    loadPriority: 0,
    minRAM: 7,
    tier: 'premium',
    ollamaId: 'llama3.1:8b',
    llamaCppId: 'llama-3.1-8b-instruct-q4_k_m.gguf',
  },

  // FALLBACK: Lightweight
  fallback: {
    id: 'fallback',
    name: 'Phi-3 Mini 3.8B Instruct',
    size: '2.5',
    quantization: 'Q4_K_M',
    purpose: 'Quick responses, low memory, offline mode',
    keywords: ['quick', 'fast', 'simple', 'brief'],
    loadPriority: 0,
    minRAM: 4,
    tier: 'minimal',
    ollamaId: 'phi3:mini',
    llamaCppId: 'phi-3-mini-4k-instruct-q4.gguf',
  },
};

// Model routing logic
export function selectModelForQuery(query: string): string {
  const lower = query.toLowerCase();
  
  // Check for code/finance keywords
  const codeKeywords = JARVIS_MODELS.code.keywords;
  if (codeKeywords.some(kw => lower.includes(kw))) {
    return 'code';
  }
  
  // Check for chat/creative keywords
  const chatKeywords = JARVIS_MODELS.chat.keywords;
  if (chatKeywords.some(kw => lower.includes(kw))) {
    return 'chat';
  }
  
  // Default to orchestrator for routing
  return 'orchestrator';
}

// Get models for hardware tier
export function getModelsForTier(tier: 'premium' | 'standard' | 'minimal'): ModelConfig[] {
  return Object.values(JARVIS_MODELS).filter(m => 
    m.tier === tier || m.tier === 'minimal'
  );
}

// Calculate total memory needed
export function calculateMemoryRequirement(modelIds: string[]): number {
  return modelIds.reduce((total, id) => {
    const model = JARVIS_MODELS[id];
    return total + (model ? parseFloat(model.size) : 0);
  }, 0);
}

// Check if system can handle model
export function canRunModel(modelId: string, availableRAM: number): boolean {
  const model = JARVIS_MODELS[modelId];
  if (!model) return false;
  return availableRAM >= model.minRAM;
}
