import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');
const fromEmail = process.env.FROM_EMAIL || 'APEX OS <apex@infoacademy.uk>';
const internalEmail = process.env.NOTIFY_EMAIL || 'apex@infoacademy.uk';
const telegramToken = process.env.TELEGRAM_BOT_TOKEN || '';
const telegramChatId = process.env.TELEGRAM_CHAT_ID || '';
const discordWebhook = process.env.DISCORD_WEBHOOK_URL || '';

const buildInternalHtml = (payload: any) => {
  const lines = [
    `<strong>Name:</strong> ${payload.name || ''}`,
    `<strong>Email:</strong> ${payload.email || ''}`,
    `<strong>Phone:</strong> ${payload.phone || ''}`,
    `<strong>LinkedIn:</strong> ${payload.linkedin || '—'}`,
    `<strong>Goal:</strong> ${payload.goal || ''}`,
    `<strong>Notes:</strong> ${payload.notes || '—'}`,
    `<strong>Persona:</strong> ${payload.persona || '—'}`,
    `<strong>AI Score:</strong> ${payload.ai_score ?? '—'}`,
    `<strong>Referral:</strong> ${payload.referral_code || '—'}`,
    `<strong>Platform:</strong> ${payload.platform || '—'}`,
    `<strong>Created:</strong> ${payload.created_at || new Date().toISOString()}`,
  ];

  return `
    <div style="background:#030305;padding:20px;font-family:Inter,sans-serif;color:#e5e7eb;">
      <div style="background:linear-gradient(135deg,rgba(34,211,238,0.15),rgba(16,185,129,0.15));padding:16px;border-radius:12px;border:1px solid rgba(34,211,238,0.25);margin-bottom:16px;">
        <div style="color:#22d3ee;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;">APEX OS Waitlist</div>
        <div style="font-size:18px;font-weight:800;color:#ffffff;margin-top:6px;">New Submission</div>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px;">
        ${lines.map((line) => `<div style="margin:6px 0;font-size:13px;">${line}</div>`).join('')}
      </div>
    </div>`;
};

const buildUserHtml = (payload: any) => `
  <div style="background:#030305;padding:20px;font-family:Inter,sans-serif;color:#e5e7eb;">
    <div style="background:linear-gradient(135deg,rgba(34,211,238,0.15),rgba(16,185,129,0.15));padding:16px;border-radius:12px;border:1px solid rgba(34,211,238,0.25);margin-bottom:16px;">
      <div style="color:#22d3ee;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;">APEX OS</div>
      <div style="font-size:18px;font-weight:800;color:#ffffff;margin-top:6px;">You're in. Welcome to the Swarm.</div>
    </div>
    <p style="font-size:14px;color:#cbd5e1;line-height:1.6;">Welcome Founder. You have successfully established a neural link with APEX OS.</p>
    
    <div style="margin:20px 0;padding:16px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);border-radius:12px;text-align:center;">
      <div style="color:#10b981;font-size:12px;font-weight:bold;text-transform:uppercase;margin-bottom:8px;">Early Access Reward Unlocked</div>
      <a href="https://www.notion.so/infoacademy/APEX-OS-Founder-Bible-Placeholder" style="display:inline-block;padding:10px 20px;background:#10b981;color:#000;text-decoration:none;border-radius:8px;font-weight:bold;font-size:14px;">ACCESS PRIVATE VAULT</a>
    </div>

    <div style="margin-top:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:14px;">
      <div style="color:#22d3ee;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:8px;">Your Profile</div>
      <div style="font-size:13px;">Name: ${payload.name || ''}</div>
      <div style="font-size:13px;">Goal: ${payload.goal || ''}</div>
      <div style="font-size:13px;">Referral ID: ${payload.referral_code || ''}</div>
    </div>
    <p style="font-size:12px;color:#94a3b8;margin-top:12px;">Next Step: Live Webinar in 2-3 weeks. Watch your inbox for the sync signal.</p>
  </div>`;

const sendTelegram = async (payload: any) => {
  if (!telegramToken || !telegramChatId) return;
  const text = [
    `APEX Waitlist: ${payload.name || '—'}`,
    `Goal: ${payload.goal || '—'}`,
    `Email: ${payload.email || '—'}`,
    payload.phone ? `Phone: ${payload.phone}` : null,
    payload.linkedin ? `LinkedIn: ${payload.linkedin}` : null,
    payload.ai_score !== undefined ? `AI Score: ${payload.ai_score}` : null,
    payload.notes ? `Notes: ${payload.notes}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: telegramChatId, text }),
  });
};

const sendDiscord = async (payload: any) => {
  if (!discordWebhook) return;
  const content = [
    `**APEX Waitlist:** ${payload.name || ''}`,
    `Goal: ${payload.goal || '—'}`,
    `Email: ${payload.email || '—'}`,
    payload.phone ? `Phone: ${payload.phone}` : null,
    payload.linkedin ? `LinkedIn: ${payload.linkedin}` : null,
    payload.ai_score !== undefined ? `AI Score: ${payload.ai_score}` : null,
    payload.notes ? `Notes: ${payload.notes}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  await fetch(discordWebhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
};

export const sendWaitlistNotifications = async (payload: any) => {
  if (!payload) throw new Error('Missing payload');
  const tasks: Promise<any>[] = [];

  if (internalEmail) {
    tasks.push(
      resend.emails.send({
        from: fromEmail,
        to: internalEmail,
        subject: `APEX Waitlist: ${payload.name} / ${payload.goal || 'No goal'}`,
        html: buildInternalHtml(payload),
        text: `Name: ${payload.name}\nEmail: ${payload.email}\nGoal: ${payload.goal || ''}\nAI Score: ${payload.ai_score ?? ''}`,
      })
    );
  }

  if (payload.email) {
    tasks.push(
      resend.emails.send({
        from: fromEmail,
        to: payload.email,
        subject: 'APEX OS Waitlist — You are in',
        html: buildUserHtml(payload),
        text: `We received your details. Next: webinar invite (2–3 weeks) and Module 00 preview. Name: ${payload.name}. Goal: ${payload.goal || ''}.`,
      })
    );
  }

  tasks.push(sendTelegram(payload).catch((err) => console.warn('Telegram send failed', err)));
  tasks.push(sendDiscord(payload).catch((err) => console.warn('Discord send failed', err)));

  await Promise.all(tasks);
};
