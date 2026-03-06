"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThreadCard } from "@/components/dashboard/thread-card";
import type { Thread } from "@/types";

const DEMO_THREADS: Thread[] = [
  {
    id: "t1",
    project_id: "p1",
    reddit_thread_id: "abc123",
    subreddit: "r/watches",
    title: "Best watches under $500 for daily wear?",
    url: "https://reddit.com/r/watches/comments/abc123",
    author: "watchlover42",
    score: 287,
    num_comments: 145,
    created_utc: "2026-03-01T10:00:00Z",
    google_rank: 3,
    estimated_traffic: 4200,
    buying_intent: "high",
    freshness_score: 0.85,
    overall_score: 92,
    links_allowed: true,
    status: "new",
    discovered_at: "2026-03-05T08:00:00Z",
  },
  {
    id: "t2",
    project_id: "p1",
    reddit_thread_id: "def456",
    subreddit: "r/BuyItForLife",
    title: "What's the most durable watch you've ever owned?",
    url: "https://reddit.com/r/BuyItForLife/comments/def456",
    author: "bifl_fan",
    score: 523,
    num_comments: 312,
    created_utc: "2026-02-28T14:00:00Z",
    google_rank: 7,
    estimated_traffic: 2800,
    buying_intent: "high",
    freshness_score: 0.72,
    overall_score: 88,
    links_allowed: true,
    status: "new",
    discovered_at: "2026-03-05T08:00:00Z",
  },
  {
    id: "t3",
    project_id: "p1",
    reddit_thread_id: "ghi789",
    subreddit: "r/malefashionadvice",
    title: "Watch recommendations for a new job in finance?",
    url: "https://reddit.com/r/malefashionadvice/comments/ghi789",
    author: "newgrad_2026",
    score: 156,
    num_comments: 89,
    created_utc: "2026-03-03T09:00:00Z",
    google_rank: 12,
    estimated_traffic: 1500,
    buying_intent: "high",
    freshness_score: 0.9,
    overall_score: 85,
    links_allowed: true,
    status: "viewed",
    discovered_at: "2026-03-04T12:00:00Z",
  },
  {
    id: "t4",
    project_id: "p1",
    reddit_thread_id: "jkl012",
    subreddit: "r/EDC",
    title: "What watch do you EDC and why?",
    url: "https://reddit.com/r/EDC/comments/jkl012",
    author: "edc_daily",
    score: 342,
    num_comments: 201,
    created_utc: "2026-02-25T16:00:00Z",
    google_rank: null,
    estimated_traffic: 800,
    buying_intent: "medium",
    freshness_score: 0.55,
    overall_score: 72,
    links_allowed: true,
    status: "new",
    discovered_at: "2026-03-03T10:00:00Z",
  },
  {
    id: "t5",
    project_id: "p1",
    reddit_thread_id: "mno345",
    subreddit: "r/frugalmalefashion",
    title: "Affordable watch brands that don't look cheap",
    url: "https://reddit.com/r/frugalmalefashion/comments/mno345",
    author: "budget_style",
    score: 198,
    num_comments: 134,
    created_utc: "2026-03-02T11:00:00Z",
    google_rank: 5,
    estimated_traffic: 3100,
    buying_intent: "high",
    freshness_score: 0.8,
    overall_score: 90,
    links_allowed: true,
    status: "new",
    discovered_at: "2026-03-05T06:00:00Z",
  },
  {
    id: "t6",
    project_id: "p1",
    reddit_thread_id: "pqr678",
    subreddit: "r/watches",
    title: "Omega vs Tissot for a first luxury watch?",
    url: "https://reddit.com/r/watches/comments/pqr678",
    author: "luxury_seeker",
    score: 445,
    num_comments: 267,
    created_utc: "2026-02-20T08:00:00Z",
    google_rank: 2,
    estimated_traffic: 5000,
    buying_intent: "high",
    freshness_score: 0.4,
    overall_score: 78,
    links_allowed: true,
    status: "commented",
    discovered_at: "2026-02-28T14:00:00Z",
  },
  {
    id: "t7",
    project_id: "p1",
    reddit_thread_id: "stu901",
    subreddit: "r/BuyItForLife",
    title: "Is Seiko still the go-to budget watch brand?",
    url: "https://reddit.com/r/BuyItForLife/comments/stu901",
    author: "seiko_fan",
    score: 89,
    num_comments: 45,
    created_utc: "2026-03-04T15:00:00Z",
    google_rank: null,
    estimated_traffic: 350,
    buying_intent: "medium",
    freshness_score: 0.92,
    overall_score: 58,
    links_allowed: true,
    status: "new",
    discovered_at: "2026-03-05T09:00:00Z",
  },
  {
    id: "t8",
    project_id: "p1",
    reddit_thread_id: "vwx234",
    subreddit: "r/watches",
    title: "Watch collectors: what's your grail piece?",
    url: "https://reddit.com/r/watches/comments/vwx234",
    author: "collector99",
    score: 712,
    num_comments: 389,
    created_utc: "2026-02-15T12:00:00Z",
    google_rank: 15,
    estimated_traffic: 900,
    buying_intent: "low",
    freshness_score: 0.2,
    overall_score: 42,
    links_allowed: false,
    status: "skipped",
    discovered_at: "2026-02-22T10:00:00Z",
  },
  {
    id: "t9",
    project_id: "p1",
    reddit_thread_id: "yza567",
    subreddit: "r/malefashionadvice",
    title: "Minimalist watches for small wrists?",
    url: "https://reddit.com/r/malefashionadvice/comments/yza567",
    author: "small_wrist_guy",
    score: 167,
    num_comments: 98,
    created_utc: "2026-03-04T08:00:00Z",
    google_rank: 9,
    estimated_traffic: 1800,
    buying_intent: "medium",
    freshness_score: 0.88,
    overall_score: 76,
    links_allowed: true,
    status: "new",
    discovered_at: "2026-03-05T07:00:00Z",
  },
  {
    id: "t10",
    project_id: "p1",
    reddit_thread_id: "bcd890",
    subreddit: "r/frugalmalefashion",
    title: "Black Friday watch deals that are actually worth it",
    url: "https://reddit.com/r/frugalmalefashion/comments/bcd890",
    author: "deal_hunter",
    score: 34,
    num_comments: 22,
    created_utc: "2026-01-15T10:00:00Z",
    google_rank: null,
    estimated_traffic: 120,
    buying_intent: "low",
    freshness_score: 0.1,
    overall_score: 25,
    links_allowed: true,
    status: "skipped",
    discovered_at: "2026-01-20T08:00:00Z",
  },
];

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

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [subredditFilter, setSubredditFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("30d");
  const [intentFilter, setIntentFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      let filtered = [...DEMO_THREADS];

      if (subredditFilter !== "all") {
        filtered = filtered.filter((t) => t.subreddit === subredditFilter);
      }
      if (intentFilter !== "all") {
        filtered = filtered.filter((t) => t.buying_intent === intentFilter);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter((t) =>
          t.title.toLowerCase().includes(q)
        );
      }

      filtered.sort((a, b) => b.overall_score - a.overall_score);
      setThreads(filtered);
      setLoading(false);
    }, 500);

    setLoading(true);
    return () => clearTimeout(timer);
  }, [searchQuery, subredditFilter, timeRange, intentFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">
          Discover Threads
        </h1>
        <p className="text-body-sm text-gray-500 mt-1">
          Find high-value Reddit threads for your brand
        </p>
      </div>

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

      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
          <span className="text-sm font-medium text-orange-700">
            {selectedIds.size} thread{selectedIds.size > 1 ? "s" : ""} selected
          </span>
          <Button size="sm">
            Generate Comments ({selectedIds.size})
          </Button>
          <Button size="sm" variant="outline">
            Mark as Viewed
          </Button>
          <Button size="sm" variant="outline">
            Skip Selected
          </Button>
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

      {!loading && threads.length > 0 && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedIds.size === threads.length && threads.length > 0}
            onChange={() => {
              if (selectedIds.size === threads.length) {
                setSelectedIds(new Set());
              } else {
                setSelectedIds(new Set(threads.map((t) => t.id)));
              }
            }}
            className="h-4 w-4 rounded border-gray-300 text-orange-500"
          />
          <span className="text-sm text-gray-500">
            Select all ({threads.length} threads)
          </span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <ThreadCardSkeleton key={i} />
          ))}
        </div>
      ) : threads.length === 0 ? (
        <div className="text-center py-16">
          <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="font-heading font-semibold text-gray-900 text-lg">
            No threads found
          </h3>
          <p className="text-body-sm text-gray-500 mt-2">
            Try adjusting your filters or search terms.
          </p>
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
              onGenerateComment={() => {
                // Will be implemented with comment generation modal
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
