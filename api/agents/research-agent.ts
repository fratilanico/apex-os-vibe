import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data: sources, error } = await supabase
      .from('content_sources')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;

    const results = [];
    for (const source of sources || []) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/content/rss/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId: source.id }),
      });
      
      const result = await response.json();
      results.push({ source: source.name, ...result });
    }

    res.status(200).json({
      success: true,
      message: `Processed ${results.length} sources`,
      results,
    });
  } catch (error) {
    console.error('Research agent error:', error);
    res.status(500).json({ error: 'Research agent failed' });
  }
}