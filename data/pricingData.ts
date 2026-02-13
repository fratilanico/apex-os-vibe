/**
 * APEX OS Pricing Tiers
 * Based on emerging markets strategy with Romanian developing country discount
 * Yearly subscription: 25% off (cumulative with regional discount)
 */

export interface PricingTier {
  id: string;
  name: string;
  badge: string;
  badgeColor: 'orange' | 'amber' | 'emerald' | 'violet' | 'cyan';
  monthlyPrice: number;
  yearlyPrice: number; // Calculated as monthlyPrice * 12 * 0.75 (25% off)
  monthlyPriceRO: number; // Romanian developing country discount (50% off)
  yearlyPriceRO: number; // Romanian yearly (50% + 25% cumulative = 62.5% total discount)
  currency: string;
  interval: 'month' | 'one-time';
  description: string;
  targetAudience: string;
  features: string[];
  highlighted?: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'codesprint',
    name: 'CodeSprint',
    badge: 'CODESPRINT',
    badgeColor: 'orange',
    monthlyPrice: 89,
    yearlyPrice: 801, // $89 * 12 * 0.75 = $801
    monthlyPriceRO: 45, // 50% off for Romania
    yearlyPriceRO: 405, // 50% + 25% = 62.5% total discount ($89 * 12 * 0.375)
    currency: 'USD',
    interval: 'month',
    description: 'Module 00 + Core Builder Track',
    targetAudience: 'EMERGING MARKETS ENTRY (RO/IN/LATAM)',
    features: [
      'Module 00 + Core Builder Track',
      'Community Access (Regional)',
      'Tools Starter Pack',
    ],
  },
  {
    id: 'builder-lab',
    name: 'Builder Lab',
    badge: 'BUILDER LAB',
    badgeColor: 'amber',
    monthlyPrice: 149,
    yearlyPrice: 1341, // $149 * 12 * 0.75 = $1,341
    monthlyPriceRO: 75, // 50% off for Romania
    yearlyPriceRO: 675, // 62.5% total discount
    currency: 'USD',
    interval: 'month',
    description: 'Full Core Curriculum',
    targetAudience: 'MOMENTUM TIER (COMMUNITY-DRIVEN)',
    features: [
      'Full Core Curriculum',
      'Weekly Regional Live Sessions',
      'Peer Reviews + Builder Challenges',
    ],
  },
  {
    id: 'founder-track',
    name: 'Founder Track',
    badge: 'FOUNDER TRACK',
    badgeColor: 'emerald',
    monthlyPrice: 249,
    yearlyPrice: 2241, // $249 * 12 * 0.75 = $2,241
    monthlyPriceRO: 125, // 50% off for Romania
    yearlyPriceRO: 1125, // 62.5% total discount
    currency: 'USD',
    interval: 'month',
    description: 'Advanced Orchestration Modules',
    targetAudience: 'HIGH-INTENT BUILDERS (SHADOW BRAND)',
    features: [
      'Advanced Orchestration Modules',
      'Ship-to-Launch Roadmaps',
      'Founder Network Access',
    ],
    highlighted: true,
  },
  {
    id: 'accelerator',
    name: 'Accelerator',
    badge: 'ACCELERATOR (EMERGING)',
    badgeColor: 'violet',
    monthlyPrice: 300,
    yearlyPrice: 300, // One-time payment, no yearly discount
    monthlyPriceRO: 150, // 50% off for Romania
    yearlyPriceRO: 150, // One-time, 50% discount only
    currency: 'USD',
    interval: 'one-time',
    description: 'JOIN',
    targetAudience: 'TOP FOUNDERS (ONE-TIME JOIN)',
    features: [
      '30-Day GTM Sprint',
      '2-Week Hyper Care',
      'On-Demand Support (Negotiated)',
    ],
  },
  {
    id: 'scale-team',
    name: 'Scale (Team)',
    badge: 'SCALE (TEAM)',
    badgeColor: 'cyan',
    monthlyPrice: 500,
    yearlyPrice: 4500, // $500 * 12 * 0.75 = $4,500
    monthlyPriceRO: 250, // 50% off for Romania
    yearlyPriceRO: 2250, // 62.5% total discount
    currency: 'USD',
    interval: 'month',
    description: 'Team Seats + Progress Dashboard',
    targetAudience: 'EMERGING MARKET B2B',
    features: [
      'Team Seats + Progress Dashboard',
      'B2B Enablement Toolkit',
      'Dedicated Cohort Support',
    ],
  },
];

/**
 * Calculate final price based on region and billing period
 */
export function calculatePrice(
  tier: PricingTier,
  isRomania: boolean,
  isYearly: boolean
): number {
  if (tier.interval === 'one-time') {
    return isRomania ? tier.monthlyPriceRO : tier.monthlyPrice;
  }

  if (isYearly) {
    return isRomania ? tier.yearlyPriceRO : tier.yearlyPrice;
  }

  return isRomania ? tier.monthlyPriceRO : tier.monthlyPrice;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(
  tier: PricingTier,
  isRomania: boolean,
  isYearly: boolean
): number {
  if (tier.interval === 'one-time') {
    return isRomania ? 50 : 0;
  }

  if (isRomania && isYearly) {
    return 62.5; // 50% regional + 25% yearly (cumulative)
  }

  if (isRomania) {
    return 50;
  }

  if (isYearly) {
    return 25;
  }

  return 0;
}

/**
 * Get savings amount
 */
export function getSavings(
  tier: PricingTier,
  isRomania: boolean,
  isYearly: boolean
): number {
  const fullPrice = tier.monthlyPrice * (isYearly ? 12 : 1);
  const discountedPrice = calculatePrice(tier, isRomania, isYearly);
  return Math.round(fullPrice - discountedPrice);
}
