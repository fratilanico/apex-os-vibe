import { queryAI as baseQueryAI, AIRequest, AIResponse } from './globalAIService';

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENT-SIDE GPT ACCELERATION LAYER
// Caching | Deduplication | Batching | Prefetching
// ═══════════════════════════════════════════════════════════════════════════════

interface CacheEntry {
  response: AIResponse;
  timestamp: number;
  ttl: number;
}

interface PendingRequest {
  promise: Promise<AIResponse>;
  timestamp: number;
}

class ClientAICache {
  private cache = new Map<string, CacheEntry>();
  private pendingRequests = new Map<string, PendingRequest>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 100;

  private generateKey(request: AIRequest): string {
    const key = `${request.message}:${request.systemPrompt || ''}:${request.preferredProvider || 'auto'}`;
    // Use simple hash instead of btoa to avoid undefined issues
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return String(Math.abs(hash));
  }

  get(request: AIRequest): AIResponse | null {
    const key = this.generateKey(request);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check TTL
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    // Return cached response with cached flag
    return {
      ...entry.response,
      cached: true,
      latency: 0, // Instant
    };
  }

  set(request: AIRequest, response: AIResponse, ttl?: number): void {
    const key = this.generateKey(request);
    
    // Evict oldest if at capacity
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    
    this.cache.set(key, {
      response,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL,
    });
  }

  hasPending(request: AIRequest): Promise<AIResponse> | null {
    const key = this.generateKey(request);
    const pending = this.pendingRequests.get(key);
    
    if (!pending) return null;
    
    // Clear if too old (stale request)
    if (Date.now() - pending.timestamp > 30000) {
      this.pendingRequests.delete(key);
      return null;
    }
    
    return pending.promise;
  }

  setPending(request: AIRequest, promise: Promise<AIResponse>): void {
    const key = this.generateKey(request);
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now(),
    });
    
    // Clean up pending after completion
    promise.finally(() => {
      setTimeout(() => this.pendingRequests.delete(key), 1000);
    });
  }

  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  // Preload common responses
  async prefetch(requests: AIRequest[]): Promise<void> {
    const uncachedRequests = requests.filter(r => !this.get(r));
    
    // Process in batches of 3 to avoid overwhelming the API
    for (let i = 0; i < uncachedRequests.length; i += 3) {
      const batch = uncachedRequests.slice(i, i + 3);
      await Promise.all(
        batch.map(async (req) => {
          try {
            const response = await baseQueryAI(req);
            this.set(req, response, 10 * 60 * 1000); // Longer TTL for prefetched
          } catch (e) {
            // Silently fail prefetch
          }
        })
      );
      
      // Small delay between batches
      if (i + 3 < uncachedRequests.length) {
        await new Promise(r => setTimeout(r, 100));
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// OPTIMIZED AI SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

const cache = new ClientAICache();

// Common waitlist responses to prefetch
const PREFETCH_QUERIES: AIRequest[] = [
  {
    message: 'What is APEX OS?',
    systemPrompt: 'Brief 2-sentence explanation for landing page',
    preferredModel: 'fast',
  },
  {
    message: 'How does the AI orchestration work?',
    systemPrompt: 'Simple technical explanation',
    preferredModel: 'fast',
  },
  {
    message: 'What makes this different from other AI tools?',
    systemPrompt: 'Differentiation focus',
    preferredModel: 'fast',
  },
];

export async function queryAIOptimized(request: AIRequest): Promise<AIResponse> {
  // 1. Check cache first (instant response)
  const cached = cache.get(request);
  if (cached) {
    console.log('[AI Client] Cache hit:', request.message.slice(0, 50));
    return cached;
  }
  
  // 2. Check for pending identical request (deduplication)
  const pending = cache.hasPending(request);
  if (pending) {
    console.log('[AI Client] Deduplicating request');
    return pending;
  }
  
  // 3. Create promise and track as pending
  const promise = (async (): Promise<AIResponse> => {
    try {
      // Use batching for non-urgent requests
      const response = await baseQueryAI(request);
      
      // Cache the response
      cache.set(request, response);
      
      return response;
    } catch (error) {
      console.error('[AI Client] Request failed:', error);
      throw error;
    }
  })();
  
  cache.setPending(request, promise);
  
  return promise;
}

// Prefetch common responses on page load
export function prefetchCommonResponses(): void {
  // Delay prefetch until after initial page load
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      console.log('[AI Client] Prefetching common responses...');
      cache.prefetch(PREFETCH_QUERIES).catch(() => {
        // Silently fail
      });
    }, 2000);
  }
}

// Streaming response for better UX (simulated progressive display)
export async function* queryAIStreaming(request: AIRequest): AsyncGenerator<string, AIResponse, unknown> {
  const response = await queryAIOptimized(request);
  
  // Simulate streaming by yielding chunks
  const words = response.content.split(' ');
  let accumulated = '';
  
  for (const word of words) {
    accumulated += word + ' ';
    yield accumulated.trim();
    await new Promise(r => setTimeout(r, 20)); // 20ms per word
  }
  
  return response;
}

// Export cache management
export const AICache = {
  clear: () => cache.clear(),
  prefetch: (requests: AIRequest[]) => cache.prefetch(requests),
};

// Re-export base query for direct use when needed
export { baseQueryAI as queryAIRaw };
