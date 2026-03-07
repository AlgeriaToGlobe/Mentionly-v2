-- ============================================================================
-- MENTIONLY — Combined Database Migration
-- Run this entire file in the Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 001: Profiles table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'lite', 'pro', 'max')),
  credits_balance INTEGER NOT NULL DEFAULT 0,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 002: Projects table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  website_url TEXT,
  description TEXT,
  target_keywords TEXT[] DEFAULT '{}',
  target_subreddits TEXT[] DEFAULT '{}',
  brand_names TEXT[] DEFAULT '{}',
  tone TEXT DEFAULT 'helpful' CHECK (tone IN ('helpful', 'casual', 'professional', 'technical', 'witty')),
  custom_instructions TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own projects" ON projects FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 003: Threads table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  reddit_thread_id TEXT NOT NULL,
  subreddit TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  author TEXT,
  score INTEGER DEFAULT 0,
  num_comments INTEGER DEFAULT 0,
  created_utc TIMESTAMPTZ,
  google_rank INTEGER,
  estimated_traffic INTEGER DEFAULT 0,
  buying_intent TEXT DEFAULT 'low' CHECK (buying_intent IN ('low', 'medium', 'high')),
  freshness_score REAL DEFAULT 0,
  overall_score REAL DEFAULT 0,
  links_allowed BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'commented', 'skipped')),
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, reddit_thread_id)
);

CREATE INDEX idx_threads_project_status ON threads(project_id, status);
CREATE INDEX idx_threads_overall_score ON threads(overall_score DESC);

ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own threads" ON threads FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own threads" ON threads FOR UPDATE
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- ============================================================================
-- 004: Comments table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  thread_id UUID NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  ai_generated BOOLEAN DEFAULT true,
  ai_prompt TEXT,
  edited_body TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'scheduled', 'live', 'failed', 'deleted')),
  posted_via TEXT,
  posted_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  reddit_comment_id TEXT,
  upvotes INTEGER DEFAULT 0,
  boost_upvotes_requested INTEGER DEFAULT 0,
  boost_upvotes_delivered INTEGER DEFAULT 0,
  credits_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_project_status ON comments(project_id, status);
CREATE INDEX idx_comments_user ON comments(user_id);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own comments" ON comments FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 005: Analytics table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  threads_discovered INTEGER DEFAULT 0,
  comments_posted INTEGER DEFAULT 0,
  total_upvotes INTEGER DEFAULT 0,
  estimated_clicks INTEGER DEFAULT 0,
  brand_mentions INTEGER DEFAULT 0,
  llm_citations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, date)
);

CREATE INDEX idx_analytics_project_date ON analytics(project_id, date DESC);

ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own analytics" ON analytics FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- ============================================================================
-- 006: Competitors table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  website_url TEXT,
  brand_keywords TEXT[] DEFAULT '{}',
  mention_count INTEGER DEFAULT 0,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own competitors" ON competitors FOR ALL
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- ============================================================================
-- 007: Waitlist table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'website',
  referrer TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert waitlist" ON waitlist FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 008: Alerts table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('new_thread', 'brand_mention', 'competitor_activity', 'comment_status')),
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN DEFAULT false,
  delivered_via TEXT DEFAULT 'in_app' CHECK (delivered_via IN ('in_app', 'email', 'both')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_alerts_project_read ON alerts(project_id, is_read);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own alerts" ON alerts FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own alerts" ON alerts FOR UPDATE
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- ============================================================================
-- 009: Credit Transactions table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'subscription_grant', 'comment_used', 'post_used', 'upvote_used', 'refund')),
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_credit_tx_user ON credit_transactions(user_id, created_at DESC);

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own transactions" ON credit_transactions FOR SELECT
  USING (auth.uid() = user_id);
