# Task 015: n8n Webhook API Route

## Status
not-started

## Depends On
002

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting.

## Objective
Create a secure webhook API route that accepts payloads from n8n workflows, validates a shared secret, routes to appropriate handlers based on payload type, and inserts/updates data in Supabase.

## Scope
- Files to create or modify:
  - `src/app/api/n8n/webhook/route.ts` (create)
- Files NOT to touch:
  - `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts` (already exist from task 002)
  - Dashboard components
  - Marketing components
  - Supabase migration files

## Acceptance Criteria
- [ ] `src/app/api/n8n/webhook/route.ts` exists with a POST handler
- [ ] Validates `N8N_WEBHOOK_SECRET` from the `Authorization` header (Bearer token) or a custom `x-webhook-secret` header
- [ ] Returns 401 Unauthorized if the secret is missing or invalid
- [ ] Accepts JSON payloads with a `type` field to route to the appropriate handler
- [ ] Supported payload types: `thread_update`, `analytics_update`, `alert_create`
- [ ] `thread_update` handler: upserts data into the Supabase `threads` table
- [ ] `analytics_update` handler: upserts data into the Supabase `analytics` table
- [ ] `alert_create` handler: inserts a new row into the Supabase `alerts` table
- [ ] All Supabase operations use `service_role` key (bypasses RLS)
- [ ] Returns 200 with `{ success: true }` on successful processing
- [ ] Returns 400 for invalid payload structure (missing type, missing required fields)
- [ ] Returns 422 for unknown payload types
- [ ] Returns 500 for unexpected server errors (with error logged, not exposed to client)

## Instructions

### Step 1: Create the webhook route
Create `src/app/api/n8n/webhook/route.ts`:
1. Import `NextRequest`, `NextResponse` from `next/server`.
2. Import `createClient` from `@supabase/supabase-js` — create a client using `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
3. Define zod schemas for each payload type:
   - **Base schema**: `{ type: z.enum(['thread_update', 'analytics_update', 'alert_create']), data: z.object({...}) }`
   - **thread_update data**: `{ project_id, reddit_thread_id, subreddit, title, url, author, score, num_comments, google_rank, estimated_traffic, buying_intent, freshness_score, overall_score, links_allowed, status }`
   - **analytics_update data**: `{ project_id, date, threads_discovered, comments_posted, total_upvotes, estimated_clicks, brand_mentions, llm_citations }`
   - **alert_create data**: `{ project_id, type (new_thread | brand_mention | competitor_activity | comment_status), title, body, delivered_via }`
4. Export an async `POST` function.

### Step 2: Implement secret validation
1. Read the secret from `request.headers.get('authorization')` (strip "Bearer " prefix) or `request.headers.get('x-webhook-secret')`.
2. Compare against `process.env.N8N_WEBHOOK_SECRET`.
3. If missing or mismatched, return 401: `{ success: false, error: 'Unauthorized' }`.

### Step 3: Implement payload routing
1. Parse the request body as JSON.
2. Validate the `type` field exists.
3. Based on `type`, validate the `data` object against the appropriate zod schema.
4. Route to the handler:
   - `thread_update` → call `handleThreadUpdate(data)`
   - `analytics_update` → call `handleAnalyticsUpdate(data)`
   - `alert_create` → call `handleAlertCreate(data)`
5. For unknown types, return 422: `{ success: false, error: 'Unknown payload type' }`.

### Step 4: Implement handlers
1. **handleThreadUpdate**: Use Supabase `.upsert()` on the `threads` table with conflict on `(project_id, reddit_thread_id)`. Pass all fields from the validated data.
2. **handleAnalyticsUpdate**: Use Supabase `.upsert()` on the `analytics` table with conflict on `(project_id, date)`. Pass all metric fields.
3. **handleAlertCreate**: Use Supabase `.insert()` on the `alerts` table. Set `is_read` to false, `delivered_via` to the provided value or default to `'in_app'`.

### Step 5: Error handling
1. Wrap the entire handler in a try/catch.
2. On Supabase errors, log the error details server-side and return 500 with a generic message.
3. On zod validation errors, return 400 with the validation error details.
4. Never expose internal error details or stack traces in the response.
