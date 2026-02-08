import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * APEX OS — Waitlist → Notion Sync
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Syncs waitlist entries from Supabase to a Notion database.
 * Workaround while domain verification is pending for Resend.
 *
 * ENV VARS REQUIRED:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   NOTION_TOKEN, NOTION_WAITLIST_DB_ID
 *
 * GET  /api/waitlist/notion-sync         → Sync all un-synced entries
 * POST /api/waitlist/notion-sync         → Sync a specific entry by email
 * GET  /api/waitlist/notion-sync?export  → Export all entries as JSON
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const NOTION_TOKEN = process.env.NOTION_TOKEN || '';
const NOTION_DB_ID = process.env.NOTION_WAITLIST_DB_ID || '';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
);

function notionHeaders() {
  return {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  };
}

async function createNotionPage(entry: any) {
  const statusEmoji = entry.status === 'hot' ? '🔥' : entry.status === 'warm' ? '🟡' : '⚪';

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: notionHeaders(),
    body: JSON.stringify({
      parent: { database_id: NOTION_DB_ID },
      properties: {
        Name: { title: [{ text: { content: entry.name || 'Unknown' } }] },
        Email: { email: entry.email },
        'AI Score': { number: entry.ai_score || 0 },
        Status: { select: { name: `${statusEmoji} ${(entry.status || 'cold').toUpperCase()}` } },
        'Referral Code': { rich_text: [{ text: { content: entry.referral_code || '' } }] },
        Persona: { select: { name: entry.persona || 'PERSONAL_BUILDER' } },
        Phone: { phone_number: entry.phone || null },
        Company: { rich_text: [{ text: { content: entry.company || '' } }] },
        Platform: { select: { name: entry.platform || 'web_form' } },
        Goal: { rich_text: [{ text: { content: (entry.goal || '').slice(0, 2000) } }] },
        'Biggest Challenge': { rich_text: [{ text: { content: (entry.biggestChallenge || '').slice(0, 2000) } }] },
        'Created At': { date: { start: entry.created_at || new Date().toISOString() } },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion API error ${res.status}: ${err}`);
  }

  return res.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Export mode: just return all entries as JSON (no Notion needed)
  if (req.method === 'GET' && req.query.export !== undefined) {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Try legacy table
        const legacy = await supabase
          .from('waitlist_entries')
          .select('*')
          .order('created_at', { ascending: false });
        return res.status(200).json({ entries: legacy.data || [], count: legacy.data?.length || 0 });
      }

      return res.status(200).json({ entries: data || [], count: data?.length || 0 });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Sync mode: push entries to Notion
  if (!NOTION_TOKEN || !NOTION_DB_ID) {
    return res.status(400).json({
      error: 'Notion not configured',
      help: 'Set NOTION_TOKEN and NOTION_WAITLIST_DB_ID in your environment variables.',
    });
  }

  try {
    let entries: any[] = [];

    if (req.method === 'POST' && req.body?.email) {
      // Sync specific entry
      const { data } = await supabase
        .from('waitlist')
        .select('*')
        .eq('email', req.body.email)
        .single();
      if (data) entries = [data];
    } else {
      // Sync all entries (GET)
      const { data } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      entries = data || [];
    }

    const results = [];
    for (const entry of entries) {
      try {
        const page = await createNotionPage(entry);
        results.push({ email: entry.email, status: 'synced', notion_id: page.id });
      } catch (err: any) {
        results.push({ email: entry.email, status: 'error', error: err.message });
      }
    }

    return res.status(200).json({
      ok: true,
      synced: results.filter(r => r.status === 'synced').length,
      errors: results.filter(r => r.status === 'error').length,
      results,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
