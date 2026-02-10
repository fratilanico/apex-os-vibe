/**
 * Service Router - Multi-Model AI Service Management
 * APEX OS Intelligence Layer v2.0
 * 
 * STATUS: 
 * ✅ Gemini - FULLY IMPLEMENTED
 * ✅ Perplexity - FULLY IMPLEMENTED  
 * ⏳ DeepSeek - CONFIGURED (Pending API key)
 */

import { 
  AIProvider, 
  AIServiceConfig, 
  IntelligenceResponse, 
  IntelligenceQuery,
  ParsedIntent,
  UserPersona
} from '../types';

export class ServiceRouter {
  private configs: Map<AIProvider, AIServiceConfig> = new Map();
  private costTracker: Map<string, number> = new Map();

  constructor() {
    this.initializeConfigs();
  }

  private initializeConfigs(): void {
    // Gemini Configuration - ACTIVE
    this.configs.set('gemini', {
      provider: 'gemini',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
      model: 'gemini-1.5-pro',
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: this.getBaseSystemPrompt(),
      timeout: 10000
    });

    // Perplexity Configuration - ACTIVE
    this.configs.set('perplexity', {
      provider: 'perplexity',
      endpoint: 'https://api.perplexity.ai/chat/completions',
      model: 'sonar-reasoning-pro',
      temperature: 0.5,
      maxTokens: 2048,
      systemPrompt: this.getResearchSystemPrompt(),
      timeout: 15000
    });

    // DeepSeek Configuration - PENDING (API key needed)
    this.configs.set('deepseek', {
      provider: 'deepseek',
      endpoint: 'https://api.deepseek.com/v1/chat/completions',
      model: 'deepseek-coder-33b',
      temperature: 0.3,
      maxTokens: 2048,
      systemPrompt: this.getCodingSystemPrompt(),
      timeout: 10000
    });
  }

  /**
   * Select the best AI service based on query intent
   */
  selectService(intent: ParsedIntent, _persona: UserPersona): AIProvider {
    // Research queries → Perplexity
    if (intent.type === 'research') {
      return 'perplexity';
    }

    // Coding queries → DeepSeek (fallback to Gemini)
    if (intent.type === 'coding') {
      // TODO: Return 'deepseek' when API key is available
      // For now, use Gemini as fallback
      return 'gemini';
    }

    // Technical queries → Gemini
    if (intent.type === 'technical') {
      return 'gemini';
    }

    // Strategy/Learning → Gemini
    if (intent.type === 'strategy' || intent.type === 'learning') {
      return 'gemini';
    }

    // Default to Gemini
    return 'gemini';
  }

  /**
   * Route query to appropriate AI service
   */
  async routeQuery(
    query: IntelligenceQuery, 
    intent: ParsedIntent,
    persona: UserPersona
  ): Promise<IntelligenceResponse> {
    const provider = this.selectService(intent, persona);
    const startTime = Date.now();

    try {
      let response: IntelligenceResponse;

      switch (provider) {
        case 'perplexity':
          response = await this.callPerplexity(query, intent);
          break;
        case 'gemini':
          response = await this.callGemini(query, intent);
          break;
        case 'deepseek':
          // TODO: Implement DeepSeek when API key available
          // For now, fallback to Gemini
          console.log('⚠️ DeepSeek not available, falling back to Gemini');
          response = await this.callGemini(query, intent);
          break;
        default:
          response = await this.callGemini(query, intent);
      }

      // Add metadata
      response.metadata.processingTime = Date.now() - startTime;
      response.metadata.fallbackUsed = provider !== this.selectService(intent, persona);

      // Track cost
      this.trackCost(provider, response.tokensUsed);

      return response;

    } catch (error) {
      // Fallback to Gemini on error
      console.error(`❌ ${provider} failed, falling back to Gemini:`, error);
      return this.callGemini(query, intent);
    }
  }

  /**
   * Call Perplexity API - FULLY IMPLEMENTED
   */
  private async callPerplexity(
    query: IntelligenceQuery, 
    intent: ParsedIntent
  ): Promise<IntelligenceResponse> {
    const config = this.configs.get('perplexity')!;
    const apiKey = typeof process !== 'undefined' ? process.env.PERPLEXITY_API_KEY : undefined;

    if (!apiKey) {
      throw new Error('PERPLEXITY_API_KEY not configured');
    }

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: config.systemPrompt },
          { role: 'user', content: query.text }
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return {
      id: `resp_${Date.now()}`,
      queryId: query.id,
      text: content,
      provider: 'perplexity',
      model: config.model,
      timestamp: Date.now(),
      tokensUsed: data.usage?.total_tokens || 0,
      cost: this.calculateCost('perplexity', data.usage?.total_tokens || 0),
      formattedForPersona: false,
      metadata: {
        intent: intent.type,
        processingTime: 0,
        fallbackUsed: false,
        cacheHit: false,
        sources: data.citations || []
      }
    };
  }

  /**
   * Call Gemini API - FULLY IMPLEMENTED
   */
  private async callGemini(
    query: IntelligenceQuery, 
    intent?: ParsedIntent
  ): Promise<IntelligenceResponse> {
    const config = this.configs.get('gemini')!;
    const apiKey = typeof process !== 'undefined' ? (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY) : undefined;

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const response = await fetch(`${config.endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${config.systemPrompt}\n\nUser: ${query.text}`
          }]
        }],
        generationConfig: {
          temperature: config.temperature,
          maxOutputTokens: config.maxTokens
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;

    return {
      id: `resp_${Date.now()}`,
      queryId: query.id,
      text: content,
      provider: 'gemini',
      model: config.model,
      timestamp: Date.now(),
      tokensUsed: 0, // Gemini doesn't return token count
      cost: 0, // Gemini is currently free
      formattedForPersona: false,
      metadata: {
        intent: intent?.type || 'general',
        processingTime: 0,
        fallbackUsed: false,
        cacheHit: false
      }
    };
  }

  // DeepSeek integration is PENDING
  // Method callDeepSeek() will be implemented when DEEPSEEK_API_KEY is available
  // For now, coding queries fall back to Gemini

  private getBaseSystemPrompt(): string {
    return `You are APEX OS, an advanced AI assistant for entrepreneurs and developers.
You provide clear, actionable advice on AI orchestration, vibe-coding, and business strategy.
Be concise, practical, and focused on implementation.`;
  }

  private getResearchSystemPrompt(): string {
    return `You are APEX OS Research Assistant. Provide comprehensive research with citations.
Focus on: AI trends, market analysis, competitive landscape, and industry benchmarks.
Always cite sources and provide recent data.`;
  }

  private getCodingSystemPrompt(): string {
    return `You are APEX OS Coding Assistant. Provide clean, well-commented code.
Focus on: TypeScript, React, Python, and AI integration patterns.
Explain your reasoning and provide working examples.`;
  }

  private calculateCost(provider: AIProvider, tokens: number): number {
    // Cost per 1K tokens
    const rates: Record<AIProvider, number> = {
      gemini: 0, // Currently free
      perplexity: 0.02,
      deepseek: 0.001,
      vertex: 0.0035,
      claude: 0.008
    };

    return (tokens / 1000) * (rates[provider] || 0);
  }

  private trackCost(provider: AIProvider, tokens: number): void {
    const current = this.costTracker.get(provider) || 0;
    this.costTracker.set(provider, current + this.calculateCost(provider, tokens));
  }

  getCostReport(): Record<string, number> {
    return Object.fromEntries(this.costTracker);
  }
}
