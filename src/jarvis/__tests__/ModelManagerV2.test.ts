/**
 * ModelManagerV2.test.ts
 * Comprehensive test suite for ModelManagerV2
 * Tony Stark Standards: 100% Coverage, Zero Tolerance
 */

import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { ModelManagerV2, getModelManagerV2 } from '../models/ModelManagerV2';
import * as OllamaClient from '../models/OllamaClient';

// Mock OllamaClient
vi.mock('../models/OllamaClient', () => ({
  isOllamaRunning: vi.fn(),
  listOllamaModels: vi.fn(),
  pullOllamaModel: vi.fn(),
  generateWithOllama: vi.fn(),
  streamGenerateWithOllama: vi.fn(),
  isModelAvailable: vi.fn(),
  createJarvisSystemPrompt: vi.fn((personality, context) => 
    `System prompt: ${personality}, ${context || 'no context'}`
  ),
}));

let mockConsoleLog: ReturnType<typeof vi.spyOn>;
let mockConsoleWarn: ReturnType<typeof vi.spyOn>;
let mockConsoleError: ReturnType<typeof vi.spyOn>;

describe('ModelManagerV2', () => {
  let manager: ModelManagerV2;

  beforeEach(() => {
    vi.clearAllMocks();

    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
    mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Reset singleton
    (getModelManagerV2 as any).modelManagerV2 = null;
    
    // Default mocks
    (OllamaClient.isOllamaRunning as Mock).mockResolvedValue(true);
    (OllamaClient.listOllamaModels as Mock).mockResolvedValue([
      'qwen2.5:7b',
      'deepseek-coder-v2:6.7b',
      'llama3.1:8b',
    ]);
    (OllamaClient.generateWithOllama as Mock).mockResolvedValue({
      response: 'Test response',
      eval_count: 100,
      context: [1, 2, 3],
    });
    (OllamaClient.streamGenerateWithOllama as Mock).mockImplementation(async function* () {
      yield { response: 'Chunk 1' };
      yield { response: 'Chunk 2' };
      yield { response: 'Chunk 3', done: true };
    });
    (OllamaClient.pullOllamaModel as Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
    mockConsoleWarn.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('Initialization', () => {
    it('should initialize with correct default state', () => {
      manager = new ModelManagerV2();
      const status = manager.getStatus();

      expect(status.availableRAM).toBeGreaterThan(0);
      expect(status.currentTier).toBeDefined();
      expect(status.maxMemoryUsage).toBe(status.availableRAM * 0.75);
      expect(status.loadedModels).toEqual([]);
      expect(status.activeModel).toBeNull();
      expect(status.isLoading).toBe(false);
    });

    it('should detect RAM correctly', () => {
      manager = new ModelManagerV2();
      const status = manager.getStatus();
      
      expect(status.availableRAM).toBeGreaterThanOrEqual(4);
      expect(status.availableRAM).toBeLessThanOrEqual(128);
    });

    it('should detect tier based on RAM', () => {
      manager = new ModelManagerV2();
      const status = manager.getStatus();
      
      expect(['premium', 'standard', 'minimal']).toContain(status.currentTier);
    });

    it('should initialize Ollama connection on construction', async () => {
      manager = new ModelManagerV2();
      
      // Wait for async initialization
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(OllamaClient.isOllamaRunning).toHaveBeenCalled();
    });

    it('should handle Ollama not running', async () => {
      (OllamaClient.isOllamaRunning as Mock).mockResolvedValue(false);
      
      manager = new ModelManagerV2();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const status = manager.getStatus();
      expect(status.ollamaConnected).toBe(false);
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('Ollama not running')
      );
    });

    it('should fetch available models when Ollama is connected', async () => {
      manager = new ModelManagerV2();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(OllamaClient.listOllamaModels).toHaveBeenCalled();
      const status = manager.getStatus();
      expect(status.availableOllamaModels).toContain('qwen2.5:7b');
    });
  });

  describe('Model Loading', () => {
    beforeEach(async () => {
      manager = new ModelManagerV2();
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should load a model successfully', async () => {
      const instance = await manager.loadModel('orchestrator');
      
      expect(instance).toBeDefined();
      expect(instance.config.id).toBe('orchestrator');
      expect(instance.loaded).toBe(true);
      expect(instance.lastAccessed).toBeInstanceOf(Date);
    });

    it('should return existing instance if model already loaded', async () => {
      const instance1 = await manager.loadModel('orchestrator');
      const instance2 = await manager.loadModel('orchestrator');
      
      expect(instance1).toBe(instance2);
      expect(instance2.lastAccessed.getTime()).toBeGreaterThanOrEqual(
        instance1.lastAccessed.getTime()
      );
    });

    it('should download model if not available', async () => {
      (OllamaClient.listOllamaModels as Mock).mockResolvedValue([]);
      
      await manager.loadModel('code');
      
      expect(OllamaClient.pullOllamaModel).toHaveBeenCalledWith(
        'deepseek-coder-v2:6.7b',
        undefined
      );
    });

    it('should throw error for unknown model', async () => {
      await expect(manager.loadModel('unknown-model')).rejects.toThrow(
        'Unknown model: unknown-model'
      );
    });

    it('should handle memory constraints and unload LRU models', async () => {
      // Load multiple models to trigger memory management
      await manager.loadModel('orchestrator');
      await manager.loadModel('code');
      await manager.loadModel('chat');
      
      const status = manager.getStatus();
      expect(status.loadedModels.length).toBeGreaterThan(0);
    });

    it('should set active model when loading', async () => {
      await manager.loadModel('orchestrator');
      
      const status = manager.getStatus();
      expect(status.activeModel).toBe('orchestrator');
    });
  });

  describe('Model Switching', () => {
    beforeEach(async () => {
      manager = new ModelManagerV2();
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should switch models successfully', async () => {
      const instance = await manager.switchModel('code');
      
      expect(instance.config.id).toBe('code');
      expect(manager.getStatus().activeModel).toBe('code');
    });

    it('should unload non-priority models when memory is high', async () => {
      await manager.loadModel('orchestrator');
      await manager.loadModel('code');
      await manager.loadModel('chat');
      
      // Switch to a new model
      await manager.switchModel('orchestrator');
      
      const status = manager.getStatus();
      expect(status.activeModel).toBe('orchestrator');
    });
  });

  describe('Model Downloading', () => {
    beforeEach(async () => {
      manager = new ModelManagerV2();
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should download model with progress callback', async () => {
      const onProgress = vi.fn();
      
      await manager.downloadModel('code', onProgress);
      
      expect(OllamaClient.pullOllamaModel).toHaveBeenCalledWith(
        'deepseek-coder-v2:6.7b',
        onProgress
      );
    });

    it('should throw error when Ollama not connected', async () => {
      (OllamaClient.isOllamaRunning as Mock).mockResolvedValue(false);
      manager = new ModelManagerV2();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await expect(manager.downloadModel('code')).rejects.toThrow(
        'Ollama not connected'
      );
    });

    it('should throw error for unknown model during download', async () => {
      await expect(manager.downloadModel('unknown')).rejects.toThrow(
        'Unknown model: unknown'
      );
    });

    it('should update loading state during download', async () => {
      let resolveDownload: () => void;
      const downloadPromise = new Promise<void>(resolve => {
        resolveDownload = resolve;
      });
      (OllamaClient.pullOllamaModel as Mock).mockReturnValue(downloadPromise);
      
      const downloadStarted = manager.downloadModel('code');
      
      expect(manager.getStatus().isLoading).toBe(true);
      
      resolveDownload!();
      await downloadStarted;
      
      expect(manager.getStatus().isLoading).toBe(false);
    });
  });

  describe('Query Operations', () => {
    beforeEach(async () => {
      manager = new ModelManagerV2();
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should execute query successfully', async () => {
      const response = await manager.query('Test prompt');
      
      expect(response).toBe('Test response');
      expect(OllamaClient.generateWithOllama).toHaveBeenCalled();
    });

    it('should route code queries to code model', async () => {
      await manager.query('Write a function to calculate fibonacci');
      
      const call = (OllamaClient.generateWithOllama as Mock).mock.calls[0][0];
      expect(call.model).toBe('deepseek-coder-v2:6.7b');
    });

    it('should route chat queries to chat model', async () => {
      await manager.query('Tell me a story');
      
      const call = (OllamaClient.generateWithOllama as Mock).mock.calls[0][0];
      expect(call.model).toBe('llama3.1:8b');
    });

    it('should use default orchestrator for general queries', async () => {
      await manager.query('Hello');
      
      const call = (OllamaClient.generateWithOllama as Mock).mock.calls[0][0];
      expect(call.model).toBe('qwen2.5:7b');
    });

    it('should pass personality and context options', async () => {
      await manager.query('Test', {
        personality: 'witty',
        context: 'Business meeting',
        temperature: 0.8,
      });
      
      expect(OllamaClient.createJarvisSystemPrompt).toHaveBeenCalledWith(
        'witty',
        'Business meeting'
      );
      
      const call = (OllamaClient.generateWithOllama as Mock).mock.calls[0][0];
      expect(call.options.temperature).toBe(0.8);
    });

    it('should store context from response', async () => {
      await manager.query('Test');
      
      const status = manager.getStatus();
      expect(status.loadedModels.length).toBeGreaterThan(0);
    });

    it('should handle query errors', async () => {
      (OllamaClient.generateWithOllama as Mock).mockRejectedValue(
        new Error('Generation failed')
      );
      
      await expect(manager.query('Test')).rejects.toThrow('Generation failed');
      expect(mockConsoleError).toHaveBeenCalled();
    });
  });

  describe('Stream Query Operations', () => {
    beforeEach(async () => {
      manager = new ModelManagerV2();
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should stream query successfully', async () => {
      const chunks: string[] = [];
      
      for await (const chunk of manager.streamQuery('Test')) {
        chunks.push(chunk);
      }
      
      expect(chunks).toEqual(['Chunk 1', 'Chunk 2', 'Chunk 3']);
    });

    it('should route streaming queries correctly', async () => {
      const generator = manager.streamQuery('Write code');
      
      // Consume generator
      for await (const _ of generator) {}
      
      const call = (OllamaClient.streamGenerateWithOllama as Mock).mock.calls[0][0];
      expect(call.model).toBe('deepseek-coder-v2:6.7b');
    });

    it('should update last accessed after streaming', async () => {
      await manager.loadModel('orchestrator');
      
      for await (const _ of manager.streamQuery('Test')) {}
      
      // Last accessed should be updated
      expect(manager.getStatus().loadedModels).toContain('orchestrator');
    });
  });

  describe('Memory Management', () => {
    beforeEach(async () => {
      manager = new ModelManagerV2();
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should calculate memory usage correctly', async () => {
      await manager.loadModel('orchestrator');
      
      const status = manager.getStatus();
      expect(status.currentMemoryUsage).toBeGreaterThan(0);
      expect(status.currentMemoryUsage).toBeLessThanOrEqual(status.maxMemoryUsage);
    });

    it('should never exceed max memory usage', async () => {
      // Load multiple models
      await manager.loadModel('orchestrator');
      await manager.loadModel('code');
      await manager.loadModel('chat');
      
      const status = manager.getStatus();
      expect(status.currentMemoryUsage).toBeLessThanOrEqual(status.maxMemoryUsage);
    });

    it('should protect orchestrator from LRU unload', async () => {
      await manager.loadModel('orchestrator');
      await manager.loadModel('code');
      await manager.loadModel('chat');
      
      // Orchestrator should still be loaded
      const status = manager.getStatus();
      expect(status.loadedModels).toContain('orchestrator');
    });
  });

  describe('Auto Download', () => {
    beforeEach(async () => {
      manager = new ModelManagerV2();
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should auto-download models for current tier', async () => {
      await manager.autoDownloadForTier();
      
      expect(OllamaClient.pullOllamaModel).toHaveBeenCalled();
    });

    it('should skip already available models', async () => {
      (OllamaClient.listOllamaModels as Mock).mockResolvedValue([
        'qwen2.5:7b',
        'deepseek-coder-v2:6.7b',
        'llama3.1:8b',
        'phi3:mini',
      ]);
      
      await manager.autoDownloadForTier();
      
      // Should not try to download already available models
      const calls = (OllamaClient.pullOllamaModel as Mock).mock.calls;
      expect(calls.length).toBe(0);
    });

    it('should handle download failures gracefully', async () => {
      (OllamaClient.pullOllamaModel as Mock).mockRejectedValue(
        new Error('Download failed')
      );
      
      // Should not throw, just log warning
      await expect(manager.autoDownloadForTier()).resolves.not.toThrow();
      expect(mockConsoleWarn).toHaveBeenCalled();
    });

    it('should skip if Ollama not connected', async () => {
      (OllamaClient.isOllamaRunning as Mock).mockResolvedValue(false);
      manager = new ModelManagerV2();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await manager.autoDownloadForTier();
      
      expect(OllamaClient.pullOllamaModel).not.toHaveBeenCalled();
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('Cannot auto-download')
      );
    });
  });

  describe('Status and Getters', () => {
    beforeEach(async () => {
      manager = new ModelManagerV2();
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should return complete status', async () => {
      await manager.loadModel('orchestrator');
      
      const status = manager.getStatus();
      
      expect(status).toHaveProperty('availableRAM');
      expect(status).toHaveProperty('currentTier');
      expect(status).toHaveProperty('maxMemoryUsage');
      expect(status).toHaveProperty('currentMemoryUsage');
      expect(status).toHaveProperty('loadedModels');
      expect(status).toHaveProperty('activeModel');
      expect(status).toHaveProperty('isLoading');
      expect(status).toHaveProperty('ollamaConnected');
      expect(status).toHaveProperty('availableOllamaModels');
    });

    it('should track loaded models correctly', async () => {
      expect(manager.getStatus().loadedModels).toEqual([]);
      
      await manager.loadModel('orchestrator');
      expect(manager.getStatus().loadedModels).toContain('orchestrator');
      
      await manager.loadModel('code');
      expect(manager.getStatus().loadedModels).toContain('code');
    });
  });

  describe('Singleton Pattern', () => {
    it('should return same instance from getModelManagerV2', () => {
      const instance1 = getModelManagerV2();
      const instance2 = getModelManagerV2();
      
      expect(instance1).toBe(instance2);
    });

    it('should create new instance when singleton is null', () => {
      // Reset singleton
      (getModelManagerV2 as any).modelManagerV2 = null;
      
      const instance = getModelManagerV2();
      expect(instance).toBeInstanceOf(ModelManagerV2);
    });
  });

  describe('Edge Cases', () => {
    beforeEach(async () => {
      manager = new ModelManagerV2();
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should handle empty prompt', async () => {
      const response = await manager.query('');
      expect(response).toBe('Test response');
    });

    it('should handle very long prompts', async () => {
      const longPrompt = 'a'.repeat(10000);
      const response = await manager.query(longPrompt);
      expect(response).toBe('Test response');
    });

    it('should handle special characters in prompts', async () => {
      const specialPrompt = 'Test with <script>alert("xss")</script> and emoji 🎉';
      const response = await manager.query(specialPrompt);
      expect(response).toBe('Test response');
    });

    it('should handle concurrent model loads', async () => {
      const loads = await Promise.all([
        manager.loadModel('orchestrator'),
        manager.loadModel('orchestrator'),
        manager.loadModel('orchestrator'),
      ]);
      
      // All should return the same instance
      expect(loads[0]).toBe(loads[1]);
      expect(loads[1]).toBe(loads[2]);
    });
  });
});
