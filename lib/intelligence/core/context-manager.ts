/**
 * Context Manager - User Persona State & Session Management
 * APEX OS Intelligence Layer v2.0
 */

import { 
  UserProfile, 
  SessionData, 
  ConversationMessage,
  UserPersona,
  QueryContext 
} from '../types';

export class ContextManager {
  private userProfiles: Map<string, UserProfile> = new Map();
  private sessions: Map<string, SessionData> = new Map();
  private conversations: Map<string, ConversationMessage[]> = new Map();

  async getUserProfile(userId: string): Promise<UserProfile> {
    if (this.userProfiles.has(userId)) {
      return this.userProfiles.get(userId)!;
    }

    // Create default profile for new users
    const defaultProfile: UserProfile = {
      id: userId,
      persona: 'founder',
      expertiseLevel: 'intermediate',
      interests: [],
      learningGoals: [],
    };

    this.userProfiles.set(userId, defaultProfile);
    return defaultProfile;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const existing = await this.getUserProfile(userId);
    const updated = { ...existing, ...updates };
    this.userProfiles.set(userId, updated);
    return updated;
  }

  async detectPersona(userId: string, queryText: string): Promise<UserPersona> {
    const text = queryText.toLowerCase();
    
    // Developer indicators
    if (text.includes('code') || text.includes('api') || text.includes('deploy') || 
        text.includes('debug') || text.includes('github')) {
      return 'developer';
    }

    // Investor indicators
    if (text.includes('valuation') || text.includes('equity') || text.includes('invest') ||
        text.includes('series') || text.includes('funding') || text.includes('roi')) {
      return 'investor';
    }

    // Student indicators
    if (text.includes('learn') || text.includes('course') || text.includes('tutorial') ||
        text.includes('beginner') || text.includes('study')) {
      return 'student';
    }

    // Enterprise indicators
    if (text.includes('enterprise') || text.includes('scale') || text.includes('compliance') ||
        text.includes('security') || text.includes('integration')) {
      return 'enterprise';
    }

    // Researcher indicators
    if (text.includes('research') || text.includes('study') || text.includes('paper') ||
        text.includes('analysis') || text.includes('benchmark')) {
      return 'researcher';
    }

    // Default to founder
    return 'founder';
  }

  async createSession(userId: string): Promise<SessionData> {
    const session: SessionData = {
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: Date.now(),
      queryCount: 0,
      topicsDiscussed: [],
    };

    this.sessions.set(userId, session);
    return session;
  }

  async getSession(userId: string): Promise<SessionData> {
    if (this.sessions.has(userId)) {
      return this.sessions.get(userId)!;
    }
    return this.createSession(userId);
  }

  async updateSession(userId: string, updates: Partial<SessionData>): Promise<SessionData> {
    const existing = await this.getSession(userId);
    const updated = { ...existing, ...updates };
    this.sessions.set(userId, updated);
    return updated;
  }

  async addConversationMessage(userId: string, message: ConversationMessage): Promise<void> {
    if (!this.conversations.has(userId)) {
      this.conversations.set(userId, []);
    }
    
    const history = this.conversations.get(userId)!;
    history.push(message);
    
    // Keep only last 20 messages for context
    if (history.length > 20) {
      this.conversations.set(userId, history.slice(-20));
    }

    // Update session
    await this.updateSession(userId, {
      queryCount: (await this.getSession(userId)).queryCount + 1,
    });
  }

  async getConversationHistory(userId: string): Promise<ConversationMessage[]> {
    return this.conversations.get(userId) || [];
  }

  async buildQueryContext(userId: string, queryText: string): Promise<QueryContext> {
    const [profile, session, history] = await Promise.all([
      this.getUserProfile(userId),
      this.getSession(userId),
      this.getConversationHistory(userId),
    ]);

    // Detect if persona should change based on query
    const detectedPersona = await this.detectPersona(userId, queryText);
    if (detectedPersona !== profile.persona) {
      await this.updateUserProfile(userId, { persona: detectedPersona });
      profile.persona = detectedPersona;
    }

    return {
      persona: profile.persona,
      conversationHistory: history,
      sessionData: session,
      userProfile: profile,
    };
  }

  async extractTopics(text: string): Promise<string[]> {
    const topics: string[] = [];
    
    // Common topic keywords
    const topicKeywords: Record<string, string[]> = {
      'ai-orchestration': ['orchestrator', 'agents', 'swarm', 'coordination'],
      'vibe-coding': ['vibe', 'coding', 'development', 'programming'],
      'content-strategy': ['content', 'strategy', 'playbook', 'documentation'],
      'deployment': ['deploy', 'production', 'vercel', 'hosting'],
      'testing': ['test', 'qa', 'audit', 'validation'],
      'fundraising': ['invest', 'funding', 'series', 'valuation'],
    };

    const lowerText = text.toLowerCase();
    
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          topics.push(topic);
          break;
        }
      }
    }

    return [...new Set(topics)];
  }
}
