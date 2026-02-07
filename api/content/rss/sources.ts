import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════════════════════════════════
// RSS SOURCES MANAGEMENT API - Agent 1 Implementation
// GET /api/content/rss/sources - List all RSS sources
// POST /api/content/rss/sources - Add new RSS source
// PUT /api/content/rss/sources - Update source config
// DELETE /api/content/rss/sources - Remove source
// ═══════════════════════════════════════════════════════════════════════════════

const SUPABASE_URL = process.env.VIBE_MARKETING_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.VIBE_MARKETING_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY;

interface RSSSourceInput {
  name: string;
  url: string;
  type?: 'rss' | 'api' | 'webhook' | 'manual';
  category?: string;
  priority?: 'high' | 'medium' | 'low';
  config?: Record<string, any>;
}

// Validate RSS URL format
function isValidRSSUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// GET: List all sources
async function listSources(supabase: any, req: VercelRequest) {
  const { 
    status, 
    category, 
    type = 'rss',
    limit = '50', 
    offset = '0',
    include_stats = 'false'
  } = req.query;

  let query = supabase
    .from('content_sources')
    .select('*')
    .eq('type', type)
    .order('priority', { ascending: false })
    .order('name', { ascending: true });

  if (status) {
    query = query.eq('status', status);
  }

  if (category) {
    query = query.eq('category', category);
  }

  query = query.range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);

  const { data: sources, error, count } = await query;

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  // Include stats if requested
  let sourcesWithStats = sources;
  if (include_stats === 'true') {
    const { data: stats } = await supabase
      .from('content_items')
      .select('source_id, status')
      .in('source_id', sources.map((s: any) => s.id));

    const statsMap = stats?.reduce((acc: any, item: any) => {
      if (!acc[item.source_id]) {
        acc[item.source_id] = { total: 0, new: 0, scored: 0, curated: 0 };
      }
      acc[item.source_id].total++;
      acc[item.source_id][item.status] = (acc[item.source_id][item.status] || 0) + 1;
      return acc;
    }, {});

    sourcesWithStats = sources.map((s: any) => ({
      ...s,
      stats: statsMap?.[s.id] || { total: 0, new: 0, scored: 0, curated: 0 }
    }));
  }

  return {
    sources: sourcesWithStats,
    pagination: {
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
      total: count
    }
  };
}

// POST: Add new source
async function addSource(supabase: any, body: RSSSourceInput) {
  const { name, url, type = 'rss', category, priority = 'medium', config = {} } = body;

  // Validation
  if (!name || !url) {
    return { error: 'Name and URL are required', status: 400 };
  }

  if (!isValidRSSUrl(url)) {
    return { error: 'Invalid URL format', status: 400 };
  }

  // Check for duplicates
  const { data: existing } = await supabase
    .from('content_sources')
    .select('id')
    .eq('url', url)
    .maybeSingle();

  if (existing) {
    return { error: 'Source with this URL already exists', status: 409 };
  }

  // Insert new source
  const { data: source, error } = await supabase
    .from('content_sources')
    .insert({
      name,
      url,
      type,
      category,
      priority,
      config: {
        fetch_limit: 20,
        ai_analysis: true,
        ...config
      },
      status: 'active'
    })
    .select()
    .single();

  if (error) {
    return { error: `Failed to create source: ${error.message}`, status: 500 };
  }

  return { source, status: 201 };
}

// PUT: Update source
async function updateSource(supabase: any, body: any) {
  const { id, ...updates } = body;

  if (!id) {
    return { error: 'Source ID is required', status: 400 };
  }

  // Validate URL if provided
  if (updates.url && !isValidRSSUrl(updates.url)) {
    return { error: 'Invalid URL format', status: 400 };
  }

  // Build update object
  const updateData: any = {};
  const allowedFields = ['name', 'url', 'category', 'priority', 'config', 'status'];
  
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      updateData[field] = updates[field];
    }
  }

  if (Object.keys(updateData).length === 0) {
    return { error: 'No valid fields to update', status: 400 };
  }

  const { data: source, error } = await supabase
    .from('content_sources')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { error: 'Source not found', status: 404 };
    }
    return { error: `Failed to update source: ${error.message}`, status: 500 };
  }

  return { source, status: 200 };
}

// DELETE: Remove source
async function deleteSource(supabase: any, id: string, cascade: boolean = false) {
  if (!id) {
    return { error: 'Source ID is required', status: 400 };
  }

  // If cascade, delete related content first
  if (cascade) {
    const { error: contentError } = await supabase
      .from('content_items')
      .delete()
      .eq('source_id', id);

    if (contentError) {
      return { error: `Failed to delete related content: ${contentError.message}`, status: 500 };
    }
  } else {
    // Check if source has content
    const { count, error: countError } = await supabase
      .from('content_items')
      .select('*', { count: 'exact', head: true })
      .eq('source_id', id);

    if (countError) {
      return { error: `Failed to check related content: ${countError.message}`, status: 500 };
    }

    if (count > 0) {
      return { 
        error: 'Source has associated content. Use cascade=true to delete all content.', 
        content_count: count,
        status: 409 
      };
    }
  }

  // Delete source
  const { error } = await supabase
    .from('content_sources')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: `Failed to delete source: ${error.message}`, status: 500 };
  }

  return { 
    message: 'Source deleted successfully',
    cascade_deleted: cascade,
    status: 200 
  };
}

// Main handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Validate Supabase config
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ 
      error: 'Supabase configuration missing',
      details: 'VIBE_MARKETING_SUPABASE_URL and VIBE_MARKETING_SUPABASE_SERVICE_KEY required'
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    switch (req.method) {
      case 'GET': {
        const result = await listSources(supabase, req);
        return res.status(200).json(result);
      }

      case 'POST': {
        const result = await addSource(supabase, req.body);
        return res.status(result.status).json(
          result.error 
            ? { error: result.error } 
            : { success: true, source: result.source }
        );
      }

      case 'PUT': {
        const result = await updateSource(supabase, req.body);
        return res.status(result.status).json(
          result.error 
            ? { error: result.error } 
            : { success: true, source: result.source }
        );
      }

      case 'DELETE': {
        const { id, cascade } = req.query;
        const result = await deleteSource(supabase, id as string, cascade === 'true');
        return res.status(result.status).json(
          result.error 
            ? { error: result.error } 
            : { success: true, message: result.message }
        );
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error: any) {
    console.error(`[RSS Sources] Error:`, error);
    return res.status(500).json({
      error: 'Request failed',
      details: error.message
    });
  }
}
