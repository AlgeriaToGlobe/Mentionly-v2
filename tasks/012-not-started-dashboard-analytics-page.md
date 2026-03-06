# Task 012: Dashboard - Analytics Page

## Status
not-started

## Depends On
009

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting.

## Objective
Build the analytics page with interactive Recharts visualizations, date range filtering, brand mention tracking, and competitor activity insights, all powered by Supabase data.

## Scope
- Files to create or modify:
  - `src/app/dashboard/analytics/page.tsx`
  - `src/components/dashboard/charts/traffic-chart.tsx`
  - `src/components/dashboard/charts/subreddit-chart.tsx`
  - `src/components/dashboard/charts/upvote-chart.tsx`
- Files NOT to touch:
  - `src/app/dashboard/layout.tsx` (already exists from task 009)
  - `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts` (already exist from task 002)
  - Marketing page components

## Acceptance Criteria
- [ ] `src/app/dashboard/analytics/page.tsx` exists and renders at `/dashboard/analytics`
- [ ] `src/components/dashboard/charts/traffic-chart.tsx` exists as a named export
- [ ] `src/components/dashboard/charts/subreddit-chart.tsx` exists as a named export
- [ ] `src/components/dashboard/charts/upvote-chart.tsx` exists as a named export
- [ ] Date range picker at top with preset buttons (7d, 30d, 90d) and custom date range option
- [ ] Line chart showing traffic/clicks over time with orange line (`#F97316`) and filled area gradient
- [ ] Line chart showing comments placed over time
- [ ] Horizontal bar chart showing top performing subreddits by comment count or upvotes
- [ ] Brand mention feed as a scrollable list with subreddit name, thread title, and date
- [ ] Competitor activity section as a table with competitor name, mention count, and trend indicator (up/down arrow with green/red color)
- [ ] All charts use the orange accent color (`#F97316`) as primary color
- [ ] Data fetched from Supabase `analytics`, `comments`, `threads`, and `competitors` tables
- [ ] Loading skeletons display while chart data is being fetched
- [ ] Empty states render when no data is available for a given date range
- [ ] Page is responsive: charts stack vertically on mobile, 2-column grid on desktop
- [ ] Recharts `ResponsiveContainer` used so charts resize properly

## Instructions

### Step 1: Create the TrafficChart component
Create `src/components/dashboard/charts/traffic-chart.tsx`:
1. Mark as `"use client"` (Recharts requires client-side rendering).
2. Accept props: `data: Array<{ date: string; clicks: number }>`, `isLoading: boolean`.
3. Use Recharts `ResponsiveContainer`, `LineChart`, `Line`, `XAxis`, `YAxis`, `Tooltip`, `CartesianGrid`.
4. Line color: `#F97316` (orange-500). Add an area fill with a gradient from `#F9731620` to transparent.
5. XAxis formatted as short date (e.g., "Mar 1"). YAxis auto-scaled.
6. Custom tooltip with white background, border, and formatted values.
7. When `isLoading`, render a skeleton placeholder matching the chart dimensions.

### Step 2: Create the SubredditChart component
Create `src/components/dashboard/charts/subreddit-chart.tsx`:
1. Mark as `"use client"`.
2. Accept props: `data: Array<{ subreddit: string; count: number }>`, `isLoading: boolean`.
3. Use Recharts `ResponsiveContainer`, `BarChart` (with `layout="vertical"`), `Bar`, `XAxis`, `YAxis`, `Tooltip`.
4. Bar fill color: `#F97316`. Rounded bar corners.
5. YAxis shows subreddit names (e.g., "r/watches"). XAxis shows count.
6. Sort data by count descending, limit to top 10.

### Step 3: Create the UpvoteChart component
Create `src/components/dashboard/charts/upvote-chart.tsx`:
1. Mark as `"use client"`.
2. Accept props: `data: Array<{ date: string; upvotes: number; comments: number }>`, `isLoading: boolean`.
3. Use Recharts `ResponsiveContainer`, `LineChart` with two `Line` elements.
4. Upvotes line: `#F97316` (orange). Comments line: `#3B82F6` (blue/info).
5. Include a Recharts `Legend` component.

### Step 4: Create the Analytics page
Create `src/app/dashboard/analytics/page.tsx`:
1. Mark as `"use client"`.
2. Export default function `AnalyticsPage`.
3. **Date Range Picker**: Render preset buttons (7d, 30d, 90d) as a button group at the top right. Use state to track selected range. Calculate `startDate` and `endDate` from the selection. Optionally add a custom date range picker using two date inputs.
4. **Data Fetching**: On mount and range change, fetch from Supabase:
   - `analytics` table: filter by `project_id` and `date` within range, order by `date` ascending
   - `threads` table: for brand mention feed (threads where title or subreddit matches brand keywords)
   - `competitors` table: for competitor activity section
5. **Layout**: Use a responsive grid:
   - Top row: date range picker spanning full width
   - Second row: TrafficChart (clicks over time) — full width or `col-span-2`
   - Third row: UpvoteChart (upvotes + comments over time) and SubredditChart side-by-side (`grid-cols-1 lg:grid-cols-2 gap-6`)
   - Fourth section: Brand Mention Feed — a scrollable card with a list of mentions, each showing subreddit badge, thread title (truncated), and date
   - Fifth section: Competitor Activity Table — using shadcn Table components with columns: Competitor, Mentions, Trend (TrendingUp/TrendingDown icon with green/red color)

### Step 5: Implement empty and loading states
1. Each chart component handles its own loading skeleton internally.
2. If the analytics query returns zero rows for the selected range, show an empty state card: "No data for this period. Analytics will populate as your comments go live."
3. Brand mention feed empty state: "No brand mentions detected yet."
4. Competitor table empty state: "Add competitors in Settings to track their activity."

### Step 6: Polish
1. Wrap each chart in a card container with `rounded-2xl border border-gray-200 p-6` and a title heading.
2. Add page title "Analytics" with subtitle "Track your Reddit marketing performance."
3. Ensure charts are fully responsive using `ResponsiveContainer` with `width="100%"` and a fixed `height` (e.g., 300-400px).
4. Verify no layout shifts when charts load.
