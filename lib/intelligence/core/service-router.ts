import { 
  AIProvider, 
  AIServiceConfig, 
  IntelligenceResponse, 
  IntelligenceQuery,
  ParsedIntent,
  UserPersona
} from '../types';
import { complianceEnforcer } from '../../agents/complianceEnforcer';

/**
 * Service Router - Multi-Model AI Swarm Orchestrator
 * APEX OS Intelligence Layer v2.0
 */
export class ServiceRouter {
  private configs: Map<AIProvider, AIServiceConfig> = new Map();

  constructor() {
    this.initializeConfigs();
  }

  private initializeConfigs(): void {
    // Gemini 1.5 Pro - Primary General Intelligence
    this.configs.set('gemini', {
      provider: 'gemini',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
      model: 'gemini-1.5-pro',
      temperature: 0.7,
      maxTokens: 4096,
      systemPrompt: '',
      timeout: 15000
    });

    // Perplexity - Real-time Research & Knowledge
    this.configs.set('perplexity', {
      provider: 'perplexity',
      endpoint: 'https://api.perplexity.ai/chat/completions',
      model: 'sonar-reasoning-pro',
      temperature: 0.5,
      maxTokens: 4096,
      systemPrompt: '',
      timeout: 20000
    });

    // DeepSeek - Technical & Coding
    this.configs.set('deepseek', {
      provider: 'deepseek',
      endpoint: 'https://api.deepseek.com/v1/chat/completions',
      model: 'deepseek-coder',
      temperature: 0.2,
      maxTokens: 8192,
      systemPrompt: '',
      timeout: 30000
    });
  }

  async routeQuery(
    query: IntelligenceQuery, 
    intent: ParsedIntent,
    persona: UserPersona
  ): Promise<IntelligenceResponse> {
    // 1. Determine Primary Provider
    let primary: AIProvider = 'gemini';
    if (intent.type === 'coding' || intent.type === 'technical') primary = 'deepseek';
    if (intent.type === 'research') primary = 'perplexity';

    // 2. Fallback Chain
    const chain: AIProvider[] = [primary];
    if (primary !== 'gemini') chain.push('gemini');
    if (!chain.includes('perplexity')) chain.push('perplexity');

    // 3. Execute with Fallbacks
    let lastError: Error | null = null;
    const startTime = Date.now();

    for (const provider of chain) {
      try {
        const response = await this.executeCall(provider, query, persona);
        
        // 4. Compliance & Enforcement
        const enforced = complianceEnforcer.enforce(response.text, provider);
        response.text = enforced.output;
        
        response.metadata.processingTime = Date.now() - startTime;
        response.metadata.fallbackUsed = provider !== primary;
        
        return response;
      } catch (err) {
        lastError = err as Error;
        console.error(`[ServiceRouter] ${provider} failed:`, err);
      }
    }

    throw lastError || new Error('All AI providers failed');
  }

  private async executeCall(
    provider: AIProvider, 
    query: IntelligenceQuery,
    persona: UserPersona
  ): Promise<IntelligenceResponse> {
    // This is a proxy to the server-side unified API
    // We keep the heavy lifting on the server to protect keys
    const response = await fetch('/api/ai-unified', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: query.text,
        userId: query.userId,
        preferredProvider: provider,
        context: `Persona: ${persona}. Intent: ${query.context?.sessionData?.topicsDiscussed?.join(', ')}`
      })
    });

    if (!response.ok) {
      throw new Error(`${provider} request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      id: `resp_${Date.now()}`,
      queryId: query.id,
      text: data.content,
      provider: data.provider,
      model: data.model,
      timestamp: Date.now(),
      tokensUsed: 0,
      cost: 0,
      formattedForPersona: true,
      metadata: {
        intent: 'general',
        processingTime: data.latency,
        fallbackUsed: false,
        cacheHit: false,
        sources: data.meta?.sources
      }
    };
  }
}

