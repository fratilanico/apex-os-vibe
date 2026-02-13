import type { VercelRequest, VercelResponse } from '@vercel/node';

// ═══════════════════════════════════════════════════════════════════════════════
// WAITLIST SUBMIT — Bulletproof serverless handler
// All SDK initialization is LAZY (inside handler) to prevent module-level crashes
// ═══════════════════════════════════════════════════════════════════════════════

// Simple AI score calculation (mirrors lib/waitlist/calculateAiScore.ts)
function calculateAiScore(payload: any): number {
  let score = 50;
  if (payload.experience) score += 10;
  if (payload.company) score += 10;
  if (payload.linkedin) score += 15;
  if (payload.phone) score += 5;
  if (payload.email && !payload.email.match(/@(gmail|yahoo|hotmail|outlook)\./i)) score += 20;
  if (payload.goal && payload.goal.length > 100) score += 15;
  else if (payload.goal && payload.goal.length > 50) score += 10;
  if (payload.biggestChallenge) score += 10;
  if (payload.fundingStatus && payload.fundingStatus !== 'bootstrapped') score += 10;
  score += Math.floor(Math.random() * 5);
  return Math.min(score, 100);
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
  return `<div style="background:#030305;padding:32px 20px;font-family:'Inter','Helvetica Neue',sans-serif;color:#e5e7eb;max-width:600px;margin:0 auto;">
  <!-- Header Banner -->
  <div style="background:linear-gradient(135deg,rgba(34,211,238,0.15),rgba(16,185,129,0.15));padding:24px;border-radius:16px;border:1px solid rgba(34,211,238,0.25);margin-bottom:24px;text-align:center;">
    <div style="color:#22d3ee;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;font-weight:700;">APEX OS</div>
    <div style="font-size:24px;font-weight:900;color:#ffffff;margin-top:8px;">Welcome to the Swarm, ${entry.name || 'Founder'}.</div>
    <div style="font-size:13px;color:#94a3b8;margin-top:8px;">Your neural link has been established. Standard protocols are offline.</div>
  </div>

  <!-- AI Score Card -->
  <div style="background:rgba(6,182,212,0.08);border:1px solid rgba(6,182,212,0.2);border-radius:12px;padding:20px;margin-bottom:20px;">
    <!-- ... content for AI Score, Rank, Referral Code ... -->
  </div>

  <!-- Vault Access -->
  <div style="margin:24px 0;padding:20px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:12px;text-align:center;">
    <div style="color:#10b981;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:12px;">Early Access Reward Unlocked</div>
    <a href="https://apex-os-clean-kappa.vercel.app/waitlist?vault_access=true" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#10b981,#06b6d4);color:#000;text-decoration:none;border-radius:10px;font-weight:800;font-size:14px;letter-spacing:0.05em;">ACCESS THE VAULT</a>
  </div>
  <!-- ... rest of email ... -->
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
    // onboarding@resend.dev = sandbox (only delivers to Resend account owner)
    // Set FROM_EMAIL_VERIFIED=true after verifying your domain in Resend
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
      hasResend: !!(process.env.RESEND_API_KEY),
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
        const userEmailResult = await resend.emails.send({
          from: FROM_EMAIL,
          to: payload.email,
          subject: `Welcome to APEX OS — You're in, ${payload.name || 'Founder'}`,
          html: buildWelcomeEmail({ ...entry, rank }),
        });
        console.log('User email sent:', userEmailResult);

        if (!isVerifiedSender && payload.email !== NOTIFY_EMAIL) {
          console.warn(
            `WARNING: Using sandbox sender (onboarding@resend.dev). ` +
            `Email to ${payload.email} will likely NOT be delivered. ` +
            `Set FROM_EMAIL_VERIFIED=true with a verified domain to fix this.`
          );
        }

        // Send admin notification
        const adminEmailResult = await resend.emails.send({
          from: FROM_EMAIL,
          to: NOTIFY_EMAIL,
          subject: `${entry.status === 'hot' ? '🔥' : '🟡'} APEX Waitlist: ${payload.name} (${ai_score}/100)`,
          html: buildAdminEmail(payload, { ...entry, rank }),
        });
        console.log('Admin email sent:', adminEmailResult);
      } catch (emailError: any) {
        console.error('Email error:', emailError.message);
      }
    } else {
      console.warn('RESEND_API_KEY not set — no emails sent');
    }

    // ── Listmonk subscriber sync (fire-and-forget) ──
    if (process.env.LISTMONK_API_URL) {
      try {
        const credentials = `${process.env.LISTMONK_USERNAME || 'admin'}:${process.env.LISTMONK_PASSWORD || ''}`;
        const listmonkAuth = 'Basic ' + Buffer.from(credentials).toString('base64');

        fetch(`${process.env.LISTMONK_API_URL}/subscribers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': listmonkAuth },
          body: JSON.stringify({
            email: payload.email,
            name: payload.name || '',
            status: 'enabled',
            lists: [1],
            attribs: { ai_score, status, referral_code: referralCode, persona: payload.persona },
          }),
        }).then(r => r.json())
          .then(d => console.log('Listmonk subscriber synced:', d))
          .catch(e => console.warn('Listmonk sync skipped:', e.message));
      } catch (e: any) {
        console.warn('Listmonk sync error:', e.message);
      }
    }

    // ── Notion sync (fire-and-forget CRM fallback) ──
    if (process.env.NOTION_TOKEN && process.env.NOTION_WAITLIST_DB_ID) {
      try {
        const statusEmoji = status === 'hot' ? '🔥' : status === 'warm' ? '🟡' : '⚪';
        fetch('https://api.notion.com/v1/pages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parent: { database_id: process.env.NOTION_WAITLIST_DB_ID },
            properties: {
              Name: { title: [{ text: { content: payload.name || 'Unknown' } }] },
              Email: { email: payload.email },
              'AI Score': { number: ai_score },
              Status: { select: { name: `${statusEmoji} ${status.toUpperCase()}` } },
              'Referral Code': { rich_text: [{ text: { content: referralCode } }] },
              Persona: { select: { name: payload.persona || 'PERSONAL_BUILDER' } },
            },
          }),
        }).then(r => r.json())
          .then(d => console.log('Notion page created:', d.id))
          .catch(e => console.warn('Notion sync skipped:', e.message));
      } catch (e: any) {
        console.warn('Notion sync error:', e.message);
      }
    }

    // ── Final response — always returns valid JSON ──
    const finalResponse = {
      ok: true,
      ai_score,
      referral_code: entry.referral_code,
      status,
      rank,
      message: 'Welcome to APEX OS!',
    };

    console.log('API Response:', JSON.stringify(finalResponse));
    return res.status(200).json(finalResponse);

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
