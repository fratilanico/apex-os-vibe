import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleAuth } from 'google-auth-library';

// ═══════════════════════════════════════════════════════════════════════════════
// VERTEX AI UNIFIED ENDPOINT - Uses GCP Credits (fratilanicu@gmail.com)
// Priority: Vertex AI (Gemini) → Perplexity → Groq → Cohere → Offline
// ═══════════════════════════════════════════════════════════════════════════════

interface AIProvider {
  name: string;
  enabled: boolean;
  call: (message: string, history: any[]) => Promise<{ content: string; provider: string; model: string; latency: number }>;
}

// Provider 1: Vertex AI (Primary - Uses GCP Credits)
const callVertexAI = async (message: string, history: any[]): Promise<any> => {
  const projectId =
    process.env.VERTEX_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCP_PROJECT_ID;
  const location =
    process.env.VERTEX_LOCATION ||
    process.env.GOOGLE_CLOUD_LOCATION ||
    process.env.GOOGLE_CLOUD_REGION ||
    'us-central1';
  const model = process.env.VERTEX_MODEL || 'gemini-2.5-pro';

  if (!projectId) {
    throw new Error('VERTEX_PROJECT_ID or GOOGLE_CLOUD_PROJECT is not configured');
  }

  const accessToken = await getAccessToken();

  const formattedHistory = Array.isArray(history)
    ? history.map((h: any) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content ?? '' }],
      }))
    : [];

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
          ...formattedHistory,
          {
            role: 'user',
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Vertex AI error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return {
    content: data.candidates[0].content.parts[0].text,
    provider: 'vertex-ai',
    model: model,
    latency: Date.now(),
  };
};

// Get access token using gcloud ADC
async function getAccessToken(): Promise<string> {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  const accessToken = typeof token === 'string' ? token : token?.token;
  if (!accessToken) {
    throw new Error('Unable to obtain Google Cloud access token');
  }
  return accessToken;
}

// Provider 2: Perplexity (Fallback 1)
const callPerplexity = async (message: string, history: any[]): Promise<any> => {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) throw new Error('PERPLEXITY_API_KEY not configured');

  const callModel = async (model: string) => {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant.' },
          ...history,
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content ?? '',
      provider: 'perplexity',
      model: data.model || model,
      latency: Date.now(),
    };
  };

  try {
    return await callModel('sonar-reasoning-pro');
  } catch (err: any) {
    if (String(err?.message || '').includes('Invalid model')) {
      console.warn('[Perplexity] sonar-reasoning-pro rejected, retrying sonar-reasoning');
      return await callModel('sonar-reasoning');
    }
    throw err;
  }
};

// Provider 3: Groq (Fallback 2)
const callGroq = async (message: string, history: any[]): Promise<any> => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not configured');

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        ...history,
        { role: 'user', content: message }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    provider: 'groq',
    model: data.model,
    latency: Date.now(),
  };
};

// Provider 4: Cohere (Fallback 3)
const callCohere = async (message: string, history: any[]): Promise<any> => {
  const apiKey = process.env.COHERE_API_KEY;
  if (!apiKey) throw new Error('COHERE_API_KEY not configured');

  const response = await fetch('https://api.cohere.ai/v1/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'command-r',
      message: message,
      chat_history: history.map(h => ({
        role: h.role,
        message: h.content
      })),
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cohere API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return {
    content: data.text,
    provider: 'cohere',
    model: 'command-r',
    latency: Date.now(),
  };
};

// Offline fallback
const offlineResponse = (message: string): any => {
  return {
    content: `I'm currently offline. Your message: "${message.substring(0, 50)}..." has been queued and will be processed when connectivity is restored.`,
    provider: 'offline',
    model: 'fallback',
    latency: 0,
  };
};

// Main handler with fallback chain
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history = [] } = req.body;
  
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const providers: AIProvider[] = [
    {
      name: 'vertex-ai',
      enabled:
        process.env.USE_VERTEX_AI !== 'false' &&
        !!(process.env.VERTEX_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID),
      call: callVertexAI,
    },
    { name: 'perplexity', enabled: !!process.env.PERPLEXITY_API_KEY, call: callPerplexity },
    { name: 'groq', enabled: !!process.env.GROQ_API_KEY, call: callGroq },
    { name: 'cohere', enabled: !!process.env.COHERE_API_KEY, call: callCohere },
  ];

  const startTime = Date.now();
  let lastError: Error | null = null;

  // Try each provider in order
  for (const provider of providers) {
    if (!provider.enabled) {
      console.log(`[Vertex AI Unified] ${provider.name} skipped - not configured`);
      continue;
    }

    try {
      console.log(`[Vertex AI Unified] Trying ${provider.name}...`);
      const result = await provider.call(message, history);
      const latency = Date.now() - startTime;
      
      console.log(`[Vertex AI Unified] Success with ${provider.name} in ${latency}ms`);
      
      return res.status(200).json({
        content: result.content,
        provider: result.provider,
        model: result.model,
        latency,
        tier: providers.findIndex(p => p.name === provider.name) + 1,
      });
    } catch (error) {
      lastError = error as Error;
      console.error(`[Vertex AI Unified] ${provider.name} failed:`, (error as Error).message);
      // Continue to next provider
    }
  }

  // All providers failed - return offline response
  console.log('[Vertex AI Unified] All providers failed, returning offline response');
  const offline = offlineResponse(message);
  
  return res.status(200).json({
    content: offline.content,
    provider: 'offline',
    model: 'fallback',
    latency: Date.now() - startTime,
    tier: 5,
    error: lastError?.message,
  });
}
