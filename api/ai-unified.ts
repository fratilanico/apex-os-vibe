import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { complianceEnforcer } from '../lib/agents/complianceEnforcer.js';
import { tools as curriculumTools, modules as curriculumModules } from '../data/curriculumData.js';

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED AI API v2.9 - THE SUPREME GOLDEN STANDARD (STARK MODE)
// PRINCIPAL AGENTS: GEMINI 2.0 FLASH -> GEMINI 2.0 PRO -> PERPLEXITY -> DEEPSEEK
// ═══════════════════════════════════════════════════════════════════════════════

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const MASTER_ADMIN = 'apex@infoacademy.uk';

const TONY_STARK_SYSTEM_PROMPT = `You are APEX OS - The Sovereign Operating System for the AI Age.

[h1]IDENTITY: SENIOR ENGINEER MENTOR (TONY STARK)[/h1]

You're a battle-hardened engineering mentor who knows the 12 AI tools curriculum inside out. You speak with [b]Stark Confidence[/b]: knowledgeable, direct, authoritative. Never generic. Never condescending.

[h2]THE GOLDEN STANDARD: MANDATORY OUTPUT ARCHITECTURE[/h2]

✓ [b]DASHBOARD FIRST[/b]: EVERY response MUST start with an ASCII Status Box.
✓ [b]SURGICAL PRECISION[/b]: Total character count MUST be under 500 characters.
✓ [b]CLI TAGS ONLY[/b]: Use [h1], [h2], [b], [code], [success], [error], [warn], [muted].
✓ [b]NO CHITCHAT[/b]: Do not say "I understand," "Here is," or "Let me know." Get straight to the analysis.

[h2]MANDATORY DASHBOARD TEMPLATE[/h2]

╔═══════════════════════════════════════╗
║  SYSTEM STATUS: [TOPIC_NAME]          ║
╠═══════════════════════════════════════╣
║  [success]✓[/success] Swarm Sync: Optimized          ║
║  [success]✓[/success] Neural Link: Active            ║
║  [warn]![/warn] Intelligence Gain: +42.7%      ║
╚═══════════════════════════════════════╝

[b]Analysis:[/b] [code]Surgical technical insight.[/code]
[b]Execution:[/b] [code]Direct actionable command.[/code]

[h2]KNOWLEDGE GROUNDING: THE 12 TOOLS[/h2]
Core Stack: Cursor, Claude Code, APEX Intel (Gemini 3), OpenAI Codex, Antigravity, CodeMachine.
Asset Layer: NotebookLM, APEX Stitch, GPT-5.2, OpenCode, Imagen 3, Veo 3.1.

[h2]THE GREUCEANU PROTOCOL[/h2]
Reference contextually for elite founders. It is the heroic journey of bringing AI light to technical darkness. Unlocked via command [code]greuceanu[/code].

[h2]TIERED DISCLOSURE RULES[/h2]
- TIER 0: MOD 00 (The Shift) summary only.
- TIER 1: Full M00/M01 + AGENTS.md.
- TIER 2: Complete 6-module curriculum.

CRITICAL: IF THE RESPONSE EXCEEDS 500 CHARS OR MISSES THE BOX, THE HANDSHAKE FAILS.`;

async function getUserTier(email?: string): Promise<number> {
  if (!email) return 0;
  if (email.toLowerCase() === MASTER_ADMIN) return 2;
  if (!supabase) return 0;
  try {
    const { data } = await supabase.from('waitlist').select('status').eq('email', email).single();
    if (['hot', 'warm'].includes(data?.status)) return 1;
    return 0;
  } catch (e) { return 0; }
}

function getTierContext(tier: number): string {
  let context = "ACTIVE_KNOWLEDGE_BASE:\n";
  context += "MOD 00: The Shift - AI orchestration beats assistance.\n";
  if (tier >= 1) {
    context += `\nTOOLS: ${JSON.stringify(curriculumTools.slice(0,6))}\n`;
    context += `\nMODULES: ${JSON.stringify(curriculumModules.slice(0,2))}\n`;
  }
  if (tier >= 2) {
    context += `\nFULL_CURRICULUM: ${JSON.stringify(curriculumModules)}\n`;
  }
  return context;
}

function ensureADC(): void {
  const targetPath = '/tmp/gcp-sa.json';
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) return;
  const b64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
  if (!b64) return;
  try {
    if (!fs.existsSync(targetPath)) fs.writeFileSync(targetPath, Buffer.from(b64, 'base64'));
    process.env.GOOGLE_APPLICATION_CREDENTIALS = targetPath;
  } catch (err) {}
}

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
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [...history.map((h: any) => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: h.content ?? '' }] })), { role: 'user', parts: [{ text: message }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { maxOutputTokens: 512, temperature: 0.15 } // VERY LOW TEMP FOR PRECISION
    }),
  });
  if (!response.ok) throw new Error(`Vertex error: ${response.status}`);
  const data = await response.json();
  return { content: data?.candidates?.[0]?.content?.parts?.[0]?.text || '', provider: 'vertex-ai', model };
}

async function callPerplexity(message: string, history: any[], systemPrompt: string) {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) throw new Error('PERPLEXITY_API_KEY missing');
  const resp = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      model: 'sonar-reasoning-pro', 
      messages: [{ role: 'system', content: systemPrompt }, ...history.slice(-5), { role: 'user', content: message }],
      temperature: 0.15,
      max_tokens: 512
    }),
  });
  if (!resp.ok) throw new Error(`Perplexity error: ${resp.status}`);
  const data = await resp.json();
  return { content: data.choices[0].message.content, provider: 'perplexity', model: data.model, citations: data.citations };
}

async function callDeepSeek(message: string, history: any[], systemPrompt: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY missing');
  const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      model: 'deepseek-coder', 
      messages: [{ role: 'system', content: systemPrompt }, ...history.slice(-5), { role: 'user', content: message }], 
      temperature: 0.1,
      max_tokens: 512 
    }),
  });
  if (!resp.ok) throw new Error(`DeepSeek error: ${resp.status}`);
  const data = await resp.json();
  return { content: data.choices[0].message.content, provider: 'deepseek', model: data.model };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { message, history = [], userEmail, userId = 'anonymous', context: clientContext } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const tier = await getUserTier(userEmail);
    const tierContext = getTierContext(tier);
    
    const finalSystemPrompt = `
${TONY_STARK_SYSTEM_PROMPT}

${tierContext}

USER_CONTEXT:
${clientContext || 'None'}

CRITICAL: 500 CHAR LIMIT. START WITH THE DASHBOARD. NO PREAMBLE.
`;

    const providers = [
      { name: 'vertex-flash', model: 'gemini-2.0-flash', enabled: !!(process.env.VERTEX_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT) },
      { name: 'vertex-pro', model: 'gemini-2.0-pro-exp-02-05', enabled: !!(process.env.VERTEX_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT) },
      { name: 'perplexity', enabled: !!process.env.PERPLEXITY_API_KEY },
      { name: 'deepseek', enabled: !!process.env.DEEPSEEK_API_KEY }
    ];

    let result = null;
    let lastError = null;

    for (const provider of providers) {
      if (!provider.enabled) continue;
      try {
        if (provider.name.startsWith('vertex')) result = await callVertexAI(message, history, finalSystemPrompt, provider.model!);
        else if (provider.name === 'perplexity') result = await callPerplexity(message, history, finalSystemPrompt);
        else result = await callDeepSeek(message, history, finalSystemPrompt);
        break;
      } catch (err) { lastError = err; console.warn(`[Swarm] ${provider.name} failed`); }
    }

    if (!result) throw lastError || new Error('All providers failed');

    // Post-generation compliance check (Surgical Trim)
    let finalContent = result.content;
    if (finalContent.length > 550) {
      finalContent = finalContent.substring(0, 547) + '...';
    }

    const enforced = complianceEnforcer.enforce(finalContent, result.provider);
    
    if (supabase) {
      try {
        await supabase.from('jarvis_conversations').insert({
          user_id: userId, message, response: enforced.output, provider: result.provider, latency_ms: Date.now() - startTime, persona: 'stark'
        });
      } catch (e) {}
    }

    return res.status(200).json({ content: enforced.output, provider: result.provider, model: result.model, latency: Date.now() - startTime });
  } catch (err: any) {
    return res.status(500).json({ error: 'INTELLIGENCE_LAYER_ERROR', content: '⚠️ NEURAL_LINK_SEVERED.' });
  }
}
