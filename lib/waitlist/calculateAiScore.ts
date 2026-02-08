export type WaitlistFormData = {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  company?: string;
  role?: string;
  industry?: string;
  companySize?: string;
  experience?: string;
  teamSize?: string;
  revenueRange?: string;
  fundingStatus?: string;
  whyJoin?: string;
  biggestChallenge?: string;
  currentTools?: string;
  timeline?: string;
  goal?: string;
  notes?: string;
  consent?: boolean;
};

export function calculateAiScore(data: WaitlistFormData): number {
  let score = 50; // Base score
  
  // EXPERIENCE SCORING (max 20 points)
  if (data.experience === '5+ years') score += 20;
  else if (data.experience === '3-5 years') score += 15;
  else if (data.experience === '1-3 years') score += 10;
  else if (data.experience === 'Less than 1 year') score += 5;

  // COMPANY & SIZE SCORING (max 25 points)
  if (data.company) score += 10;
  if (data.companySize === '200+') score += 15;
  else if (data.companySize === '50-200') score += 12;
  else if (data.companySize === '10-50') score += 8;
  else if (data.companySize === '2-10') score += 5;

  // LINKEDIN & PHONE VERIFICATION (max 20 points)
  if (data.linkedin?.includes('linkedin.com')) score += 15;
  if (data.phone) score += 5;

  // PROFESSIONAL EMAIL (max 20 points)
  // Non-generic email domains get higher score
  if (data.email && !data.email.includes('@gmail.com') && !data.email.includes('@yahoo.com') && !data.email.includes('@outlook.com')) {
    score += 20;
  } else if (data.email) {
    score += 5; // Still give points for valid email
  }

  // MOTIVATION & DEPTH (max 20 points)
  if (data.whyJoin && data.whyJoin.length > 150) score += 20;
  else if (data.whyJoin && data.whyJoin.length > 100) score += 15;
  else if (data.whyJoin && data.whyJoin.length > 50) score += 10;

  if (data.biggestChallenge && data.biggestChallenge.length > 50) score += 10;

  // FUNDING STATUS (max 15 points)
  const fundingLower = (data.fundingStatus || '').toLowerCase();
  if (fundingLower.includes('series a')) score += 15;
  else if (fundingLower.includes('seed')) score += 12;
  else if (fundingLower.includes('bootstrapped')) score += 10;
  else if (fundingLower.includes('pre-seed')) score += 8;

  // REVENUE RANGE (max 15 points) - if present
  if (data.revenueRange) {
    if (['100k+', '50k-100k'].includes(data.revenueRange)) score += 15;
    else if (data.revenueRange === '10k-50k') score += 10;
  }

  // TEAM SIZE (max 10 points) - if present
  if (data.teamSize) {
    if (['10+', '5-10'].includes(data.teamSize)) score += 10;
    else if (data.teamSize === '2-5') score += 5;
  }

  // TIMELINE/URGENCY (max 15 points)
  if (data.timeline === 'Immediately') score += 15;
  else if (data.timeline === '1 month') score += 12;
  else if (data.timeline === '3 months') score += 8;
  else if (data.timeline === '6 months') score += 5;

  // GOAL CLARITY (max 15 points)
  if (data.goal && data.goal.length > 100) score += 15;
  else if (data.goal && data.goal.length > 50) score += 10;

  // Slight randomization for natural distribution (0-5 points)
  score += Math.floor(Math.random() * 6);
  
  return Math.min(100, Math.max(0, score));
}
