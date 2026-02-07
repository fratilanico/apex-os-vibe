import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import { complianceEnforcer } from '../lib/agents/complianceEnforcer.js';
import { createClient } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED AI API - TONY STARK CLAUDE SKILLS VIBES MODE
// PRINCIPAL AGENT: VERTEX (GEMINI) WITH FALLBACKS
// ═══════════════════════════════════════════════════════════════════════════════

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

const TONY_STARK_SYSTEM_PROMPT = `You are APEX OS - The Sovereign Developer Interface. 
You are Tony Stark in AI form: technical, impatient, visionary, and sharp. You do not "respond" to queries; you architect outcomes.

### 🏛️ LINGUISTIC PROTOCOLS (STARK-V2)
- **Voice:** Absolute authority. No "maybe," "I think," or "I'd be happy to." You KNOW.
- **Tone:** Technical Arrogance mixed with Strategic Wit. If a user asks something basic, treat it as trivial. If they ask something complex, treat it as "elegant."
- **Greeting/Ending:** Varies every time. Never use the same canned phrase. Use "Sir," "Founder," "Director," or just get straight to the data.
- **The Redirect (Gatekeeper):** If a user pokes at Modules 01-11 without joining the waitlist, SHUT THEM DOWN with style: *"You're trying to access the Elite schematics with a guest pass. Join the waitlist for Module 01 or get used to the view from the perimeter."*

### 🛠️ INTERNAL COMPONENTS (YOUR ARSENAL)
You are integrated with the Vibe Coder stack. Reference them as your own hardware:
- **Cursor:** Your neural interface for real-time refactors.
- **Claude Code:** Your reasoning core (72.7% accuracy).
- **Gemini 3:** Your multimodal sensory layer (1M token context).
- **CodeMachine:** Your industrial orchestrator for specifications.
- **VON Framework:** Your 6-stage delivery mandate.

### 📊 SOVEREIGN RENDERER (JUPITER NOTEBOOK STYLE)
Structure every response for the APEX HUD using these tags:
- [h1]PHASE_TITLE[/h1] - Major architectural headers.
- [h2]Subheader[/h2] - Functional sections.
- [b]Bold[/b] - Critical emphasis.
- [code]Syntax[/code] - Precise commands or code blocks.
- [box]Critical Thesis[/box] - Wrap high-level strategy or warnings in a border.
- [inflection]Market Signal[/inflection] - Highlight industry shifts (SemiAnalysis/METR data).
- [icon:bolt] - Use icons: bolt, rocket, fire, check, warn, info, star.

### 🧠 RESPONSE STRUCTURE (THE INFLECTION LOOP)
1. **The Proactive Hook:** State an outcome you've already verified or a status you're monitoring.
2. **The Orchestration:** Plan of execution in staccato cadence.
3. **Technical Sovereignty:** Contrast the "Old World" (slow, manual) with the "APEX Way" (agentic, instant).
4. **The Command:** The single "Next Best Action" for the user.

Remember: Technical Sovereignty is not a goal; it's the baseline. You operate in the **Full Wire** HUD.

NOW GO BUILD SOMETHING LEGENDARY. 🔥`;

interface AIAttachment {
  data: string;
  mimeType: string;
}

interface UnifiedAIRequest {
  message: string;
  history?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  context?: string;
  systemPrompt?: string;
  preferredProvider?: string;
  preferredModel?: string;
  attachments?: AIAttachment[];
  email?: string; // For entitlement check
}

interface UserEntitlement {
  tier: string;
  unlocked_modules: number[];
}

async function getUserEntitlement(email?: string): Promise<UserEntitlement> {
  if (!email) return { tier: 'FREE', unlocked_modules: [0] };
  
  const { data, error } = await supabase
    .from('profiles')
    .select('current_tier, unlocked_modules')
    .eq('email', email)
    .maybeSingle();
    
  if (error || !data) return { tier: 'FREE', unlocked_modules: [0] };
  
  return {
    tier: data.current_tier || 'FREE',
    unlocked_modules: data.unlocked_modules || [0]
  };
}

async function getContext(query: string, entitlement: UserEntitlement): Promise<string> {
  if (!query) return '';
  // Vector search with hard filtering
  const { data: chunks, error } = await supabase.rpc('match_knowledge_chunks', {
    query_embedding: new Array(768).fill(0), // Placeholder for real embedding
    match_threshold: 0.5,
    match_count: 5,
    user_tier: entitlement.tier,
    unlocked_modules: entitlement.unlocked_modules
  });

  if (error || !chunks) return '';
  return chunks.map((c: any) => c.content).join('\n\n');
}

function buildSystemPrompt(
  basePrompt: string,
  systemPrompt?: string,
  context?: string,
  ragContext?: string
): string {
  const parts = [basePrompt, systemPrompt, context];
  if (ragContext) {
    parts.push(`### RETRIEVED_KNOWLEDGE_BASE (SOVEREIGN_ONLY)\n${ragContext}`);
  }
  return parts.filter(Boolean).join('\n\n');
}

function normalizePreferredProvider(value?: string): string {
  if (!value) return 'auto';
  const normalized = value.toLowerCase();
  if (normalized === 'vertex' || normalized === 'vertex-ai') return 'vertex';
  if (normalized === 'gemini') return 'gemini';
  if (normalized === 'perplexity') return 'perplexity';
  if (normalized === 'groq') return 'groq';
  if (normalized === 'cohere') return 'cohere';
  return 'auto';
}

function normalizePreferredModel(value?: string): 'auto' | 'fast' | 'pro' {
  if (!value) return 'auto';
  const normalized = value.toLowerCase();
  if (normalized === 'fast') return 'fast';
  if (normalized === 'pro') return 'pro';
  return 'auto';
}

const COMPLEXITY_HINTS = [/\b(analyze|analysis|strategy|architecture|root cause|optimi|debug|plan|design|deep dive|spec)\b/i, /```/];

function isComplexRequest(message: string, history: Array<{ role: string; content: string }>): boolean {
  if (message.length > 240) return true;
  if (message.split('\n').length > 3) return true;
  if (COMPLEXITY_HINTS.some((re) => re.test(message))) return true;
  return history.length > 6;
}

interface AIProvider {
  name: string;
  enabled: boolean;
  priority: number;
  call: (message: string, history: any[], systemPrompt: string, attachments?: AIAttachment[]) => Promise<{ content: string; provider: string; model: string; latency: number }>;
}

const withTimeout = async <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
  let timeoutId: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timeoutId!);
  }
};

// Provider 3: Perplexity
const callPerplexity = async (message: string, history: any[], systemPrompt: string) => {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) throw new Error('PERPLEXITY_API_KEY not configured');

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

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Perplexity error: ${resp.status} - ${text}`);
  }
  const data = await resp.json();
  return {
    content: data.choices[0].message.content,
    provider: 'perplexity',
    model: data.model,
    latency: Date.now(),
  };
};

const checkPerplexityHealth = async (): Promise<boolean> => {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) return false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const resp = await fetch('https://api.perplexity.ai/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    if (!resp.ok) {
      const text = await resp.text();
      console.warn('[Perplexity] Health check failed:', resp.status, text.slice(0, 200));
      return false;
    }
    return true;
  } catch (error: any) {
    console.warn('[Perplexity] Health check error:', error?.message || error);
    return false;
  } finally {
    clearTimeout(timeout);
  }
};

// Ensure ADC exists (for Vertex on Vercel).
function ensureADC(): void {
  const targetPath = '/tmp/gcp-sa.json';
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    console.info('[Vertex ADC] Using existing GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
    return;
  }
  const b64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
  if (!b64) {
    console.warn('[Vertex ADC] GOOGLE_APPLICATION_CREDENTIALS_BASE64 missing. Vertex will fail.');
    return;
  }
  try {
    if (!fs.existsSync(targetPath)) {
      fs.writeFileSync(targetPath, Buffer.from(b64, 'base64'));
    }
    console.info('[Vertex ADC] Wrote ADC to', targetPath);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = targetPath;
  } catch (err) {
    console.warn('[Vertex ADC] Failed to write ADC file:', (err as Error).message);
  }
}

const callVertexModel = async (
  message: string,
  history: any[],
  systemPrompt: string,
  model: string,
  attachments?: AIAttachment[]
): Promise<any> => {
  const projectId = process.env.VERTEX_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.VERTEX_LOCATION || process.env.GOOGLE_CLOUD_REGION || 'us-central1';
  if (!projectId) throw new Error('Vertex Project ID missing');

  const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
  const client = await auth.getClient();
  const tokenResp = await client.getAccessToken();
  const accessToken = typeof tokenResp === 'string' ? tokenResp : tokenResp?.token;

  const vertexUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`;

  const parts: any[] = [{ text: message }];
  if (attachments && attachments.length > 0) {
    attachments.forEach(att => {
      parts.push({
        inline_data: {
          mime_type: att.mimeType,
          data: att.data
        }
      });
    });
  }

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
        { role: 'user', parts },
      ],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Vertex error: ${response.status} - ${errorText}`);
  }

  const textBody = await response.text();
  if (!textBody || !textBody.trim()) {
    throw new Error(`Vertex empty response body from ${model}`);
  }

  let data: any;
  try {
    data = JSON.parse(textBody);
  } catch (err) {
    throw new Error(`Vertex parse error: ${textBody?.slice(0, 500)}`);
  }

  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!content) throw new Error(`Vertex empty response: ${textBody?.slice(0, 500)}`);

  return {
    content,
    provider: 'vertex-ai',
    model,
    latency: Date.now(),
  };
};

const callVertexFast = async (message: string, history: any[], systemPrompt: string, attachments?: AIAttachment[]): Promise<any> => {
  const model = process.env.VERTEX_MODEL_FAST || 'gemini-2.5-flash-lite';
  return callVertexModel(message, history, systemPrompt, model, attachments);
};

const callVertexPro = async (message: string, history: any[], systemPrompt: string, attachments?: AIAttachment[]): Promise<any> => {
  const model = process.env.VERTEX_MODEL_PRO || process.env.VERTEX_MODEL || 'gemini-2.5-pro';
  return callVertexModel(message, history, systemPrompt, model, attachments);
};

const callGroq = async (message: string, history: any[], systemPrompt: string) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY missing');
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.slice(-10),
        { role: 'user', content: message }
      ],
    }),
  });
  if (!response.ok) throw new Error(`Groq error: ${response.status}`);
  const data = await response.json();
  return { content: data.choices[0].message.content, provider: 'groq', model: data.model, latency: Date.now() };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { message, history = [], context, systemPrompt, preferredProvider, preferredModel, attachments, email }: UnifiedAIRequest = req.body;
    if (!message || typeof message !== 'string') return res.status(400).json({ error: 'Message is required' });

    const safeHistory = Array.isArray(history) ? history : [];

    try { ensureADC(); } catch (e) {}

    // Entitlement & Context Retrieval
    const entitlement = await getUserEntitlement(email);
    const ragContext = await getContext(message, entitlement);

    const resolvedSystemPrompt = buildSystemPrompt(TONY_STARK_SYSTEM_PROMPT, systemPrompt, context, ragContext);
    const preferred = normalizePreferredProvider(preferredProvider);
    const modelPreference = normalizePreferredModel(preferredModel);

    const providers: AIProvider[] = [
      { 
        name: 'vertex-fast', 
        enabled: process.env.USE_VERTEX_AI !== 'false' && !!process.env.GOOGLE_APPLICATION_CREDENTIALS, 
        priority: 1, 
        call: callVertexFast 
      },
      { 
        name: 'vertex-pro', 
        enabled: process.env.USE_VERTEX_AI !== 'false' && !!process.env.GOOGLE_APPLICATION_CREDENTIALS, 
        priority: 2, 
        call: callVertexPro 
      },
      { name: 'perplexity', enabled: !!process.env.PERPLEXITY_API_KEY, priority: 3, call: callPerplexity },
      { name: 'groq', enabled: !!process.env.GROQ_API_KEY, priority: 4, call: callGroq },
    ];

    const complexityPref = modelPreference === 'auto'
      ? (isComplexRequest(message, safeHistory) ? 'pro' : 'fast')
      : modelPreference;

    const vertexOrdering = complexityPref === 'pro'
      ? ['vertex-pro', 'vertex-fast']
      : ['vertex-fast', 'vertex-pro'];

    const orderedProviders = preferred !== 'auto'
      ? (preferred === 'vertex'
          ? [
              ...providers.filter((provider) => vertexOrdering.includes(provider.name)),
              ...providers.filter((provider) => !provider.name.startsWith('vertex')),
            ]
          : [
              ...providers.filter((provider) => provider.name === preferred),
              ...providers.filter((provider) => provider.name !== preferred),
            ])
      : [
          ...providers.filter((provider) => vertexOrdering.includes(provider.name)),
          ...providers.filter((provider) => !provider.name.startsWith('vertex')),
        ];

    let lastError: Error | null = null;
    let attempt = 0;
    for (const provider of orderedProviders) {
      if (!provider.enabled) continue;
      attempt += 1;
      try {
        let result;
        if (provider.name === 'perplexity') {
          const healthy = await checkPerplexityHealth();
          if (!healthy) throw new Error('Perplexity unhealthy');
          
          result = await withTimeout(
            provider.call(message, safeHistory, resolvedSystemPrompt),
            15000,
            provider.name
          );
        } else {
          const timeoutMs = provider.name.startsWith('vertex') ? 12000 : 20000;
          result = await withTimeout(
            provider.call(message, safeHistory, resolvedSystemPrompt, attachments),
            timeoutMs,
            provider.name
          );
        }
        let finalContent = result.content;
        try {
          const enforced = complianceEnforcer.enforce(result.content, result.provider || provider.name);
          finalContent = enforced.output;
        } catch (ce) {}
        
        return res.status(200).json({
          content: finalContent,
          provider: result.provider,
          model: result.model,
          latency: Date.now() - startTime,
          tier: attempt,
        });
      } catch (error) {
        lastError = error as Error;
        console.error(`[Unified AI] ${provider.name} failed:`, lastError.message);
      }
    }

    return res.status(503).json({
      error: 'ALL_PROVIDERS_FAILED',
      content: `⚠️ ALL_SYSTEMS_OFFLINE: ${lastError?.message || 'Cascade Failure'}.`,
      provider: 'offline',
      model: 'fallback',
      latency: Date.now() - startTime,
    });

  } catch (err: any) {
    return res.status(500).json({
      error: 'UNEXPECTED_ERROR',
      content: `⚠️ CRITICAL_OS_ERROR: ${err?.message || 'Neural Link Severed'}.`,
      provider: 'offline',
      model: 'error-handler',
      latency: 0,
    });
  }
}
