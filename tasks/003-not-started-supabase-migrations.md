# Task 003: Supabase Database Migrations

## Status
not-started

## Depends On
none

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting.

## Objective
Create all SQL migration files that define the complete Supabase database schema (tables, indexes, RLS policies, triggers) and seed realistic demo data, matching PROJECT_CONTEXT.md Section 8 exactly.

## Scope
- Files to create: `supabase/migrations/001_create_profiles.sql`, `002_create_projects.sql`, `003_create_threads.sql`, `004_create_comments.sql`, `005_create_analytics.sql`, `006_create_competitors.sql`, `007_create_waitlist.sql`, `008_create_alerts.sql`, `009_create_credits.sql`, `010_seed_data.sql`
- Files NOT to touch: `src/`, `tasks/`, any Next.js files

## Acceptance Criteria
- [ ] All 10 SQL migration files exist in `supabase/migrations/`
- [ ] Each migration is idempotent-safe (uses `CREATE TABLE IF NOT EXISTS` or similar)
- [ ] All table schemas match PROJECT_CONTEXT.md Section 8 exactly (column names, types, constraints, defaults)
- [ ] All CHECK constraints are present (plan, tone, status, buying_intent, type, delivered_via)
- [ ] All indexes are created (idx_threads_project_status, idx_threads_overall_score, idx_comments_project_status, idx_comments_user, idx_analytics_project_date, idx_alerts_project_read, idx_credit_tx_user)
- [ ] All UNIQUE constraints are present (threads: project_id + reddit_thread_id, analytics: project_id + date, waitlist: email)
- [ ] RLS is enabled on all tables with correct policies per PROJECT_CONTEXT.md
- [ ] `handle_new_user()` trigger function creates a profile row on auth.users insert
- [ ] `update_updated_at()` trigger function auto-updates `updated_at` on profiles, projects, comments
- [ ] Seed data includes: 1 demo project ("AcmeWatch"), 25 threads, 10 comments, 30 days analytics, 3 competitors, 5 alerts, credit transactions
- [ ] SQL files can be run in order without errors on a fresh Supabase instance

## Instructions

### Step 1: Create `supabase/migrations/` directory
```bash
mkdir -p supabase/migrations
```

### Step 2: Create `001_create_profiles.sql`
```sql
-- Create profiles table (extends auth.users)
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

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger: auto-create profile on signup
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

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Step 3: Create `002_create_projects.sql`
Copy the `projects` table definition from PROJECT_CONTEXT.md exactly. Include:
- All columns with correct types (TEXT[], CHECK on tone)
- RLS: `ALTER TABLE projects ENABLE ROW LEVEL SECURITY;`
- Policy: `"Users can CRUD own projects" ON projects FOR ALL USING (auth.uid() = user_id)`
- Trigger: `set_updated_at BEFORE UPDATE ON projects`

### Step 4: Create `003_create_threads.sql`
Copy the `threads` table definition exactly. Include:
- All columns including scoring columns (google_rank, estimated_traffic, buying_intent, freshness_score, overall_score, links_allowed)
- CHECK on buying_intent and status
- UNIQUE(project_id, reddit_thread_id)
- Both indexes: `idx_threads_project_status`, `idx_threads_overall_score`
- RLS with SELECT and UPDATE policies (using subquery on projects)

### Step 5: Create `004_create_comments.sql`
Copy the `comments` table definition exactly. Include:
- All columns including posting and metrics columns
- CHECK on status
- Both indexes: `idx_comments_project_status`, `idx_comments_user`
- RLS: `FOR ALL USING (auth.uid() = user_id)`
- Trigger: `set_updated_at BEFORE UPDATE ON comments`

### Step 6: Create `005_create_analytics.sql`
Copy exactly. Include:
- UNIQUE(project_id, date)
- Index: `idx_analytics_project_date`
- RLS with SELECT policy (subquery on projects)

### Step 7: Create `006_create_competitors.sql`
Copy exactly. Include:
- brand_keywords TEXT[] DEFAULT '{}'
- RLS: FOR ALL policy (subquery on projects)

### Step 8: Create `007_create_waitlist.sql`
Copy exactly. Include:
- UNIQUE on email
- RLS: insert-only for anonymous (`FOR INSERT WITH CHECK (true)`)

### Step 9: Create `008_create_alerts.sql`
Copy exactly. Include:
- CHECK on type and delivered_via
- Index: `idx_alerts_project_read`
- RLS: SELECT and UPDATE policies (subquery on projects)

### Step 10: Create `009_create_credits.sql`
Copy `credit_transactions` exactly. Include:
- CHECK on type
- Index: `idx_credit_tx_user`
- RLS: SELECT policy `USING (auth.uid() = user_id)`

### Step 11: Create `010_seed_data.sql`
Create realistic seed data. Use a fixed demo user UUID (e.g., `'00000000-0000-0000-0000-000000000001'`) with a comment explaining this must match an actual auth.users row or be inserted manually for testing.

**Demo Project — "AcmeWatch":**
```sql
INSERT INTO public.projects (id, user_id, name, website_url, description, target_keywords, target_subreddits, brand_names, tone)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000001',
  'AcmeWatch',
  'https://acmewatch.com',
  'Premium affordable watches for the modern professional',
  ARRAY['best watches under 500', 'affordable luxury watches', 'watch recommendations'],
  ARRAY['r/watches', 'r/BuyItForLife', 'r/malefashionadvice', 'r/frugalmalefashion', 'r/EDC'],
  ARRAY['AcmeWatch', 'Acme Watch', 'acmewatch.com'],
  'helpful'
);
```

**25 Threads:** Generate 25 INSERT statements with varied subreddits (r/watches, r/BuyItForLife, r/malefashionadvice, r/frugalmalefashion, r/EDC), varied scores (overall_score 20-95), varied statuses (new, viewed, commented, skipped), varied buying_intent (low, medium, high), realistic titles like "Best watches under $500?", "Looking for a daily wear watch", etc. Include google_rank values (some null, some 1-50), estimated_traffic (0-5000).

**10 Comments:** Generate 10 INSERT statements with varied statuses (draft, pending, live, scheduled, failed). Each links to a thread. Include realistic comment bodies mentioning AcmeWatch naturally. Set varied upvote counts for live comments.

**30 Days Analytics:** Generate 30 INSERT statements for the last 30 days with realistic growth curves. Start small (2-3 threads/day, 1 comment, 5 upvotes) and grow to (8-10 threads/day, 3 comments, 50+ upvotes). Use `CURRENT_DATE - INTERVAL 'N days'` for dates.

**3 Competitors:**
- Rolex (mention_count: 450)
- Omega (mention_count: 320)
- Tissot (mention_count: 180)

**5 Alerts:** Mix of types (new_thread, brand_mention, competitor_activity, comment_status). 2 read, 3 unread.

**Credit Transactions:** Insert 5-8 transactions showing: initial subscription_grant of 500 credits, then several comment_used (-10 each), one upvote_used (-5), resulting in a final balance that matches the profile's credits_balance. Update the demo profile's credits_balance to match.
