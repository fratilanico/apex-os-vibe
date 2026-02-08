import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendContactNotifications } from '../lib/notifications/contact.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body;
  if (!payload || !payload.email || !payload.name || !payload.message) {
    return res.status(400).json({ error: 'Missing required fields (name, email, message)' });
  }

  try {
    await sendContactNotifications(payload);
    return res.status(200).json({ 
      ok: true,
      message: 'Message received. We will get back to you shortly.'
    });
  } catch (error: any) {
    console.error('Contact notify error', error);
    return res.status(200).json({ 
      ok: true,
      warning: 'Message saved but notification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
