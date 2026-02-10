/**
 * Recommendation Engine - Study Recommendations
 * APEX OS Intelligence Layer v2.0
 */

import { 
  UserProfile, 
  SessionData, 
  StudyRecommendation,
  UserPersona 
} from '../types';

export class RecommendationEngine {
  private contentLibrary: StudyRecommendation[] = [
    // AI Orchestration
    {
      id: 'rec_001',
      userId: '',
      title: 'AI Orchestration Fundamentals',
      description: 'Learn how to coordinate multiple AI agents for complex workflows',
      type: 'module',
      difficulty: 'intermediate',
      estimatedTime: 120,
      relevanceScore: 0.95,
      tags: ['ai-orchestration', 'agents', 'coordination'],
      prerequisites: [],
      url: '/learn/modules/ai-orchestration-fundamentals',
      matchReason: 'Core skill for building AI-powered products',
    },
    {
      id: 'rec_002',
      userId: '',
      title: 'Multi-Agent Swarm Patterns',
      description: 'Advanced patterns for scaling AI agent orchestration',
      type: 'playbook',
      difficulty: 'advanced',
      estimatedTime: 90,
      relevanceScore: 0.88,
      tags: ['ai-orchestration', 'swarm', 'patterns'],
      prerequisites: ['ai-orchestration-fundamentals'],
      url: '/blog/playbook/multi-agent-swarm-patterns',
      matchReason: 'Next step after learning fundamentals',
    },

    // Vibe Coding
    {
      id: 'rec_003',
      userId: '',
      title: 'Vibe Coding: The Complete Guide',
      description: 'Master AI-assisted development workflows',
      type: 'module',
      difficulty: 'beginner',
      estimatedTime: 60,
      relevanceScore: 0.92,
      tags: ['vibe-coding', 'development', 'ai-tools'],
      prerequisites: [],
      url: '/learn/modules/vibe-coding-guide',
      matchReason: 'Essential for modern development',
    },
    {
      id: 'rec_004',
      userId: '',
      title: 'Building with Claude, Cursor, and Cody',
      description: 'Practical guide to AI-powered IDEs',
      type: 'playbook',
      difficulty: 'intermediate',
      estimatedTime: 45,
      relevanceScore: 0.85,
      tags: ['vibe-coding', 'tools', 'claude', 'cursor'],
      prerequisites: ['vibe-coding-guide'],
      url: '/blog/playbook/ai-ide-guide',
      matchReason: 'Hands-on tool guide',
    },

    // Content Strategy
    {
      id: 'rec_005',
      userId: '',
      title: 'Content Operations at Scale',
      description: 'How to build a content machine for your startup',
      type: 'playbook',
      difficulty: 'intermediate',
      estimatedTime: 75,
      relevanceScore: 0.80,
      tags: ['content-strategy', 'operations', 'scale'],
      prerequisites: [],
      url: '/blog/strategy/content-operations-scale',
      matchReason: 'Critical for marketing and growth',
    },

    // Deployment
    {
      id: 'rec_006',
      userId: '',
      title: 'Deploying AI Products to Production',
      description: 'Best practices for production AI deployments',
      type: 'module',
      difficulty: 'advanced',
      estimatedTime: 150,
      relevanceScore: 0.87,
      tags: ['deployment', 'production', 'devops'],
      prerequisites: ['ai-orchestration-fundamentals'],
      url: '/learn/modules/deploying-ai-products',
      matchReason: 'Essential for shipping products',
    },

    // Fundraising
    {
      id: 'rec_007',
      userId: '',
      title: 'Seed Funding Playbook',
      description: 'Complete guide to raising your seed round',
      type: 'playbook',
      difficulty: 'intermediate',
      estimatedTime: 90,
      relevanceScore: 0.91,
      tags: ['fundraising', 'seed', 'investors'],
      prerequisites: [],
      url: '/blog/playbook/seed-funding-playbook',
      matchReason: 'Critical for early-stage founders',
    },
    {
      id: 'rec_008',
      userId: '',
      title: 'Pitch Deck Mastery',
      description: 'Create investor-ready pitch decks',
      type: 'module',
      difficulty: 'beginner',
      estimatedTime: 60,
      relevanceScore: 0.83,
      tags: ['fundraising', 'pitch-deck', 'presentations'],
      prerequisites: [],
      url: '/learn/modules/pitch-deck-mastery',
      matchReason: 'Practical skill for fundraising',
    },

    // Testing & QA
    {
      id: 'rec_009',
      userId: '',
      title: 'Testing AI Systems',
      description: 'Quality assurance for AI-powered applications',
      type: 'module',
      difficulty: 'advanced',
      estimatedTime: 120,
      relevanceScore: 0.79,
      tags: ['testing', 'qa', 'ai-systems'],
      prerequisites: ['deploying-ai-products'],
      url: '/learn/modules/testing-ai-systems',
      matchReason: 'Important for production reliability',
    },

    // Team Building
    {
      id: 'rec_010',
      userId: '',
      title: 'Hiring Your First 10 Engineers',
      description: 'How to build an elite engineering team',
      type: 'playbook',
      difficulty: 'intermediate',
      estimatedTime: 60,
      relevanceScore: 0.76,
      tags: ['team-building', 'hiring', 'engineering'],
      prerequisites: [],
      url: '/blog/playbook/hiring-first-10-engineers',
      matchReason: 'Critical for scaling teams',
    },
  ];

  async getRecommendations(
    profile: UserProfile,
    session: SessionData,
    limit: number = 5
  ): Promise<StudyRecommendation[]> {
    // Score all content based on user profile
    const scored = this.contentLibrary.map((content) => {
      const score = this.calculateRelevanceScore(content, profile, session);
      return { content, score };
    });

    // Sort by relevance score
    scored.sort((a, b) => b.score - a.score);

    // Filter out completed prerequisites
    const filtered = scored.filter((item) =>
      this.meetsPrerequisites(item.content, profile)
    );

    // Return top N recommendations
    return filtered.slice(0, limit).map((item) => ({
      ...item.content,
      userId: profile.id,
      relevanceScore: item.score,
      matchReason: this.generateMatchReason(item.content, profile),
    }));
  }

  private calculateRelevanceScore(
    content: StudyRecommendation,
    profile: UserProfile,
    session: SessionData
  ): number {
    let score = content.relevanceScore; // Base score

    // Boost by persona match
    if (this.isRelevantToPersona(content, profile.persona)) {
      score += 0.15;
    }

    // Boost by interest match
    const interestOverlap = content.tags.filter((tag) =>
      profile.interests.includes(tag)
    ).length;
    score += interestOverlap * 0.1;

    // Boost by goal match
    const goalOverlap = content.tags.filter((tag) =>
      profile.learningGoals.some((goal) => goal.includes(tag))
    ).length;
    score += goalOverlap * 0.12;

    // Adjust by expertise level
    if (this.difficultyMatchesExpertise(content.difficulty, profile.expertiseLevel)) {
      score += 0.08;
    }

    // Boost if topics match recent conversation
    const topicOverlap = content.tags.filter((tag) =>
      session.topicsDiscussed.includes(tag)
    ).length;
    score += topicOverlap * 0.05;

    // Penalize if already in learning goals (but not completed)
    // (This would require tracking completed content)

    return Math.min(score, 1.0); // Cap at 1.0
  }

  private isRelevantToPersona(
    content: StudyRecommendation,
    persona: UserPersona
  ): boolean {
    const personaContentMap: Record<UserPersona, string[]> = {
      founder: ['fundraising', 'seed', 'pitch-deck', 'hiring', 'content-strategy'],
      developer: ['vibe-coding', 'deployment', 'testing', 'ai-orchestration'],
      investor: ['fundraising', 'seed', 'market-research'],
      student: ['vibe-coding', 'ai-orchestration', 'pitch-deck'],
      enterprise: ['ai-orchestration', 'deployment', 'testing', 'team-building'],
      researcher: ['ai-orchestration', 'testing', 'content-strategy'],
    };

    const relevantTags = personaContentMap[persona] || [];
    return content.tags.some((tag) => relevantTags.includes(tag));
  }

  private difficultyMatchesExpertise(
    contentDifficulty: string,
    userExpertise: string
  ): boolean {
    const difficultyMap: Record<string, number> = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4,
    };

    const contentLevel = difficultyMap[contentDifficulty] || 2;
    const userLevel = difficultyMap[userExpertise] || 2;

    // Content should be at or slightly above user's level
    return contentLevel <= userLevel + 1;
  }

  private meetsPrerequisites(
    content: StudyRecommendation,
    profile: UserProfile
  ): boolean {
    if (!content.prerequisites || content.prerequisites.length === 0) {
      return true;
    }
    
    // Check if user has completed all prerequisites
    return content.prerequisites.every(prereqId => 
      profile.completedModules.includes(prereqId)
    );
  }

  private generateMatchReason(
    content: StudyRecommendation,
    profile: UserProfile
  ): string {
    const reasons: string[] = [];

    // Check persona match
    if (this.isRelevantToPersona(content, profile.persona)) {
      reasons.push(`Tailored for ${profile.persona}s`);
    }

    // Check interest match
    const interestMatches = content.tags.filter((tag) =>
      profile.interests.includes(tag)
    );
    if (interestMatches.length > 0) {
      reasons.push(`Matches your interest in ${interestMatches[0]}`);
    }

    // Check goal match
    const goalMatches = content.tags.filter((tag) =>
      profile.learningGoals.some((goal) => goal.includes(tag))
    );
    if (goalMatches.length > 0) {
      reasons.push(`Helps you achieve your goal`);
    }

    if (reasons.length === 0) {
      reasons.push('Highly rated by similar users');
    }

    return reasons[0] || 'Highly rated by similar users';
  }

  async trackRecommendationView(
    recommendationId: string,
    userId: string
  ): Promise<void> {
    // Track that user viewed recommendation
    // For analytics and improving recommendations
    console.log(`User ${userId} viewed recommendation ${recommendationId}`);
  }

  async trackRecommendationClick(
    recommendationId: string,
    userId: string
  ): Promise<void> {
    // Track that user clicked on recommendation
    console.log(`User ${userId} clicked recommendation ${recommendationId}`);
  }
}
