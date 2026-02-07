import { supabaseServer } from '../supabaseServer.js';
import { sendWaitlistNotifications } from '../notifications/waitlist.js';
import { calculateAiScore, WaitlistFormData } from './calculateAiScore.js';

const REQUIRED_FIELDS = ['name', 'email', 'phone', 'goal', 'consent'];

const generateReferralCode = () => `APEX${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

const getStatus = (score: number) => {
  if (score >= 80) return 'hot';
  if (score >= 60) return 'warm';
  return 'cold';
};

export type SubmitPayload = WaitlistFormData & {
  platform?: string;
  commands?: unknown;
};

export async function submitWaitlistEntry(payload: SubmitPayload) {
  for (const field of REQUIRED_FIELDS) {
    if (!payload[field as keyof WaitlistFormData]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  const ai_score = calculateAiScore(payload);
  const referral_code = generateReferralCode();
  const status = getStatus(ai_score);
  const newRecord = {
    ...payload,
    ai_score,
    referral_code,
    status,
    platform: payload.platform || 'terminal',
    created_at: new Date().toISOString(),
  };

  const { error } = await supabaseServer.from('waitlist').insert([newRecord]);
  if (error) {
    console.error('Supabase insert error', error);
    throw new Error('Database insert failed');
  }

  const countRes = await supabaseServer.from('waitlist').select('id', { count: 'exact', head: true });
  const rank = countRes.count ?? 0;

  await sendWaitlistNotifications(newRecord);

  return { ai_score, referral_code, status, rank };
}
