import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { complianceEnforcer } from '../lib/agents/complianceEnforcer.js';

// Import Intelligence v2.0 Core
import { QueryParser } from '../lib/intelligence/core/query-parser.js';
import { ContextManager } from '../lib/intelligence/core/context-manager.js';
import { ResponseFormatter } from '../lib/intelligence/core/response-formatter.js';
import { IntelligenceQuery } from '../lib/intelligence/types/index.js';

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED AI API v2.5 - TIERED KNOWLEDGE & INTELLIGENCE SWARM
// PRINCIPAL AGENTS: GEMINI 2.0 FLASH -> GEMINI 2.0 PRO -> PERPLEXITY -> DEEPSEEK
// ═══════════════════════════════════════════════════════════════════════════════

// Initialize Core Components
const queryParser = new QueryParser();
const contextManager = new ContextManager();
const responseFormatter = new ResponseFormatter();

// Initialize Supabase only if configured
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Ensures Google Application Credentials are set up from Base64 env var
 */
function ensureADC(): void {
  const targetPath = '/tmp/gcp-sa.json';
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    return;
  }
  const b64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
  if (!b64) return;
  try {
    if (!fs.existsSync(targetPath)) {
      fs.writeFileSync(targetPath, Buffer.from(b64, 'base64'));
    }
    process.env.GOOGLE_APPLICATION_CREDENTIALS = targetPath;
  } catch (err) {
    console.error('[GCP] Failed to write SA key:', err);
  }
}

/**
 * Call Google Vertex AI (Gemini 2.0 Flash/Pro)
 */
async function callVertexAI(message: string, history: any[], systemPrompt: string, model: string) {
  ensureADC();
  const projectId = process.env.VERTEX_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.VERTEX_LOCATION || 'us-central1';
  
  if (!projectId) throw new Error('Vertex Project ID missing');

  const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
  const client = await auth.getClient();
  const tokenResp = await client.getAccessToken();
  const accessToken = typeof tokenResp === 'string' ? tokenResp : tokenResp?.token;

  const vertexUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`;

  const response = await fetch(vertexUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        ...history.map((h: any) => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content ?? '' }],
        })),
        { role: 'user', parts: [{ text: message }] },
      ],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Vertex error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    content: data?.candidates?.[0]?.content?.parts?.[0]?.text || '',
    provider: 'vertex-ai',
    model,
  };
}

/**
 * Call Perplexity AI
 */
async function callPerplexity(message: string, history: any[], systemPrompt: string) {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) throw new Error('PERPLEXITY_API_KEY missing');

  const resp = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar-reasoning-pro',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.slice(-10),
        { role: 'user', content: message }
      ],
    }),
  });

  if (!resp.ok) throw new Error(`Perplexity error: ${resp.status}`);
  const data = await resp.json();
  return {
    content: data.choices[0].message.content,
    provider: 'perplexity',
    model: data.model,
    citations: data.citations
  };
}

/**
 * Call DeepSeek AI
 */
async function callDeepSeek(message: string, history: any[], systemPrompt: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY missing');

  const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-coder',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.slice(-10),
        { role: 'user', content: message }
      ],
      temperature: 0.2
    }),
  });

  if (!resp.ok) throw new Error(`DeepSeek error: ${resp.status}`);
  const data = await resp.json();
  return {
    content: data.choices[0].message.content,
    provider: 'deepseek',
    model: data.model,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();
  
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const { 
      message, 
      userId = 'anonymous',
      preferredProvider = 'auto'
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 1. Initialize Intelligence Query
    const query: IntelligenceQuery = {
      id: `q_${Date.now()}`,
      userId,
      text: message,
      timestamp: Date.now(),
    };

    // 2. Parse Intent & Build Context
    const [intent, context] = await Promise.all([
      queryParser.parse(query),
      contextManager.buildQueryContext(userId, message)
    ]);

    // 3. Select Provider Chain (Requested Order)
    // strategy: Gemini 2.0 Flash -> Gemini 2.0 Pro -> Perplexity -> DeepSeek
    let providers = [
      { name: 'vertex-flash', call: (m: any, h: any, s: any) => callVertexAI(m, h, s, 'gemini-2.0-flash'), enabled: !!(process.env.VERTEX_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT) },
      { name: 'vertex-pro', call: (m: any, h: any, s: any) => callVertexAI(m, h, s, 'gemini-2.0-pro-exp-02-05'), enabled: !!(process.env.VERTEX_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT) },
      { name: 'perplexity', call: callPerplexity, enabled: !!process.env.PERPLEXITY_API_KEY },
      { name: 'deepseek', call: callDeepSeek, enabled: !!process.env.DEEPSEEK_API_KEY }
    ];

    // Build system prompt based on persona - REFINED for business journey
    // Focus on "Vibe Coding" and leverage multipliers, avoid generic ROI/LTV/CAC
    const personaPrompt = context.persona === 'founder' || context.persona === 'investor' || context.persona === 'enterprise'
      ? `You are APEX OS, an elite strategic advisor. Persona: ${context.persona.toUpperCase()}.
Focus on architectural scalability, market-making strategies, agentic workflows, and high-velocity shipping. 
Avoid generic pitch-deck jargon. Talk about "Vibe Coding" as a leverage multiplier for sovereign founders.
Reference the "Greuceanu Protocol" as the heroic journey of bringing AI light to technical darkness.
Speak with Stark Confidence: knowledgeable, direct, authoritative. Never generic.`
      : `You are APEX OS, an elite technical mentor. Persona: ${context.persona.toUpperCase()}.
Focus on implementation details, technical excellence, code quality, and hands-on builder patterns.
Encourage "Aha!" moments through direct building and elite tool mastery.
Speak with Stark Confidence: knowledgeable, direct, authoritative. Never generic.`;

    const finalSystemPrompt = `${personaPrompt}\n${context.systemContext || ''}`;

    // Reorder based on intent: Research -> Perplexity first
    if (intent.type === 'research') {
      providers = [
        { name: 'perplexity', call: callPerplexity, enabled: !!process.env.PERPLEXITY_API_KEY },
        { name: 'vertex-flash', call: (m: any, h: any, s: any) => callVertexAI(m, h, s, 'gemini-2.0-flash'), enabled: !!(process.env.VERTEX_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT) },
        { name: 'vertex-pro', call: (m: any, h: any, s: any) => callVertexAI(m, h, s, 'gemini-2.0-pro-exp-02-05'), enabled: !!(process.env.VERTEX_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT) },
        { name: 'deepseek', call: callDeepSeek, enabled: !!process.env.DEEPSEEK_API_KEY }
      ];
    } else if (preferredProvider !== 'auto') {
      providers = providers.filter(p => p.name === preferredProvider).concat(providers.filter(p => p.name !== preferredProvider));
    }

    // 4. Execute with Fallbacks
    let lastError: Error | null = null;
    let result: any = null;

    for (const provider of providers) {
      if (!provider.enabled) continue;
      try {
        result = await provider.call(message, context.conversationHistory, finalSystemPrompt);
        break; // Success!
      } catch (err) {
        lastError = err as Error;
        console.warn(`[Unified AI] ${provider.name} failed:`, err);
      }
    }

    if (!result) throw lastError || new Error('All AI providers failed');

    // 5. Compliance & Formatting
    const enforced = complianceEnforcer.enforce(result.content, result.provider);
    const formattedResponse = await responseFormatter.formatResponse(
      {
        id: `resp_${Date.now()}`,
        queryId: query.id,
        text: enforced.output,
        provider: result.provider,
        model: result.model,
        timestamp: Date.now(),
        tokensUsed: 0,
        cost: 0,
        formattedForPersona: false,
        metadata: { intent: intent.type, processingTime: 0, fallbackUsed: false, cacheHit: false, sources: result.citations }
      },
      context.persona,
      context.userProfile,
      context.conversationHistory
    );

    // 6. Track interaction in Supabase if available
    if (supabase) {
      try {
        await supabase.from('jarvis_conversations').insert({
          user_id: userId,
          message: message,
          response: formattedResponse.text,
          provider: result.provider,
          intent: intent.type,
          persona: context.persona,
          latency_ms: Date.now() - startTime
        });
      } catch (trackErr) {
        console.error('[Analytics] Failed to track:', trackErr);
      }
    }

    // 7. Save to Context History
    await contextManager.addConversationMessage(userId, {
      role: 'user',
      content: message,
      timestamp: Date.now(),
    });

    await contextManager.addConversationMessage(userId, {
      role: 'assistant',
      content: formattedResponse.text,
      timestamp: Date.now(),
      provider: formattedResponse.provider as any,
    });

    // 8. Return Response
    return res.status(200).json({
      content: formattedResponse.text,
      provider: result.provider,
      model: result.model,
      latency: Date.now() - startTime,
      meta: {
        intent: intent.type,
        persona: context.persona,
        confidence: intent.confidence,
        sources: result.citations
      }
    });

  } catch (err: any) {
    console.error('[Unified AI v2.0] Error:', err);
    return res.status(500).json({
      error: 'INTELLIGENCE_LAYER_ERROR',
      content: `⚠️ NEURAL_LINK_SEVERED: ${err?.message || 'Unknown processing error'}.`,
      provider: 'offline',
      model: 'error-handler',
      latency: 0,
    });
  }
}
