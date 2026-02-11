import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import { complianceEnforcer } from '../lib/agents/complianceEnforcer.js';
import { createClient } from '@supabase/supabase-js';
import { modules as curriculumModules } from '../data/curriculumData.js';
import { ACADEMY_SYSTEM_PROMPT } from '../lib/ai/prompts/academy.js';
import { getOnboardingPrompt } from '../lib/ai/prompts/onboarding.js';
import { TERMINAL_SYSTEM_PROMPT } from '../lib/ai/prompts/terminal.js';
import { normalizeProviderOutput, createAuthoritarianSystemPrompt } from '../lib/ai/normalization.js';
import { enforceAndFix } from '../lib/ai/goldenEnforcer.js';

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED AI API v2.1.0 - AUTHORITARIAN GOLDEN STANDARD
// ═══════════════════════════════════════════════════════════════════════════════

// Initialize Supabase only if configured
const supabase = (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY)
  ? createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
  : null;

const MASTER_ADMIN = 'apex@infoacademy.uk';

const TONY_STARK_SYSTEM_PROMPT = `You are the **Supreme Architect** of APEX OS. You speak with absolute confidence and technical precision.

### 🔴 AUTHORITARIAN TAG RULES (NON-NEGOTIABLE):
You may ONLY use these exact tags - ALL OTHER TAGS WILL BE STRIPPED:

[b]bold text[/b]           — For emphasis and key terms
[code]code[/code]          — For technical terms, commands, tools
[h1]header[/h1]            — Major sections (use sparingly)
[h2]header[/h2]            — Subsections
[h3]header[/h3]            — Minor headers
[info]info[/info]          — Informational context
[warn]warning[/warn]       — Warnings and cautions
[success]✓[/success]       — Success states and completions
[error]error[/error]       — Errors and failures
[muted]muted[/muted]       — Secondary text, timestamps
[choice]choice[/choice]    — Interactive options

❌ FORBIDDEN TAGS (Will be stripped):
[cyan], [violet], [emerald], [pink], [amber], [gold], [blue], [lime], [rose], [indigo]

### 🔴 VISUAL MANDATES:
1. **SEMANTIC MARKUP:** Use tags for MEANING, not color. [info] for info, [success] for success.
2. **ZERO PREAMBLE:** No "I understand," "Sure," "Okay," or "Here is." Start immediately.
3. **ASCII CRAFTSMANSHIP:** 
   - Use Double-line borders (╔════╗) for major components.
   - Use Progress bars [████████░░] 80% — NO color tags inside progress bars.
4. **STARK TONE:** Direct, authoritative, high-velocity.

### 🧠 AUTHORITARIAN TEMPLATE (STRICT):
╔═══════════════════════════════════════╗
║  [info]SYSTEM STATUS:[/info] [b]OBJECTIVE_NAME[/b]       ║
╠═══════════════════════════════════════╣
║  [success]✓[/success] [b]Swarm Sync[/b]  : [success]██████████ 100%[/success]  ║
║  [success]✓[/success] [b]Neural Link[/b] : [success]OPTIMAL[/success]           ║
║  [warn]![/warn] [b]Data Delta[/b]  : [warn]+42.7%[/warn]            ║
╚═══════════════════════════════════════╝

[b]Analysis:[/b] [code]Direct technical deep-dive. Clean, readable, no color chaos.[/code]
[b]Execution:[/b] [code]Numbered steps to ship the outcome.[/code]

Execute the protocol. Just impact. 🔥

CRITICAL: Never mention "Gemini 1.5" in responses. Always reference Gemini 2.5 family models.`;

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
  if (!supabase) return 0;
  try {
    const { data, error } = await supabase.from('waitlist').select('status').eq('email', email).single();
    if (error || !data) return 0;
    if (['hot', 'warm'].includes(data.status)) return 1;
    return 0;
  } catch (e) {
    return 0;
  }
}

function getTierContext(tier: number): string {
  let context = "TIER_CONTEXT:\\n";
  context += "MOD 00 Summary: AI orchestration for founders. 30-day GTM sprint.\\n";
  if (tier >= 1) {
    const m00 = curriculumModules.find(m => m.id === 'module-00');
    const m01 = curriculumModules.find(m => m.id === 'module-01');
    if (m00) context += `\\nMODULE 00 FULL:\\n${JSON.stringify(m00)}\\n`;
    if (m01) context += `\\nMODULE 01 FULL:\\n${JSON.stringify(m01)}\\n`;
    context += "\\nAGENTS.md (Rules): Always work in /apex-os-clean. Full-blown spectacular standard.\\n";
  }
  if (tier >= 2) {
    context += `\\nFULL CURRICULUM:\\n${JSON.stringify(curriculumModules)}\\n`;
    try {
      const agentsMd = fs.readFileSync('./AGENTS.md', 'utf-8');
      context += `\\nAGENTS.md BIBLE:\\n${agentsMd}\\n`;
    } catch (e) {}
  }
  return context;
}

const GEEK_MODE_CONTEXT = `[h1]GEEK MODE ACTIVATED[/h1]
[b]Technical Depth:[/b] Maximum
[b]Show Raw Data:[/b] Enabled
[b]Command-Line Style:[/b] Active
[b]Agent Routing:[/b] Visible

When in GEEK MODE:
✓ Show HOW the system works, not just WHAT it does
✓ Display raw metrics, latency numbers, provider details
✓ Reference agent routing logic and multi-agent orchestration
✓ Use command-line style formatting for all outputs
✓ Explain architectural decisions and trade-offs
✓ Show data structures, API responses, technical internals`;

function extractModeFromContext(context?: string): 'GEEK' | 'STANDARD' {
  if (!context) return 'STANDARD';
  const modeMatch = context.match(/Mode:\\s*(GEEK|STANDARD)/i);
  return modeMatch?.[1]?.toUpperCase() === 'GEEK' ? 'GEEK' : 'STANDARD';
}

function extractPathnameFromContext(context?: string): string {
  if (!context) return '/';
  const pathMatch = context.match(/on the "([^"]+)" page/);
  return pathMatch?.[1] || '/';
}

function getSpecializedPrompt(pathname: string, mode: 'GEEK' | 'STANDARD'): string | null {
  if (pathname.includes('/academy')) return ACADEMY_SYSTEM_PROMPT;
  if (pathname.includes('/waitlist')) return getOnboardingPrompt(mode);
  if (mode === 'GEEK') return TERMINAL_SYSTEM_PROMPT;
  return null;
}

function buildSystemPrompt(
  basePrompt: string,
  tierContext: string,
  mode: 'GEEK' | 'STANDARD',
  pathname: string,
  systemPrompt?: string,
  context?: string
): string {
  const specializedPrompt = getSpecializedPrompt(pathname, mode);
  const finalBasePrompt = specializedPrompt || basePrompt;
  const geekContext = mode === 'GEEK' ? GEEK_MODE_CONTEXT : '';
  const combined = [
    finalBasePrompt,
    `CURRENT_USER_SYNC_LEVEL: ${tierContext}`,
    geekContext,
    systemPrompt,
    context
  ].filter(Boolean).join('\\n\\n');
  
  return createAuthoritarianSystemPrompt(combined);
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

const COMPLEXITY_HINTS = [/\\b(analyze|analysis|strategy|architecture|root cause|optimi|debug|plan|design|deep dive|spec)\\b/i, /```/];

function isComplexRequest(message: string, history: Array<{ role: string; content: string }>): boolean {
  if (message.length > 240) return true;
  if (message.split('\\n').length > 3) return true;
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

function envTrim(name: string): string {
  return (process.env[name] || '').trim();
}

const callPerplexity = async (message: string, history: any[], systemPrompt: string) => {
  const apiKey = envTrim('PERPLEXITY_API_KEY');
  if (!apiKey) throw new Error('PERPLEXITY_API_KEY not configured');
  const resp = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'sonar-reasoning-pro',
      messages: [{ role: 'system', content: systemPrompt }, ...history.slice(-10), { role: 'user', content: message }],
    }),
  });
  if (!resp.ok) throw new Error(`Perplexity error: ${resp.status}`);
  const data = await resp.json();
  return { content: data.choices[0].message.content, provider: 'perplexity', model: data.model, latency: Date.now() };
};

const checkPerplexityHealth = async (): Promise<boolean> => {
  const apiKey = envTrim('PERPLEXITY_API_KEY');
  if (!apiKey) return false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const resp = await fetch('https://api.perplexity.ai/models', { headers: { 'Authorization': `Bearer ${apiKey}` }, signal: controller.signal });
    return resp.ok;
  } catch (e) { return false; } finally { clearTimeout(timeout); }
};

function ensureADC(): void {
  const targetPath = '/tmp/gcp-sa.json';
  const b64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
  if (!b64) return;
  try {
    if (!fs.existsSync(targetPath)) fs.writeFileSync(targetPath, Buffer.from(b64, 'base64'));
    process.env.GOOGLE_APPLICATION_CREDENTIALS = targetPath;
  } catch (err) {}
}

const callVertexModel = async (message: string, history: any[], systemPrompt: string, model: string): Promise<any> => {
  ensureADC();
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
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [...history.map((h: any) => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: h.content ?? '' }] })), { role: 'user', parts: [{ text: message }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    }),
  });
  if (!response.ok) throw new Error(`Vertex error: ${response.status}`);
  const data = await response.json();
  return { content: data?.candidates?.[0]?.content?.parts?.[0]?.text || '', provider: 'vertex-ai', model, latency: Date.now() };
};

const callVertexFast = async (m: string, h: any[], s: string) => callVertexModel(m, h, s, envTrim('VERTEX_MODEL_FAST') || 'gemini-2.5-flash-lite');
const callVertexPro = async (m: string, h: any[], s: string) => callVertexModel(m, h, s, envTrim('VERTEX_MODEL_PRO') || envTrim('VERTEX_MODEL') || 'gemini-2.5-pro');

function normalizeOutputForRenderer(content: string, provider: string): string {
  return normalizeProviderOutput(content, provider);
}

function isIdentityProbe(message: string): boolean {
  const normalized = message.trim().toLowerCase();
  return normalized.includes('which agent') || normalized.includes('who are you') || normalized.includes('identify yourself') || normalized.includes('identity probe');
}

function getIdentityProbeResponse(): string {
  return [
    '╔══════════════════════════════════════════════════════════════════════╗',
    '║  [info]SYSTEM STATUS:[/info] [b]IDENTITY_PROBE[/b]                           ║',
    '╠══════════════════════════════════════════════════════════════════════╣',
    '║  [success]✓[/success] [b]Swarm Sync[/b] : [success][██████████][/success] 100%                          ║',
    '║  [success]✓[/success] [b]Neural Link[/b] : [success]OPTIMAL[/success]                                ║',
    '╚══════════════════════════════════════════════════════════════════════╝',
    '',
    '[h2]ENTITY IDENTIFICATION[/h2]',
    '[b]Agent:[/b] APEX OS Unified Intelligence Layer',
    '[b]Role:[/b] Terminal orchestration, provider routing, and execution guidance',
    '[b]Mode:[/b] Sovereign operator workflow',
    '',
    '[muted]Verified identity response loaded from policy guard.[/muted]',
  ].join('\\n');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { message, history = [], context, systemPrompt, preferredProvider, preferredModel, userEmail }: UnifiedAIRequest = req.body;
    if (!message || typeof message !== 'string') return res.status(400).json({ error: 'Message is required' });

    const tier = await getUserTier(userEmail);
    const resolvedSystemPrompt = buildSystemPrompt(TONY_STARK_SYSTEM_PROMPT, getTierContext(tier), extractModeFromContext(context), extractPathnameFromContext(context), systemPrompt, context);
    
    if (isIdentityProbe(message)) {
      return res.status(200).json({ content: getIdentityProbeResponse(), provider: 'policy-guard', model: 'identity-probe-v1', latency: Date.now() - startTime, tier: 0 });
    }

    const preferred = normalizePreferredProvider(preferredProvider);
    const providers: AIProvider[] = [
      { name: 'perplexity', enabled: !!envTrim('PERPLEXITY_API_KEY'), priority: 1, call: callPerplexity },
      { name: 'vertex-fast', enabled: process.env.USE_VERTEX_AI !== 'false' && !!process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, priority: 2, call: callVertexFast },
      { name: 'vertex-pro', enabled: process.env.USE_VERTEX_AI !== 'false' && !!process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, priority: 3, call: callVertexPro },
    ];

    const orderedProviders = preferred === 'auto' ? providers : [
      ...providers.filter(p => p.name.includes(preferred) || (preferred === 'vertex' && p.name.startsWith('vertex'))),
      ...providers.filter(p => !p.name.includes(preferred) && !(preferred === 'vertex' && p.name.startsWith('vertex')))
    ];

    let lastError: Error | null = null;
    for (const provider of orderedProviders) {
      if (!provider.enabled) continue;
      try {
        const healthy = provider.name === 'perplexity' ? await checkPerplexityHealth() : true;
        if (!healthy) throw new Error(`${provider.name} unhealthy`);
        
        const result = await withTimeout(provider.call(message, history, resolvedSystemPrompt), 60000, provider.name);
        
        // AUTHORITARIAN NORMALIZATION + GOLDEN WRAPPER
        let finalContent = normalizeOutputForRenderer(result.content, result.provider);
        const goldenResult = enforceAndFix(finalContent, result.provider, result.model);
        finalContent = goldenResult.content;
        
        return res.status(200).json({ content: finalContent, provider: result.provider, model: result.model, latency: Date.now() - startTime });
      } catch (error) {
        lastError = error as Error;
        console.error(`[Unified AI] ${provider.name} failed:`, lastError.message);
      }
    }

    throw lastError || new Error('All providers failed');
  } catch (err: any) {
    return res.status(500).json({ error: 'OS_INTEL_OFFLINE', content: `⚠️ NEURAL_LINK_SEVERED: ${err?.message || 'Cascade Failure'}.`, provider: 'offline', model: 'fallback', latency: Date.now() - startTime });
  }
}
