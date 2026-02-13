import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════════════════════════════════
// RSS INGESTION API - Agent 1 Implementation
// POST /api/content/rss/ingest
// Parses RSS XML and stores articles in content_items table
// ═══════════════════════════════════════════════════════════════════════════════

const SUPABASE_URL = process.env.VIBE_MARKETING_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.VIBE_MARKETING_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY;

interface RSSItem {
  title: string;
  link: string;
  description?: string;
  content?: string;
  author?: string;
  pubDate?: string;
  guid?: string;
  categories?: string[];
  enclosure?: { url: string; type: string };
}

interface RSSFeed {
  title: string;
  description?: string;
  link?: string;
  lastBuildDate?: string;
  items: RSSItem[];
}

// Parse RSS XML to JSON
async function parseRSS(xml: string = ''): Promise<RSSFeed> {
  try {
    const source = xml ?? '';
    // Simple XML parsing without external dependencies
    const getTextContent = (xml: string, tag: string): string | undefined => {
      const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i');
      const match = xml.match(regex);
      return match?.[1]?.trim();
    };

    const getAllMatches = (xml: string, tag: string): string[] => {
      const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'gi');
      const matches: string[] = [];
      let match: RegExpExecArray | null;
      while ((match = regex.exec(xml)) !== null) {
        const value = match?.[1];
        if (value) {
          matches.push(value.trim());
        }
      }
      return matches;
    };

    // Extract channel info
    const channelMatch = source.match(/<channel[^>]*>([\s\S]*?)<\/channel>/i);
    const channelXml: string = channelMatch?.[1] ?? source;

    // Extract items
    const itemMatches = source.match(/<item[^>]*>([\s\S]*?)<\/item>/gi) || [];

    const items: RSSItem[] = itemMatches.map((itemXml: string) => {
      const title = getTextContent(itemXml, 'title') || 'Untitled';
      const link = getTextContent(itemXml, 'link') || '';
      const description = getTextContent(itemXml, 'description') || getTextContent(itemXml, 'summary');
      const content = getTextContent(itemXml, 'content:encoded') || description;
      const author = getTextContent(itemXml, 'author') || getTextContent(itemXml, 'dc:creator');
      const pubDate = getTextContent(itemXml, 'pubDate') || getTextContent(itemXml, 'dc:date');
      const guid = getTextContent(itemXml, 'guid') || getTextContent(itemXml, 'id') || link;
      const categories = getAllMatches(itemXml, 'category');
      
      // Extract enclosure (image)
      const enclosureMatch = itemXml.match(/<enclosure[^>]*url="([^"]*)"[^>]*>/i);
      const enclosureUrl = enclosureMatch?.[1];
      const enclosure = enclosureUrl ? { url: enclosureUrl, type: 'image' } : undefined;

      return {
        title,
        link,
        description,
        content,
        author,
        pubDate,
        guid,
        categories,
        enclosure
      };
    });

    return {
      title: getTextContent(channelXml, 'title') || 'Unknown Feed',
      description: getTextContent(channelXml, 'description') || undefined,
      link: getTextContent(channelXml, 'link') || undefined,
      lastBuildDate: getTextContent(channelXml, 'lastBuildDate') || undefined,
      items
    };
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(`Failed to parse RSS: ${err.message}`);
  }
}

// Calculate word count and read time
function calculateReadTime(content: string): { wordCount: number; readTime: number } {
  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
  const readTime = Math.ceil(wordCount / 200); // 200 words per minute
  return { wordCount, readTime };
}

// Fetch and parse RSS feed
async function fetchRSSFeed(url: string): Promise<RSSFeed> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'APEX-OS-RSS-Aggregator/1.0',
      'Accept': 'application/rss+xml, application/xml, text/xml, */*'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const xmlContent = await response.text();
  return parseRSS(xmlContent);
}

// Store content items in database
async function storeContentItems(
  supabase: any,
  sourceId: string,
  items: RSSItem[],
  lastFetch: Date | null
): Promise<{ inserted: number; skipped: number; errors: number }> {
  const results = { inserted: 0, skipped: 0, errors: 0 };
  
  for (const item of items) {
    try {
      // Check if item already exists
      const { data: existing } = await supabase
        .from('content_items')
        .select('id')
        .eq('source_id', sourceId)
        .eq('external_id', item.guid || item.link)
        .maybeSingle();

      if (existing) {
        results.skipped++;
        continue;
      }

      // Check if published after last fetch
      const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
      if (lastFetch && pubDate <= lastFetch) {
        results.skipped++;
        continue;
      }

      // Calculate read time
      const content = item.content || item.description || '';
      const { wordCount, readTime } = calculateReadTime(content);

      // Insert content item
      const { data: contentItem, error: insertError } = await supabase
        .from('content_items')
        .insert({
          source_id: sourceId,
          external_id: item.guid || item.link,
          title: item.title,
          content: content,
          excerpt: item.description?.substring(0, 500),
          url: item.link,
          author: item.author,
          published_at: pubDate.toISOString(),
          raw_data: {
            categories: item.categories,
            enclosure: item.enclosure
          },
          image_url: item.enclosure?.url,
          word_count: wordCount,
          read_time_minutes: readTime,
          status: 'new'
        })
        .select()
        .single();

      if (insertError) {
        console.error(`[RSS Ingest] Insert error:`, insertError);
        results.errors++;
        continue;
      }

      results.inserted++;

      // Trigger AI scoring (async, don't wait)
      triggerAIScoring(contentItem.id).catch(err => {
        console.error(`[RSS Ingest] Scoring trigger failed:`, err);
      });

    } catch (error) {
      console.error(`[RSS Ingest] Item processing error:`, error);
      results.errors++;
    }
  }

  return results;
}

// Trigger AI scoring via webhook
async function triggerAIScoring(contentId: string): Promise<void> {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
  
  const response = await fetch(`${baseUrl}/api/content/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content_id: contentId })
  });

  if (!response.ok) {
    throw new Error(`Scoring API returned ${response.status}`);
  }
}

// Main handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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
    const { source_id, url, fetch_all = false } = req.body;

    // Validate input
    if (!source_id && !url) {
      return res.status(400).json({ 
        error: 'Missing required field',
        details: 'Provide either source_id or url'
      });
    }

    let source: any = null;
    let feedUrl = url;
    let lastFetch: Date | null = null;

    // If source_id provided, fetch source details
    if (source_id) {
      const { data: sourceData, error: sourceError } = await supabase
        .from('content_sources')
        .select('*')
        .eq('id', source_id)
        .single();

      if (sourceError || !sourceData) {
        return res.status(404).json({ 
          error: 'Source not found',
          details: sourceError?.message 
        });
      }

      source = sourceData;
      feedUrl = source.url;
      lastFetch = fetch_all ? null : new Date(source.last_fetch || 0);
    }

    console.log(`[RSS Ingest] Fetching: ${feedUrl}`);

    // Fetch and parse RSS
    const feed = await fetchRSSFeed(feedUrl);
    console.log(`[RSS Ingest] Parsed ${feed.items.length} items from ${feed.title}`);

    // Store items
    const sourceId = source?.id || 'manual-ingest';
    const results = await storeContentItems(supabase, sourceId, feed.items, lastFetch);

    // Update source metadata if source exists
    if (source) {
      const { error: updateError } = await supabase
        .from('content_sources')
        .update({
          last_fetch: new Date().toISOString(),
          fetch_count: (source.fetch_count || 0) + 1,
          status: 'active',
          last_error: null
        })
        .eq('id', source.id);

      if (updateError) {
        console.error(`[RSS Ingest] Failed to update source:`, updateError);
      }
    }

    return res.status(200).json({
      success: true,
      feed: {
        title: feed.title,
        description: feed.description,
        item_count: feed.items.length
      },
      results: {
        inserted: results.inserted,
        skipped: results.skipped,
        errors: results.errors
      },
      source_id: source?.id,
      processed_at: new Date().toISOString()
    });

  } catch (error: any) {
    console.error(`[RSS Ingest] Error:`, error);
    
    // Update source with error if applicable
    if (req.body.source_id) {
      await supabase
        .from('content_sources')
        .update({
          status: 'error',
          last_error: error.message,
          error_count: supabase.rpc('increment_error_count', { row_id: req.body.source_id })
        })
        .eq('id', req.body.source_id);
    }

    return res.status(500).json({
      error: 'Ingestion failed',
      details: error.message
    });
  }
}
