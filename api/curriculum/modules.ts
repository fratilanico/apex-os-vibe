import type { VercelRequest, VercelResponse } from '@vercel/node';
import { hasSupabaseServerConfig, supabaseServer } from '../../lib/supabaseServer.js';
import { modules as STATIC_MODULES } from '../../data/curriculumData.js';
import type { Module } from '../../types/curriculum';

const ADMIN_PASSWORD = process.env.ADMIN_DASH_PASSWORD ?? '';

const sanitizeModule = (module: Module, index: number) => ({
  id: module.id,
  number: module.number,
  title: module.title,
  subtitle: module.subtitle,
  duration: module.duration,
  objective: module.objective,
  icon: module.icon,
  sections: module.sections,
  key_takeaways: module.keyTakeaways ?? [],
  tier: module.tier,
  phase: module.phase,
  level: module.level,
  xp_required: module.xpRequired,
  description: module.description || '',
  sort_order: index,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    if (!hasSupabaseServerConfig) {
      return res.status(200).json({ modules: STATIC_MODULES, source: 'fallback' });
    }

    const { data, error } = await supabaseServer
      .from('curriculum_modules')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return res.status(200).json({ modules: STATIC_MODULES, source: 'fallback' });
    }

    const modules = data.map((row) => ({
      id: row.id,
      number: row.number,
      title: row.title,
      subtitle: row.subtitle,
      duration: row.duration,
      objective: row.objective,
      icon: row.icon,
      sections: row.sections ?? [],
      keyTakeaways: row.key_takeaways ?? [],
      tier: row.tier,
      phase: row.phase,
      level: row.level,
      xpRequired: row.xp_required,
      description: row.description,
    }));

    return res.status(200).json({ modules, source: 'database' });
  }

  if (req.method === 'POST') {
    if (!hasSupabaseServerConfig) {
      return res.status(500).json({ error: 'Supabase server config missing' });
    }

    const { adminPassword, modules } = req.body || {};

    if (!ADMIN_PASSWORD || adminPassword !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!Array.isArray(modules)) {
      return res.status(400).json({ error: 'Modules array is required' });
    }

    const payload = modules.map((module: Module, index: number) => sanitizeModule(module, index));

    const { error } = await supabaseServer
      .from('curriculum_modules')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
