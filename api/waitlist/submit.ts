import type { VercelRequest, VercelResponse } from '@vercel/node';
import { hasSupabaseServerConfig } from '../../lib/supabaseServer.js';
import { submitWaitlistEntry } from '../../lib/waitlist/submitEntry.js';
import { sendWaitlistNotifications } from '../../lib/notifications/waitlist.js';

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

  const payload = req.body;
  if (!payload) {
    return res.status(400).json({ error: 'Missing payload' });
  }

  console.log('Waitlist submission received:', { 
    name: payload.name, 
    email: payload.email,
    hasSupabase: hasSupabaseServerConfig,
    resendKey: process.env.RESEND_API_KEY ? 'set' : 'missing'
  });

  try {
    let result: any = {};
    
    // Try to save to database if Supabase is configured
    if (hasSupabaseServerConfig) {
      try {
        result = await submitWaitlistEntry(payload);
        console.log('Saved to database:', result);
      } catch (dbError: any) {
        console.error('Database save failed (continuing with email):', dbError.message);
        // Continue anyway - email is more important for demo
      }
    } else {
      console.log('Supabase not configured, skipping database save');
    }

    // Always try to send email notification (critical for demo)
    try {
      await sendWaitlistNotifications({
        ...payload,
        ai_score: result.ai_score || 75,
        referral_code: result.referral_code || `APEX${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        created_at: new Date().toISOString()
      });
      console.log('Email notifications sent successfully');
    } catch (emailError: any) {
      console.error('Email send failed:', emailError.message);
      // Don't fail the request if email fails, but log it
    }

    return res.status(200).json({ 
      ok: true, 
      ...result,
      message: 'Welcome to APEX OS! Check your email for confirmation.'
    });
  } catch (error: any) {
    console.error('Waitlist submit error:', error);
    return res.status(200).json({ 
      ok: true, 
      warning: 'Entry received but there was a processing issue',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
