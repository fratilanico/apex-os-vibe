import type { VercelRequest, VercelResponse } from '@vercel/node';
import { submitWaitlistEntry } from '../../lib/waitlist/submitEntry.js';

const TELEGRAM_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (TELEGRAM_SECRET) {
    const token = req.headers['x-telegram-secret'] as string | undefined;
    if (token !== TELEGRAM_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const payload = req.body;
  if (!payload) {
    return res.status(400).json({ error: 'Missing payload' });
  }

  try {
    const result = await submitWaitlistEntry({ ...payload, platform: 'telegram' });
    return res.status(200).json({ ok: true, ...result });
  } catch (error: any) {
    console.error('Telegram waitlist submit failed', error);
    return res.status(500).json({ error: error.message || 'Submission failed' });
  }
}
