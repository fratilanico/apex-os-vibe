/**
 * Query Parser - Intent Classification & Entity Extraction
 * APEX OS Intelligence Layer v2.0
 */

import { 
  IntelligenceQuery, 
  ParsedIntent, 
  IntentType, 
  QueryUrgency 
} from '../types';

export class QueryParser {
  private codingKeywords = [
    'code', 'programming', 'debug', 'error', 'implementation', 
    'function', 'api', 'javascript', 'python', 'react', 'sql',
    'typescript', 'database', 'algorithm', 'deploy', 'build',
    'component', 'hooks', 'refactor', 'git', 'github', 'vercel',
    'nextjs', 'css', 'html', 'backend', 'frontend', 'fullstack',
    'vibe-coding', 'cursor', 'claude code', 'copilot', 'coding'
  ];

  private researchKeywords = [
    'research', 'market', 'competitor', 'trends', 'statistics',
    'latest', 'news', 'report', 'study', 'analysis', 'benchmark',
    'data', 'survey', 'industry', 'landscape', 'mrr', 'valuation',
    'funding', 'startup', 'vc', 'venture capital', 'market size',
    'perplexity', 'search the web', 'market analysis', 'competitive'
  ];

  private learningKeywords = [
    'learn', 'tutorial', 'course', 'module', 'lesson', 'how to',
    'guide', 'explain', 'understand', 'basics', 'fundamentals',
    'education', 'training', 'study', 'syllabus', 'curriculum',
    'beginner', 'pathway', 'steps to', 'curriculum', 'academy'
  ];

  private strategyKeywords = [
    'strategy', 'plan', 'roadmap', 'vision', 'mission', 'goal',
    'objective', 'tactics', 'approach', 'framework', 'methodology',
    'gtm', 'go-to-market', 'scale', 'growth', 'business model',
    'pitch deck', 'investor', 'tam', 'cac', 'ltv', 'revenue'
  ];

  private urgencyKeywords: Record<QueryUrgency, string[]> = {
    critical: ['urgent', 'asap', 'emergency', 'critical', 'down', 'broken', 'error', 'fatal', 'blocking'],
    high: ['important', 'priority', 'needed', 'required', 'soon', 'quickly'],
    medium: ['help', 'question', 'advice', 'suggestion', 'how', 'what'],
    low: ['curious', 'wondering', 'thinking', 'considering', 'maybe', 'eventually']
  };

  async parse(query: IntelligenceQuery): Promise<ParsedIntent> {
    const lowerText = query.text.toLowerCase();
    
    // Classify intent
    const intent = this.classifyIntent(lowerText);
    
    // Extract entities
    const entities = this.extractEntities(lowerText);
    
    // Detect urgency
    const urgency = this.detectUrgency(lowerText);
    
    // Analyze sentiment
    const sentiment = this.analyzeSentiment(lowerText);
    
    // Calculate confidence
    const confidence = this.calculateConfidence(intent, entities, lowerText);

    return {
      type: intent,
      entities,
      urgency,
      sentiment,
      confidence
    };
  }

  private classifyIntent(text: string): IntentType {
    let scores: Record<IntentType, number> = {
      coding: 0,
      research: 0,
      learning: 0,
      strategy: 0,
      technical: 0,
      general: 0
    };

    // Score each category
    this.codingKeywords.forEach(keyword => {
      if (text.includes(keyword)) scores.coding += 1;
    });

    this.researchKeywords.forEach(keyword => {
      if (text.includes(keyword)) scores.research += 1;
    });

    this.learningKeywords.forEach(keyword => {
      if (text.includes(keyword)) scores.learning += 1;
    });

    this.strategyKeywords.forEach(keyword => {
      if (text.includes(keyword)) scores.strategy += 1;
    });

    // Technical queries often have technical terms but are not necessarily coding
    if (text.includes('how to') || text.includes('setup') || text.includes('configure') || text.includes('install')) {
      scores.technical += 1.5;
    }

    // Weight strategy more if specific business terms are used
    if (text.includes('roadmap') || text.includes('business') || text.includes('market')) {
      scores.strategy += 0.5;
    }

    // Find highest score
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topResult = sorted[0];
    
    // If no clear winner, default to general
    if (!topResult || topResult[1] === 0) {
      return 'general';
    }

    return topResult[0] as IntentType;
  }

  private extractEntities(text: string): string[] {
    const entities: string[] = [];
    
    // Extract tech stack mentions
    const techPattern = /\b(react|vue|angular|node|python|javascript|typescript|sql|aws|gcp|azure|nextjs|tailwind|supabase|vercel|docker|kubernetes)\b/gi;
    const techMatches = text.match(techPattern);
    if (techMatches) {
      entities.push(...techMatches.map(m => m.toLowerCase()));
    }

    // Extract company/product mentions
    const companyPattern = /\b(claude|gpt|gemini|perplexity|notion|figma|vercel|stripe|github|deepseek|openai|anthropic|google|microsoft|meta)\b/gi;
    const companyMatches = text.match(companyPattern);
    if (companyMatches) {
      entities.push(...companyMatches.map(m => m.toLowerCase()));
    }

    // Extract stage mentions
    const stagePattern = /\b(seed|series a|series b|startup|enterprise|pre-seed|growth|scale)\b/gi;
    const stageMatches = text.match(stagePattern);
    if (stageMatches) {
      entities.push(...stageMatches.map(m => m.toLowerCase()));
    }

    // Extract financial terms
    const financePattern = /\b(mrr|arr|ltv|cac|roi|valuation|equity|funding|round)\b/gi;
    const financeMatches = text.match(financePattern);
    if (financeMatches) {
      entities.push(...financeMatches.map(m => m.toLowerCase()));
    }

    return [...new Set(entities)]; // Remove duplicates
  }

  private detectUrgency(text: string): QueryUrgency {
    for (const [level, keywords] of Object.entries(this.urgencyKeywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return level as QueryUrgency;
        }
      }
    }
    return 'medium';
  }

  private analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['great', 'awesome', 'love', 'best', 'good', 'excellent', 'thanks'];
    const negativeWords = ['bad', 'terrible', 'hate', 'worst', 'error', 'bug', 'issue', 'problem'];
    
    let score = 0;
    
    positiveWords.forEach(word => {
      if (text.includes(word)) score += 1;
    });
    
    negativeWords.forEach(word => {
      if (text.includes(word)) score -= 1;
    });

    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
  }

  private calculateConfidence(
    intent: IntentType, 
    entities: string[], 
    text: string
  ): number {
    let confidence = 0.5; // Base confidence

    // More entities = higher confidence
    confidence += Math.min(entities.length * 0.05, 0.2);

    // Longer queries tend to be clearer
    if (text.length > 50) confidence += 0.1;

    // Coding queries with specific syntax = high confidence
    if (intent === 'coding' && (text.includes('```') || text.includes('function'))) {
      confidence += 0.2;
    }

    return Math.min(confidence, 1.0);
  }
}
