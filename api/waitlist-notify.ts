import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendWaitlistNotifications } from '../lib/notifications/waitlist.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body?.payload || req.body;
  if (!payload || !payload.email || !payload.name) {
    return res.status(400).json({ error: 'Missing payload, name, or email' });
  }

  try {
    await sendWaitlistNotifications(payload);
    return res.status(200).json({ 
      ok: true,
      message: 'Waitlist entry received. Confirmation email will be sent if configured.'
    });
  } catch (error: any) {
    console.error('Waitlist notify error', error);
    // Still return 200 so the waitlist entry is saved, even if notifications fail
    return res.status(200).json({ 
      ok: true,
      warning: 'Entry saved but notification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
