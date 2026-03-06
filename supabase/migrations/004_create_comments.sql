-- Migration 004: Create comments table
-- Generated and posted comments

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  thread_id UUID NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- Content
  body TEXT NOT NULL,
  ai_generated BOOLEAN DEFAULT true,
  ai_prompt TEXT,
  edited_body TEXT,
  -- Posting
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'scheduled', 'live', 'failed', 'deleted')),
  posted_via TEXT,
  posted_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  reddit_comment_id TEXT,
  -- Metrics
  upvotes INTEGER DEFAULT 0,
  boost_upvotes_requested INTEGER DEFAULT 0,
  boost_upvotes_delivered INTEGER DEFAULT 0,
  -- Cost
  credits_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_comments_project_status ON comments(project_id, status);
CREATE INDEX idx_comments_user ON comments(user_id);

-- RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own comments" ON comments FOR ALL USING (auth.uid() = user_id);

-- Trigger: auto-update updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
