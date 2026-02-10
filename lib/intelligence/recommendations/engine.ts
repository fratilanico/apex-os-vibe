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
import { modules, tools } from '../../../data/curriculumData';

export class RecommendationEngine {
  private contentLibrary: StudyRecommendation[] = [
    // Transform curriculum modules into recommendations
    ...modules.map(m => ({
      id: m.id,
      userId: '',
      title: m.title,
      description: m.subtitle,
      type: 'module' as const,
      difficulty: (m.number === '00' ? 'beginner' : m.number === '03' ? 'advanced' : 'intermediate') as 'beginner' | 'intermediate' | 'advanced',
      estimatedTime: parseInt(m.duration) || 60,
      relevanceScore: 0.9,
      tags: [m.title.toLowerCase().replace(/ /g, '-'), ...m.sections.flatMap(s => s.tools)],
      prerequisites: m.number === '00' ? [] : [`module-${(parseInt(m.number) - 1).toString().padStart(2, '0')}`],
      url: `/learn/modules/${m.id}`,
      matchReason: m.objective,
    })),
    // Transform specialized tools into research recommendations
    ...tools.filter(t => t.tier === 'asset').map(t => ({
      id: `tool_${t.id}`,
      userId: '',
      title: `Mastering ${t.name}`,
      description: t.description,
      type: 'playbook' as const,
      difficulty: 'intermediate' as const,
      estimatedTime: 45,
      relevanceScore: 0.8,
      tags: [t.id, t.category.toLowerCase(), 'tools'],
      prerequisites: [],
      url: `/tools/${t.id}`,
      matchReason: `Critical tool for ${t.category.toLowerCase()} workflows`,
    }))
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
