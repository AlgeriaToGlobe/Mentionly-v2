# Task 016: n8n Workflow JSON Files

## Status
not-started

## Depends On
none

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting. See section 10 (n8n Workflow Architecture) for detailed flow descriptions.

## Objective
Create valid, importable n8n workflow JSON files and a spec document for all automation workflows: waitlist welcome, Reddit thread discovery, alert dispatcher, analytics aggregator, comment status updater, and a Stripe webhook handler spec.

## Scope
- Files to create or modify:
  - `workflows/waitlist-welcome.json` (create)
  - `workflows/reddit-thread-discovery.json` (create)
  - `workflows/alert-dispatcher.json` (create)
  - `workflows/analytics-aggregator.json` (create)
  - `workflows/comment-status-updater.json` (create)
  - `workflows/stripe-webhook-handler.spec.md` (create — spec only, no JSON)
  - `workflows/README.md` (create)
- Files NOT to touch:
  - All `src/` files
  - Supabase migration files
  - `PROJECT_CONTEXT.md`

## Acceptance Criteria
- [ ] `workflows/waitlist-welcome.json` is a valid n8n workflow JSON that can be imported directly into n8n
- [ ] Waitlist welcome workflow: webhook trigger -> validate email -> send welcome email via Resend HTTP node
- [ ] `workflows/reddit-thread-discovery.json` is a valid n8n workflow JSON
- [ ] Reddit thread discovery workflow: cron every 6h -> fetch projects from Supabase -> Reddit API search -> score threads -> upsert to Supabase threads table -> create alerts
- [ ] `workflows/alert-dispatcher.json` is a valid n8n workflow JSON
- [ ] Alert dispatcher workflow: daily cron -> query unread alerts -> group by user -> send email digest -> mark delivered
- [ ] `workflows/analytics-aggregator.json` is a valid n8n workflow JSON
- [ ] Analytics aggregator workflow: cron every 12h -> aggregate metrics per project -> upsert analytics table
- [ ] `workflows/comment-status-updater.json` is a valid n8n workflow JSON
- [ ] Comment status updater workflow: cron every 2h -> fetch live comments -> check Reddit API -> update metrics
- [ ] `workflows/stripe-webhook-handler.spec.md` exists as a spec document (no JSON)
- [ ] `workflows/README.md` exists explaining how to import workflows into n8n and configure environment variables
- [ ] All JSON files follow valid n8n export format (with `nodes`, `connections`, `settings` top-level keys)
- [ ] All workflows use environment variables for API keys and secrets (never hardcoded)
- [ ] All workflows include error handling / retry nodes where appropriate

## Instructions

### Step 1: Create the workflows directory structure
Ensure the `workflows/` directory exists at the project root.

### Step 2: Create waitlist-welcome.json
Create `workflows/waitlist-welcome.json`:
1. Use valid n8n workflow JSON export format with: `name`, `nodes`, `connections`, `settings`, `active`.
2. **Node 1 — Webhook Trigger**: Type `n8n-nodes-base.webhook`. Method POST. Path: `/waitlist-welcome`. Receives `{ email, source }` in body.
3. **Node 2 — Validate Email**: Type `n8n-nodes-base.if`. Check that `email` field exists and matches email regex.
4. **Node 3 — Send Welcome Email**: Type `n8n-nodes-base.httpRequest`. POST to Resend API (`https://api.resend.com/emails`). Headers: `Authorization: Bearer {{$env.RESEND_API_KEY}}`. Body: `{ from: "Mentionly <hello@mentionly.com>", to: [email], subject: "Welcome to the Mentionly Waitlist!", html: "..." }`.
5. **Node 4 — Error Handler**: Type `n8n-nodes-base.noOp` connected to the false branch of the IF node.
6. Connect nodes: Webhook -> Validate -> (true) Send Email, (false) Error Handler.

### Step 3: Create reddit-thread-discovery.json
Create `workflows/reddit-thread-discovery.json`:
1. **Node 1 — Cron Trigger**: Type `n8n-nodes-base.scheduleTrigger`. Every 6 hours.
2. **Node 2 — Fetch Projects**: Type `n8n-nodes-base.httpRequest`. GET to Supabase REST API: `{{$env.SUPABASE_URL}}/rest/v1/projects?is_active=eq.true&select=*`. Headers: `apikey: {{$env.SUPABASE_SERVICE_ROLE_KEY}}`, `Authorization: Bearer {{$env.SUPABASE_SERVICE_ROLE_KEY}}`.
3. **Node 3 — Loop Over Projects**: Type `n8n-nodes-base.splitInBatches`. Process each project individually.
4. **Node 4 — Search Reddit**: Type `n8n-nodes-base.httpRequest`. GET to Reddit search API: `https://www.reddit.com/search.json?q={{keywords}}&sort=relevance&t=day&limit=25`. Build query from project's `target_keywords`.
5. **Node 5 — Score Threads**: Type `n8n-nodes-base.code`. JavaScript node that scores each thread based on freshness, subreddit authority, score, and buying intent keywords. Output includes `overall_score`.
6. **Node 6 — Upsert Threads**: Type `n8n-nodes-base.httpRequest`. POST to Supabase REST API: `{{$env.SUPABASE_URL}}/rest/v1/threads` with `Prefer: resolution=merge-duplicates` header. Upsert on `(project_id, reddit_thread_id)`.
7. **Node 7 — Create Alerts**: Type `n8n-nodes-base.httpRequest`. POST to Supabase alerts table for threads with `overall_score > 70`.
8. Include error handling with retry on HTTP nodes (retry on failure: 2 attempts, 5s wait).

### Step 4: Create alert-dispatcher.json
Create `workflows/alert-dispatcher.json`:
1. **Node 1 — Cron Trigger**: Daily at 09:00 UTC.
2. **Node 2 — Query Unread Alerts**: GET from Supabase `alerts` table where `is_read=eq.false` and `delivered_via=in.(in_app,both)`. Join with projects to get user email.
3. **Node 3 — Group by User**: Type `n8n-nodes-base.code`. Group alerts by user_id/email.
4. **Node 4 — Send Digest Email**: Type `n8n-nodes-base.httpRequest`. POST to Resend API. Compile HTML digest with all alerts for that user.
5. **Node 5 — Mark as Delivered**: PATCH to Supabase `alerts` table. Set `delivered_via = 'both'` and `is_read = true` for processed alert IDs.

### Step 5: Create analytics-aggregator.json
Create `workflows/analytics-aggregator.json`:
1. **Node 1 — Cron Trigger**: Every 12 hours.
2. **Node 2 — Fetch Active Projects**: GET from Supabase `projects` table where `is_active=eq.true`.
3. **Node 3 — Loop Over Projects**: Split in batches.
4. **Node 4 — Count Today's Metrics**: Type `n8n-nodes-base.code`. Make multiple Supabase queries: count threads discovered today, count comments posted today, sum upvotes, sum estimated clicks.
5. **Node 5 — Upsert Analytics**: POST to Supabase `analytics` table with `Prefer: resolution=merge-duplicates` on `(project_id, date)`.

### Step 6: Create comment-status-updater.json
Create `workflows/comment-status-updater.json`:
1. **Node 1 — Cron Trigger**: Every 2 hours.
2. **Node 2 — Fetch Live Comments**: GET from Supabase `comments` table where `status=eq.live` and `reddit_comment_id` is not null.
3. **Node 3 — Loop Over Comments**: Split in batches (batch size 10 to respect Reddit rate limits).
4. **Node 4 — Check Reddit API**: Type `n8n-nodes-base.httpRequest`. GET `https://www.reddit.com/api/info.json?id=t1_{{reddit_comment_id}}` to fetch current upvote count.
5. **Node 5 — Update Metrics**: PATCH to Supabase `comments` table. Update `upvotes` field with current Reddit score.
6. Add a 2-second wait between batches to respect Reddit rate limits.

### Step 7: Create stripe-webhook-handler.spec.md
Create `workflows/stripe-webhook-handler.spec.md`:
1. Title: "Stripe Webhook Handler — Specification (DEFERRED)"
2. Document the intended workflow for when Stripe payments are activated:
   - Webhook trigger receiving Stripe events
   - Event types to handle: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
   - For each event: what Supabase tables to update (profiles plan field, credit_transactions)
   - Signature verification using `STRIPE_WEBHOOK_SECRET`
3. Note that this is deferred until payments are activated.

### Step 8: Create workflows/README.md
Create `workflows/README.md`:
1. Title: "n8n Workflows — Mentionly"
2. Sections:
   - **Overview**: Brief description of what each workflow does
   - **Prerequisites**: n8n instance (self-hosted or cloud), Supabase project, Resend account
   - **Environment Variables**: List all required env vars (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `N8N_WEBHOOK_SECRET`)
   - **How to Import**: Step-by-step instructions for importing JSON files into n8n (Settings -> Import Workflow -> paste JSON or upload file)
   - **Configuration**: After import, update credential references and environment variables in each workflow
   - **Workflow Descriptions**: One paragraph per workflow explaining trigger, flow, and output
