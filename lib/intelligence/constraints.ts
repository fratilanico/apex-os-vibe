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
    .from('frontier_intelligence')
    .select('title, category, logic, is_active');

  if (error || !data) return '';

  const restricted = data.filter(item => !item.is_active);
  const active = data.filter(item => item.is_active);

  let constraintBlock = '\n\n## FRONTIER_KNOWLEDGE_CONSTRAINTS\n';

  if (restricted.length > 0) {
    constraintBlock += '\n[RESTRICTED_TOOLS_AND_LOGIC - DO NOT USE OR MENTION]:\n';
    restricted.forEach(item => {
      constraintBlock += `- ${item.title} (${item.category}): User has disabled this sync. If asked about it, explicitly refuse to implement or discuss it as it is outside the authorized frontier.\n`;
    });
  }

  if (active.length > 0) {
    constraintBlock += '\n[AUTHORIZED_FRONTIER_KNOWLEDGE]:\n';
    active.forEach(item => {
      constraintBlock += `- ${item.title}: ${item.logic}\n`;
    });
  }

  return constraintBlock;
}
