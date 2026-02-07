-- ═══════════════════════════════════════════════════════════════════════════════
-- APEX OS CONTENT SYSTEM - Database Schema
-- Full Tony Stark Mode - Neural Content Aggregation & Distribution
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE: content_sources
-- RSS feeds, social accounts, and API sources
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS content_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('rss', 'social', 'api', 'internal')),
  url TEXT NOT NULL,
  category VARCHAR(100),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error')),
  config JSONB DEFAULT '{}',
  last_fetch TIMESTAMP,
  fetch_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE: content_items
-- Individual articles, posts, and content pieces
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID REFERENCES content_sources(id) ON DELETE CASCADE,
  external_id VARCHAR(500),
  title VARCHAR(500),
  content TEXT,
  excerpt TEXT,
  url TEXT NOT NULL,
  author VARCHAR(255),
  published_at TIMESTAMP,
  fetched_at TIMESTAMP DEFAULT NOW(),
  image_url TEXT,
  word_count INTEGER,
  read_time_minutes INTEGER,
  raw_data JSONB,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'scored', 'curated', 'published', 'archived')),
  UNIQUE(source_id, external_id)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE: content_scores
-- AI scoring results from Vertex AI
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS content_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  relevance_score INTEGER CHECK (relevance_score BETWEEN 0 AND 100),
  quality_score INTEGER CHECK (quality_score BETWEEN 0 AND 100),
  uniqueness_score INTEGER CHECK (uniqueness_score BETWEEN 0 AND 100),
  overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),
  tags TEXT[],
  summary TEXT,
  sentiment VARCHAR(20) CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  scored_by VARCHAR(50) DEFAULT 'vertex_ai',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE: content_curation_queue
-- Manual review queue for content approval
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS content_curation_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  score_id UUID REFERENCES content_scores(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'scheduled')),
  priority INTEGER DEFAULT 0 CHECK (priority BETWEEN 1 AND 3),
  notes TEXT,
  assigned_to UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE: blog_posts
-- Published blog content
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  curation_id UUID REFERENCES content_curation_queue(id) ON DELETE SET NULL,
  title VARCHAR(500),
  slug VARCHAR(500) UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP,
  author_id UUID,
  tags TEXT[],
  meta JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE: newsletters
-- Newsletter campaigns
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS newsletters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('daily', 'weekly', 'custom')),
  subject VARCHAR(500),
  content TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent')),
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  listmonk_campaign_id INTEGER,
  analytics JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE: newsletter_items
-- Content items included in newsletters
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS newsletter_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  newsletter_id UUID REFERENCES newsletters(id) ON DELETE CASCADE,
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  order_index INTEGER,
  section VARCHAR(50),
  UNIQUE(newsletter_id, blog_post_id)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLE: newsletter_analytics
-- Performance tracking for newsletters
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS newsletter_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  newsletter_id UUID REFERENCES newsletters(id) ON DELETE CASCADE,
  sent_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  bounce_count INTEGER DEFAULT 0,
  unsub_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- INDEXES for performance
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_content_items_source ON content_items(source_id);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_published ON content_items(published_at);
CREATE INDEX IF NOT EXISTS idx_content_scores_overall ON content_scores(overall_score);
CREATE INDEX IF NOT EXISTS idx_curation_queue_status ON content_curation_queue(status);
CREATE INDEX IF NOT EXISTS idx_curation_queue_priority ON content_curation_queue(priority);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_newsletters_status ON newsletters(status);
CREATE INDEX IF NOT EXISTS idx_newsletters_type ON newsletters(type);

-- ═══════════════════════════════════════════════════════════════════════════════
-- FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_content_sources_updated_at BEFORE UPDATE ON content_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════════
-- SEED DATA - RSS Sources
-- ═══════════════════════════════════════════════════════════════════════════════

-- Marketing feeds
INSERT INTO content_sources (id, name, type, url, category, priority, status) VALUES
('hubspot-marketing', 'HubSpot Marketing', 'rss', 'https://blog.hubspot.com/marketing/rss.xml', 'marketing', 'high', 'active'),
('copyblogger', 'Copyblogger', 'rss', 'https://www.copyblogger.com/feed/', 'copywriting', 'high', 'active'),
('mailchimp', 'Mailchimp', 'rss', 'https://mailchimp.com/resources/feed/', 'email-marketing', 'high', 'active'),
('activecampaign', 'ActiveCampaign', 'rss', 'https://www.activecampaign.com/blog/feed/', 'automation', 'medium', 'active'),
('convertkit', 'ConvertKit', 'rss', 'https://convertkit.com/feed', 'email-marketing', 'medium', 'active'),
('neil-patel', 'Neil Patel', 'rss', 'https://neilpatel.com/blog/feed/', 'marketing', 'medium', 'active'),
('backlinko', 'Backlinko', 'rss', 'https://backlinko.com/feed', 'seo', 'medium', 'active'),
('marketing-profs', 'MarketingProfs', 'rss', 'https://www.marketingprofs.com/feed', 'marketing', 'low', 'active')
ON CONFLICT (id) DO NOTHING;

-- Tech feeds
INSERT INTO content_sources (id, name, type, url, category, priority, status) VALUES
('hacker-news', 'Hacker News', 'rss', 'https://news.ycombinator.com/rss', 'tech', 'high', 'active'),
('dev-to', 'Dev.to', 'rss', 'https://dev.to/feed', 'tech', 'high', 'active'),
('product-hunt', 'Product Hunt', 'rss', 'https://www.producthunt.com/feed', 'tech', 'high', 'active'),
('indie-hackers', 'Indie Hackers', 'rss', 'https://www.indiehackers.com/feed', 'tech', 'high', 'active'),
('github-trending', 'GitHub Trending', 'rss', 'https://github.com/trending/javascript', 'tech', 'medium', 'active')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════════
-- VIEWS for common queries
-- ═══════════════════════════════════════════════════════════════════════════════

-- View: Content ready for curation
CREATE OR REPLACE VIEW v_curation_ready AS
SELECT 
  ci.*,
  cs.overall_score,
  cs.tags,
  cs.summary,
  cs.sentiment,
  CASE 
    WHEN cs.overall_score > 85 THEN 3
    WHEN cs.overall_score >= 60 THEN 2
    ELSE 1
  END as calculated_priority
FROM content_items ci
JOIN content_scores cs ON ci.id = cs.content_id
LEFT JOIN content_curation_queue ccq ON ci.id = ccq.content_id
WHERE ci.status = 'scored'
  AND ccq.id IS NULL;

-- View: Published blog posts with scores
CREATE OR REPLACE VIEW v_published_posts AS
SELECT 
  bp.*,
  cs.overall_score as ai_score,
  cs.tags
FROM blog_posts bp
LEFT JOIN content_curation_queue ccq ON bp.curation_id = ccq.id
LEFT JOIN content_scores cs ON ccq.score_id = cs.id
WHERE bp.status = 'published';

-- ═══════════════════════════════════════════════════════════════════════════════
-- COMPLETION MESSAGE
-- ═══════════════════════════════════════════════════════════════════════════════
-- Run this SQL in your Supabase SQL editor to set up the complete content system
-- Then deploy the API endpoints and configure cron jobs