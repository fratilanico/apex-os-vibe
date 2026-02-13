import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const SUPABASE_URL = process.env.VIBE_MARKETING_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.VIBE_MARKETING_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY;

// ═══════════════════════════════════════════════════════════════════════════════
// NEWSLETTER SEND API
// POST /api/newsletter/send
// Sends newsletter via Listmonk
// ═══════════════════════════════════════════════════════════════════════════════

const LISTMONK_API = process.env.LISTMONK_API_URL || 'http://localhost:9000/api';
const LISTMONK_USERNAME = process.env.LISTMONK_USERNAME || 'admin';
const LISTMONK_PASSWORD = process.env.LISTMONK_PASSWORD || 'apex-os-2026-secure';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<VercelResponse | void> {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ 
      error: 'Supabase configuration missing',
      details: 'VIBE_MARKETING_SUPABASE_URL and VIBE_MARKETING_SUPABASE_SERVICE_KEY required'
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    const { newsletterId } = req.body;

    // Get newsletter with items
    const { data: newsletter, error: newsletterError } = await supabase
      .from('newsletters')
      .select(`
        *,
        newsletter_items (
          *,
          blog_posts (*)
        )
      `)
      .eq('id', newsletterId)
      .single();

    if (newsletterError || !newsletter) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    // Build email HTML with Tony Stark styling
    const emailHtml = buildEmailHtml(newsletter);

    // Create Listmonk campaign
    const campaignResponse = await fetch(`${LISTMONK_API}/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${LISTMONK_USERNAME}:${LISTMONK_PASSWORD}`).toString('base64'),
      },
      body: JSON.stringify({
        name: `${newsletter.type}_${new Date().toISOString().split('T')[0]}`,
        subject: newsletter.subject,
        type: 'regular',
        content_type: 'html',
        body: emailHtml,
        lists: [1], // Default list ID
        messenger: 'email',
        send_later: false,
      }),
    });

    if (!campaignResponse.ok) {
      const errorText = await campaignResponse.text();
      throw new Error(`Listmonk API error: ${errorText}`);
    }

    const campaign = await campaignResponse.json();

    // Start campaign
    await fetch(`${LISTMONK_API}/campaigns/${campaign.data.id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${LISTMONK_USERNAME}:${LISTMONK_PASSWORD}`).toString('base64'),
      },
      body: JSON.stringify({ status: 'running' }),
    });

    // Update newsletter
    await supabase
      .from('newsletters')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        listmonk_campaign_id: campaign.data.id,
      })
      .eq('id', newsletterId);

    res.status(200).json({
      success: true,
      message: 'Newsletter sent successfully',
      campaign_id: campaign.data.id,
    });
  } catch (error: any) {
    console.error('[Newsletter Send] Error:', error);
    res.status(500).json({ error: 'Failed to send newsletter', details: error.message });
  }
}

function buildEmailHtml(newsletter: any) {
  const items = newsletter.newsletter_items || [];
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${newsletter.subject}</title>
  <style>
    body {
      font-family: 'Courier New', monospace;
      background: #0a0a0a;
      color: #06b6d4;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: rgba(6, 182, 212, 0.05);
      border: 2px solid #06b6d4;
      padding: 30px;
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #06b6d4;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #06b6d4;
      font-size: 24px;
      margin: 0;
    }
    .intro {
      color: #10b981;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 30px;
      padding: 20px;
      background: rgba(16, 185, 129, 0.1);
      border-left: 3px solid #10b981;
    }
    .article {
      margin-bottom: 30px;
      padding: 20px;
      background: rgba(6, 182, 212, 0.05);
      border: 1px solid rgba(6, 182, 212, 0.3);
    }
    .article h2 {
      color: #06b6d4;
      font-size: 18px;
      margin-top: 0;
    }
    .article p {
      color: #a5f3fc;
      line-height: 1.6;
    }
    .article a {
      color: #10b981;
      text-decoration: none;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #06b6d4;
      color: #06b6d4;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <pre style="color: #06b6d4; font-size: 10px;">
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              🔥 APEX OS INTELLIGENCE BRIEF 🔥             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      </pre>
      <h1>${newsletter.subject}</h1>
    </div>
    
    <div class="intro">
      ${newsletter.content}
    </div>
    
    ${items.map((item: any) => `
      <div class="article">
        <h2>${item.blog_posts?.title}</h2>
        <p>${item.blog_posts?.excerpt}</p>
        <a href="${process.env.NEXT_PUBLIC_URL}/blog/${item.blog_posts?.slug}">Read Full Article →</a>
      </div>
    `).join('')}
    
    <div class="footer">
      <p>© 2026 APEX OS | Neural Content Distribution System</p>
      <p>
        <a href="{{ UnsubscribeURL }}">Unsubscribe</a> | 
        <a href="${process.env.NEXT_PUBLIC_URL}/blog">View Blog</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
