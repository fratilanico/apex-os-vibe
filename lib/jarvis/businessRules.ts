export const FINANCIAL_CONSTANTS = {
  MRR_MONTH_6: '$847,000',
  MRR_MONTH_12: '$1,420,000',
  YEAR_1_REVENUE: '$501,000',
  CAC: '$150',
  LTV: '$1,466',
  LTV_CAC_RATIO: '9.8:1',
  BLENDED_ARPU: '$165',
  SEED_ASK: '$1.2M',
  PRE_MONEY_VALUATION: '$6.8M',
  POST_MONEY_VALUATION: '$8.0M',
  RUNWAY_MONTHS: 18,
  TAM: '$350B',
  SAM: '$50B',
  SOM_YEAR_1: '$2.8M',
  CONVERSION_RATE: '9%',
  LEADS_MONTH_6: '34,000',
  AGENTS_TOTAL: 17
} as const;

export const BusinessRules = {
  validateLTVCAC: (ltv: number, cac: number): boolean => {
    return ltv / cac >= 3;
  },
  
  validateMRRGrowth: (mrrMonth6: number, year1Revenue: number): boolean => {
    return mrrMonth6 * 6 > year1Revenue * 0.5;
  },
  
  validateEquityDilution: (seedAsk: number, postMoney: number): boolean => {
    const dilution = seedAsk / postMoney;
    return dilution >= 0.15 && dilution <= 0.20;
  }
};

export type QueryIntent = 
  | 'financial_query'
  | 'unit_economics' 
  | 'revenue_projection'
  | 'fundraising'
  | 'agent_status'
  | 'pricing_strategy'
  | 'business_model'
  | 'accelerator_model'
  | 'navigation'
  | 'fallback';

export interface QueryPattern {
  intent: QueryIntent;
  keywords: string[];
  response: string;
  navigateTo?: string;
}

export const QUERY_PATTERNS: QueryPattern[] = [
  {
    intent: 'financial_query',
    keywords: ['mrr', 'month 6', 'monthly revenue'],
    response: `Month 6 MRR: $847,000. Driven by 34,000 leads at 9% conversion with $165 blended ARPU.`
  },
  {
    intent: 'unit_economics',
    keywords: ['ltv', 'cac', 'ratio', 'unit economics'],
    response: `LTV:CAC ratio: 9.8:1. We earn $9.80 for every $1 spent. CAC: $150, LTV: $1,466.`
  },
  {
    intent: 'revenue_projection',
    keywords: ['revenue', 'year 1', 'annual'],
    response: `Year 1 revenue: $501,000. Month 12 MRR: $1.42M. On track for $2.8M ARR.`
  },
  {
    intent: 'fundraising',
    keywords: ['seed', 'funding', 'raise', 'investment'],
    response: `Raising $1.2M Seed at $6.8M pre-money ($8M post). 18 months runway to profitability.`
  },
  {
    intent: 'agent_status',
    keywords: ['agent', 'swarm', 'ai', 'orchestration'],
    response: `17 AI agents active across 4 levels: Founder (1), Executive (4), Operational (5), Specialist (7).`
  },
  {
    intent: 'pricing_strategy',
    keywords: ['pricing', 'ppp', 'price'],
    response: `PPP-optimized: Emerging $89-249/mo, Western $299-749/mo. Same product, market-optimized positioning.`
  },
  {
    intent: 'business_model',
    keywords: ['shadow branding', 'branding', 'strategy'],
    response: `Dual-brand strategy: 'CodeSprint' in emerging markets, 'APEX OS' in West. Maximizes global reach.`
  },
  {
    intent: 'accelerator_model',
    keywords: ['accelerator', '15%', 'equity', 'venture'],
    response: `15% equity for 30-day intensive support. Portfolio of AI-first startups with aligned incentives.`
  }
];

export const processQuery = (query: string): { response: string; intent: QueryIntent } => {
  const lowerQuery = query.toLowerCase();
  
  for (const pattern of QUERY_PATTERNS) {
    if (pattern.keywords.some(keyword => lowerQuery.includes(keyword))) {
      return { response: pattern.response, intent: pattern.intent };
    }
  }
  
  return {
    response: "I can help with: MRR projections, LTV:CAC ratio, revenue, seed round, or business model. What would you like to know?",
    intent: 'fallback'
  };
};
