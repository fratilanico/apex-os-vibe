import type { VercelRequest, VercelResponse } from '@vercel/node';
import { hasSupabaseServerConfig } from '../../lib/supabaseServer.js';
import { submitWaitlistEntry } from '../../lib/waitlist/submitEntry.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!hasSupabaseServerConfig) {
    return res.status(500).json({ error: 'Supabase config missing' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body;
  if (!payload) {
    return res.status(400).json({ error: 'Missing payload' });
  }

  try {
    const result = await submitWaitlistEntry(payload);
    return res.status(200).json({ ok: true, ...result });
  } catch (error: any) {
    console.error('Waitlist submit error', error);
    return res.status(500).json({ error: error.message || 'Submission failed' });
  }
}
