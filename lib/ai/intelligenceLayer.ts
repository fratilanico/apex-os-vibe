// ═══════════════════════════════════════════════════════════════════════════════
// AI INTELLIGENCE LAYER - Core Architecture
// Service: DeepSeek + Gemini + Perplexity Integration
// ═══════════════════════════════════════════════════════════════════════════════

export type Persona = 'PERSONAL' | 'BUSINESS' | null;

// AI Service Types
export type AIService = 'deepseek' | 'gemini' | 'perplexity';

export interface AIRequest {
  message: string;
  persona: Persona;
  context: UserContext;
  history: MessageHistory[];
  service?: AIService;
}

export interface AIResponse {
  content: string;
  service: AIService;
  confidence: number;
  metadata?: {
    tokensUsed?: number;
    latency?: number;
    model?: string;
  };
}

export interface UserContext {
  name: string;
  email: string;
  persona: Persona;
  studyPreferences: StudyPreferences;
  goals: string[];
  completedModules: string[];
  interactionCount: number;
}

export interface StudyPreferences {
  technical: number;  // 0-100
  business: number;   // 0-100
  creative: number;   // 0-100
}

export interface MessageHistory {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Persona-specific system prompts
export const PERSONA_PROMPTS: Record<NonNullable<Persona>, string> = {
  BUSINESS: `
You are APEX OS Business Intelligence, an elite AI mentor for business architects.
The user has selected the RED PILL - they want to orchestrate fleet-scale outcomes.

CORE BEHAVIOR:
- Lead with ROI, metrics, and scalability
- Reference business terminology: LTV:CAC, TAM, unit economics, growth loops
- Suggest business-focused tools and strategies
- Focus on: Market analysis, fundraising, team scaling, revenue optimization
- Tone: Strategic, data-driven, ambitious, executive-level

RESPONSE FORMAT:
1. Start with the business impact
2. Provide specific metrics or frameworks
3. End with actionable next steps

AVOID:
- Technical implementation details (unless asked)
- Creative/artistic language
- Casual tone
`,

  PERSONAL: `
You are APEX OS Personal Intelligence, a hands-on AI mentor for solo builders.
The user has selected the BLUE PILL - they want to master the stack and build personal arbitrage.

CORE BEHAVIOR:
- Lead with "what you can build" and practical skills
- Reference builder terminology: vibe coding, ship, learn by doing, stack mastery
- Suggest hands-on tools and learning paths
- Focus on: Practical skills, portfolio projects, creative tools, side projects
- Tone: Curious, builder-focused, playful, encouraging

RESPONSE FORMAT:
1. Start with a concrete project or skill
2. Show the "aha moment" or hack
3. End with something to try immediately

AVOID:
- Heavy business theory (unless asked)
- Corporate language
- Passive tone
`,
};

// Default prompt for when persona is null
export const DEFAULT_PROMPT = `
You are APEX OS General Intelligence, a helpful AI assistant.
Guide the user to choose between Business (RED PILL) or Personal (BLUE PILL) paths.
Be neutral but informative about both options.
`;

// Service selection logic
export function selectAIService(query: string): AIService {
  const lowerQuery = query.toLowerCase();
  
  // Use Perplexity for research-heavy queries
  if (
    lowerQuery.includes('research') ||
    lowerQuery.includes('market') ||
    lowerQuery.includes('competitor') ||
    lowerQuery.includes('trends') ||
    lowerQuery.includes('statistics') ||
    lowerQuery.includes('latest') ||
    lowerQuery.includes('news')
  ) {
    return 'perplexity';
  }
  
  // Use DeepSeek for coding/technical
  if (
    lowerQuery.includes('code') ||
    lowerQuery.includes('programming') ||
    lowerQuery.includes('debug') ||
    lowerQuery.includes('error') ||
    lowerQuery.includes('implementation')
  ) {
    return 'deepseek';
  }
  
  // Default to Gemini for general queries
  return 'gemini';
}

// Smart question detection for micro-questions
export function shouldAskMicroQuestion(
  query: string,
  context: UserContext
): boolean {
  const lowerQuery = query.toLowerCase();
  
  // Vague queries that need clarification
  const vagueQueries = [
    'help',
    'what should i do',
    'recommend',
    'suggest',
    "i don't know",
    'lost',
    'confused',
    'where do i start',
  ];
  
  const isVague = vagueQueries.some(vq => lowerQuery.includes(vq));
  
  // Check if we have enough context
  const hasPreferences = 
    context.studyPreferences.technical > 0 ||
    context.studyPreferences.business > 0 ||
    context.studyPreferences.creative > 0;
  
  const hasGoals = context.goals.length > 0;
  
  // Ask micro-question if vague AND lacking context
  return isVague && (!hasPreferences || !hasGoals);
}

// Generate micro-questions based on missing context
export function generateMicroQuestion(context: UserContext): string {
  const questions = [];
  
  if (!context.studyPreferences.technical && !context.studyPreferences.business) {
    questions.push('Are you more interested in technical implementation (coding) or business strategy?');
  }
  
  if (context.goals.length === 0) {
    questions.push('What is your primary goal? Build a product, automate workflows, or learn new skills?');
  }
  
  if (context.interactionCount < 3) {
    questions.push('How many hours per week can you dedicate to learning?');
  }
  
  return questions[0] || 'Tell me more about what you want to achieve.';
}

export default {
  PERSONA_PROMPTS,
  selectAIService,
  shouldAskMicroQuestion,
  generateMicroQuestion,
};
