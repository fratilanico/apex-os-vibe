/**
 * OllamaClient
 * Minimal Ollama HTTP client used by Jarvis ModelManagerV2.
 *
 * Notes:
 * - In unit tests, this module is mocked via Vitest.
 * - In runtime, this talks to a locally running Ollama daemon.
 */

export type OllamaGenerateRequest = {
  model: string;
  prompt: string;
  system?: string;
  context?: number[];
  options?: {
    temperature?: number;
    top_p?: number;
    num_predict?: number;
    [key: string]: unknown;
  };
};

export type OllamaGenerateResponse = {
  response: string;
  context?: number[];
  eval_count?: number;
  done?: boolean;
  [key: string]: unknown;
};

const DEFAULT_BASE_URL = 'http://127.0.0.1:11434';

function getBaseUrl(): string {
  const envUrl =
    (typeof process !== 'undefined' && process?.env?.OLLAMA_BASE_URL) ||
    (typeof process !== 'undefined' && process?.env?.OLLAMA_HOST);

  if (typeof envUrl === 'string' && envUrl.trim().length > 0) return envUrl.trim();
  return DEFAULT_BASE_URL;
}

async function ollamaJson<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${getBaseUrl()}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Ollama request failed (${res.status}) ${path}${text ? `: ${text}` : ''}`);
  }

  return (await res.json()) as T;
}

export async function isOllamaRunning(): Promise<boolean> {
  try {
    // /api/tags is stable across Ollama versions.
    await ollamaJson<{ models?: unknown[] }>('/api/tags', { method: 'GET' });
    return true;
  } catch {
    return false;
  }
}

export async function listOllamaModels(): Promise<string[]> {
  const data = await ollamaJson<{ models?: Array<{ name?: string }> }>('/api/tags', { method: 'GET' });
  return (data.models || [])
    .map((m) => m?.name)
    .filter((name): name is string => typeof name === 'string' && name.length > 0);
}

export async function isModelAvailable(modelName: string): Promise<boolean> {
  const models = await listOllamaModels();
  return models.includes(modelName);
}

export async function pullOllamaModel(
  modelName: string,
  onProgress?: (progress: number) => void,
): Promise<void> {
  const url = `${getBaseUrl()}/api/pull`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: modelName, stream: true }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Ollama pull failed (${res.status})${text ? `: ${text}` : ''}`);
  }

  // Ollama streams progress as NDJSON.
  const reader = res.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const evt = JSON.parse(trimmed) as { completed?: number; total?: number; status?: string };
        if (typeof evt.completed === 'number' && typeof evt.total === 'number' && evt.total > 0) {
          const p = Math.max(0, Math.min(1, evt.completed / evt.total));
          onProgress?.(p);
        }
      } catch {
        // ignore malformed progress lines
      }
    }
  }
}

export async function generateWithOllama(request: OllamaGenerateRequest): Promise<OllamaGenerateResponse> {
  // Non-streaming generate.
  return await ollamaJson<OllamaGenerateResponse>('/api/generate', {
    method: 'POST',
    body: JSON.stringify({ ...request, stream: false }),
  });
}

export async function* streamGenerateWithOllama(
  request: OllamaGenerateRequest,
): AsyncGenerator<OllamaGenerateResponse, void, unknown> {
  const url = `${getBaseUrl()}/api/generate`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...request, stream: true }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Ollama generate stream failed (${res.status})${text ? `: ${text}` : ''}`);
  }

  const reader = res.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      let evt: OllamaGenerateResponse | null = null;
      try {
        evt = JSON.parse(trimmed) as OllamaGenerateResponse;
      } catch {
        evt = null;
      }
      if (evt) {
        yield evt;
        if (evt.done) return;
      }
    }
  }
}

export function createJarvisSystemPrompt(
  personality: 'professional' | 'witty' | 'sarcastic' = 'professional',
  context?: string,
): string {
  const style =
    personality === 'witty'
      ? 'Witty, concise, high-signal.'
      : personality === 'sarcastic'
        ? 'Dry sarcasm, but still helpful and precise.'
        : 'Professional, direct, technically precise.';

  const ctx = context && context.trim().length > 0 ? context.trim() : 'No additional context.';

  return [
    'You are JARVIS, an elite AI operating system assistant.',
    `Style: ${style}`,
    `Context: ${ctx}`,
    'Rules: be accurate, avoid hallucinations, ask clarifying questions when needed.',
  ].join('\n');
}
