-- Migration 006: Create competitors table
-- Tracked competitor brands per project

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

-- RLS
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own competitors" ON competitors FOR ALL
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));
