/**
 * Model Manager
 * Handles downloading, loading, and swapping of local SLM models
 * Optimized for Mac M1 with memory management
 */

import { JARVIS_MODELS, ModelConfig, canRunModel } from './ModelRegistry';

interface ModelInstance {
  config: ModelConfig;
  loaded: boolean;
  lastAccessed: Date;
  instance?: any; // Ollama or llama.cpp instance
}

interface ModelManagerState {
  loadedModels: Map<string, ModelInstance>;
  availableRAM: number;
  currentTier: 'premium' | 'standard' | 'minimal';
  isLoading: boolean;
  activeModel: string | null;
}

class ModelManager {
  private state: ModelManagerState;
  private maxMemoryUsage: number;

  constructor() {
    this.state = {
      loadedModels: new Map(),
      availableRAM: this.detectRAM(),
      currentTier: this.detectTier(),
      isLoading: false,
      activeModel: null,
    };
    
    // Use 75% of available RAM for models
    this.maxMemoryUsage = this.state.availableRAM * 0.75;
    
    console.log('[ModelManager] Initialized:', {
      ram: this.state.availableRAM + 'GB',
      tier: this.state.currentTier,
      maxMemory: this.maxMemoryUsage + 'GB',
    });
  }

  /**
   * Detect available system RAM
   */
  private detectRAM(): number {
    // Node.js memory detection
    if (typeof process !== 'undefined' && process.memoryUsage) {
      // For MVP, assume 16GB or detect from user agent
      const totalMemory = require('os').totalmem();
      return Math.floor(totalMemory / (1024 * 1024 * 1024));
    }
    
    // Browser fallback - assume 8GB
    return 8;
  }

  /**
   * Detect hardware tier based on RAM
   */
  private detectTier(): 'premium' | 'standard' | 'minimal' {
    const ram = this.state?.availableRAM || this.detectRAM();
    
    if (ram >= 16) return 'premium';
    if (ram >= 8) return 'standard';
    return 'minimal';
  }

  /**
   * Download a model (if not already downloaded)
   */
  async downloadModel(modelId: string): Promise<void> {
    const config = JARVIS_MODELS[modelId];
    if (!config) {
      throw new Error(`Unknown model: ${modelId}`);
    }

    console.log(`[ModelManager] Downloading ${config.name}...`);
    
    // TODO: Implement actual download via Ollama or llama.cpp
    // For MVP, we'll use Ollama's pull command
    
    this.state.isLoading = true;
    
    try {
      // Simulate download progress
      await this.simulateDownload(config);
      
      console.log(`[ModelManager] ✓ Downloaded ${config.name}`);
    } catch (error) {
      console.error(`[ModelManager] ✗ Failed to download ${config.name}:`, error);
      throw error;
    } finally {
      this.state.isLoading = false;
    }
  }

  /**
   * Load a model into memory
   */
  async loadModel(modelId: string): Promise<ModelInstance> {
    const config = JARVIS_MODELS[modelId];
    if (!config) {
      throw new Error(`Unknown model: ${modelId}`);
    }

    // Check if already loaded
    if (this.state.loadedModels.has(modelId)) {
      const instance = this.state.loadedModels.get(modelId)!;
      instance.lastAccessed = new Date();
      console.log(`[ModelManager] ✓ ${config.name} already loaded`);
      return instance;
    }

    // Check memory availability
    const currentUsage = this.calculateMemoryUsage();
    const requiredMemory = parseFloat(config.size);
    
    if (currentUsage + requiredMemory > this.maxMemoryUsage) {
      // Unload least recently used model
      await this.unloadLRU();
    }

    console.log(`[ModelManager] Loading ${config.name}...`);
    this.state.isLoading = true;

    try {
      // TODO: Implement actual loading via Ollama or llama.cpp
      const instance: ModelInstance = {
        config,
        loaded: true,
        lastAccessed: new Date(),
        instance: null, // Will hold actual model instance
      };

      this.state.loadedModels.set(modelId, instance);
      this.state.activeModel = modelId;

      console.log(`[ModelManager] ✓ Loaded ${config.name}`);
      return instance;
    } catch (error) {
      console.error(`[ModelManager] ✗ Failed to load ${config.name}:`, error);
      throw error;
    } finally {
      this.state.isLoading = false;
    }
  }

  /**
   * Unload least recently used model
   */
  private async unloadLRU(): Promise<void> {
    let lru: string | null = null;
    let oldestTime = Date.now();

    for (const [id, instance] of this.state.loadedModels) {
      // Never unload orchestrator
      if (id === 'orchestrator') continue;
      
      if (instance.lastAccessed.getTime() < oldestTime) {
        oldestTime = instance.lastAccessed.getTime();
        lru = id;
      }
    }

    if (lru) {
      await this.unloadModel(lru);
    }
  }

  /**
   * Unload a specific model
   */
  async unloadModel(modelId: string): Promise<void> {
    const instance = this.state.loadedModels.get(modelId);
    if (!instance) return;

    console.log(`[ModelManager] Unloading ${instance.config.name}...`);
    
    // TODO: Implement actual unloading
    
    this.state.loadedModels.delete(modelId);
    
    if (this.state.activeModel === modelId) {
      this.state.activeModel = null;
    }

    console.log(`[ModelManager] ✓ Unloaded ${instance.config.name}`);
  }

  /**
   * Switch to a different model
   */
  async switchModel(modelId: string): Promise<ModelInstance> {
    console.log(`[ModelManager] Switching to ${JARVIS_MODELS[modelId]?.name}...`);
    
    // Load new model
    const instance = await this.loadModel(modelId);
    
    // Unload non-priority models if memory constrained
    const currentUsage = this.calculateMemoryUsage();
    if (currentUsage > this.maxMemoryUsage * 0.9) {
      for (const [id, inst] of this.state.loadedModels) {
        if (id !== modelId && id !== 'orchestrator' && inst.config.loadPriority === 0) {
          await this.unloadModel(id);
        }
      }
    }

    return instance;
  }

  /**
   * Query the active model
   */
  async query(prompt: string, context?: string): Promise<string> {
    const activeModel = this.state.activeModel || 'orchestrator';
    const instance = this.state.loadedModels.get(activeModel);
    
    if (!instance || !instance.loaded) {
      throw new Error('No model loaded');
    }

    // Update last accessed
    instance.lastAccessed = new Date();

    // TODO: Implement actual query via Ollama or llama.cpp
    console.log(`[ModelManager] Querying ${instance.config.name}...`);
    
    // Simulate response for MVP
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return `[${instance.config.name}] Response to: "${prompt.substring(0, 50)}..."`;
  }

  /**
   * Calculate current memory usage
   */
  private calculateMemoryUsage(): number {
    let total = 0;
    for (const instance of this.state.loadedModels.values()) {
      if (instance.loaded) {
        total += parseFloat(instance.config.size);
      }
    }
    return total;
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      availableRAM: this.state.availableRAM,
      currentTier: this.state.currentTier,
      maxMemoryUsage: this.maxMemoryUsage,
      currentMemoryUsage: this.calculateMemoryUsage(),
      loadedModels: Array.from(this.state.loadedModels.keys()),
      activeModel: this.state.activeModel,
      isLoading: this.state.isLoading,
    };
  }

  /**
   * Simulate download progress (for MVP)
   */
  private async simulateDownload(config: ModelConfig): Promise<void> {
    const size = parseFloat(config.size);
    const duration = size * 1000; // 1 second per GB
    
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  }

  /**
   * Auto-download recommended models for current tier
   */
  async autoDownloadForTier(): Promise<void> {
    const tier = this.state.currentTier;
    console.log(`[ModelManager] Auto-downloading models for ${tier} tier...`);

    const modelsToDownload = Object.values(JARVIS_MODELS).filter(
      m => m.tier === tier || m.loadPriority === 1
    );

    for (const model of modelsToDownload) {
      try {
        await this.downloadModel(model.id);
      } catch (error) {
        console.warn(`[ModelManager] Failed to download ${model.name}:`, error);
      }
    }
  }
}

// Singleton instance
let modelManager: ModelManager | null = null;

export function getModelManager(): ModelManager {
  if (!modelManager) {
    modelManager = new ModelManager();
  }
  return modelManager;
}

export { ModelManager };
export type { ModelInstance, ModelManagerState };
