# Task 010: Dashboard - Thread Discovery Page

## Status
not-started

## Depends On
009

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting.

## Objective
Build the thread discovery page where users search, filter, and browse scored Reddit threads, with the ability to generate comments or perform bulk actions.

## Scope
- Files to create or modify: `src/app/dashboard/discover/page.tsx`, `src/components/dashboard/thread-card.tsx`
- Files NOT to touch: `src/components/marketing/`, `supabase/migrations/`, `src/app/page.tsx`

## Acceptance Criteria
- [ ] `/dashboard/discover` page renders inside the dashboard layout (sidebar + topbar)
- [ ] Page has a search bar at top for keyword search
- [ ] Filter controls: subreddit dropdown (multi-select or single), keyword input, time range selector (24h, 7d, 30d, All), intent level filter (All, Low, Medium, High)
- [ ] Results area shows a list of thread cards
- [ ] Each thread card displays: subreddit badge (colored pill), thread title (linked), upvote count with arrow icon, Google ranking position (or "Not ranked"), estimated monthly traffic, freshness indicator, links-allowed badge (green check or red X), overall score (0-100 with color coding), buying intent level badge
- [ ] Each thread card has a "Generate Comment" primary action button (orange)
- [ ] Thread cards have hover state (slight elevation, shadow-card-hover)
- [ ] Bulk select: checkbox on each card, "Select All" in header
- [ ] Bulk actions bar appears when items selected: "Generate Comments (N)", "Mark as Viewed", "Skip Selected"
- [ ] Empty state: when no threads match filters, show illustration placeholder + "No threads found" message + "Try adjusting your filters" CTA
- [ ] Loading state: skeleton cards while data is being fetched (4-6 skeleton cards with pulsing animation)
- [ ] Data fetched from Supabase `threads` table for the user's active project, or falls back to hardcoded demo data
- [ ] Thread list is sorted by `overall_score` descending by default
- [ ] `pnpm build` passes with no errors

## Instructions

### Step 1: Create `src/components/dashboard/thread-card.tsx`
Mark as `"use client"` (checkbox state, hover interactions).

```tsx
"use client";

import { cn } from "@/lib/utils";
import { Thread } from "@/types";
import { ArrowUp, ExternalLink, Globe, TrendingUp, Clock, Link2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ThreadCardProps {
  thread: Thread;
  selected: boolean;
  onSelect: (id: string) => void;
  onGenerateComment: (id: string) => void;
}

export function ThreadCard({ thread, selected, onSelect, onGenerateComment }: ThreadCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-2xl border p-5 transition-all hover:shadow-card-hover",
      selected ? "border-orange-300 bg-orange-50/30" : "border-gray-200 shadow-card"
    )}>
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(thread.id)}
          className="mt-1.5 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
        />

        <div className="flex-1 min-w-0">
          {/* Top row: subreddit badge + score */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs font-medium">
                {thread.subreddit}
              </Badge>
              <Badge variant="secondary" className={cn(
                "text-xs font-medium",
                thread.buying_intent === "high" && "bg-green-100 text-green-700",
                thread.buying_intent === "medium" && "bg-yellow-100 text-yellow-700",
                thread.buying_intent === "low" && "bg-gray-100 text-gray-600",
              )}>
                {thread.buying_intent} intent
              </Badge>
              {thread.links_allowed ? (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle2 className="h-3 w-3" /> Links OK
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-red-500">
                  <XCircle className="h-3 w-3" /> No links
                </span>
              )}
            </div>

            {/* Overall score */}
            <div className={cn(
              "flex items-center justify-center h-10 w-10 rounded-full font-heading font-bold text-sm",
              thread.overall_score >= 75 && "bg-green-100 text-green-700",
              thread.overall_score >= 50 && thread.overall_score < 75 && "bg-yellow-100 text-yellow-700",
              thread.overall_score < 50 && "bg-gray-100 text-gray-500",
            )}>
              {Math.round(thread.overall_score)}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-heading font-semibold text-gray-900 mb-2 line-clamp-2">
            <a href={thread.url} target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition-colors">
              {thread.title}
              <ExternalLink className="inline ml-1 h-3.5 w-3.5 text-gray-400" />
            </a>
          </h3>

          {/* Metrics row */}
          <div className="flex flex-wrap items-center gap-4 text-body-sm text-gray-500">
            <span className="flex items-center gap-1">
              <ArrowUp className="h-4 w-4" />
              {thread.score} upvotes
            </span>
            {thread.google_rank && (
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                Google #{thread.google_rank}
              </span>
            )}
            <span className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {thread.estimated_traffic?.toLocaleString()} est. visits/mo
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {/* Format freshness or created_utc */}
              {thread.freshness_score > 0.7 ? "Fresh" : thread.freshness_score > 0.3 ? "Recent" : "Older"}
            </span>
          </div>
        </div>

        {/* Generate comment button */}
        <Button
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 text-white flex-shrink-0"
          onClick={() => onGenerateComment(thread.id)}
        >
          Generate Comment
        </Button>
      </div>
    </div>
  );
}
```

### Step 2: Create loading skeleton component
Either inline in the discover page or as a separate component:
```tsx
function ThreadCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-card animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-4 w-4 rounded bg-gray-200 mt-1.5" />
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <div className="h-5 w-20 rounded-full bg-gray-200" />
            <div className="h-5 w-24 rounded-full bg-gray-200" />
          </div>
          <div className="h-5 w-3/4 rounded bg-gray-200" />
          <div className="flex gap-4">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-4 w-28 rounded bg-gray-200" />
          </div>
        </div>
        <div className="h-9 w-36 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
```

### Step 3: Create `src/app/dashboard/discover/page.tsx`
Mark as `"use client"` (filter state, selection state, search interactions).

**Demo data fallback:**
Create an array of 10-15 demo threads matching the Thread type from `src/types/index.ts`. Use realistic data: varied subreddits, titles, scores, intents. This allows the page to render without a live Supabase connection.

**State management:**
```tsx
const [searchQuery, setSearchQuery] = useState("");
const [subredditFilter, setSubredditFilter] = useState<string>("all");
const [timeRange, setTimeRange] = useState<string>("30d");
const [intentFilter, setIntentFilter] = useState<string>("all");
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
const [loading, setLoading] = useState(true);
const [threads, setThreads] = useState<Thread[]>([]);
```

**Data fetching:**
```tsx
useEffect(() => {
  async function fetchThreads() {
    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from("threads")
        .select("*")
        .order("overall_score", { ascending: false });

      if (subredditFilter !== "all") {
        query = query.eq("subreddit", subredditFilter);
      }
      if (intentFilter !== "all") {
        query = query.eq("buying_intent", intentFilter);
      }
      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      setThreads(data ?? []);
    } catch {
      // Fall back to demo data
      setThreads(DEMO_THREADS);
    } finally {
      setLoading(false);
    }
  }

  fetchThreads();
}, [searchQuery, subredditFilter, timeRange, intentFilter]);
```

**Page layout:**
```tsx
<div className="space-y-6">
  {/* Header */}
  <div>
    <h1 className="text-2xl font-heading font-bold text-gray-900">Discover Threads</h1>
    <p className="text-body-sm text-gray-500 mt-1">Find high-value Reddit threads for your brand</p>
  </div>

  {/* Search + Filters bar */}
  <div className="flex flex-col sm:flex-row gap-3">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search threads by keyword..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
    {/* Subreddit filter — use a Select or dropdown */}
    <select
      value={subredditFilter}
      onChange={(e) => setSubredditFilter(e.target.value)}
      className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
    >
      <option value="all">All Subreddits</option>
      <option value="r/watches">r/watches</option>
      <option value="r/BuyItForLife">r/BuyItForLife</option>
      <option value="r/malefashionadvice">r/malefashionadvice</option>
      <option value="r/frugalmalefashion">r/frugalmalefashion</option>
      <option value="r/EDC">r/EDC</option>
    </select>
    {/* Time range filter */}
    <select
      value={timeRange}
      onChange={(e) => setTimeRange(e.target.value)}
      className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
    >
      <option value="24h">Last 24h</option>
      <option value="7d">Last 7 days</option>
      <option value="30d">Last 30 days</option>
      <option value="all">All time</option>
    </select>
    {/* Intent filter */}
    <select
      value={intentFilter}
      onChange={(e) => setIntentFilter(e.target.value)}
      className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
    >
      <option value="all">All Intent</option>
      <option value="high">High Intent</option>
      <option value="medium">Medium Intent</option>
      <option value="low">Low Intent</option>
    </select>
  </div>

  {/* Bulk actions bar (visible when items selected) */}
  {selectedIds.size > 0 && (
    <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
      <span className="text-sm font-medium text-orange-700">
        {selectedIds.size} thread{selectedIds.size > 1 ? "s" : ""} selected
      </span>
      <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
        Generate Comments ({selectedIds.size})
      </Button>
      <Button size="sm" variant="outline">Mark as Viewed</Button>
      <Button size="sm" variant="outline">Skip Selected</Button>
      <Button
        size="sm"
        variant="ghost"
        className="ml-auto text-gray-500"
        onClick={() => setSelectedIds(new Set())}
      >
        Clear Selection
      </Button>
    </div>
  )}

  {/* Select all */}
  {!loading && threads.length > 0 && (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={selectedIds.size === threads.length}
        onChange={() => {
          if (selectedIds.size === threads.length) {
            setSelectedIds(new Set());
          } else {
            setSelectedIds(new Set(threads.map((t) => t.id)));
          }
        }}
        className="h-4 w-4 rounded border-gray-300 text-orange-500"
      />
      <span className="text-sm text-gray-500">Select all ({threads.length} threads)</span>
    </div>
  )}

  {/* Thread list */}
  {loading ? (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => <ThreadCardSkeleton key={i} />)}
    </div>
  ) : threads.length === 0 ? (
    /* Empty state */
    <div className="text-center py-16">
      <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
      <h3 className="font-heading font-semibold text-gray-900 text-lg">No threads found</h3>
      <p className="text-body-sm text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
    </div>
  ) : (
    <div className="space-y-4">
      {threads.map((thread) => (
        <ThreadCard
          key={thread.id}
          thread={thread}
          selected={selectedIds.has(thread.id)}
          onSelect={(id) => {
            setSelectedIds((prev) => {
              const next = new Set(prev);
              if (next.has(id)) next.delete(id);
              else next.add(id);
              return next;
            });
          }}
          onGenerateComment={(id) => {
            // TODO: Open comment generation modal or navigate
            console.log("Generate comment for", id);
          }}
        />
      ))}
    </div>
  )}
</div>
```

### Step 4: Verify
- `pnpm build` passes
- `/dashboard/discover` renders with demo data (or Supabase data if connected)
- Filters update the displayed thread list
- Selecting threads shows the bulk actions bar
- Empty state shows when no threads match
- Loading skeletons display during data fetch
- Thread cards display all required information
- Responsive layout works at all breakpoints
