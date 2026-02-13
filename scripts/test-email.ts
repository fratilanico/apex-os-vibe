import { Resend } from 'resend';

// Load env vars from .env file if running locally
import * as dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = 'onboarding@resend.dev';
const toEmail = 'fratilanico@gmail.com';

async function sendTestEmail() {
  console.log('Sending test email...');
  console.log('API Key present:', !!process.env.RESEND_API_KEY);
  console.log('From:', fromEmail);
  console.log('To:', toEmail);

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'APEX OS Mission Handshake Test',
      html: `
        <div style="font-family: monospace; background: #000; color: #0f0; padding: 20px;">
          <h1>NEURAL LINK ESTABLISHED</h1>
          <p>This is a test of the APEX OS notification system.</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
          <p>Status: OPERATIONAL</p>
        </div>
      `,
    });

    console.log('Email sent successfully:', data);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

sendTestEmail();
