// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT SCORING MODULE - Agent 1 Implementation
// Integrates with Vertex AI for AI-powered content scoring
// ═══════════════════════════════════════════════════════════════════════════════

import { GoogleAuth } from 'google-auth-library';

const VERTEX_SCOPES = ['https://www.googleapis.com/auth/cloud-platform'];

interface ContentItem {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  source_category?: string;
}

interface ContentScore {
  relevance_score: number;
  quality_score: number;
  uniqueness_score: number;
  overall_score: number;
  tags: string[];
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  key_insights: string[];
  target_audience: string[];
  content_type: string;
}

interface ScoringResult {
  success: boolean;
  score?: ContentScore;
  error?: string;
  provider: string;
  latency_ms: number;
}

// System prompt for content scoring
const SCORING_SYSTEM_PROMPT = `You are an expert content analyst and curator for APEX OS.
Your task is to analyze content and provide detailed scoring and metadata.

SCORING CRITERIA (0-100 for each):
1. RELEVANCE: How relevant is this content to tech entrepreneurs, developers, and digital marketers?
   - 90-100: Highly relevant, actionable insights for our audience
   - 70-89: Good relevance with some useful information
   - 50-69: Moderate relevance, tangential value
   - 0-49: Low relevance, not useful for target audience

2. QUALITY: Overall content quality (depth, accuracy, writing, research)
   - 90-100: Exceptional quality, well-researched, expertly written
   - 70-89: Good quality, solid information
   - 50-69: Average quality, acceptable
   - 0-49: Poor quality, superficial or inaccurate

3. UNIQUENESS: How unique/original is this content?
   - 90-100: Highly original, new insights, unique perspective
   - 70-89: Some original elements, good synthesis
   - 50-69: Common knowledge, standard information
   - 0-49: Repetitive, widely available elsewhere

OUTPUT FORMAT (JSON):
{
  "relevance_score": number,
  "quality_score": number,
  "uniqueness_score": number,
  "tags": ["tag1", "tag2", "tag3"],
  "summary": "2-3 sentence summary",
  "sentiment": "positive|neutral|negative",
  "key_insights": ["insight1", "insight2"],
  "target_audience": ["audience1", "audience2"],
  "content_type": "tutorial|news|opinion|case-study|guide|review|other"
}

Be objective and consistent. Return ONLY valid JSON.`;

async function getVertexAccessToken(): Promise<string> {
  const auth = new GoogleAuth({ scopes: VERTEX_SCOPES });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  const accessToken = typeof token === 'string' ? token : token?.token;
  if (!accessToken) {
    throw new Error('Unable to obtain Google Cloud access token');
  }
  return accessToken;
}

// Score content using Vertex AI
async function scoreWithVertexAI(content: ContentItem): Promise<ScoringResult> {
  const startTime = Date.now();
  
  try {
    const projectId =
      process.env.VERTEX_PROJECT_ID ||
      process.env.GOOGLE_CLOUD_PROJECT ||
      process.env.GCP_PROJECT_ID;
    const location =
      process.env.VERTEX_LOCATION ||
      process.env.GOOGLE_CLOUD_LOCATION ||
      'us-central1';
    const model = process.env.VERTEX_MODEL || 'gemini-2.5-pro';

    if (!projectId) {
      throw new Error('VERTEX_PROJECT_ID not configured');
    }

    const accessToken = await getVertexAccessToken();

    // Prepare content for analysis
    const contentText = `
TITLE: ${content.title}
CATEGORY: ${content.source_category || 'general'}
AUTHOR: ${content.author || 'Unknown'}

CONTENT:
${content.content?.substring(0, 8000) || content.excerpt || ''}
    `.trim();

    const response = await fetch(
      `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: SCORING_SYSTEM_PROMPT }] },
            { role: 'model', parts: [{ text: 'I understand. I will analyze content and return JSON scoring data.' }] },
            { role: 'user', parts: [{ text: contentText }] }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000,
            topP: 0.9,
            topK: 40,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Vertex AI error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from AI response');
    }

    const scoreData = JSON.parse(jsonMatch[0]);

    // Validate and normalize scores
    const score: ContentScore = {
      relevance_score: Math.min(100, Math.max(0, Math.round(scoreData.relevance_score || 50))),
      quality_score: Math.min(100, Math.max(0, Math.round(scoreData.quality_score || 50))),
      uniqueness_score: Math.min(100, Math.max(0, Math.round(scoreData.uniqueness_score || 50))),
      overall_score: 0,
      tags: Array.isArray(scoreData.tags) ? scoreData.tags.slice(0, 10) : [],
      summary: scoreData.summary?.substring(0, 500) || '',
      sentiment: ['positive', 'neutral', 'negative'].includes(scoreData.sentiment) 
        ? scoreData.sentiment 
        : 'neutral',
      key_insights: Array.isArray(scoreData.key_insights) ? scoreData.key_insights.slice(0, 5) : [],
      target_audience: Array.isArray(scoreData.target_audience) ? scoreData.target_audience.slice(0, 5) : [],
      content_type: scoreData.content_type || 'other'
    };

    // Calculate overall score
    score.overall_score = Math.round(
      (score.relevance_score + score.quality_score + score.uniqueness_score) / 3
    );

    return {
      success: true,
      score,
      provider: 'vertex-ai',
      latency_ms: Date.now() - startTime
    };

  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      provider: 'vertex-ai',
      latency_ms: Date.now() - startTime
    };
  }
}

// Score content using Gemini API (fallback)
async function scoreWithGemini(content: ContentItem): Promise<ScoringResult> {
  const startTime = Date.now();
  
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const contentText = `
TITLE: ${content.title}
CATEGORY: ${content.source_category || 'general'}
AUTHOR: ${content.author || 'Unknown'}

CONTENT:
${content.content?.substring(0, 8000) || content.excerpt || ''}
    `.trim();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: SCORING_SYSTEM_PROMPT }] },
            { role: 'model', parts: [{ text: 'I understand. I will analyze content and return JSON scoring data.' }] },
            { role: 'user', parts: [{ text: contentText }] }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000,
            topP: 0.9,
            topK: 40,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from AI response');
    }

    const scoreData = JSON.parse(jsonMatch[0]);

    const score: ContentScore = {
      relevance_score: Math.min(100, Math.max(0, Math.round(scoreData.relevance_score || 50))),
      quality_score: Math.min(100, Math.max(0, Math.round(scoreData.quality_score || 50))),
      uniqueness_score: Math.min(100, Math.max(0, Math.round(scoreData.uniqueness_score || 50))),
      overall_score: 0,
      tags: Array.isArray(scoreData.tags) ? scoreData.tags.slice(0, 10) : [],
      summary: scoreData.summary?.substring(0, 500) || '',
      sentiment: ['positive', 'neutral', 'negative'].includes(scoreData.sentiment) 
        ? scoreData.sentiment 
        : 'neutral',
      key_insights: Array.isArray(scoreData.key_insights) ? scoreData.key_insights.slice(0, 5) : [],
      target_audience: Array.isArray(scoreData.target_audience) ? scoreData.target_audience.slice(0, 5) : [],
      content_type: scoreData.content_type || 'other'
    };

    score.overall_score = Math.round(
      (score.relevance_score + score.quality_score + score.uniqueness_score) / 3
    );

    return {
      success: true,
      score,
      provider: 'gemini',
      latency_ms: Date.now() - startTime
    };

  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      provider: 'gemini',
      latency_ms: Date.now() - startTime
    };
  }
}

// Fallback scoring when AI is unavailable
function fallbackScoring(content: ContentItem): ScoringResult {
  // Simple heuristic scoring based on content length and keywords
  const text = `${content.title} ${content.content || ''}`.toLowerCase();
  
  const techKeywords = ['ai', 'machine learning', 'startup', 'entrepreneur', 'developer', 'code', 'software', 'tech'];
  const marketingKeywords = ['marketing', 'growth', 'conversion', 'sales', 'customer', 'strategy'];
  
  const techMatches = techKeywords.filter(k => text.includes(k)).length;
  const marketingMatches = marketingKeywords.filter(k => text.includes(k)).length;
  
  const relevanceScore = Math.min(100, 40 + (techMatches + marketingMatches) * 10);
  const qualityScore = Math.min(100, 50 + (content.content?.length || 0) / 100);
  const uniquenessScore = 50; // Neutral without AI analysis
  
  const score: ContentScore = {
    relevance_score: relevanceScore,
    quality_score: qualityScore,
    uniqueness_score: uniquenessScore,
    overall_score: Math.round((relevanceScore + qualityScore + uniquenessScore) / 3),
    tags: [],
    summary: content.excerpt?.substring(0, 200) || content.title,
    sentiment: 'neutral',
    key_insights: [],
    target_audience: ['general'],
    content_type: 'other'
  };

  return {
    success: true,
    score,
    provider: 'fallback-heuristic',
    latency_ms: 0
  };
}

// Main scoring function with fallback chain
export async function scoreContent(content: ContentItem): Promise<ScoringResult> {
  console.log(`[Content Scoring] Starting scoring for: ${content.title?.substring(0, 50)}...`);

  // Try Vertex AI first
  const hasVertex = !!(
    process.env.VERTEX_PROJECT_ID || 
    process.env.GOOGLE_CLOUD_PROJECT || 
    process.env.GCP_PROJECT_ID
  );

  if (hasVertex && process.env.USE_VERTEX_AI !== 'false') {
    const vertexResult = await scoreWithVertexAI(content);
    if (vertexResult.success) {
      console.log(`[Content Scoring] Vertex AI scored: ${vertexResult.score?.overall_score}/100`);
      return vertexResult;
    }
    console.log(`[Content Scoring] Vertex AI failed: ${vertexResult.error}`);
  }

  // Fallback to Gemini API
  if (process.env.GEMINI_API_KEY) {
    const geminiResult = await scoreWithGemini(content);
    if (geminiResult.success) {
      console.log(`[Content Scoring] Gemini scored: ${geminiResult.score?.overall_score}/100`);
      return geminiResult;
    }
    console.log(`[Content Scoring] Gemini failed: ${geminiResult.error}`);
  }

  // Final fallback
  console.log(`[Content Scoring] Using fallback heuristic scoring`);
  return fallbackScoring(content);
}

// Determine priority based on overall score
export function getPriorityFromScore(overallScore: number): number {
  if (overallScore > 85) return 3; // High priority
  if (overallScore >= 60) return 2; // Medium priority
  return 1; // Low priority
}

// Check if content should trigger webhook notification
export function shouldNotifyHighPriority(overallScore: number): boolean {
  return overallScore > 85;
}

export type { ContentItem, ContentScore, ScoringResult };
