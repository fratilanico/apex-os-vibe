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
  let score = 50;
  if (data.experience === '5+') score += 20;
  else if (data.experience === '3-5') score += 15;
  else if (data.experience === '1-3') score += 10;

  if (data.company) score += 10;
  if (data.companySize === '50-200' || data.companySize === '200+') score += 15;

  if (data.linkedin?.includes('linkedin.com')) score += 15;
  if (data.phone) score += 5;

  if (data.email && !data.email.includes('@gmail.com') && !data.email.includes('@yahoo.com')) {
    score += 20;
  }

  if (data.whyJoin && data.whyJoin.length > 100) score += 15;
  else if (data.whyJoin && data.whyJoin.length > 50) score += 10;

  if (['bootstrapped', 'seed', 'series-a'].includes(data.fundingStatus || '')) score += 15;
  if (['10k-50k', '50k-100k', '100k+'].includes(data.revenueRange || '')) score += 15;

  if (['5-10', '10+'].includes(data.teamSize || '')) score += 10;
  if (['immediately', '1-month'].includes(data.timeline || '')) score += 10;

  score += Math.floor(Math.random() * 10);
  return Math.min(100, Math.max(0, score));
}
