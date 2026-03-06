# PROJECT_CONTEXT.md — Mentionly

> **Last updated:** 2026-03-06
> **Status:** Architecture Phase — Awaiting Approval

---

## 1. Project Overview

**Product Name:** Mentionly
**Domain:** mentionly.com
**Tagline:** "Turn Reddit Into Your #1 Growth Channel"

**What it is:** An AI-powered Reddit organic marketing platform that helps businesses get mentioned in Reddit threads that rank on Google and get cited by AI chatbots — without managing Reddit accounts, without risking bans, and without spending hours monitoring subreddits.

**Core capabilities:**
1. **Thread Discovery Engine** — AI scans Reddit to find high-value threads (Google-ranking, buying intent, competitor mentions) and scores them
2. **AI Comment & Post Generation** — Drafts natural, non-spammy Reddit comments that mention the user's product
3. **Managed Account Network** — Posts through aged, high-karma Reddit accounts (operational — not built in MVP frontend, but dashboard references it)
4. **Smart Upvote Boosting** — Gradual, natural upvote delivery (operational — dashboard references it)
5. **Analytics Dashboard** — Track comment visibility, ranking position, upvotes, estimated traffic
6. **LLM/AI Visibility Tracking** — Monitor whether the user's brand appears in AI-generated search results

**Target users:** E-commerce brands, SaaS founders, affiliate marketers, marketing agencies, indie hackers

**MVP scope:**
- Full marketing website (public)
- Real authentication (Supabase Auth)
- Real dashboard with all pages (real data flow, seed/demo data)
- Real Supabase database (full schema, RLS, seed data)
- Real n8n workflows (thread discovery, waitlist, alerts, analytics)
- Waitlist capture fully wired
- **Stripe/payments deferred** — pricing shows tiers, CTAs go to waitlist

---

## 2. Tech Stack

| Layer | Technology | Version/Notes |
|---|---|---|
| **Framework** | Next.js (App Router) | 14+ with TypeScript |
| **Styling** | Tailwind CSS | v3.4+ |
| **UI Components** | shadcn/ui + Radix UI | Dashboard components |
| **Icons** | Lucide React | Consistent icon set |
| **Animations** | Framer Motion | Subtle scroll/hover animations |
| **Charts** | Recharts | Dashboard analytics |
| **Auth** | Supabase Auth (@supabase/ssr) | Email/password, Google OAuth, Magic Links |
| **Database** | Supabase PostgreSQL | With RLS policies |
| **ORM/Query** | Supabase JS Client | No separate ORM |
| **Email** | Resend | Transactional emails via n8n |
| **Hosting** | Vercel Pro | Auto-deploy from GitHub |
| **Automation** | n8n Pro | Webhooks + cron workflows |
| **Package Manager** | pnpm | Fastest, disk-efficient |
| **Payments** | Stripe (DEFERRED) | Stubbed in MVP |

---

## 3. Folder Structure

```
mentionly-v2/
├── PROJECT_CONTEXT.md              # This file
├── README.md                       # Deployment & setup instructions
├── tasks/                          # Atomic task cards (markdown)
├── workflows/                      # n8n workflow JSON exports + specs
├── supabase/
│   ├── migrations/                 # SQL migration files (ordered)
│   │   ├── 001_create_profiles.sql
│   │   ├── 002_create_projects.sql
│   │   ├── 003_create_threads.sql
│   │   ├── 004_create_comments.sql
│   │   ├── 005_create_analytics.sql
│   │   ├── 006_create_competitors.sql
│   │   ├── 007_create_waitlist.sql
│   │   ├── 008_create_alerts.sql
│   │   ├── 009_create_credits.sql
│   │   └── 010_seed_data.sql
│   └── config.toml                 # Local Supabase config
├── public/
│   ├── favicon.ico
│   ├── og-image.png                # OpenGraph image
│   └── images/                     # Static images/illustrations
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, metadata)
│   │   ├── page.tsx                # Marketing homepage
│   │   ├── pricing/
│   │   │   └── page.tsx            # Dedicated pricing page
│   │   ├── blog/
│   │   │   └── page.tsx            # Blog placeholder
│   │   ├── login/
│   │   │   └── page.tsx            # Login page
│   │   ├── signup/
│   │   │   └── page.tsx            # Signup page
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts        # Supabase Auth callback handler
│   │   ├── dashboard/
│   │   │   ├── layout.tsx          # Dashboard layout (sidebar, topbar)
│   │   │   ├── page.tsx            # Dashboard overview
│   │   │   ├── discover/
│   │   │   │   └── page.tsx        # Thread discovery
│   │   │   ├── comments/
│   │   │   │   └── page.tsx        # My comments
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx        # Analytics & reports
│   │   │   └── settings/
│   │   │       └── page.tsx        # Account settings
│   │   └── api/
│   │       ├── waitlist/
│   │       │   └── route.ts        # Waitlist email capture
│   │       └── n8n/
│   │           └── webhook/
│   │               └── route.ts    # n8n webhook receiver
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── marketing/              # Marketing page sections
│   │   │   ├── navbar.tsx
│   │   │   ├── hero.tsx
│   │   │   ├── trust-bar.tsx
│   │   │   ├── features-bento.tsx
│   │   │   ├── how-it-works.tsx
│   │   │   ├── testimonials.tsx
│   │   │   ├── pricing-section.tsx
│   │   │   ├── faq.tsx
│   │   │   ├── cta-section.tsx
│   │   │   └── footer.tsx
│   │   └── dashboard/              # Dashboard components
│   │       ├── sidebar.tsx
│   │       ├── topbar.tsx
│   │       ├── stat-card.tsx
│   │       ├── activity-feed.tsx
│   │       ├── thread-card.tsx
│   │       ├── comment-card.tsx
│   │       ├── charts/
│   │       │   ├── traffic-chart.tsx
│   │       │   ├── subreddit-chart.tsx
│   │       │   └── upvote-chart.tsx
│   │       └── settings/
│   │           ├── account-form.tsx
│   │           ├── keywords-form.tsx
│   │           └── notifications-form.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser Supabase client
│   │   │   ├── server.ts           # Server Supabase client
│   │   │   └── middleware.ts        # Auth middleware helper
│   │   ├── utils.ts                # Utility functions (cn, formatDate, etc.)
│   │   └── constants.ts            # App-wide constants (plan tiers, etc.)
│   ├── hooks/
│   │   ├── use-user.ts             # Current user hook
│   │   └── use-threads.ts          # Thread data hook
│   └── types/
│       ├── database.ts             # Supabase-generated types
│       └── index.ts                # Shared app types
├── middleware.ts                    # Next.js middleware (auth protection)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── package.json
└── .env.local.example              # Template for environment variables
```

---

## 4. Naming Conventions

| Element | Convention | Example |
|---|---|---|
| **Files/folders** | kebab-case | `features-bento.tsx`, `stat-card.tsx` |
| **React components** | PascalCase | `FeaturesBento`, `StatCard` |
| **Functions/hooks** | camelCase | `useUser`, `formatDate` |
| **Constants** | UPPER_SNAKE_CASE | `PLAN_TIERS`, `MAX_CREDITS` |
| **CSS classes** | Tailwind utility classes | No custom CSS files |
| **Database tables** | snake_case (plural) | `threads`, `comments`, `credit_transactions` |
| **Database columns** | snake_case | `created_at`, `google_rank` |
| **API routes** | kebab-case paths | `/api/waitlist`, `/api/n8n/webhook` |
| **Environment vars** | UPPER_SNAKE_CASE | `NEXT_PUBLIC_SUPABASE_URL` |

---

## 5. Coding Style

### General Rules
- TypeScript strict mode enabled
- Functional components only (no class components)
- Named exports for components, default exports only for page.tsx files
- No `any` types — use proper typing or `unknown` with type guards
- Use `const` by default, `let` only when reassignment needed
- Prefer early returns over nested conditionals
- No comments unless logic is non-obvious

### Component Patterns
- Server Components by default (Next.js App Router)
- `"use client"` only when needed (interactivity, hooks, browser APIs)
- Props interfaces defined inline or co-located (not in separate files unless shared)
- Composition over prop drilling — use React Context sparingly

### Imports
- Absolute imports via `@/` alias (maps to `src/`)
- Group imports: React → Next.js → external libs → internal modules → types
- No barrel exports (index.ts re-exports) — import directly from source files

### Tailwind
- Use `cn()` utility (clsx + tailwind-merge) for conditional classes
- No `@apply` in CSS — keep everything in JSX
- Design tokens defined in `tailwind.config.ts` (colors, fonts, spacing)
- Responsive: mobile-first (`sm:`, `md:`, `lg:`, `xl:`)

---

## 6. Design System

### Color Palette

```
Primary (Orange):
  50:  #FFF7ED
  100: #FFEDD5
  200: #FED7AA
  300: #FDBA74
  400: #FB923C
  500: #F97316  ← Main accent
  600: #EA580C
  700: #C2410C
  800: #9A3412
  900: #7C2D12

Neutral (Gray):
  50:  #F9FAFB
  100: #F3F4F6
  200: #E5E7EB
  300: #D1D5DB
  400: #9CA3AF
  500: #6B7280  ← Body text
  600: #4B5563
  700: #374151
  800: #1F2937
  900: #111827  ← Headlines

Background:
  page:    #FFFFFF
  section: #F9FAFB
  card:    #FFFFFF

Gradient (Hero/Sections):
  Warm radial: radial-gradient(circle at 50% 50%, #FFF7ED 0%, #FFEDD5 25%, #FFFFFF 60%)
  Testimonial: linear-gradient(180deg, #FFEDD5 0%, #FFFFFF 100%)

Status:
  success: #22C55E
  warning: #EAB308
  error:   #EF4444
  info:    #3B82F6
```

### Typography

```
Font Family:
  Headlines: "Plus Jakarta Sans", sans-serif (Google Fonts)
  Body:      "Inter", sans-serif (Google Fonts — next/font optimized)
  Mono:      "JetBrains Mono", monospace (code/API elements)

Scale:
  hero-title:    64px / 700 weight / -0.02em tracking / 1.1 line-height
  section-title: 42px / 700 weight / -0.02em tracking / 1.2 line-height
  card-title:    22px / 600 weight / normal tracking / 1.3 line-height
  body-lg:       18px / 400 weight / normal / 1.75 line-height
  body:          16px / 400 weight / normal / 1.7 line-height
  body-sm:       14px / 400 weight / normal / 1.6 line-height
  caption:       12px / 500 weight / 0.05em tracking / 1.5 line-height

  Mobile overrides:
    hero-title:    36px
    section-title: 28px
```

### Spacing Scale

```
Using Tailwind default scale (rem-based):
  section-y:  py-20 (80px) → py-16 on mobile
  section-x:  px-6 (24px) with max-w-7xl (1280px) container
  card-pad:   p-6 (24px) → p-4 on mobile
  gap-grid:   gap-6 (24px) for bento grid
  gap-stack:  space-y-4 (16px) for stacked elements
```

### Border & Shadow

```
Border radius:
  button:  rounded-lg (8px)
  card:    rounded-2xl (16px)
  badge:   rounded-full (9999px)
  input:   rounded-lg (8px)

Shadows:
  card:       shadow-sm (0 1px 2px rgba(0,0,0,0.05))
  card-hover: shadow-md (0 4px 6px rgba(0,0,0,0.07))
  floating:   shadow-lg (0 10px 15px rgba(0,0,0,0.1))
  stat-badge: shadow-xl (0 20px 25px rgba(0,0,0,0.1))

Borders:
  card:  border border-gray-200
  input: border border-gray-300 focus:border-orange-500 focus:ring-orange-500
```

### Animation Tokens (Framer Motion)

```
Scroll reveal (fade up):
  initial:  { opacity: 0, y: 30 }
  animate:  { opacity: 1, y: 0 }
  transition: { duration: 0.6, ease: "easeOut" }
  viewport: { once: true, margin: "-100px" }

Stagger children:
  staggerChildren: 0.1

Hover scale:
  whileHover: { scale: 1.02 }
  transition: { duration: 0.2 }

Card hover:
  whileHover: { y: -4, shadow increases }
```

---

## 7. Page Map & Routing

### Public Pages (Marketing)
| Route | Purpose |
|---|---|
| `/` | Marketing homepage (hero → features → how it works → testimonials → pricing → FAQ → CTA → footer) |
| `/pricing` | Dedicated pricing page with full tier comparison + FAQ |
| `/blog` | Blog placeholder page ("Coming soon") |
| `/login` | Login form (Supabase Auth) |
| `/signup` | Registration form (Supabase Auth) |
| `/auth/callback` | Supabase OAuth redirect handler (route handler, not page) |

### Protected Pages (Dashboard)
| Route | Purpose |
|---|---|
| `/dashboard` | Overview: stat cards, activity feed, quick actions, traffic chart |
| `/dashboard/discover` | Thread discovery: search, filters, scored thread list, generate comment action |
| `/dashboard/comments` | Comment management: tabs (All/Pending/Live/Scheduled/Failed), comment cards |
| `/dashboard/analytics` | Charts: traffic over time, top subreddits, brand mentions, competitor activity |
| `/dashboard/settings` | Account, keywords, notifications, team (stubbed), billing (stubbed), API (stubbed) |

### API Routes
| Route | Purpose |
|---|---|
| `/api/waitlist` | POST — capture email → insert to Supabase `waitlist` table |
| `/api/n8n/webhook` | POST — receive n8n webhook payloads (thread updates, analytics) |

---

## 8. Supabase Database Schema

### Table: `profiles`
Extends Supabase `auth.users`. Created via trigger on user signup.

```sql
CREATE TABLE public.profiles (
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
```

### Table: `projects`
A user's brand/product configuration.

```sql
CREATE TABLE public.projects (
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
```

### Table: `threads`
Discovered Reddit threads.

```sql
CREATE TABLE public.threads (
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
  google_rank INTEGER,                  -- Position in Google SERP (null if not ranking)
  estimated_traffic INTEGER DEFAULT 0,  -- Monthly estimated visits
  buying_intent TEXT DEFAULT 'low' CHECK (buying_intent IN ('low', 'medium', 'high')),
  freshness_score REAL DEFAULT 0,       -- 0-1, higher = fresher
  overall_score REAL DEFAULT 0,         -- Composite score (0-100)
  links_allowed BOOLEAN DEFAULT true,
  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'commented', 'skipped')),
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, reddit_thread_id)
);

CREATE INDEX idx_threads_project_status ON threads(project_id, status);
CREATE INDEX idx_threads_overall_score ON threads(overall_score DESC);
```

### Table: `comments`
Generated and posted comments.

```sql
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  thread_id UUID NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- Content
  body TEXT NOT NULL,
  ai_generated BOOLEAN DEFAULT true,
  ai_prompt TEXT,
  edited_body TEXT,                      -- User's edited version (null if unedited)
  -- Posting
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'scheduled', 'live', 'failed', 'deleted')),
  posted_via TEXT,                       -- Account identifier (anonymized)
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

CREATE INDEX idx_comments_project_status ON comments(project_id, status);
CREATE INDEX idx_comments_user ON comments(user_id);
```

### Table: `analytics`
Aggregated metrics per project per day.

```sql
CREATE TABLE public.analytics (
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
```

### Table: `competitors`
Tracked competitor brands per project.

```sql
CREATE TABLE public.competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  website_url TEXT,
  brand_keywords TEXT[] DEFAULT '{}',
  mention_count INTEGER DEFAULT 0,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Table: `waitlist`
Pre-launch email captures.

```sql
CREATE TABLE public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'website',
  referrer TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Table: `alerts`
Notification configuration and history.

```sql
CREATE TABLE public.alerts (
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
```

### Table: `credit_transactions`
Credit usage and purchase history.

```sql
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'subscription_grant', 'comment_used', 'post_used', 'upvote_used', 'refund')),
  amount INTEGER NOT NULL,              -- Positive for credits in, negative for credits out
  balance_after INTEGER NOT NULL,
  description TEXT,
  reference_id UUID,                    -- Links to comment/thread/etc
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_credit_tx_user ON credit_transactions(user_id, created_at DESC);
```

### Row Level Security (RLS)

All tables have RLS enabled. Policies follow this pattern:

```sql
-- profiles: users can read/update only their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- projects: users can CRUD only their own
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own projects" ON projects FOR ALL USING (auth.uid() = user_id);

-- threads: users can read threads belonging to their projects
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own threads" ON threads FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own threads" ON threads FOR UPDATE
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- comments: users can CRUD comments they own
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own comments" ON comments FOR ALL USING (auth.uid() = user_id);

-- analytics: users can read analytics for their projects
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own analytics" ON analytics FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- competitors: users can CRUD competitors in their projects
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own competitors" ON competitors FOR ALL
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- waitlist: insert-only for anonymous, read for service role only
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert waitlist" ON waitlist FOR INSERT WITH CHECK (true);

-- alerts: users can read/update their own alerts
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own alerts" ON alerts FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own alerts" ON alerts FOR UPDATE
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- credit_transactions: users can read their own
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own transactions" ON credit_transactions FOR SELECT
  USING (auth.uid() = user_id);
```

### Trigger: Auto-create profile on signup

```sql
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
```

### Trigger: Auto-update `updated_at`

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 9. Auth Configuration

### Supabase Auth Setup
- **Providers:** Email/Password + Google OAuth + Magic Links
- **Email confirmation:** Enabled (redirect to `/auth/callback`)
- **Redirect URLs:**
  - Production: `https://mentionly.com/auth/callback`
  - Preview: `https://*.vercel.app/auth/callback`
  - Local: `http://localhost:3000/auth/callback`
- **Password requirements:** Minimum 8 characters

### Next.js Middleware
- Protects all `/dashboard/*` routes
- Redirects unauthenticated users to `/login`
- Uses `@supabase/ssr` for cookie-based session management

---

## 10. n8n Workflow Architecture

### Workflow 1: Waitlist Welcome
- **Trigger:** Webhook (POST from `/api/waitlist`)
- **Flow:** Receive email → validate → check duplicate in Supabase → insert to waitlist table → send welcome email via Resend
- **File:** `workflows/waitlist-welcome.json`

### Workflow 2: Reddit Thread Discovery
- **Trigger:** Cron (every 6 hours)
- **Flow:** Fetch active projects from Supabase → for each project, query Reddit API with target keywords → score threads (freshness, subreddit authority, buying intent) → upsert to threads table → create alerts for high-score threads
- **File:** `workflows/reddit-thread-discovery.json`

### Workflow 3: Alert Dispatcher
- **Trigger:** Cron (daily at 09:00 UTC+1)
- **Flow:** Query unread alerts grouped by user → compile digest → send email via Resend → mark alerts as delivered
- **File:** `workflows/alert-dispatcher.json`

### Workflow 4: Analytics Aggregator
- **Trigger:** Cron (every 12 hours)
- **Flow:** For each active project → count today's threads, comments, upvotes → aggregate metrics → upsert to analytics table
- **File:** `workflows/analytics-aggregator.json`

### Workflow 5: Comment Status Updater
- **Trigger:** Cron (every 2 hours)
- **Flow:** Fetch comments with status 'live' → check Reddit API for current upvote count → update comment metrics in Supabase
- **File:** `workflows/comment-status-updater.json`

### Workflow 6: Stripe Webhook Handler (DEFERRED)
- **Purpose spec only** — will be built when payments are activated
- **File:** `workflows/stripe-webhook-handler.spec.md`

### All workflows:
- Connect to Supabase via REST API using `service_role` key (bypasses RLS)
- Use environment variables for API keys (never hardcoded)
- Include error handling nodes with retry logic
- Log all operations for debugging

---

## 11. Vercel Configuration

### Environment Variables (.env.local.example)
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Stripe (DEFERRED)
# STRIPE_SECRET_KEY=sk_live_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# n8n
N8N_WEBHOOK_BASE_URL=https://your-n8n-instance.com
N8N_WEBHOOK_SECRET=your-shared-secret

# App
NEXT_PUBLIC_APP_URL=https://mentionly.com
NEXT_PUBLIC_APP_NAME=Mentionly

# Email (via n8n — no direct integration needed in Next.js)
# RESEND_API_KEY=re_...
```

### Build Settings
- Framework: Next.js (auto-detected)
- Build command: `pnpm build`
- Output directory: `.next`
- Install command: `pnpm install`
- Node.js version: 20.x

### Middleware
- `/middleware.ts` at project root
- Protects `/dashboard/*` routes only
- Passes through all other routes

---

## 12. Seed Data

The MVP ships with realistic demo data so the dashboard looks populated immediately:

- **1 demo project:** "AcmeWatch" (fictional luxury watch brand)
- **25 discovered threads** across r/watches, r/BuyItForLife, r/malefashionadvice, etc.
- **10 generated comments** in various statuses (draft, pending, live, scheduled)
- **30 days of analytics data** with realistic growth curves
- **3 competitors** (Rolex, Omega, Tissot)
- **5 alerts** (mix of read/unread)
- **Credit transaction history** showing grants and usage

---

## 13. SEO & Meta

### Default Meta Tags
```
title: "Mentionly — AI-Powered Reddit Marketing Platform"
description: "Discover high-intent Reddit threads, generate natural comments, and get your brand mentioned — all without managing a single Reddit account."
og:image: /og-image.png (1200x630)
og:type: website
og:url: https://mentionly.com
twitter:card: summary_large_image
```

### Per-Page Titles
- `/`: "Mentionly — Turn Reddit Into Your #1 Growth Channel"
- `/pricing`: "Pricing — Mentionly"
- `/login`: "Log In — Mentionly"
- `/signup`: "Sign Up — Mentionly"
- `/dashboard`: "Dashboard — Mentionly"

### Structured Data
- Organization schema on homepage
- SoftwareApplication schema
- FAQ schema on pricing page (for rich snippets)

---

## 14. Rules of the Road

1. **No placeholder text** — every visible string should be final production copy (or clearly marked "[REPLACE]")
2. **Mobile-first** — write mobile styles first, add breakpoints up
3. **Accessibility** — proper ARIA labels, keyboard navigation, color contrast (4.5:1 minimum)
4. **Performance** — use Next.js Image component, lazy load below-fold content, minimize client-side JS
5. **No `console.log`** in production code
6. **Error boundaries** — wrap dashboard pages in error boundaries
7. **Loading states** — every async data fetch shows a skeleton/spinner
8. **Empty states** — every list/grid has a designed empty state with CTA
9. **Toast notifications** — use sonner for success/error feedback
10. **Form validation** — use react-hook-form + zod for all forms
