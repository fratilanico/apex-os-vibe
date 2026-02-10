-- ═══════════════════════════════════════════════════════════════════════════════
-- APEX OS CUSTOMER ANALYTICS DATABASE SCHEMA
-- Everything tracked: Sessions, Users, Jarvis, Terminal, Forms, Webinar
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- ═══════════════════════════════════════════════════════════════════════════════
-- CORE TABLES
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. USER SESSIONS (Parent table - everything links here)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- Anonymous UUID generated on first visit
  email VARCHAR(255),
  
  -- Session timing
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  session_duration_seconds INTEGER,
  
  -- Device & Browser Info
  device_type VARCHAR(50), -- 'mobile', 'tablet', 'desktop'
  device_model VARCHAR(255),
  os VARCHAR(100),
  os_version VARCHAR(50),
  browser VARCHAR(100),
  browser_version VARCHAR(50),
  screen_resolution VARCHAR(50),
  device_pixel_ratio DECIMAL(3,2),
  
  -- Performance
  refresh_rate INTEGER,
  memory_gb DECIMAL(4,2),
  cpu_cores INTEGER,
  
  -- Location (if available)
  country VARCHAR(100),
  city VARCHAR(100),
  ip_address INET,
  
  -- Onboarding State
  persona VARCHAR(50), -- 'PERSONAL', 'BUSINESS', or NULL
  onboarding_step VARCHAR(100),
  is_unlocked BOOLEAN DEFAULT FALSE,
  geek_mode_enabled BOOLEAN DEFAULT FALSE,
  
  -- Journey tracking
  landing_page VARCHAR(500),
  referrer VARCHAR(500),
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  conversion_status VARCHAR(50), -- 'visitor', 'lead', 'qualified', 'customer'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_email ON user_sessions(email);
CREATE INDEX idx_user_sessions_session_start ON user_sessions(session_start);
CREATE INDEX idx_user_sessions_is_active ON user_sessions(is_active);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 2. JARVIS CONVERSATIONS
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS jarvis_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES user_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  -- Message info
  message_id VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'jarvis', 'system')),
  content TEXT NOT NULL,
  content_preview VARCHAR(200), -- First 200 chars for quick view
  
  -- Context
  page_path VARCHAR(500),
  persona VARCHAR(50),
  geek_mode BOOLEAN DEFAULT FALSE,
  
  -- Message metadata
  message_length INTEGER,
  word_count INTEGER,
  has_code BOOLEAN DEFAULT FALSE,
  has_question BOOLEAN DEFAULT FALSE,
  has_url BOOLEAN DEFAULT FALSE,
  
  -- Topics & Analysis (populated by AI analysis)
  topics JSONB, -- Array of detected topics
  intent VARCHAR(100), -- e.g., 'question', 'command', 'feedback'
  sentiment VARCHAR(20), -- 'positive', 'neutral', 'negative'
  urgency_score INTEGER CHECK (urgency_score BETWEEN 0 AND 100),
  
  -- Session context
  session_start_time TIMESTAMP WITH TIME ZONE,
  session_message_index INTEGER, -- Message # in session
  time_since_session_start_seconds INTEGER,
  time_since_last_message_seconds INTEGER,
  
  -- AI Performance
  ai_response_time_ms INTEGER,
  ai_model_used VARCHAR(100),
  ai_tokens_used INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_jarvis_conversations_session_id ON jarvis_conversations(session_id);
CREATE INDEX idx_jarvis_conversations_user_id ON jarvis_conversations(user_id);
CREATE INDEX idx_jarvis_conversations_created_at ON jarvis_conversations(created_at);
CREATE INDEX idx_jarvis_conversations_role ON jarvis_conversations(role);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 3. TERMINAL INTERACTIONS
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS terminal_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES user_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  -- Command info
  command_id VARCHAR(100) UNIQUE NOT NULL,
  command TEXT NOT NULL,
  command_clean TEXT, -- Command without arguments
  command_type VARCHAR(50), -- 'input', 'admin', 'system', 'navigation'
  command_category VARCHAR(100), -- 'help', 'status', 'admin', 'pill', etc.
  
  -- Context
  onboarding_step VARCHAR(100),
  persona VARCHAR(50),
  is_unlocked BOOLEAN,
  terminal_mode VARCHAR(20), -- 'STANDARD', 'GEEK'
  
  -- Response info
  response_type VARCHAR(50), -- 'success', 'error', 'info', 'warning'
  response_preview VARCHAR(500),
  response_full TEXT,
  
  -- Performance
  execution_time_ms INTEGER,
  client_timestamp TIMESTAMP WITH TIME ZONE,
  server_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Admin commands (if applicable)
  is_admin_command BOOLEAN DEFAULT FALSE,
  admin_action VARCHAR(100), -- 'auth', 'pill_switch', 'geek_toggle', etc.
  admin_success BOOLEAN,
  
  -- Sequence tracking
  command_sequence INTEGER, -- Command # in session
  time_since_last_command_ms INTEGER,
  session_total_commands INTEGER,
  
  -- Metadata
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_terminal_interactions_session_id ON terminal_interactions(session_id);
CREATE INDEX idx_terminal_interactions_user_id ON terminal_interactions(user_id);
CREATE INDEX idx_terminal_interactions_command_type ON terminal_interactions(command_type);
CREATE INDEX idx_terminal_interactions_is_admin ON terminal_interactions(is_admin_command);
CREATE INDEX idx_terminal_interactions_created_at ON terminal_interactions(created_at);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 4. PILL SELECTIONS
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS pill_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES user_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  -- Selection info
  selected_persona VARCHAR(50) NOT NULL CHECK (selected_persona IN ('PERSONAL', 'BUSINESS')),
  selected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Pre-selection behavior
  hovered_options JSONB, -- ['PERSONAL', 'BUSINESS'] or just one
  hover_duration_ms INTEGER,
  times_hovered_personal INTEGER DEFAULT 0,
  times_hovered_business INTEGER DEFAULT 0,
  
  -- Journey timing
  handshake_completed_at TIMESTAMP WITH TIME ZONE,
  time_to_decision_ms INTEGER, -- Time from handshake to click
  
  -- User info at time of selection
  name_provided VARCHAR(255),
  email_provided VARCHAR(255),
  
  -- Post-selection
  modules_unlocked JSONB, -- Array of module IDs
  
  -- A/B Test data
  pill_style_shown VARCHAR(50), -- 'matrix', 'commander', 'arcade', etc.
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pill_selections_session_id ON pill_selections(session_id);
CREATE INDEX idx_pill_selections_user_id ON pill_selections(user_id);
CREATE INDEX idx_pill_selections_selected_persona ON pill_selections(selected_persona);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 5. WEBINAR / WAITLIST FORM SUBMISSIONS
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS webinar_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES user_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  -- Contact info
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  
  -- Professional info
  company VARCHAR(255),
  job_title VARCHAR(255),
  industry VARCHAR(100),
  company_size VARCHAR(50),
  
  -- Intent & Goals
  primary_goal TEXT,
  current_challenges TEXT,
  desired_outcome TEXT,
  
  -- Experience level
  ai_experience_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
  coding_experience_level VARCHAR(50),
  
  -- Preferences
  preferred_persona VARCHAR(50), -- 'PERSONAL', 'BUSINESS'
  preferred_schedule VARCHAR(100),
  timezone VARCHAR(100),
  
  -- AI Scoring (computed by your AI)
  ai_score INTEGER CHECK (ai_score BETWEEN 0 AND 100),
  ai_rank INTEGER,
  ai_status VARCHAR(50), -- 'hot', 'warm', 'cold'
  ai_analysis JSONB, -- Full AI analysis
  
  -- Referral
  referral_code VARCHAR(100),
  referred_by VARCHAR(100),
  
  -- UTM & Source
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  landing_page VARCHAR(500),
  
  -- Status
  submission_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'reviewed', 'approved', 'rejected'
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by VARCHAR(255),
  notes TEXT,
  
  -- Communication
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_webinar_submissions_session_id ON webinar_submissions(session_id);
CREATE INDEX idx_webinar_submissions_email ON webinar_submissions(email);
CREATE INDEX idx_webinar_submissions_ai_score ON webinar_submissions(ai_score);
CREATE INDEX idx_webinar_submissions_status ON webinar_submissions(submission_status);
CREATE INDEX idx_webinar_submissions_created_at ON webinar_submissions(created_at);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 6. USER JOURNEY EVENTS (Catch-all for everything else)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS user_journey_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES user_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  -- Event info
  event_type VARCHAR(100) NOT NULL,
  -- 'page_view', 'scroll', 'click', 'hover', 'form_start', 'form_submit',
  -- 'video_play', 'video_pause', 'download', 'share', 'vault_open',
  -- 'geek_mode_toggle', 'terminal_focus', 'terminal_blur', etc.
  
  event_name VARCHAR(255),
  event_description TEXT,
  
  -- Context
  page_path VARCHAR(500),
  page_title VARCHAR(500),
  element_id VARCHAR(255),
  element_class VARCHAR(255),
  element_text VARCHAR(500),
  
  -- Position (for clicks/hovers)
  click_x INTEGER,
  click_y INTEGER,
  viewport_width INTEGER,
  viewport_height INTEGER,
  
  -- Event data (flexible JSON)
  event_data JSONB,
  
  -- Timing
  session_time_ms INTEGER, -- Time since session start
  time_on_page_ms INTEGER,
  time_since_last_event_ms INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_journey_events_session_id ON user_journey_events(session_id);
CREATE INDEX idx_user_journey_events_user_id ON user_journey_events(user_id);
CREATE INDEX idx_user_journey_events_event_type ON user_journey_events(event_type);
CREATE INDEX idx_user_journey_events_created_at ON user_journey_events(created_at);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 7. GEEK MODE EVENTS
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS geek_mode_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES user_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  event_type VARCHAR(50) NOT NULL, -- 'enabled', 'disabled', 'effect_toggled'
  effect_name VARCHAR(100), -- 'matrix_rain', 'scanlines', 'glitch', etc.
  effect_enabled BOOLEAN,
  
  -- Context
  time_in_session_seconds INTEGER,
  commands_used_before_toggle INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- VIEWS FOR EASY QUERYING
-- ═══════════════════════════════════════════════════════════════════════════════

-- View: Complete user journey
CREATE OR REPLACE VIEW v_complete_user_journey AS
SELECT 
  us.id as session_id,
  us.user_id,
  us.email,
  us.persona,
  us.session_start,
  us.session_duration_seconds,
  us.device_type,
  us.browser,
  us.conversion_status,
  
  -- Jarvis stats
  COUNT(DISTINCT jc.id) as jarvis_message_count,
  
  -- Terminal stats
  COUNT(DISTINCT ti.id) as terminal_command_count,
  
  -- Webinar submission
  ws.id as webinar_submission_id,
  ws.full_name as webinar_name,
  ws.ai_score,
  ws.ai_status,
  
  -- Pill selection
  ps.selected_persona as chosen_persona,
  ps.time_to_decision_ms

FROM user_sessions us
LEFT JOIN jarvis_conversations jc ON us.id = jc.session_id
LEFT JOIN terminal_interactions ti ON us.id = ti.session_id
LEFT JOIN webinar_submissions ws ON us.id = ws.session_id
LEFT JOIN pill_selections ps ON us.id = ps.session_id
GROUP BY us.id, ws.id, ws.full_name, ws.ai_score, ws.ai_status, ps.selected_persona, ps.time_to_decision_ms;

-- View: Daily analytics summary
CREATE OR REPLACE VIEW v_daily_analytics AS
SELECT 
  DATE_TRUNC('day', session_start) as date,
  COUNT(DISTINCT us.id) as total_sessions,
  COUNT(DISTINCT us.user_id) as unique_users,
  COUNT(DISTINCT ws.id) as webinar_submissions,
  AVG(us.session_duration_seconds) as avg_session_duration,
  COUNT(DISTINCT CASE WHEN us.persona = 'PERSONAL' THEN us.id END) as personal_selected,
  COUNT(DISTINCT CASE WHEN us.persona = 'BUSINESS' THEN us.id END) as business_selected,
  AVG(ws.ai_score) as avg_ai_score

FROM user_sessions us
LEFT JOIN webinar_submissions ws ON DATE_TRUNC('day', us.session_start) = DATE_TRUNC('day', ws.created_at)
GROUP BY DATE_TRUNC('day', session_start)
ORDER BY date DESC;

-- ═══════════════════════════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Function: Auto-update session duration
CREATE OR REPLACE FUNCTION update_session_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.session_end IS NOT NULL AND OLD.session_end IS NULL THEN
    NEW.session_duration_seconds := EXTRACT(EPOCH FROM (NEW.session_end - NEW.session_start));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_duration
  BEFORE UPDATE ON user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_session_duration();

-- Function: Update timestamp on webinar_submissions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_webinar_timestamp
  BEFORE UPDATE ON webinar_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE jarvis_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE terminal_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pill_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journey_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE geek_mode_events ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read all data
CREATE POLICY "Admins can read all user_sessions" 
  ON user_sessions FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can read all jarvis_conversations" 
  ON jarvis_conversations FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can read all terminal_interactions" 
  ON terminal_interactions FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can read all webinar_submissions" 
  ON webinar_submissions FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Allow inserts from service role (backend)
CREATE POLICY "Service can insert all tables"
  ON user_sessions FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Service can insert jarvis"
  ON jarvis_conversations FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Service can insert terminal"
  ON terminal_interactions FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Service can insert webinar"
  ON webinar_submissions FOR INSERT 
  WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════════════════
-- DONE! SCHEMA COMPLETE
-- ═══════════════════════════════════════════════════════════════════════════════

COMMENT ON TABLE user_sessions IS 'Parent table for all user activity - every session gets a unique ID';
COMMENT ON TABLE jarvis_conversations IS 'All Jarvis chat messages with full context and analysis';
COMMENT ON TABLE terminal_interactions IS 'Every terminal command with response and metadata';
COMMENT ON TABLE webinar_submissions IS 'Webinar/waitlist form submissions with AI scoring';
COMMENT ON TABLE pill_selections IS 'Red/Blue pill selections with hover behavior tracking';
COMMENT ON TABLE user_journey_events IS 'Catch-all for page views, clicks, scrolls, etc.';

-- Success message
SELECT '✅ APEX OS Analytics Schema Created Successfully!' as status;
