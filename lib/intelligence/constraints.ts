import { createClient } from '@supabase/supabase-js';

// Lazy initialization - only create client when function is called
let supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabase && typeof process !== 'undefined') {
    supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || ''
    );
  }
  return supabase;
}

export async function getFrontierConstraints(): Promise<string> {
  const client = getSupabase();
  if (!client) return '';
  
  const { data, error } = await client
    .from('frontier_intelligence' as any)
    .select('title, category, logic, is_active');

  if (error || !data) return '';

  const constraints = data as any[];
  return constraints
    .filter((c) => c.is_active)
    .map((c) => `[${c.category.toUpperCase()}] ${c.title}: ${c.logic}`)
    .join('\n');
}

export async function getCategoryConstraints(category: string): Promise<string> {
  const client = getSupabase();
  if (!client) return '';

  const { data, error } = await client
    .from('frontier_intelligence' as any)
    .select('title, category, logic')
    .eq('category', category);

  if (error || !data) return '';

  const constraints = data as any[];
  return constraints
    .map((c) => `[${c.category.toUpperCase()}] ${c.title}: ${c.logic}`)
    .join('\n');
}

export async function getPersonaLogic(persona: string): Promise<string> {
  const client = getSupabase();
  if (!client) return '';

  const { data, error } = await client
    .from('frontier_intelligence' as any)
    .select('title, logic')
    .eq('category', 'persona')
    .ilike('title', `%${persona}%`)
    .limit(1);

  if (error || !data || (data as any[]).length === 0) return '';

  return (data as any[])[0].logic;
}
