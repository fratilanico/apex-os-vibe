export interface AIRequest {
  message: string;
  context?: string;
  history?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  systemPrompt?: string;
  preferredProvider?: 'auto' | 'vertex' | 'vertex-ai' | 'gemini' | 'perplexity' | 'groq' | 'cohere';
  preferredModel?: 'auto' | 'fast' | 'pro';
  userEmail?: string;
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
}

function looksLikeTokenDump(input: string): boolean {
  const t = (input || '').trim();
  if (t.length < 80) return false;
  if (/^[0-9-]+$/.test(t) && t.replace(/-/g, '').length >= 80) return true;
  const compact = t.replace(/\s+/g, '');
  if (compact.length >= 120 && /^[A-Za-z0-9+/_=-]+$/.test(compact)) return true;
  if (compact.length >= 96 && /^[a-f0-9]+$/i.test(compact)) return true;
  const letters = (t.match(/[A-Za-z]/g) || []).length;
  if (t.length >= 120 && letters / t.length < 0.05) return true;
  return false;
}

function getCookieValue(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const parts = document.cookie.split(';').map(p => p.trim());
  const prefix = `${name}=`;
  for (const p of parts) {
    if (p.startsWith(prefix)) return decodeURIComponent(p.slice(prefix.length));
  }
  return undefined;
}

function setCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (typeof document === 'undefined') return;
  const isHttps = typeof location !== 'undefined' && location.protocol === 'https:';
  const attrs = [
    `Path=/`,
    `Max-Age=${maxAgeSeconds}`,
    `SameSite=Lax`,
  ];
  if (isHttps) attrs.push('Secure');
  document.cookie = `${name}=${encodeURIComponent(value)}; ${attrs.join('; ')}`;
}

function generateSessionId(): string {
  // Browser-first, no dependency on Node crypto.
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c: any = (globalThis as any).crypto;
    if (c?.randomUUID) return String(c.randomUUID());
  } catch {}
  return `sid_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateClientSessionId(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const storageKey = 'apex_client_session_id';
  const cookieKey = 'apex_sid';
  try {
    const fromStorage = window.localStorage?.getItem(storageKey) || undefined;
    if (fromStorage) {
      if (!getCookieValue(cookieKey)) setCookie(cookieKey, fromStorage, 60 * 60 * 24 * 30);
      return fromStorage;
    }
  } catch {}

  const fromCookie = getCookieValue(cookieKey);
  if (fromCookie) {
    try { window.localStorage?.setItem('apex_client_session_id', fromCookie); } catch {}
    return fromCookie;
  }

  const created = generateSessionId();
  try { window.localStorage?.setItem(storageKey, created); } catch {}
  setCookie(cookieKey, created, 60 * 60 * 24 * 30);
  return created;
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
}

/**
 * Query AI with automatic fallback chain
 * Calls unified endpoint with provider registry + fallback
 */
export async function queryAI(request: AIRequest): Promise<AIResponse> {
  const startTime = Date.now();

  // Guardrail: avoid accidentally sending token/id dumps to the AI endpoint.
  // This also prevents poisoning history-based inference on the server.
  if (looksLikeTokenDump(request.message)) {
    return {
      content: 'Input rejected: looks like a token/id dump. Paste your actual goal/question (human text).',
      provider: 'offline',
      model: 'client-guard',
      latency: Date.now() - startTime,
      tier: 0,
      cached: false,
    };
  }

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
    const clientSessionId = getOrCreateClientSessionId();
    const enrichedContext = [
      request.context,
      clientSessionId ? `ClientSessionId: ${clientSessionId}` : undefined,
    ].filter(Boolean).join(' ');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        message: request.message,
        history: request.history || [],
        context: enrichedContext,
        systemPrompt: request.systemPrompt,
        preferredProvider: request.preferredProvider,
        preferredModel: request.preferredModel,
        userEmail: request.userEmail,
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
