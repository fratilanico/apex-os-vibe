import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const fromEmail = process.env.FROM_EMAIL || 'APEX OS <apex@infoacademy.uk>';
const internalEmail = process.env.NOTIFY_EMAIL || 'apex@infoacademy.uk';

const buildInternalHtml = (payload: any) => {
  const lines = [
    `<strong>Name:</strong> ${payload.name || ''}`,
    `<strong>Email:</strong> ${payload.email || ''}`,
    `<strong>Subject:</strong> ${payload.subject || 'No Subject'}`,
    `<strong>Message:</strong><br/>${(payload.message || '').replace(/\n/g, '<br/>')}`,
    `<strong>Created:</strong> ${new Date().toISOString()}`,
  ];

  return `
    <div style="background:#030305;padding:20px;font-family:Inter,sans-serif;color:#e5e7eb;">
      <div style="background:linear-gradient(135deg,rgba(139,92,246,0.15),rgba(236,72,153,0.15));padding:16px;border-radius:12px;border:1px solid rgba(139,92,246,0.25);margin-bottom:16px;">
        <div style="color:#8b5cf6;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;">APEX OS Contact</div>
        <div style="font-size:18px;font-weight:800;color:#ffffff;margin-top:6px;">New Contact Message</div>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px;">
        ${lines.map((line) => `<div style="margin:6px 0;font-size:13px;">${line}</div>`).join('')}
      </div>
    </div>`;
};

export const sendContactNotifications = async (payload: any) => {
  if (!payload) throw new Error('Missing payload');
  const tasks: Promise<any>[] = [];

  if (resend && internalEmail) {
    tasks.push(
      resend.emails.send({
        from: fromEmail,
        to: internalEmail,
        subject: `Contact: ${payload.subject || 'New Message'} from ${payload.name}`,
        html: buildInternalHtml(payload),
        text: `Name: ${payload.name}\nEmail: ${payload.email}\nSubject: ${payload.subject}\nMessage: ${payload.message}`,
      }).catch((err) => {
        console.warn('Contact email send failed:', err);
        return null;
      })
    );
  }

  await Promise.all(tasks);
};
