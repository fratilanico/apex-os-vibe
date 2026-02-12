export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  context?: number[];
  stream?: boolean;
  options?: {
    temperature?: number;
    num_ctx?: number;
  };
}

const OLLAMA_BASE_URL = 'http://127.0.0.1:11434';

async function safeFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${OLLAMA_BASE_URL}${path}`, init);
}

export async function isOllamaRunning(): Promise<boolean> {
  try {
    const resp = await safeFetch('/api/tags', { method: 'GET' });
    return resp.ok;
  } catch {
    return false;
  }
}

export async function listOllamaModels(): Promise<string[]> {
  const resp = await safeFetch('/api/tags', { method: 'GET' });
  if (!resp.ok) return [];
  const data = (await resp.json()) as { models?: Array<{ name: string }> };
  return (data.models || []).map((m) => m.name);
}

export async function pullOllamaModel(model: string, onProgress?: (progress: number) => void): Promise<void> {
  const resp = await safeFetch('/api/pull', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: model, stream: true }),
  });

  if (!resp.ok) throw new Error(`Ollama pull failed: ${resp.status}`);
  if (!resp.body) return;

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const json = JSON.parse(line) as { total?: number; completed?: number };
        if (json.total && json.completed && onProgress) {
          onProgress(Math.round((json.completed / json.total) * 100));
        }
      } catch {
        // ignore
      }
    }
  }
}

export async function generateWithOllama(request: OllamaGenerateRequest): Promise<{ response: string; eval_count?: number; context?: number[] }> {
  const resp = await safeFetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: request.model,
      prompt: request.prompt,
      system: request.system,
      context: request.context,
      stream: false,
      options: request.options,
    }),
  });
  if (!resp.ok) throw new Error(`Ollama generate failed: ${resp.status}`);
  const data = (await resp.json()) as { response: string; eval_count?: number; context?: number[] };
  return data;
}

export async function* streamGenerateWithOllama(request: OllamaGenerateRequest): AsyncGenerator<{ response: string; done?: boolean }, void, void> {
  const resp = await safeFetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: request.model,
      prompt: request.prompt,
      system: request.system,
      context: request.context,
      stream: true,
      options: request.options,
    }),
  });
  if (!resp.ok || !resp.body) throw new Error(`Ollama stream failed: ${resp.status}`);
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (!line.trim()) continue;
      const json = JSON.parse(line) as { response?: string; done?: boolean };
      yield { response: json.response || '', done: json.done };
    }
  }
}

export async function isModelAvailable(model: string): Promise<boolean> {
  const models = await listOllamaModels();
  return models.includes(model);
}

export function createJarvisSystemPrompt(personality: string, context?: string): string {
  return `JARVIS personality=${personality}\nContext=${context || 'none'}`;
}
