# n8n Workflows — Mentionly

## Overview

This directory contains n8n workflow JSON files that power Mentionly's automation layer. Each workflow can be imported directly into your n8n instance.

| Workflow | Trigger | Description |
|----------|---------|-------------|
| `waitlist-welcome.json` | Webhook | Sends a welcome email when a new user joins the waitlist |
| `reddit-thread-discovery.json` | Cron (every 6h) | Scans Reddit for relevant threads, scores them, and creates alerts |
| `alert-dispatcher.json` | Cron (daily 9AM UTC) | Sends digest emails for unread alerts and marks them as delivered |
| `analytics-aggregator.json` | Cron (every 12h) | Aggregates daily metrics per project and upserts to the analytics table |
| `comment-status-updater.json` | Cron (every 2h) | Checks Reddit API for current upvote counts on live comments |

## Prerequisites

- **n8n instance** — Self-hosted or [n8n Cloud](https://n8n.io)
- **Supabase project** — With all migrations applied
- **Resend account** — For transactional emails ([resend.com](https://resend.com))

## Environment Variables

Set these in your n8n instance (Settings → Variables):

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL (e.g., `https://xxx.supabase.co`) | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (bypasses RLS) | Yes |
| `RESEND_API_KEY` | Resend API key for sending emails | Yes |
| `N8N_WEBHOOK_SECRET` | Shared secret for webhook authentication | Yes |

## How to Import

1. Open your n8n instance
2. Go to **Workflows** → **Add Workflow** → **Import from File** (or use the menu)
3. Select the JSON file you want to import (or paste the JSON content)
4. After import, review each node and update any credential references
5. Set environment variables in **Settings** → **Variables**
6. **Activate** the workflow when ready

Alternatively, you can import via the n8n API:

```bash
curl -X POST https://your-n8n.com/api/v1/workflows \
  -H "X-N8N-API-KEY: your-api-key" \
  -H "Content-Type: application/json" \
  -d @workflows/waitlist-welcome.json
```

## Workflow Descriptions

### Waitlist Welcome Email
Triggered via webhook when a user signs up for the waitlist. Validates the email format, then sends a branded welcome email via the Resend API.

### Reddit Thread Discovery
Runs every 6 hours. Fetches all active projects from Supabase, searches Reddit for threads matching each project's target keywords, scores threads based on freshness, buying intent, and engagement, then upserts results to the threads table. High-scoring threads (score > 70) trigger alerts.

### Alert Dispatcher
Runs daily at 9AM UTC. Queries all unread alerts, groups them by user, compiles an HTML digest email per user, sends via Resend, and marks alerts as delivered.

### Analytics Aggregator
Runs every 12 hours. For each active project, counts threads discovered and comments posted today, then upserts a daily analytics record.

### Comment Status Updater
Runs every 2 hours. Fetches all live comments with Reddit IDs, checks the Reddit API for current upvote counts, and updates the comments table. Includes rate limiting (2-second wait between batches of 10).

## Stripe Webhook Handler (Deferred)

See `stripe-webhook-handler.spec.md` for the specification of the Stripe payment workflow, which will be implemented when payments are activated.
