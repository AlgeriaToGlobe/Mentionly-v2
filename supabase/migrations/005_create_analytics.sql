-- Migration 005: Create analytics table
-- Aggregated metrics per project per day

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

-- Indexes
CREATE INDEX idx_analytics_project_date ON analytics(project_id, date DESC);

-- RLS
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own analytics" ON analytics FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));
