// ═══════════════════════════════════════════════════════════════════════════════
// STUDY RECOMMENDATION ENGINE
// Content matching algorithm for personalized learning paths
// ═══════════════════════════════════════════════════════════════════════════════

import { Persona, StudyPreferences } from './intelligenceLayer';

export interface ContentModule {
  id: string;
  title: string;
  description: string;
  persona: 'PERSONAL' | 'BUSINESS' | 'BOTH';
  category: 'technical' | 'business' | 'creative';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  prerequisites: string[];
  topics: string[];
  matchScore?: number;
}

// Content database
export const CONTENT_DATABASE: ContentModule[] = [
  // PERSONAL / BUILDER TRACK
  {
    id: 'vibe-coding-101',
    title: 'Vibe Coding Fundamentals',
    description: 'Master the art of coding with AI assistance. Build projects faster with Claude, GPT, and Cursor.',
    persona: 'PERSONAL',
    category: 'technical',
    difficulty: 'beginner',
    estimatedTime: '2 weeks',
    prerequisites: [],
    topics: ['AI-assisted coding', 'Prompt engineering', 'Rapid prototyping'],
  },
  {
    id: 'ai-agents-mastery',
    title: 'AI Agents & Automation',
    description: 'Build autonomous agents that handle tasks for you. Create your personal AI workforce.',
    persona: 'PERSONAL',
    category: 'technical',
    difficulty: 'intermediate',
    estimatedTime: '3 weeks',
    prerequisites: ['vibe-coding-101'],
    topics: ['LangChain', 'AutoGPT', 'Workflow automation', 'API integration'],
  },
  {
    id: 'npc-theory',
    title: 'NPC Theory: Beyond the Matrix',
    description: 'Understand Non-Player Character dynamics in real life. Spot patterns, optimize decisions.',
    persona: 'PERSONAL',
    category: 'creative',
    difficulty: 'intermediate',
    estimatedTime: '1 week',
    prerequisites: [],
    topics: ['Social dynamics', 'Decision frameworks', 'Pattern recognition'],
  },
  {
    id: 'personal-arbitrage',
    title: 'Time Arbitrage Masterclass',
    description: 'Turn 1 hour of work into 10 hours of value. Learn leverage and scalability for individuals.',
    persona: 'PERSONAL',
    category: 'business',
    difficulty: 'advanced',
    estimatedTime: '4 weeks',
    prerequisites: ['ai-agents-mastery'],
    topics: ['Automation', 'Productization', 'Passive income', 'Scale'],
  },
  
  // BUSINESS / ARCHITECT TRACK
  {
    id: 'market-tam-analysis',
    title: 'Market TAM Analysis',
    description: 'Calculate Total Addressable Market with precision. Make data-driven market entry decisions.',
    persona: 'BUSINESS',
    category: 'business',
    difficulty: 'intermediate',
    estimatedTime: '2 weeks',
    prerequisites: [],
    topics: ['Market sizing', 'TAM/SAM/SOM', 'Competitive analysis', 'Data sources'],
  },
  {
    id: 'revenue-engines',
    title: 'Revenue Engine Blueprints',
    description: 'Design scalable revenue models. From SaaS to marketplace - pick the right engine for your business.',
    persona: 'BUSINESS',
    category: 'business',
    difficulty: 'advanced',
    estimatedTime: '3 weeks',
    prerequisites: ['market-tam-analysis'],
    topics: ['Business models', 'Unit economics', 'Pricing strategy', 'LTV:CAC'],
  },
  {
    id: 'swarm-orchestration',
    title: 'Swarm Orchestration',
    description: 'Manage teams of AI agents and humans. Build systems that scale without scaling headcount.',
    persona: 'BUSINESS',
    category: 'technical',
    difficulty: 'advanced',
    estimatedTime: '4 weeks',
    prerequisites: ['revenue-engines'],
    topics: ['Team design', 'AI-human collaboration', 'Process automation', 'Quality control'],
  },
  {
    id: 'investor-readiness',
    title: 'Investor-Ready Frameworks',
    description: 'Prepare for fundraising. Pitch decks, metrics, and investor psychology decoded.',
    persona: 'BUSINESS',
    category: 'business',
    difficulty: 'intermediate',
    estimatedTime: '2 weeks',
    prerequisites: ['revenue-engines'],
    topics: ['Pitch decks', 'Due diligence', 'Term sheets', 'Valuation'],
  },
  
  // BOTH / UNIVERSAL
  {
    id: 'prompt-engineering',
    title: 'Advanced Prompt Engineering',
    description: 'The master skill for the AI age. Get 10x better outputs from any AI model.',
    persona: 'BOTH',
    category: 'technical',
    difficulty: 'beginner',
    estimatedTime: '1 week',
    prerequisites: [],
    topics: ['Chain-of-thought', 'Few-shot learning', 'System prompts', 'Context management'],
  },
  {
    id: 'ai-tools-stack',
    title: 'The AI Tools Stack',
    description: 'Curated toolkit of 50+ AI tools. Know which tool to use for every job.',
    persona: 'BOTH',
    category: 'technical',
    difficulty: 'beginner',
    estimatedTime: '1 week',
    prerequisites: [],
    topics: ['Tool evaluation', 'Integration patterns', 'Cost optimization'],
  },
];

// Calculate match score for a content module
export function calculateMatchScore(
  module: ContentModule,
  persona: Persona,
  preferences: StudyPreferences,
  completedModules: string[]
): number {
  let score = 0;
  
  // Persona match (40 points)
  if (module.persona === 'BOTH' || module.persona === persona) {
    score += 40;
  } else if (module.persona !== persona) {
    score += 10; // Small score for cross-training
  }
  
  // Category preference match (30 points)
  switch (module.category) {
    case 'technical':
      score += (preferences.technical / 100) * 30;
      break;
    case 'business':
      score += (preferences.business / 100) * 30;
      break;
    case 'creative':
      score += (preferences.creative / 100) * 30;
      break;
  }
  
  // Prerequisites check (20 points)
  const hasAllPrereqs = module.prerequisites.every(prereq => 
    completedModules.includes(prereq)
  );
  if (hasAllPrereqs) {
    score += 20;
  } else if (module.prerequisites.length === 0) {
    score += 20; // No prereqs = full points
  } else {
    score += 5; // Some prereqs missing
  }
  
  // Not already completed bonus (10 points)
  if (!completedModules.includes(module.id)) {
    score += 10;
  }
  
  return Math.round(score);
}

// Generate recommendations
export interface RecommendationResult {
  primary: ContentModule;
  secondary: ContentModule;
  alternative: ContentModule;
}

export function generateRecommendations(
  persona: Persona,
  preferences: StudyPreferences,
  completedModules: string[]
): RecommendationResult {
  const fallbackModule: ContentModule = CONTENT_DATABASE[0] || {
    id: 'fallback-module',
    title: 'APEX Core Foundations',
    description: 'Foundation module placeholder when no content modules are available.',
    persona: 'BOTH',
    category: 'technical',
    difficulty: 'beginner',
    estimatedTime: '1 week',
    prerequisites: [],
    topics: ['foundations'],
    matchScore: 0,
  };

  // Score all modules
  const scoredModules = CONTENT_DATABASE.map(module => ({
    ...module,
    matchScore: calculateMatchScore(module, persona, preferences, completedModules),
  }));
  
  // Sort by score (descending)
  scoredModules.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  
  // Filter out completed modules for primary/secondary
  const availableModules = scoredModules.filter(m => !completedModules.includes(m.id));
  
  // Primary: Best match
  const primary = availableModules[0] || scoredModules[0] || fallbackModule;
  
  // Secondary: Next best match
  const secondary = availableModules[1] || scoredModules[1] || primary || fallbackModule;
  
  // Alternative: Cross-training (different category or persona)
  const alternative = scoredModules.find(m => 
    m.category !== primary.category || m.persona !== primary.persona
  ) || scoredModules[scoredModules.length - 1] || fallbackModule;
  
  return {
    primary,
    secondary,
    alternative,
  };
}

// Format recommendation for terminal display
export function formatRecommendationResponse(
  rec: RecommendationResult
): string[] {
  return [
    'JARVIS: Analyzing your profile...',
    '',
    '┌─ RECOMMENDED FOR YOU ─┐',
    `│`,
    `│ 1. ${rec.primary.title}`,
    `│    Match: ${rec.primary.matchScore}%`,
    `│    Why: ${rec.primary.description.slice(0, 60)}...`,
    `│    Time: ${rec.primary.estimatedTime}`,
    `│`,
    `│ 2. ${rec.secondary.title}`,
    `│    Match: ${rec.secondary.matchScore}%`,
    `│    Why: ${rec.secondary.description.slice(0, 60)}...`,
    `│    Time: ${rec.secondary.estimatedTime}`,
    `│`,
    `├────────────────────────┤`,
    `│`,
    `│ 3. ${rec.alternative.title}`,
    `│    Alternative path`,
    `│    Cross-training focus`,
    `│`,
    `└────────────────────────┘`,
    '',
    'Type the number (1, 2, or 3) to begin.',
  ];
}

export default {
  CONTENT_DATABASE,
  calculateMatchScore,
  generateRecommendations,
  formatRecommendationResponse,
};
