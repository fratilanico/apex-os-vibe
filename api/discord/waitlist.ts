import type { VercelRequest, VercelResponse } from '@vercel/node';
import { submitWaitlistEntry } from '../../lib/waitlist/submitEntry.js';

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers['x-bot-token'] as string | undefined;
  if (!BOT_TOKEN) {
    return res.status(500).json({ error: 'Discord bot token not configured' });
  }
  if (token !== BOT_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const payload = req.body;
  if (!payload) {
    return res.status(400).json({ error: 'Missing payload' });
  }

  try {
    const result = await submitWaitlistEntry({ ...payload, platform: 'discord' });
    return res.status(200).json({ ok: true, ...result });
  } catch (error: any) {
    console.error('Discord waitlist submit failed', error);
    return res.status(500).json({ error: error.message || 'Submission failed' });
  }
}
