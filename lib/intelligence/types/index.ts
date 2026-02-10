/**
 * APEX OS - AI Intelligence Layer v2.0
 * Core Types and Interfaces
 * 
 * Architecture: Multi-model AI system with persona-aware responses
 * Last Updated: 2026-02-10
 * Status: ACTIVE IMPLEMENTATION
 */

export type AIProvider = 'deepseek' | 'gemini' | 'perplexity' | 'vertex' | 'claude';

export type UserPersona = 
  | 'founder' 
  | 'developer' 
  | 'investor' 
  | 'student' 
  | 'enterprise' 
  | 'researcher';

export type IntentType = 
  | 'coding' 
  | 'research' 
  | 'learning' 
  | 'strategy' 
  | 'technical' 
  | 'general';

export type QueryUrgency = 'low' | 'medium' | 'high' | 'critical';

export interface IntelligenceQuery {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
  context?: QueryContext;
}

export interface QueryContext {
  persona: UserPersona;
  conversationHistory: ConversationMessage[];
  sessionData: SessionData;
  userProfile: UserProfile;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  provider?: AIProvider;
}

export interface SessionData {
  sessionId: string;
  startTime: number;
  queryCount: number;
  topicsDiscussed: string[];
}

export interface UserProfile {
  id: string;
  persona: UserPersona;
  expertiseLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  interests: string[];
  learningGoals: string[];
  companyStage?: 'idea' | 'seed' | 'series-a' | 'growth' | 'enterprise';
  techStack?: string[];
}

export interface ParsedIntent {
  type: IntentType;
  entities: string[];
  urgency: QueryUrgency;
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
}

export interface AIServiceConfig {
  provider: AIProvider;
  endpoint: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  timeout: number;
}

export interface IntelligenceResponse {
  id: string;
  queryId: string;
  text: string;
  provider: AIProvider;
  model: string;
  timestamp: number;
  tokensUsed: number;
  cost: number;
  formattedForPersona: boolean;
  metadata: ResponseMetadata;
}

export interface ResponseMetadata {
  intent: IntentType;
  processingTime: number;
  fallbackUsed: boolean;
  cacheHit: boolean;
  sources?: string[];
}

export interface StudyRecommendation {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'module' | 'playbook' | 'article' | 'video' | 'resource';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  relevanceScore: number;
  tags: string[];
  prerequisites: string[];
  url: string;
  matchReason: string;
}

export interface MicroQuestion {
  id: string;
  question: string;
  options: string[];
  category: 'persona' | 'expertise' | 'interests' | 'goals';
  weight: number;
}

export interface PersonaPrompt {
  persona: UserPersona;
  systemPrompt: string;
  formattingRules: string[];
  tone: string;
  examples: string[];
}

export interface AuditLog {
  timestamp: number;
  event: string;
  queryId?: string;
  userId?: string;
  provider?: AIProvider;
  status: 'success' | 'error' | 'fallback';
  details: Record<string, unknown>;
}
