/**
 * Micro-Question System - User Profiling via Progressive Questions
 * APEX OS Intelligence Layer v2.0
 */

import { UserProfile, MicroQuestion, UserPersona } from '../types';

export class MicroQuestionSystem {
  private questionBank: MicroQuestion[] = [
    // Persona Detection
    {
      id: 'persona_1',
      question: 'Which best describes your current role?',
      options: [
        'Founder/CEO building a startup',
        'Developer/Engineer',
        'Investor/VC',
        'Student/Learner',
        'Enterprise Executive',
        'Researcher/Academic'
      ],
      category: 'persona',
      weight: 1.0,
    },
    {
      id: 'persona_2',
      question: 'What is your primary focus right now?',
      options: [
        'Building MVP/Product',
        'Raising funding',
        'Scaling operations',
        'Learning new skills',
        'Researching technologies',
        'Managing team'
      ],
      category: 'persona',
      weight: 0.8,
    },

    // Expertise Level
    {
      id: 'expertise_1',
      question: 'How would you rate your technical expertise?',
      options: [
        'Beginner - Just getting started',
        'Intermediate - Some experience',
        'Advanced - Professional level',
        'Expert - Deep expertise'
      ],
      category: 'expertise',
      weight: 1.0,
    },
    {
      id: 'expertise_2',
      question: 'How comfortable are you with AI/ML concepts?',
      options: [
        'Not familiar yet',
        'Basic understanding',
        'Used AI tools before',
        'Built AI-powered products'
      ],
      category: 'expertise',
      weight: 0.9,
    },

    // Interests
    {
      id: 'interests_1',
      question: 'Which topics are you most interested in? (Select all that apply)',
      options: [
        'AI Orchestration',
        'Vibe Coding',
        'Content Strategy',
        'Deployment & DevOps',
        'Fundraising',
        'Team Building',
        'Product Management',
        'Technical Architecture'
      ],
      category: 'interests',
      weight: 0.7,
    },
    {
      id: 'interests_2',
      question: 'What type of content do you prefer?',
      options: [
        'Step-by-step tutorials',
        'High-level strategy',
        'Technical deep-dives',
        'Quick tips & tricks',
        'Case studies',
        'Video content'
      ],
      category: 'interests',
      weight: 0.6,
    },

    // Learning Goals
    {
      id: 'goals_1',
      question: 'What is your primary learning goal?',
      options: [
        'Build and deploy a product',
        'Understand AI orchestration',
        'Improve technical skills',
        'Prepare for fundraising',
        'Scale existing product',
        'Research market opportunities'
      ],
      category: 'goals',
      weight: 0.9,
    },
    {
      id: 'goals_2',
      question: 'How much time can you dedicate to learning per week?',
      options: [
        'Less than 2 hours',
        '2-5 hours',
        '5-10 hours',
        'More than 10 hours'
      ],
      category: 'goals',
      weight: 0.5,
    },

    // Company Stage (for founders)
    {
      id: 'stage_1',
      question: 'What stage is your company in?',
      options: [
        'Idea/MVP phase',
        'Seed stage (pre-product-market fit)',
        'Series A (scaling)',
        'Growth stage (Series B+)',
        'Enterprise (established)'
      ],
      category: 'persona',
      weight: 0.8,
    },

    // Tech Stack
    {
      id: 'tech_1',
      question: 'What is your primary tech stack?',
      options: [
        'JavaScript/TypeScript (React, Node)',
        'Python (Django, Flask, FastAPI)',
        'Java/Kotlin (Spring)',
        'Go/Rust',
        'Other/Multiple stacks',
        'No-code/Low-code'
      ],
      category: 'interests',
      weight: 0.6,
    },
  ];

  private answeredQuestions: Map<string, Set<string>> = new Map();

  async getNextQuestion(profile: UserProfile): Promise<MicroQuestion | null> {
    const userId = profile.id;
    const answered = this.answeredQuestions.get(userId) || new Set();

    // Filter out already answered questions
    const available = this.questionBank.filter(
      (q) => !answered.has(q.id)
    );

    if (available.length === 0) {
      return null; // Profiling complete
    }

    // Prioritize by category and weight
    const prioritized = this.prioritizeQuestions(available, profile);
    
    return prioritized[0];
  }

  private prioritizeQuestions(
    questions: MicroQuestion[],
    profile: UserProfile
  ): MicroQuestion[] {
    // Score each question based on importance
    const scored = questions.map((q) => {
      let score = q.weight;

      // Prioritize persona detection first
      if (q.category === 'persona' && !profile.persona) {
        score += 2.0;
      }

      // Then expertise
      if (q.category === 'expertise' && !profile.expertiseLevel) {
        score += 1.5;
      }

      // Then goals
      if (q.category === 'goals' && profile.learningGoals.length === 0) {
        score += 1.0;
      }

      return { question: q, score };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    return scored.map((s) => s.question);
  }

  async processAnswer(
    profile: UserProfile,
    questionId: string,
    answer: string
  ): Promise<Partial<UserProfile>> {
    const question = this.questionBank.find((q) => q.id === questionId);
    
    if (!question) {
      throw new Error(`Question ${questionId} not found`);
    }

    // Mark as answered
    const answered = this.answeredQuestions.get(profile.id) || new Set();
    answered.add(questionId);
    this.answeredQuestions.set(profile.id, answered);

    // Process answer based on category
    const updates: Partial<UserProfile> = {};

    switch (question.category) {
      case 'persona':
        const persona = this.detectPersonaFromAnswer(questionId, answer);
        if (persona) {
          updates.persona = persona;
        }
        break;

      case 'expertise':
        const expertise = this.detectExpertiseFromAnswer(questionId, answer);
        if (expertise) {
          updates.expertiseLevel = expertise;
        }
        break;

      case 'interests':
        const interest = this.extractInterestFromAnswer(answer);
        if (interest && !profile.interests.includes(interest)) {
          updates.interests = [...profile.interests, interest];
        }
        break;

      case 'goals':
        const goal = this.extractGoalFromAnswer(answer);
        if (goal && !profile.learningGoals.includes(goal)) {
          updates.learningGoals = [...profile.learningGoals, goal];
        }
        break;
    }

    return updates;
  }

  private detectPersonaFromAnswer(
    questionId: string,
    answer: string
  ): UserPersona | null {
    const lowerAnswer = answer.toLowerCase();

    if (lowerAnswer.includes('founder') || lowerAnswer.includes('ceo')) {
      return 'founder';
    }
    if (lowerAnswer.includes('developer') || lowerAnswer.includes('engineer')) {
      return 'developer';
    }
    if (lowerAnswer.includes('investor') || lowerAnswer.includes('vc')) {
      return 'investor';
    }
    if (lowerAnswer.includes('student') || lowerAnswer.includes('learner')) {
      return 'student';
    }
    if (lowerAnswer.includes('enterprise') || lowerAnswer.includes('executive')) {
      return 'enterprise';
    }
    if (lowerAnswer.includes('researcher') || lowerAnswer.includes('academic')) {
      return 'researcher';
    }

    return null;
  }

  private detectExpertiseFromAnswer(
    questionId: string,
    answer: string
  ): 'beginner' | 'intermediate' | 'advanced' | 'expert' | null {
    const lowerAnswer = answer.toLowerCase();

    if (lowerAnswer.includes('beginner') || lowerAnswer.includes('just getting started')) {
      return 'beginner';
    }
    if (lowerAnswer.includes('intermediate') || lowerAnswer.includes('some experience')) {
      return 'intermediate';
    }
    if (lowerAnswer.includes('advanced') || lowerAnswer.includes('professional')) {
      return 'advanced';
    }
    if (lowerAnswer.includes('expert') || lowerAnswer.includes('deep expertise')) {
      return 'expert';
    }

    return null;
  }

  private extractInterestFromAnswer(answer: string): string | null {
    const interestMap: Record<string, string> = {
      'ai orchestration': 'ai-orchestration',
      'vibe coding': 'vibe-coding',
      'content strategy': 'content-strategy',
      'deployment': 'deployment',
      'fundraising': 'fundraising',
      'team building': 'team-building',
      'product management': 'product-management',
      'technical architecture': 'architecture',
    };

    const lowerAnswer = answer.toLowerCase();

    for (const [key, value] of Object.entries(interestMap)) {
      if (lowerAnswer.includes(key)) {
        return value;
      }
    }

    return null;
  }

  private extractGoalFromAnswer(answer: string): string | null {
    const goalMap: Record<string, string> = {
      'build and deploy': 'build-product',
      'understand ai': 'learn-ai',
      'improve technical': 'improve-skills',
      'raising': 'fundraising',
      'scale': 'scale-product',
      'research': 'market-research',
    };

    const lowerAnswer = answer.toLowerCase();

    for (const [key, value] of Object.entries(goalMap)) {
      if (lowerAnswer.includes(key)) {
        return value;
      }
    }

    return null;
  }

  getProfilingProgress(userId: string): number {
    const answered = this.answeredQuestions.get(userId) || new Set();
    return Math.round((answered.size / this.questionBank.length) * 100);
  }
}
