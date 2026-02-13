# APEX OS Waitlist - Supabase Setup

## Required Environment Variables

Add these to your `.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

Create a `waitlist` table with the following SQL:

```sql
create table waitlist (
  id uuid default gen_random_uuid() primary key,
  
  -- Personal Information
  email text not null unique,
  name text not null,
  phone text not null,
  linkedin_url text not null,
  
  -- Professional Information
  company text not null,
  role text not null,
  experience_level text not null,
  company_size text not null,
  industry text not null,
  
  -- Business Metrics
  funding_status text not null,
  revenue_range text not null,
  team_size text not null,
  
  -- Motivation & Goals
  why_join text not null,
  biggest_challenge text not null,
  current_tools text,
  timeline text not null,
  referral_source text,
  
  -- AI Scoring
  ai_score integer,
  referral_code text unique,
  status text default 'cold',
  
  -- Metadata
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for faster lookups
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_referral_code ON waitlist(referral_code);
CREATE INDEX idx_waitlist_status ON waitlist(status);
CREATE INDEX idx_waitlist_ai_score ON waitlist(ai_score DESC);
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at DESC);
CREATE INDEX idx_waitlist_funding ON waitlist(funding_status);
CREATE INDEX idx_waitlist_industry ON waitlist(industry);
CREATE INDEX idx_waitlist_experience ON waitlist(experience_level);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (for waitlist signup)
CREATE POLICY "Allow public inserts" ON waitlist
  FOR INSERT WITH CHECK (true);

-- Create policy to allow reading own data
CREATE POLICY "Allow users to read own data" ON waitlist
  FOR SELECT USING (true);
```

## Field Descriptions

### Personal Information
- **email**: Primary contact email (required, unique)
- **name**: Full name (required)
- **phone**: Phone number with country code (required)
- **linkedin_url**: LinkedIn profile URL (required)

### Professional Information
- **company**: Company name (required)
- **role**: Job title/role (required)
- **experience_level**: Years of experience (0-1, 1-3, 3-5, 5+, 10+)
- **company_size**: Company size (solo, 2-5, 5-10, 10-50, 50-200, 200+)
- **industry**: Industry sector (saas, ai-ml, fintech, healthtech, ecommerce, marketplace, consumer, b2b, other)

### Business Metrics
- **funding_status**: Current funding stage (idea, bootstrapped, pre-seed, seed, series-a, series-b+, profitable)
- **revenue_range**: Annual revenue (pre-revenue, 0-10k, 10k-50k, 50k-100k, 100k-500k, 500k-1m, 1m+)
- **team_size**: Current team size (solo, 2-5, 5-10, 10-20, 20-50, 50+)

### Motivation & Goals
- **why_join**: Detailed explanation of why they want to join (required, affects AI score)
- **biggest_challenge**: Primary challenge (speed, technical, team, product, funding, ai, scaling, other)
- **current_tools**: Current tech stack/tools being used
- **timeline**: Timeline to launch (immediately, 1-month, 3-months, 6-months, exploring)
- **referral_source**: How they heard about APEX OS

### AI Scoring
- **ai_score**: Calculated score (0-100) based on multiple factors
- **referral_code**: Unique referral code for sharing
- **status**: Lead qualification status (hot, warm, cold, unqualified)

## AI Scoring Algorithm

The AI score is calculated based on:

1. **Experience** (up to 20 points)
   - 5+ years: 20 pts
   - 3-5 years: 15 pts
   - 1-3 years: 10 pts
   - 0-1 years: 5 pts

2. **Company Signals** (up to 25 points)
   - Company name present: 10 pts
   - Company size (50-200 or 200+): 15 pts
   - Company size (10-50): 10 pts
   - Smaller: 5 pts

3. **Professional Signals** (up to 20 points)
   - Valid LinkedIn URL: 15 pts
   - Phone number provided: 5 pts

4. **Email Domain Quality** (up to 20 points)
   - Custom domain: 20 pts
   - .edu domain: 10 pts
   - Gmail/Yahoo/Hotmail: 5 pts

5. **Motivation Quality** (up to 15 points)
   - Why join > 100 chars: 15 pts
   - Why join > 50 chars: 10 pts
   - Shorter: 5 pts

6. **Business Maturity** (up to 30 points)
   - Bootstrapped/Seed/Series A: 15 pts
   - Revenue $10k+: 15 pts

7. **Team Strength** (up to 10 points)
   - Team size 5-10+: 10 pts

8. **Urgency** (up to 10 points)
   - Timeline: immediately/1-month: 10 pts

**Total possible**: ~140 points (capped at 100)

## Status Classification

- **Hot** (80-100): High priority leads, immediate outreach
- **Warm** (60-79): Good potential, nurture sequence
- **Cold** (40-59): Monitor and educate
- **Unqualified** (0-39): Low priority

## Row Level Security (RLS) Policies

The waitlist table should have these policies:

1. **Public Insert**: Anyone can add themselves to the waitlist
2. **Public Select**: Anyone can view waitlist entries (for public stats)
3. **No Update/Delete**: Waitlist entries cannot be modified after creation

## Testing the Connection

After setting up, test with:

```bash
# Start the dev server
npm run dev

# Navigate to /waitlist and submit a test entry
```

## Monitoring

Track waitlist growth in Supabase Dashboard:
- Total signups
- AI score distribution
- Status breakdown (hot/warm/cold/unqualified)
- Industry distribution
- Funding stage breakdown
- Referral code usage
- Conversion by source

## Backup Strategy

Enable Supabase's automated backups for the waitlist table to prevent data loss.

## Exporting Data

To export waitlist data for analysis:

```sql
-- Export all hot leads
SELECT * FROM waitlist 
WHERE status = 'hot' 
ORDER BY ai_score DESC, created_at DESC;

-- Export by industry
SELECT industry, COUNT(*) as count, AVG(ai_score) as avg_score
FROM waitlist
GROUP BY industry
ORDER BY count DESC;

-- Export by funding status
SELECT funding_status, COUNT(*) as count, AVG(ai_score) as avg_score
FROM waitlist
GROUP BY funding_status
ORDER BY count DESC;
```
