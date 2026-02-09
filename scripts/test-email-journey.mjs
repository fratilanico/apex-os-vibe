#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * APEX OS — Test Email Journey
 * Simulates the full waitlist submission flow with real Resend emails.
 *
 * Usage:
 *   RESEND_API_KEY=re_xxx node scripts/test-email-journey.mjs
 *
 * Or with .env:
 *   node --env-file=.env scripts/test-email-journey.mjs
 *
 * What it does:
 *   1. Sends a WELCOME email to the test user (fratilanicu@gmail.com)
 *   2. Sends an ADMIN notification to you (fratilanico@gmail.com)
 *   Both use the exact same templates as api/waitlist/submit.ts
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ── Config ──────────────────────────────────────────────────────────────────
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL_VERIFIED === 'true'
  ? (process.env.FROM_EMAIL || 'APEX OS <apex@infoacademy.uk>')
  : 'onboarding@resend.dev';

const TEST_USER_EMAIL = 'fratilanicu@gmail.com';
const ADMIN_EMAIL = 'fratilanico@gmail.com';

if (!RESEND_API_KEY) {
  console.error('╔═══════════════════════════════════════════════════════════╗');
  console.error('║  RESEND_API_KEY is required.                             ║');
  console.error('║                                                          ║');
  console.error('║  Run with:                                               ║');
  console.error('║  RESEND_API_KEY=re_xxx node scripts/test-email-journey.mjs║');
  console.error('╚═══════════════════════════════════════════════════════════╝');
  process.exit(1);
}

// ── Mock Data ───────────────────────────────────────────────────────────────
const mockPayload = {
  name: 'Nicu The Founder',
  email: TEST_USER_EMAIL,
  phone: '+40 700 AI AGENT',
  persona: 'SOLO_FOUNDER',
  goal: 'I want to build an AI-powered SaaS that automates due diligence for seed-stage VCs. Think: upload a pitch deck, get a 20-page analysis in 4 minutes. Already have a waitlist of 47 VC partners. The agents do the work, I orchestrate the swarm.',
  linkedin: 'https://linkedin.com/in/nicu-founder',
  company: 'Neural Diligence AI',
  role: 'CEO & Founder',
  notes: 'Referred by the APEX terminal. Typed "sudo make me dangerous" in the onboarding flow.',
  whyJoin: 'Because building alone is slow. Building with agents is sovereign.',
  biggestChallenge: 'Multi-agent orchestration at scale — 6 agents, zero hallucinations.',
  currentTools: 'Claude, Cursor, v0, Supabase, Vercel',
  timeline: 'immediately',
  experience: '3-5',
  fundingStatus: 'pre-seed',
  mode: 'GEEK_V3',
  platform: 'geek_terminal',
};

const ai_score = 92;
const status = 'hot';
const referral_code = 'APEXTST42';
const rank = 7;

// ── Email Templates (exact copies from api/waitlist/submit.ts) ──────────────

function buildWelcomeEmail(entry) {
  const statusLabel = entry.status === 'hot' ? 'Sovereign Founder' : entry.status === 'warm' ? 'Strong Signal' : 'Growing Potential';
  const statusColor = entry.status === 'hot' ? '#10b981' : entry.status === 'warm' ? '#06b6d4' : '#94a3b8';

  return `
    <div style="background:#030305;padding:32px 20px;font-family:'Inter','Helvetica Neue',sans-serif;color:#e5e7eb;max-width:600px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,rgba(34,211,238,0.15),rgba(16,185,129,0.15));padding:24px;border-radius:16px;border:1px solid rgba(34,211,238,0.25);margin-bottom:24px;text-align:center;">
        <div style="color:#22d3ee;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;font-weight:700;">APEX OS</div>
        <div style="font-size:24px;font-weight:900;color:#ffffff;margin-top:8px;">Welcome to the Swarm, ${entry.name || 'Founder'}.</div>
        <div style="font-size:13px;color:#94a3b8;margin-top:8px;">Your neural link has been established. Standard protocols are offline.</div>
      </div>
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
      <div style="margin:24px 0;padding:20px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:12px;text-align:center;">
        <div style="color:#10b981;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:12px;">Early Access Reward Unlocked</div>
        <a href="https://infoacademy.uk/waitlist" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#10b981,#06b6d4);color:#000;text-decoration:none;border-radius:10px;font-weight:800;font-size:14px;letter-spacing:0.05em;">ACCESS THE VAULT</a>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px;margin-bottom:20px;">
        <div style="color:#ffffff;font-size:14px;font-weight:800;margin-bottom:12px;">What happens next:</div>
        <div style="font-size:13px;color:#cbd5e1;line-height:1.8;">
          1. Live Webinar invite drops in 2-3 weeks<br/>
          2. Module 00: The Shift — available immediately in the terminal<br/>
          3. Your dedicated AI scoring adjusts as you engage<br/>
          4. Share your referral code to climb the queue
        </div>
      </div>
      <div style="text-align:center;margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.07);">
        <div style="font-size:11px;color:#64748b;">APEX OS — The Operating System for the AI Age</div>
        <div style="font-size:11px;color:#475569;margin-top:4px;">infoacademy.uk</div>
      </div>
    </div>`;
}

function buildAdminEmail(payload, entry) {
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
          ${payload.biggestChallenge ? `<div><strong style="color:#06b6d4;">Challenge:</strong> ${payload.biggestChallenge}</div>` : ''}
          ${payload.currentTools ? `<div><strong style="color:#06b6d4;">Tools:</strong> ${payload.currentTools}</div>` : ''}
        </div>
      </div>
      <div style="text-align:center;margin-top:16px;padding:12px;background:rgba(16,185,129,0.08);border-radius:8px;">
        <div style="font-size:11px;color:#10b981;font-weight:700;">🤖 AI Joke of the Day</div>
        <div style="font-size:12px;color:#94a3b8;margin-top:4px;font-style:italic;">"Why did the neural network break up with the decision tree? Because it needed more layers in the relationship."</div>
      </div>
    </div>`;
}

// ── Send Emails ─────────────────────────────────────────────────────────────

async function sendEmail(to, subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });

  const data = await res.json();
  return { status: res.status, data };
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║  APEX OS — Email Journey Test                            ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`  From:       ${FROM_EMAIL}`);
  console.log(`  User:       ${TEST_USER_EMAIL}`);
  console.log(`  Admin:      ${ADMIN_EMAIL}`);
  console.log(`  AI Score:   ${ai_score}/100 (${status})`);
  console.log(`  Verified:   ${process.env.FROM_EMAIL_VERIFIED === 'true' ? 'YES' : 'NO (sandbox mode)'}`);
  console.log('');

  if (FROM_EMAIL === 'onboarding@resend.dev') {
    console.log('  ⚠️  SANDBOX MODE: Only the Resend account owner will receive emails.');
    console.log('  ⚠️  Set FROM_EMAIL_VERIFIED=true after verifying your domain in Resend.');
    console.log('');
  }

  const entry = {
    name: mockPayload.name,
    ai_score,
    status,
    referral_code,
    rank,
  };

  // 1. Welcome email to test user
  console.log('  [1/2] Sending WELCOME email to', TEST_USER_EMAIL, '...');
  const welcomeResult = await sendEmail(
    TEST_USER_EMAIL,
    `Welcome to APEX OS — You're in, ${mockPayload.name}`,
    buildWelcomeEmail(entry)
  );
  console.log(`        → ${welcomeResult.status === 200 ? '✓' : '✗'} Status: ${welcomeResult.status}`, welcomeResult.data);

  // 2. Admin notification
  console.log('  [2/2] Sending ADMIN notification to', ADMIN_EMAIL, '...');
  const adminResult = await sendEmail(
    ADMIN_EMAIL,
    `🔥 APEX Waitlist: ${mockPayload.name} (${ai_score}/100)`,
    buildAdminEmail(mockPayload, entry)
  );
  console.log(`        → ${adminResult.status === 200 ? '✓' : '✗'} Status: ${adminResult.status}`, adminResult.data);

  console.log('');
  console.log('  Done. Check your inbox.');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
