-- Migration 003: Create threads table
-- Discovered Reddit threads

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
  -- Scoring
  google_rank INTEGER,
  estimated_traffic INTEGER DEFAULT 0,
  buying_intent TEXT DEFAULT 'low' CHECK (buying_intent IN ('low', 'medium', 'high')),
  freshness_score REAL DEFAULT 0,
  overall_score REAL DEFAULT 0,
  links_allowed BOOLEAN DEFAULT true,
  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'commented', 'skipped')),
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, reddit_thread_id)
);

-- Indexes
CREATE INDEX idx_threads_project_status ON threads(project_id, status);
CREATE INDEX idx_threads_overall_score ON threads(overall_score DESC);

-- RLS
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own threads" ON threads FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own threads" ON threads FOR UPDATE
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));
