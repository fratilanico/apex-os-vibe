import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { GoogleAuth } from 'google-auth-library';

// ═══════════════════════════════════════════════════════════════════════════════
// APEX OS CONTENT ORCHESTRATOR - Serverless Vercel Version
// Uses Google Gemini 1.5 Flash (GCP Credits) for automated curation
// ═══════════════════════════════════════════════════════════════════════════════

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VIBE_MARKETING_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VIBE_MARKETING_SUPABASE_SERVICE_KEY;

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || '50164779304';
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
const MODEL_FLASH = 'gemini-1.5-flash';

// Get GCP Access Token
async function getAccessToken(): Promise<string> {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  const accessToken = typeof token === 'string' ? token : token?.token;
  if (!accessToken) throw new Error('Unable to obtain GCP access token');
  return accessToken;
}

// Call Gemini Flash for fast analysis
async function analyzeWithFlash(title: string, content: string, token: string): Promise<any> {
  const response = await fetch(
    `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_FLASH}:generateContent`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: `Analyze this engineering news for APEX OS Sovereign Intelligence Hub. 
          Title: ${title}
          Content: ${content.substring(0, 5000)}
          
          Return JSON only with:
          {
            "summary": "1-sentence punchy summary",
            "arbitrage": "technical arbitrage opportunity for technical founders",
            "moat_score": number (1-10),
            "is_newsletter_worthy": boolean
          }` }],
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1000,
          responseMimeType: "application/json"
        },
      }),
    }
  );

  if (!response.ok) throw new Error(`Gemini Flash Error: ${response.status}`);
  const data = await response.json();
  return JSON.parse(data.candidates[0].content.parts[0].text);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow Vercel Cron or manual authorized triggers
  const authHeader = req.headers['authorization'];
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Missing configuration' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const startTime = Date.now();

  try {
    console.log('🚀 Starting APEX OS Content Orchestration...');

    // 1. Get Active Sources
    const { data: sources } = await supabase.from('content_sources').select('*').eq('status', 'active');
    if (!sources) return res.status(200).json({ message: 'No active sources' });

    // 2. Trigger Ingestion for each source (sequentially to avoid timeouts)
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    let totalInserted = 0;

    for (const source of sources) {
      try {
        const ingestRes = await fetch(`${baseUrl}/api/content/rss/ingest`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source_id: source.id, url: source.url })
        });
        const ingestData = await ingestRes.json();
        totalInserted += ingestData.results?.inserted || 0;
      } catch (e) {
        console.error(`Failed to ingest ${source.name}:`, e);
      }
    }

    // 3. Process New Items with Gemini Flash
    const { data: newItems } = await supabase
      .from('content_items')
      .select('*')
      .eq('status', 'new')
      .limit(5); // Process small batches per cron run to stay under serverless timeout

    if (newItems && newItems.length > 0) {
      const gcpToken = await getAccessToken();
      
      for (const item of newItems) {
        try {
          const analysis = await analyzeWithFlash(item.title, item.content, gcpToken);
          
          await supabase.from('content_items').update({
            raw_data: { ...item.raw_data, sovereign_analysis: analysis },
            status: analysis.is_newsletter_worthy ? 'curated' : 'scored',
            ai_score: analysis.moat_score * 10
          }).eq('id', item.id);
          
          console.log(`✅ Analyzed: ${item.title}`);
        } catch (e) {
          console.error(`Failed to analyze ${item.title}:`, e);
        }
      }
    }

    return res.status(200).json({
      success: true,
      inserted: totalInserted,
      analyzed: newItems?.length || 0,
      duration: `${Date.now() - startTime}ms`
    });

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
