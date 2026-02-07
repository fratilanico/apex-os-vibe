import { supabaseServer } from '../supabaseServer.js';
import { sendWaitlistNotifications } from '../notifications/waitlist.js';
import { calculateAiScore, WaitlistFormData } from './calculateAiScore.js';

const REQUIRED_FIELDS_STANDARD = ['name', 'email', 'phone', 'goal', 'consent'];
const REQUIRED_FIELDS_GEEK = ['name', 'email', 'phone', 'goal']; // Terminal bypasses consent checkbox but implies it

const generateReferralCode = () => `APEX${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

const getStatus = (score: number) => {
  if (score >= 80) return 'hot';
  if (score >= 60) return 'warm';
  return 'cold';
};

export type SubmitPayload = WaitlistFormData & {
  platform?: string;
  commands?: unknown;
  mode?: string;
};

export async function submitWaitlistEntry(payload: SubmitPayload) {
  const isGeekMode = payload.mode === 'GEEK_V2' || payload.mode === 'GEEK_V3';
  const requiredFields = isGeekMode ? REQUIRED_FIELDS_GEEK : REQUIRED_FIELDS_STANDARD;

  for (const field of requiredFields) {
    if (!payload[field as keyof WaitlistFormData]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  const ai_score = calculateAiScore(payload);
  const referral_code = generateReferralCode();
  const status = getStatus(ai_score);
  
  const newRecord = {
    ...payload,
    consent: true, // Implied consent from terminal or validated from web form
    ai_score,
    referral_code,
    status,
    platform: payload.platform || (isGeekMode ? 'geek_terminal' : 'web_form'),
    created_at: new Date().toISOString(),
  };

  const { error } = await supabaseServer.from('waitlist').insert([newRecord]);
  if (error) {
    console.error('Supabase insert error', error);
    throw new Error('Database insert failed');
  }

  const countRes = await supabaseServer.from('waitlist').select('id', { count: 'exact', head: true });
  const rank = countRes.count ?? 0;

  // Fire notifications
  await sendWaitlistNotifications(newRecord);

  return { ai_score, referral_code, status, rank };
}
