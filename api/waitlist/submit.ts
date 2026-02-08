import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Simple in-memory storage for demo (will reset on deploy)
const submissions: any[] = [];

// Initialize Resend
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'fratilanico@gmail.com';

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

  try {
    const payload = req.body;
    
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('Waitlist submission:', { 
      name: payload.name, 
      email: payload.email,
      hasResend: !!resend,
      resendKey: process.env.RESEND_API_KEY ? 'set' : 'missing'
    });

    // Store submission (in-memory for demo)
    const entry = {
      id: `WL${Date.now()}`,
      name: payload.name,
      email: payload.email,
      phone: payload.phone || '',
      goal: payload.goal || '',
      persona: payload.persona || 'PERSONAL_BUILDER',
      ai_score: 75,
      referral_code: `APEX${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      created_at: new Date().toISOString()
    };
    submissions.push(entry);

    // Send email notification
    if (resend) {
      try {
        // Send to user
        await resend.emails.send({
          from: FROM_EMAIL,
          to: payload.email,
          subject: 'APEX OS Waitlist — You are in',
          html: `
            <div style="background:#030305;padding:20px;font-family:Inter,sans-serif;color:#e5e7eb;">
              <div style="background:linear-gradient(135deg,rgba(34,211,238,0.15),rgba(16,185,129,0.15));padding:16px;border-radius:12px;border:1px solid rgba(34,211,238,0.25);margin-bottom:16px;">
                <div style="color:#22d3ee;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;">APEX OS</div>
                <div style="font-size:18px;font-weight:800;color:#ffffff;margin-top:6px;">You're in. Welcome to the Swarm.</div>
              </div>
              <p style="font-size:14px;color:#cbd5e1;line-height:1.6;">Welcome Founder. You have successfully established a neural link with APEX OS.</p>
              <div style="margin:20px 0;padding:16px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);border-radius:12px;text-align:center;">
                <div style="color:#10b981;font-size:12px;font-weight:bold;text-transform:uppercase;margin-bottom:8px;">Early Access Reward Unlocked</div>
                <div style="font-size:14px;color:#e5e7eb;">Your Referral ID: <strong>${entry.referral_code}</strong></div>
              </div>
              <p style="font-size:12px;color:#94a3b8;margin-top:12px;">Next Step: Live Webinar in 2-3 weeks. Watch your inbox for the sync signal.</p>
            </div>
          `
        });

        // Send notification to admin
        await resend.emails.send({
          from: FROM_EMAIL,
          to: NOTIFY_EMAIL,
          subject: `APEX Waitlist: ${payload.name}`,
          html: `
            <div style="background:#030305;padding:20px;font-family:Inter,sans-serif;color:#e5e7eb;">
              <h2 style="color:#22d3ee;">New Waitlist Entry</h2>
              <p><strong>Name:</strong> ${payload.name}</p>
              <p><strong>Email:</strong> ${payload.email}</p>
              <p><strong>Goal:</strong> ${payload.goal || 'N/A'}</p>
              <p><strong>Referral:</strong> ${entry.referral_code}</p>
            </div>
          `
        });

        console.log('Emails sent successfully');
      } catch (emailError: any) {
        console.error('Email error:', emailError.message);
      }
    } else {
      console.log('Resend not configured, skipping emails');
    }

    return res.status(200).json({ 
      ok: true, 
      ...entry,
      message: 'Welcome to APEX OS!'
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Server error', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
}
