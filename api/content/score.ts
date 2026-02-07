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
    const { contentId } = req.body;

    const { data: content, error: contentError } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', contentId)
      .single();

    if (contentError || !content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Use Vertex AI for scoring
    const response = await fetch(`https://${process.env.VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${process.env.VERTEX_PROJECT_ID}/locations/${process.env.VERTEX_LOCATION}/publishers/google/models/gemini-1.5-pro:generateContent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VERTEX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{
            text: `Analyze this content and provide scores (0-100) for relevance to tech/startups, quality, and uniqueness. Also provide 3-5 tags, a 2-sentence summary, and sentiment. Return JSON: {"relevance_score": number, "quality_score": number, "uniqueness_score": number, "tags": [], "summary": "", "sentiment": ""}\n\nTitle: ${content.title}\nContent: ${content.content?.substring(0, 3000)}`
          }]
        }]
      })
    });

    const aiResult = await response.json();
    const aiText = aiResult.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not parse AI response');
    
    const scores = JSON.parse(jsonMatch[0]);
    const overallScore = Math.round((scores.relevance_score + scores.quality_score + scores.uniqueness_score) / 3);

    let priority = 1;
    if (overallScore > 85) priority = 3;
    else if (overallScore >= 60) priority = 2;

    const { data: scoreData, error: scoreError } = await supabase
      .from('content_scores')
      .insert({
        content_id: contentId,
        relevance_score: scores.relevance_score,
        quality_score: scores.quality_score,
        uniqueness_score: scores.uniqueness_score,
        overall_score: overallScore,
        tags: scores.tags,
        summary: scores.summary,
        sentiment: scores.sentiment,
      })
      .select()
      .single();

    if (scoreError) throw scoreError;

    await supabase
      .from('content_curation_queue')
      .insert({
        content_id: contentId,
        score_id: scoreData.id,
        status: 'pending',
        priority: priority,
      });

    if (priority === 3) {
      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/webhooks/high-priority-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, score: overallScore, title: content.title }),
      });
    }

    res.status(200).json({ success: true, scores: scoreData, overall_score: overallScore, priority });
  } catch (error) {
    console.error('Content scoring error:', error);
    res.status(500).json({ error: 'Failed to score content' });
  }
}