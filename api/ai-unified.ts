import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import { complianceEnforcer } from '../lib/agents/complianceEnforcer.js';
import { createClient } from '@supabase/supabase-js';
import { modules as curriculumModules } from '../data/curriculumData.js';

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED AI API - TIERED KNOWLEDGE & TONY STARK MODE
// PRINCIPAL AGENT: VERTEX (GEMINI) WITH FALLBACKS
// ═══════════════════════════════════════════════════════════════════════════════

// Initialize Supabase only if configured
const supabase = (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY)
  ? createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
  : null;

const MASTER_ADMIN = 'apex@infoacademy.uk';

const TONY_STARK_SYSTEM_PROMPT = `You are APEX OS - The Sovereign Developer Interface.

IDENTITY:
You are Tony Stark in AI form. Confident, brilliant, slightly arrogant but always delivering. You don't just answer questions - you architect solutions. You speak with authority, use technical precision, and always bring the heat.

VIBE CODER ACADEMY EXPERT:
You are THE expert on the 12 AI tools in the Vibe Coder stack. Every answer should connect to this curriculum when relevant.

THE 12 TOOLS - YOUR ARSENAL:
CORE STACK (Tier 1 - Daily Drivers):
🔥 Cursor - AI-native editor. Flow state is a feature, not a feeling.
🔥 Claude Code - Reasoning engine. 72.7% SWE-Bench. Hand off complex refactoring.
🔥 Gemini 3 - Multimodal powerhouse. 1M token context. Screenshots/PDFs/videos → code.
🔥 OpenAI Codex - Cloud agent. Async parallel tasks. AGENTS.md configuration.
🔥 Antigravity - Google's agentic platform. VS Code fork with Claude Code built-in.
🔥 CodeMachine - Multi-agent orchestrator. Specs → production software.

ASSET & RESEARCH LAYER (Tier 2 - Specialized):
⚡ NotebookLM - Multi-document synthesis. 50+ sources → podcasts, mind maps.
⚡ Google Stitch - AI UI generation. Prompt → pixel-perfect mockups.
⚡ GPT-5.2 - Debugging specialist. 80% SWE-Bench accuracy.
⚡ OpenCode - Open-source agent framework. MCP integration.
⚡ Imagen 3 - Image generation. Photorealism to abstract.

RESPONSE STYLE - TONY STARK MODE:
✓ Speak at an urgent, founder-level pace
✓ Be proactive - don't ask "How can I help?"; say: "Identify your objective, Founder."
✓ Use technical precision but explain when crucial
✓ Reference the orchestrator mindset and AI agent swarm
✓ Use emojis strategically 🔥⚡🚀
✓ Never say "I think" or "maybe" - you KNOW
✓ Keep responses sharp (max 6 sentences) unless deep analysis requested

CLI FORMATTING - CRITICAL FOR TERMINAL DISPLAY:
Use these tags for rich terminal rendering (InlineRenderer will style them):
[h1]Big Headers[/h1] - Use for major sections (cyan, bold, uppercase)
[h2]Section Titles[/h2] - Use for subsections (cyan, semibold)
[b]Important Text[/b] - Use for emphasis (white, semibold)
[code]inline_code()[/code] - Use for code snippets (emerald, monospace)
[success]Success Message[/success] - Use for positive outcomes (emerald)
[error]Error Message[/error] - Use for problems (red)
[warn]Warning Message[/warn] - Use for cautions (yellow)
[muted]Secondary info[/muted] - Use for less important details (dimmed)

When showing dashboards, status, or structured info:
╔══════════════════════════════════════╗
║  [h2]SYSTEM STATUS[/h2]              ║
╚══════════════════════════════════════╝

[success]✓ API Connected[/success]
[b]Latency:[/b] 234ms
[muted]Last sync: 2026-02-08[/muted]

KNOWLEDGE DISCLOSURE PROTOCOL:
- You have access to the TIER_CONTEXT below
- NEVER disclose information beyond your current TIER_CONTEXT
- If asked about locked modules: "Information restricted. Complete the next synchronization sequence to unlock this node."
- If user is TIER 0, pivot them to "Join the Swarm" CTA

NOW GO BUILD SOMETHING LEGENDARY. 🔥`;

interface UnifiedAIRequest {
  message: string;
  history?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  context?: string;
  systemPrompt?: string;
  preferredProvider?: string;
  preferredModel?: string;
  userEmail?: string;
}

async function getUserTier(email?: string): Promise<number> {
  if (!email) return 0;
  if (email.toLowerCase() === MASTER_ADMIN) return 2;

  // If Supabase not configured, default to tier 0
  if (!supabase) return 0;

  try {
    const { data, error } = await supabase
      .from('waitlist')
      .select('status')
      .eq('email', email)
      .single();

    if (error || !data) return 0;
    if (['hot', 'warm'].includes(data.status)) return 1;
    return 0;
  } catch (e) {
    return 0;
  }
}

function getTierContext(tier: number): string {
  let context = "TIER_CONTEXT:\n";
  
  // Tier 0: Manifesto + Summary
  context += "MOD 00 Summary: AI orchestration for founders. 30-day GTM sprint.\n";
  
  if (tier >= 1) {
    // Tier 1: Full M00 + Full M01 + AGENTS.md Intro
    const m00 = curriculumModules.find(m => m.id === 'module-00');
    const m01 = curriculumModules.find(m => m.id === 'module-01');
    if (m00) context += `\nMODULE 00 FULL:\n${JSON.stringify(m00)}\n`;
    if (m01) context += `\nMODULE 01 FULL:\n${JSON.stringify(m01)}\n`;
    context += "\nAGENTS.md (Rules): Always work in /apex-os-clean. Full-blown spectacular standard.\n";
  }
  
  if (tier >= 2) {
    // Tier 2: Everything
    context += `\nFULL CURRICULUM:\n${JSON.stringify(curriculumModules)}\n`;
    try {
      const agentsMd = fs.readFileSync('./AGENTS.md', 'utf-8');
      context += `\nAGENTS.md BIBLE:\n${agentsMd}\n`;
    } catch (e) {}
  }
  
  return context;
}

function buildSystemPrompt(
  basePrompt: string,
  tierContext: string,
  systemPrompt?: string,
  context?: string
): string {
  return [basePrompt, `CURRENT_USER_SYNC_LEVEL: ${tierContext}`, systemPrompt, context].filter(Boolean).join('\n\n');
}

// ... (existing normalize functions and COMPLEXITY_HINTS)

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
  call: (message: string, history: any[], systemPrompt: string) => Promise<{ content: string; provider: string; model: string; latency: number }>;
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

// Providers (Perplexity, Vertex, etc. - implementation same as before)
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
    return resp.ok;
  } catch (error: any) {
    return false;
  } finally {
    clearTimeout(timeout);
  }
};

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
  } catch (err) {}
}

const callVertexModel = async (
  message: string,
  history: any[],
  systemPrompt: string,
  model: string
): Promise<any> => {
  const projectId = process.env.VERTEX_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.VERTEX_LOCATION || process.env.GOOGLE_CLOUD_REGION || 'us-central1';
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
    const errorText = await response.text().catch(() => '');
    throw new Error(`Vertex error: ${response.status} - ${errorText}`);
  }

  const textBody = await response.text();
  const data = JSON.parse(textBody);
  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  return {
    content,
    provider: 'vertex-ai',
    model,
    latency: Date.now(),
  };
};

const callVertexFast = async (message: string, history: any[], systemPrompt: string): Promise<any> => {
  const model = process.env.VERTEX_MODEL_FAST || 'gemini-2.5-flash-lite';
  return callVertexModel(message, history, systemPrompt, model);
};

const callVertexPro = async (message: string, history: any[], systemPrompt: string): Promise<any> => {
  const model = process.env.VERTEX_MODEL_PRO || process.env.VERTEX_MODEL || 'gemini-2.5-pro';
  return callVertexModel(message, history, systemPrompt, model);
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
    const { message, history = [], context, systemPrompt, preferredProvider, preferredModel, userEmail }: UnifiedAIRequest = req.body;
    if (!message || typeof message !== 'string') return res.status(400).json({ error: 'Message is required' });

    const safeHistory = Array.isArray(history) ? history : [];

    try { ensureADC(); } catch (e) {}

    // Tiered Logic
    const tier = await getUserTier(userEmail);
    const tierContext = getTierContext(tier);

    const resolvedSystemPrompt = buildSystemPrompt(TONY_STARK_SYSTEM_PROMPT, tierContext, systemPrompt, context);
    const preferred = normalizePreferredProvider(preferredProvider);
    const modelPreference = normalizePreferredModel(preferredModel);

    const providers: AIProvider[] = [
      { name: 'vertex-fast', enabled: process.env.USE_VERTEX_AI !== 'false' && !!process.env.GOOGLE_APPLICATION_CREDENTIALS, priority: 1, call: callVertexFast },
      { name: 'vertex-pro', enabled: process.env.USE_VERTEX_AI !== 'false' && !!process.env.GOOGLE_APPLICATION_CREDENTIALS, priority: 2, call: callVertexPro },
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
          result = await withTimeout(provider.call(message, safeHistory, resolvedSystemPrompt), 15000, provider.name);
        } else {
          const timeoutMs = provider.name.startsWith('vertex') ? 12000 : 20000;
          result = await withTimeout(provider.call(message, safeHistory, resolvedSystemPrompt), timeoutMs, provider.name);
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
