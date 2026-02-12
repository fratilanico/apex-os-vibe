import type { VercelRequest, VercelResponse } from '@vercel/node';

// ═══════════════════════════════════════════════════════════════════════════════
// WAITLIST SUBMIT — Bulletproof serverless handler
// All SDK initialization is LAZY (inside handler) to prevent module-level crashes
// ═══════════════════════════════════════════════════════════════════════════════

// Simple AI score calculation (mirrors lib/waitlist/calculateAiScore.ts)
function calculateAiScore(payload: any): number {
  let score = 50;
  
  // Role / Persona Checks
  const role = (payload.role || '').toLowerCase();
  // const bio = (payload.bio || '').toLowerCase(); // Kept for future use
  const goal = (payload.goal || '').toLowerCase();

  if (role.includes('founder') || role.includes('cto') || role.includes('engineer')) score += 15;
  if (role.includes('product') || role.includes('designer')) score += 10;
  
  if (payload.experience) score += 10;
  if (payload.company) score += 10;
  if (payload.linkedin) score += 15;
  if (payload.phone) score += 5;
  if (payload.email && !payload.email.match(/@(gmail|yahoo|hotmail|outlook)\./i)) score += 20; // Corp email bonus
  
  // Engagement Checks
  if (goal.length > 100) score += 15;
  else if (goal.length > 20) score += 10;
  
  if (payload.biggestChallenge) score += 10;
  if (payload.fundingStatus && payload.fundingStatus !== 'bootstrapped') score += 10;
  
  // Random variance for "organic" feel
  score += Math.floor(Math.random() * 5);
  
  return Math.min(score, 99); // Cap at 99 (100 is reserved)
}

function getStatus(score: number): 'hot' | 'warm' | 'cold' {
  if (score >= 80) return 'hot';
  if (score >= 60) return 'warm';
  return 'cold';
}

// ═══════════════════════════════════════════════════════════════════════════════
// EMAIL TEMPLATES — Sovereign-grade founder communication
// ═══════════════════════════════════════════════════════════════════════════════

function buildWelcomeEmail(entry: any): string {
  const statusLabel = entry.status === 'hot' ? 'Sovereign Founder' : entry.status === 'warm' ? 'Strong Signal' : 'Growing Potential';
  const statusColor = entry.status === 'hot' ? '#10b981' : entry.status === 'warm' ? '#06b6d4' : '#94a3b8';

  return `
    <div style="background:#030305;padding:32px 20px;font-family:'Inter','Helvetica Neue',sans-serif;color:#e5e7eb;max-width:600px;margin:0 auto;">
      <!-- Header Banner -->
      <div style="background:linear-gradient(135deg,rgba(34,211,238,0.15),rgba(16,185,129,0.15));padding:24px;border-radius:16px;border:1px solid rgba(34,211,238,0.25);margin-bottom:24px;text-align:center;">
        <div style="color:#22d3ee;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;font-weight:700;">APEX OS</div>
        <div style="font-size:24px;font-weight:900;color:#ffffff;margin-top:8px;">Welcome to the Swarm, ${entry.name || 'Founder'}.</div>
        <div style="font-size:13px;color:#94a3b8;margin-top:8px;">Your neural link has been established. Standard protocols are offline.</div>
      </div>

      <!-- AI Score Card -->
      <div style="background:rgba(6,182,212,0.08);border:1px solid rgba(6,182,212,0.2);border-radius:12px;padding:20px;margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:16px;">
          <div>
            <div style="color:#06b6d4;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-weight:700;">AI Readiness Score</div>
            <div style="font-size:36px;font-weight:900;color:#ffffff;margin-top:4px;">${entry.ai_score}<span style="font-size:16px;color:#94a3b8">/100</span></div>
          </div>
          <div style="text-align:right;">
            <div style="color:${statusColor};font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-weight:700;">Status</div>
            <div style="font-size:16px;font-weight:800;color:${statusColor};margin-top:4px;">${statusLabel}</div>
          </div>
        </div>
        <div style="display:flex;gap:16px;">
          <div style="flex:1;background:rgba(255,255,255,0.03);border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;">Queue Rank</div>
            <div style="font-size:18px;font-weight:800;color:#ffffff;">#${entry.rank}</div>
          </div>
          <div style="flex:1;background:rgba(255,255,255,0.03);border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;">Referral Code</div>
            <div style="font-size:18px;font-weight:800;color:#22d3ee;">${entry.referral_code}</div>
          </div>
        </div>
      </div>

      <!-- Vault Access -->
      <div style="margin:24px 0;padding:20px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:12px;text-align:center;">
        <div style="color:#10b981;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:12px;">Early Access Reward Unlocked</div>
        <a href="https://infoacademy.uk/waitlist?vault_access=true" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#10b981,#06b6d4);color:#000;text-decoration:none;border-radius:10px;font-weight:800;font-size:14px;letter-spacing:0.05em;">ACCESS THE VAULT</a>
      </div>

      <!-- What Happens Next -->
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px;margin-bottom:20px;">
        <div style="color:#ffffff;font-size:14px;font-weight:800;margin-bottom:12px;">What happens next:</div>
        <div style="font-size:13px;color:#cbd5e1;line-height:1.8;">
          1. Live Webinar invite drops in 2-3 weeks<br/>
          2. Module 00: The Shift — available immediately in the terminal<br/>
          3. Your dedicated AI scoring adjusts as you engage<br/>
          4. Share your referral code to climb the queue
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align:center;margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.07);">
        <div style="font-size:11px;color:#64748b;">APEX OS — The Operating System for the AI Age</div>
        <div style="font-size:11px;color:#475569;margin-top:4px;">infoacademy.uk</div>
      </div>
    </div>`;
}

function buildAdminEmail(payload: any, entry: any): string {
  const statusEmoji = entry.status === 'hot' ? '🔥' : entry.status === 'warm' ? '🟡' : '⚪';
  return `
    <div style="background:#030305;padding:24px;font-family:'Inter','Helvetica Neue',sans-serif;color:#e5e7eb;max-width:600px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,rgba(34,211,238,0.15),rgba(139,92,246,0.15));padding:16px;border-radius:12px;border:1px solid rgba(34,211,238,0.25);margin-bottom:20px;">
        <div style="color:#22d3ee;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;font-weight:700;">APEX OS — New Waitlist Entry</div>
        <div style="font-size:18px;font-weight:800;color:#ffffff;margin-top:6px;">${statusEmoji} ${payload.name} — ${entry.status?.toUpperCase()} (${entry.ai_score}/100)</div>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px;">
        <div style="font-size:13px;line-height:2;">
          <div><strong style="color:#06b6d4;">Name:</strong> ${payload.name}</div>
          <div><strong style="color:#06b6d4;">Email:</strong> ${payload.email}</div>
          <div><strong style="color:#06b6d4;">Phone:</strong> ${payload.phone || '—'}</div>
          <div><strong style="color:#06b6d4;">Persona:</strong> ${payload.persona || '—'}</div>
          <div><strong style="color:#06b6d4;">Goal:</strong> ${payload.goal || '—'}</div>
          <div><strong style="color:#06b6d4;">AI Score:</strong> ${entry.ai_score}/100 (${entry.status})</div>
          <div><strong style="color:#06b6d4;">Referral:</strong> ${entry.referral_code}</div>
          <div><strong style="color:#06b6d4;">Rank:</strong> #${entry.rank}</div>
          <div><strong style="color:#06b6d4;">Mode:</strong> ${payload.mode || 'web_form'}</div>
          <div><strong style="color:#06b6d4;">Platform:</strong> ${payload.platform || '—'}</div>
          ${payload.linkedin ? `<div><strong style="color:#06b6d4;">LinkedIn:</strong> ${payload.linkedin}</div>` : ''}
          ${payload.company ? `<div><strong style="color:#06b6d4;">Company:</strong> ${payload.company}</div>` : ''}
          ${payload.notes ? `<div><strong style="color:#06b6d4;">Notes:</strong> ${payload.notes}</div>` : ''}
        </div>
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HANDLER — All SDK init is lazy to prevent module-level crashes
// ═══════════════════════════════════════════════════════════════════════════════

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers — always set, even on error
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

    // ── FROM_EMAIL CONFIG ──
    const isVerifiedSender = process.env.FROM_EMAIL_VERIFIED === 'true';
    const FROM_EMAIL = isVerifiedSender
      ? (process.env.FROM_EMAIL || 'APEX OS <apex@infoacademy.uk>')
      : 'onboarding@resend.dev';
    const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'fratilanico@gmail.com';

    console.log('Waitlist submission:', {
      name: payload.name,
      email: payload.email,
      fromEmail: FROM_EMAIL,
      isVerifiedSender,
      hasSupabase: !!(process.env.SUPABASE_URL),
    });

    // Calculate real AI score
    const ai_score = calculateAiScore(payload);
    const status = getStatus(ai_score);
    const referralCode = `APEX${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const entryData = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone || null,
      goal: payload.goal || null,
      persona: payload.persona || 'PERSONAL_BUILDER',
      linkedin: payload.linkedin || null,
      company: payload.company || null,
      role: payload.role || null,
      notes: payload.notes || null,
      whyJoin: payload.whyJoin || null,
      biggestChallenge: payload.biggestChallenge || null,
      currentTools: payload.currentTools || null,
      timeline: payload.timeline || null,
      experience: payload.experience || null,
      fundingStatus: payload.fundingStatus || null,
      ai_score,
      referral_code: referralCode,
      status,
      platform: payload.platform || (payload.mode === 'GEEK_V3' ? 'geek_terminal' : 'web_form'),
      mode: payload.mode || 'STANDARD',
    };

    // ── Store in Supabase (lazy init) ──
    let entry: any = { ...entryData, id: `WL${Date.now()}`, created_at: new Date().toISOString() };
    let rank = Math.floor(Math.random() * 50) + 2800;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Try 'waitlist' table first, fall back to 'waitlist_entries'
        let dbResult = await supabase.from('waitlist').insert([entryData]).select().single();

        if (dbResult.error?.code === '42P01') {
          dbResult = await supabase.from('waitlist_entries').insert([entryData]).select().single();
        }

        if (dbResult.error) {
          console.error('Supabase error:', dbResult.error);
        } else if (dbResult.data) {
          entry = dbResult.data;
          console.log('Stored in Supabase:', entry.id);

          // Get real rank
          const countRes = await supabase
            .from('waitlist')
            .select('id', { count: 'exact', head: true });
          rank = countRes.count ?? rank;
        }
      } catch (dbError: any) {
        console.error('Database error:', dbError.message);
      }
    } else {
      console.warn('Supabase not configured — entry stored in memory only');
    }

    entry.rank = entry.rank || rank;

    // ── Send email notifications (lazy init) ──
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Send welcome email to user
        await resend.emails.send({
          from: FROM_EMAIL,
          to: payload.email,
          subject: `Welcome to APEX OS — You're in, ${payload.name || 'Founder'}`,
          html: buildWelcomeEmail({ ...entry, rank }),
        });

        // Send admin notification
        await resend.emails.send({
          from: FROM_EMAIL,
          to: NOTIFY_EMAIL,
          subject: `${entry.status === 'hot' ? '🔥' : '🟡'} APEX Waitlist: ${payload.name} (${ai_score}/100)`,
          html: buildAdminEmail(payload, { ...entry, rank }),
        });
      } catch (emailError: any) {
        console.error('Email error:', emailError.message);
      }
    }

    // ── Trigger Notion Sync (Perplexity Enrichment) ──
    // Fire-and-forget call to the sync endpoint. 
    // This allows the user request to complete fast, while the enrichment runs in the background.
    // Note: We need the full URL for server-side fetch.
    if (process.env.VERCEL_URL) {
      const syncUrl = `https://${process.env.VERCEL_URL}/api/waitlist/notion-sync`;
      fetch(syncUrl, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: payload.email })
      }).catch(err => console.error('Failed to trigger sync:', err));
    }

    // ── Final response ──
    const finalResponse = {
      ok: true,
      ai_score,
      referral_code: entry.referral_code,
      status,
      rank,
      message: 'Welcome to APEX OS!',
    };

    return res.status(200).json(finalResponse);

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
