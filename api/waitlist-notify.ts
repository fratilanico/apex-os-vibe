import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendWaitlistNotifications } from '../lib/notifications/waitlist.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body?.payload || req.body;
  if (!payload || !payload.email || !payload.name) {
    return res.status(400).json({ error: 'Missing payload, name, or email' });
  }

  try {
    await sendWaitlistNotifications(payload);
    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error('Waitlist notify error', error);
    return res.status(500).json({ error: 'Notification send failed' });
  }
}
