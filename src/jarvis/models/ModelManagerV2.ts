/**
 * Model Manager V2
 * Full Ollama integration for multi-model specialist system
 */

import { JARVIS_MODELS, ModelConfig } from './ModelRegistry';
import {
  isOllamaRunning,
  listOllamaModels,
  pullOllamaModel,
  generateWithOllama,
  streamGenerateWithOllama,
  isModelAvailable,
  createJarvisSystemPrompt,
  OllamaGenerateRequest,
} from './OllamaClient';

interface ModelInstance {
  config: ModelConfig;
  loaded: boolean;
  lastAccessed: Date;
  context?: number[];
}

interface QueryOptions {
  personality?: 'professional' | 'witty' | 'sarcastic';
  context?: string;
  temperature?: number;
  stream?: boolean;
}

interface ModelManagerState {
  loadedModels: Map<string, ModelInstance>;
  availableRAM: number;
  currentTier: 'premium' | 'standard' | 'minimal';
  isLoading: boolean;
  activeModel: string | null;
  ollamaConnected: boolean;
  availableOllamaModels: string[];
}

class ModelManagerV2 {
  private state: ModelManagerState;
  private maxMemoryUsage: number;

  constructor() {
    this.state = {
      loadedModels: new Map(),
      availableRAM: this.detectRAM(),
      currentTier: this.detectTier(),
      isLoading: false,
      activeModel: null,
      ollamaConnected: false,
      availableOllamaModels: [],
    };

    this.maxMemoryUsage = this.state.availableRAM * 0.75;

    console.log('[ModelManagerV2] Initialized:', {
      ram: this.state.availableRAM + 'GB',
      tier: this.state.currentTier,
      maxMemory: this.maxMemoryUsage + 'GB',
    });

    // Initialize Ollama connection
    this.initializeOllama();
  }

  private async initializeOllama(): Promise<void> {
    const connected = await isOllamaRunning();
    this.state.ollamaConnected = connected;

    if (connected) {
      console.log('[ModelManagerV2] ✅ Ollama connected');
      this.state.availableOllamaModels = await listOllamaModels();
      console.log('[ModelManagerV2] Available models:', this.state.availableOllamaModels);
    } else {
      console.warn('[ModelManagerV2] ⚠️ Ollama not running. Start with: ollama serve');
    }
  }

  private detectRAM(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      try {
        const os = require('os');
        const totalMemory = os.totalmem();
        return Math.floor(totalMemory / (1024 * 1024 * 1024));
      } catch {
        return 16;
      }
    }
    return 16;
  }

  private detectTier(): 'premium' | 'standard' | 'minimal' {
    const ram = this.state?.availableRAM || this.detectRAM();
    if (ram >= 16) return 'premium';
    if (ram >= 8) return 'standard';
    return 'minimal';
  }

  async downloadModel(modelId: string, onProgress?: (progress: number) => void): Promise<void> {
    if (!this.state.ollamaConnected) {
      throw new Error('Ollama not connected. Start with: ollama serve');
    }

    const config = JARVIS_MODELS[modelId];
    if (!config) {
      throw new Error(`Unknown model: ${modelId}`);
    }

    console.log(`[ModelManagerV2] Downloading ${config.name}...`);
    this.state.isLoading = true;

    try {
      await pullOllamaModel(config.ollamaId, onProgress);
      this.state.availableOllamaModels = await listOllamaModels();
      console.log(`[ModelManagerV2] ✅ Downloaded ${config.name}`);
    } catch (error) {
      console.error(`[ModelManagerV2] ✗ Failed to download ${config.name}:`, error);
      throw error;
    } finally {
      this.state.isLoading = false;
    }
  }

  async loadModel(modelId: string): Promise<ModelInstance> {
    const config = JARVIS_MODELS[modelId];
    if (!config) {
      throw new Error(`Unknown model: ${modelId}`);
    }

    // Check if already loaded
    if (this.state.loadedModels.has(modelId)) {
      const instance = this.state.loadedModels.get(modelId)!;
      instance.lastAccessed = new Date();
      return instance;
    }

    // Check if available in Ollama
    if (!this.state.availableOllamaModels.includes(config.ollamaId)) {
      console.log(`[ModelManagerV2] Model ${config.name} not available, downloading...`);
      await this.downloadModel(modelId);
    }

    // Check memory
    const currentUsage = this.calculateMemoryUsage();
    const requiredMemory = parseFloat(config.size);

    if (currentUsage + requiredMemory > this.maxMemoryUsage) {
      await this.unloadLRU();
    }

    console.log(`[ModelManagerV2] Loading ${config.name}...`);

    const instance: ModelInstance = {
      config,
      loaded: true,
      lastAccessed: new Date(),
    };

    this.state.loadedModels.set(modelId, instance);
    this.state.activeModel = modelId;

    console.log(`[ModelManagerV2] ✅ Loaded ${config.name}`);
    return instance;
  }

  private async unloadLRU(): Promise<void> {
    let lru: string | null = null;
    let oldestTime = Date.now();

    for (const [id, instance] of this.state.loadedModels) {
      if (id === 'orchestrator') continue;
      if (instance.lastAccessed.getTime() < oldestTime) {
        oldestTime = instance.lastAccessed.getTime();
        lru = id;
      }
    }

    if (lru) {
      this.state.loadedModels.delete(lru);
      if (this.state.activeModel === lru) {
        this.state.activeModel = null;
      }
      console.log(`[ModelManagerV2] Unloaded ${JARVIS_MODELS[lru]?.name}`);
    }
  }

  async switchModel(modelId: string): Promise<ModelInstance> {
    const instance = await this.loadModel(modelId);

    // Unload non-priority models if needed
    const currentUsage = this.calculateMemoryUsage();
    if (currentUsage > this.maxMemoryUsage * 0.9) {
      for (const [id, inst] of this.state.loadedModels) {
        if (id !== modelId && id !== 'orchestrator' && inst.config.loadPriority === 0) {
          this.state.loadedModels.delete(id);
        }
      }
    }

    return instance;
  }

  async query(prompt: string, options: QueryOptions = {}): Promise<string> {
    const { personality = 'professional', context, temperature = 0.7 } = options;

    // Route to appropriate model
    const modelId = this.selectModelForQuery(prompt);
    const instance = await this.loadModel(modelId);

    const systemPrompt = createJarvisSystemPrompt(personality, context);

    const request: OllamaGenerateRequest = {
      model: instance.config.ollamaId,
      prompt,
      system: systemPrompt,
      options: {
        temperature,
        top_p: 0.9,
        num_predict: 2048,
      },
    };

    console.log(`[ModelManagerV2] Querying ${instance.config.name}...`);

    try {
      const response = await generateWithOllama(request);
      instance.lastAccessed = new Date();

      if (response.context) {
        instance.context = response.context;
      }

      console.log(`[ModelManagerV2] ✅ Response received (${response.eval_count} tokens)`);
      return response.response;
    } catch (error) {
      console.error(`[ModelManagerV2] ✗ Query failed:`, error);
      throw error;
    }
  }

  async *streamQuery(prompt: string, options: QueryOptions = {}): AsyncGenerator<string, void, unknown> {
    const { personality = 'professional', context, temperature = 0.7 } = options;

    const modelId = this.selectModelForQuery(prompt);
    const instance = await this.loadModel(modelId);

    const systemPrompt = createJarvisSystemPrompt(personality, context);

    const request: OllamaGenerateRequest = {
      model: instance.config.ollamaId,
      prompt,
      system: systemPrompt,
      options: {
        temperature,
        top_p: 0.9,
        num_predict: 2048,
      },
    };

    for await (const chunk of streamGenerateWithOllama(request)) {
      if (chunk.response) {
        yield chunk.response;
      }
    }

    instance.lastAccessed = new Date();
  }

  private selectModelForQuery(prompt: string): string {
    const lower = prompt.toLowerCase();

    // Check for code/finance keywords
    const codeKeywords = JARVIS_MODELS.code?.keywords || [];
    if (codeKeywords.some(kw => lower.includes(kw))) {
      return 'code';
    }

    // Check for chat/creative keywords
    const chatKeywords = JARVIS_MODELS.chat?.keywords || [];
    if (chatKeywords.some(kw => lower.includes(kw))) {
      return 'chat';
    }

    return 'orchestrator';
  }

  private calculateMemoryUsage(): number {
    let total = 0;
    for (const instance of this.state.loadedModels.values()) {
      if (instance.loaded) {
        total += parseFloat(instance.config.size);
      }
    }
    return total;
  }

  getStatus() {
    return {
      availableRAM: this.state.availableRAM,
      currentTier: this.state.currentTier,
      maxMemoryUsage: this.maxMemoryUsage,
      currentMemoryUsage: this.calculateMemoryUsage(),
      loadedModels: Array.from(this.state.loadedModels.keys()),
      activeModel: this.state.activeModel,
      isLoading: this.state.isLoading,
      ollamaConnected: this.state.ollamaConnected,
      availableOllamaModels: this.state.availableOllamaModels,
    };
  }

  async autoDownloadForTier(): Promise<void> {
    if (!this.state.ollamaConnected) {
      console.warn('[ModelManagerV2] Cannot auto-download: Ollama not connected');
      return;
    }

    const tier = this.state.currentTier;
    console.log(`[ModelManagerV2] Auto-downloading models for ${tier} tier...`);

    const modelsToDownload = Object.values(JARVIS_MODELS).filter(
      m => m.tier === tier || m.loadPriority === 1
    );

    for (const model of modelsToDownload) {
      if (!this.state.availableOllamaModels.includes(model.ollamaId)) {
        try {
          await this.downloadModel(model.id);
        } catch (error) {
          console.warn(`[ModelManagerV2] Failed to download ${model.name}:`, error);
        }
      }
    }
  }
}

let modelManagerV2: ModelManagerV2 | null = null;

export function getModelManagerV2(): ModelManagerV2 {
  if (!modelManagerV2) {
    modelManagerV2 = new ModelManagerV2();
  }
  return modelManagerV2;
}

export { ModelManagerV2 };
export type { ModelInstance, QueryOptions };
