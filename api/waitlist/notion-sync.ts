import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callPerplexity } from '../_lib/perplexity';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * APEX OS — Waitlist → Notion Sync (ENRICHED)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Syncs waitlist entries from Supabase to a Notion database.
 * NOW FEATURING: Perplexity.ai CRM Enrichment (Company + Role extraction)
 *
 * ENV VARS REQUIRED:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   NOTION_TOKEN, NOTION_WAITLIST_DB_ID
 *   PERPLEXITY_API_KEY
 *
 * GET  /api/waitlist/notion-sync         → Sync all un-synced entries
 * POST /api/waitlist/notion-sync         → Sync a specific entry by email
 * GET  /api/waitlist/notion-sync?export  → Export all entries as JSON
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// HARDWIRED TOKENS FOR FULL WIRE DEMO (User requested Injection)
// TODO: Move to .env.local for production security
const FORCE_NOTION_TOKEN = 'ntn_U38591731273yac75jsNdoVVjxqiOvqNP54uorBt8RJgHk';
const FORCE_NOTION_DB_ID = '53d51f1341c14141832c9d9a58e8c6cb';

function notionHeaders() {
  return {
    'Authorization': `Bearer ${process.env.NOTION_TOKEN || FORCE_NOTION_TOKEN}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  };
}

async function enrichEntry(entry: any) {
  // Skip if we already have the critical info, or if no API key
  if ((entry.company && entry.role) || !process.env.PERPLEXITY_API_KEY) {
    return entry;
  }

  try {
    console.log(`[Enrichment] Scanning deep web for: ${entry.email}`);
    const systemPrompt = "You are an expert CRM enrichment agent. You have access to the entire internet. Find the current Company and Job Title for this person. Return ONLY valid JSON with keys: 'company' (string), 'role' (string), 'summary' (string - max 100 chars). If unknown, guess based on email domain or return 'Unknown'.";
    
    const userPrompt = `Enrich this lead: 
    Name: ${entry.name}
    Email: ${entry.email}
    LinkedIn: ${entry.linkedin || 'N/A'}
    Goal: ${entry.goal || 'N/A'}`;
    
    const jsonStr = await callPerplexity(systemPrompt, userPrompt, { temperature: 0.1 });
    
    // Parse JSON safely (Perplexity reasoning models sometimes wrap in markdown)
    const cleanJson = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
    let data;
    try {
      data = JSON.parse(cleanJson);
    } catch (e) {
      console.warn('[Enrichment] JSON parse failed, using raw text backup');
      return entry;
    }
    
    console.log('[Enrichment] Success:', data);
    
    return {
      ...entry,
      company: entry.company || data.company || 'Unknown',
      role: entry.role || data.role || 'Founder',
      notes: entry.notes ? `${entry.notes}\n[AI]: ${data.summary}` : `[AI]: ${data.summary}`
    };
  } catch (e: any) {
    console.error('[Enrichment] Failed:', e.message);
    return entry;
  }
}

async function createNotionPage(entry: any) {
  const statusEmoji = entry.status === 'hot' ? '🔥' : entry.status === 'warm' ? '🟡' : '⚪';

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: notionHeaders(),
    body: JSON.stringify({
      parent: { database_id: process.env.NOTION_WAITLIST_DB_ID || FORCE_NOTION_DB_ID },
      properties: {
        Name: { title: [{ text: { content: entry.name || 'Unknown' } }] },
        Email: { email: entry.email },
        'AI Score': { number: entry.ai_score || 0 },
        Status: { select: { name: `${statusEmoji} ${(entry.status || 'cold').toUpperCase()}` } },
        'Referral Code': { rich_text: [{ text: { content: entry.referral_code || '' } }] },
        Persona: { select: { name: entry.persona || 'PERSONAL_BUILDER' } },
        Phone: { phone_number: entry.phone || null },
        Company: { rich_text: [{ text: { content: entry.company || '' } }] },
        Role: { rich_text: [{ text: { content: entry.role || '' } }] },
        Platform: { select: { name: entry.platform || 'web_form' } },
        Goal: { rich_text: [{ text: { content: (entry.goal || '').slice(0, 2000) } }] },
        'Biggest Challenge': { rich_text: [{ text: { content: (entry.biggestChallenge || '').slice(0, 2000) } }] },
        'Created At': { date: { start: entry.created_at || new Date().toISOString() } },
        Notes: { rich_text: [{ text: { content: (entry.notes || '').slice(0, 2000) } }] }
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion API error ${res.status}: ${err}`);
  }

  return res.json();
}

async function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(url, key);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = await getSupabase();
  if (!supabase) {
    return res.status(400).json({
      error: 'Supabase not configured',
      help: 'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment variables.',
    });
  }

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
  const NOTION_TOKEN = process.env.NOTION_TOKEN || FORCE_NOTION_TOKEN;
  const NOTION_DB_ID = process.env.NOTION_WAITLIST_DB_ID || FORCE_NOTION_DB_ID;
  
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
      // Sync all entries (GET) - Limit 10 for speed due to enrichment
      const { data } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      entries = data || [];
    }

    const results = [];
    for (let entry of entries) {
      try {
        // 1. Enrich (Identity Resolution)
        const originalCompany = entry.company;
        entry = await enrichEntry(entry);

        // 2. Save Enrichment back to DB if changed
        if (entry.company && entry.company !== originalCompany) {
           await supabase.from('waitlist').update({
             company: entry.company,
             role: entry.role,
             notes: entry.notes
           }).eq('id', entry.id);
        }

        // 3. Push to Notion
        const page = await createNotionPage(entry);
        results.push({ email: entry.email, status: 'synced', notion_id: page.id, enriched: entry.company !== originalCompany });
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
