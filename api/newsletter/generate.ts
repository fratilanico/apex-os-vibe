import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const SUPABASE_URL = process.env.VIBE_MARKETING_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.VIBE_MARKETING_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY;

// ═══════════════════════════════════════════════════════════════════════════════
// NEWSLETTER GENERATION API
// POST /api/newsletter/generate
// Generates daily digest or weekly curated newsletter
// ═══════════════════════════════════════════════════════════════════════════════

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
    const { type = 'daily' } = req.body;
    
    let posts;
    let subject;
    
    if (type === 'daily') {
      // Get posts from last 24 hours
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .gte('published_at', yesterday.toISOString())
        .order('published_at', { ascending: false })
        .limit(5);
      
      posts = data || [];
      subject = `Daily Intel Brief | ${new Date().toLocaleDateString()}`;
    } else {
      // Get posts from last 7 days
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .gte('published_at', lastWeek.toISOString())
        .order('published_at', { ascending: false })
        .limit(10);
      
      posts = data || [];
      const startDate = lastWeek.toLocaleDateString();
      const endDate = new Date().toLocaleDateString();
      subject = `Weekly Strategic Brief | ${startDate} - ${endDate}`;
    }

    if (posts.length === 0) {
      return res.status(400).json({ error: 'No posts available for newsletter' });
    }

    // Generate AI summary for newsletter intro
    const introSummary = await generateNewsletterSummary(posts, type);

    // Create newsletter
    const { data: newsletter, error } = await supabase
      .from('newsletters')
      .insert({
        type,
        subject,
        content: introSummary,
        status: 'draft',
      })
      .select()
      .single();

    if (error) throw error;

    // Add newsletter items
    const items = posts.map((post: any, index: number) => ({
      newsletter_id: newsletter.id,
      blog_post_id: post.id,
      order_index: index,
      section: type === 'daily' ? 'top_stories' : 'featured',
    }));

    await supabase.from('newsletter_items').insert(items);

    return res.status(200).json({
      success: true,
      newsletter,
      items: posts,
      message: `${type === 'daily' ? 'Daily digest' : 'Weekly newsletter'} generated successfully`,
    });
  } catch (error: any) {
    console.error('[Newsletter Generate] Error:', error);
    return res.status(500).json({ error: 'Failed to generate newsletter', details: error.message });
  }
}

async function generateNewsletterSummary(posts: any[], type: string) {
  const postTitles = posts.map(p => p.title).join(', ');
  
  const prompt = type === 'daily' 
    ? `Create a brief 2-3 sentence intro for a daily tech newsletter featuring these stories: ${postTitles}. Tone: professional but energetic.`
    : `Create a compelling 3-4 sentence intro for a weekly strategic brief covering: ${postTitles}. Include market insights and trends. Tone: authoritative and visionary.`;

  try {
    // Use Vertex AI for summary
    const response = await fetch(`https://${process.env.VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${process.env.VERTEX_PROJECT_ID}/locations/${process.env.VERTEX_LOCATION}/publishers/google/models/gemini-1.5-pro:generateContent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VERTEX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }]
      })
    });

    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || 'Your curated tech intelligence briefing.';
  } catch (error) {
    console.error('[Newsletter Generate] AI summary failed:', error);
    return 'Your curated tech intelligence briefing.';
  }
}
