export interface AIRequest {
  message: string;
  context?: string;
  history?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  systemPrompt?: string;
  preferredProvider?: 'auto' | 'vertex' | 'vertex-ai' | 'gemini' | 'perplexity' | 'groq' | 'cohere';
  preferredModel?: 'auto' | 'fast' | 'pro';
  userEmail?: string;
  userId?: string;
  sessionId?: string;
  stateHints?: {
    name?: string;
    email?: string;
    phone?: string;
    persona?: 'PERSONAL' | 'BUSINESS' | null;
    goal?: string;
    currentStep?:
      | 'boot'
      | 'email_guard'
      | 'onboarding_name'
      | 'onboarding_phone'
      | 'handshake'
      | 'dynamic_discovery'
      | 'validation'
      | 'processing'
      | 'unlocked';
    unlocked?: boolean;
    mode?: 'STANDARD' | 'GEEK';
  };
  /** Optional base URL override for server-side calls */
  baseUrl?: string;
}

export interface AIResponse {
  content: string;
  provider: 'vertex-ai' | 'gemini' | 'perplexity' | 'groq' | 'cohere' | 'offline';
  model: string;
  latency: number;
  tier: number;
  cached?: boolean;
  citations?: string[];
  requestId?: string;
  debug?: {
    requestedProvider?: string;
    preferredModel?: string;
    mode?: string;
    pathname?: string;
    attempts?: Array<{
      provider: string;
      enabled: boolean;
      healthy?: boolean;
      success: boolean;
      error?: string;
      durationMs?: number;
    }>;
  };
  decisionTrace?: Record<string, unknown>;
  nextBestAction?: Record<string, unknown>;
  recommendations?: Record<string, unknown>;
  stateSnapshot?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED AI SERVICE - Client-side wrapper for fallback API
// ═══════════════════════════════════════════════════════════════════════════════

export interface UnifiedAIResponse {
  content: string;
  provider: 'vertex-ai' | 'gemini' | 'perplexity' | 'groq' | 'cohere' | 'offline';
  model: string;
  latency: number;
  tier: number;
  error?: string;
  requestId?: string;
  debug?: AIResponse['debug'];
  decisionTrace?: AIResponse['decisionTrace'];
  nextBestAction?: AIResponse['nextBestAction'];
  recommendations?: AIResponse['recommendations'];
  stateSnapshot?: AIResponse['stateSnapshot'];
}

/**
 * Query AI with automatic fallback chain
 * Calls unified endpoint with provider registry + fallback
 */
export async function queryAI(request: AIRequest): Promise<AIResponse> {
  const startTime = Date.now();
  const isServer = typeof window === 'undefined';
  const baseUrl = request.baseUrl
    || (isServer
        ? process.env.INTERNAL_API_BASE || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3000')
        : '');
  const apiUrl = `${baseUrl}/api/ai-unified`;
  const controller = new AbortController();
  const timeoutMs = 45000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        message: request.message,
        history: request.history || [],
        context: request.context,
        systemPrompt: request.systemPrompt,
        preferredProvider: request.preferredProvider,
        preferredModel: request.preferredModel,
        userEmail: request.userEmail,
        userId: request.userId,
        sessionId: request.sessionId,
        stateHints: request.stateHints,
        debug: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const data: UnifiedAIResponse = await response.json();

    // Enforcement now happens server-side only (api/ai-unified.ts)
    // Removed client-side double enforcement 2026-02-08
    
    return {
      content: data.content,
      provider: data.provider as AIResponse['provider'],
      model: data.model,
      latency: data.latency,
      tier: data.tier,
      cached: false,
      requestId: data.requestId,
      debug: data.debug,
      decisionTrace: data.decisionTrace,
      nextBestAction: data.nextBestAction,
      recommendations: data.recommendations,
      stateSnapshot: data.stateSnapshot,
    };
  } catch (error) {
    console.error('[Unified AI] Request failed:', error);
    if ((error as Error).name === 'AbortError') {
      return {
        content: '⚠️ REQUEST_TIMEOUT: The AI provider took too long to respond. Please try again.',
        provider: 'offline',
        model: 'timeout',
        latency: Date.now() - startTime,
        tier: 0,
        cached: false,
      };
    }
    return {
      content: `I'm currently experiencing connectivity issues. Please try again in a moment.`,
      provider: 'offline',
      model: 'fallback',
      latency: Date.now() - startTime,
      tier: 0,
      cached: false,
    };
  } finally {
    clearTimeout(timeout);
  }
}

// Legacy exports for backward compatibility
export { queryAI as callPerplexity };
export { queryAI as callGroq };
export { queryAI as callGemini };
export { queryAI as callCohere };
