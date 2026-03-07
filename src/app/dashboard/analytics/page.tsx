"use client";

import { useEffect, useState } from "react";
import { TrafficChart } from "@/components/dashboard/charts/traffic-chart";
import { SubredditChart } from "@/components/dashboard/charts/subreddit-chart";
import { UpvoteChart } from "@/components/dashboard/charts/upvote-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";
import {
  BarChart3,
  Eye,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DateRange = "7d" | "30d" | "90d";

const DEMO_TRAFFIC = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    clicks: Math.floor(80 + i * 8 + Math.random() * 40),
  };
});

const DEMO_UPVOTES = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    upvotes: Math.floor(10 + i * 3 + Math.random() * 15),
    comments: Math.floor(2 + Math.random() * 5),
  };
});

const DEMO_SUBREDDITS = [
  { subreddit: "r/watches", count: 18 },
  { subreddit: "r/BuyItForLife", count: 12 },
  { subreddit: "r/malefashionadvice", count: 8 },
  { subreddit: "r/frugalmalefashion", count: 6 },
  { subreddit: "r/EDC", count: 3 },
];

const DEMO_MENTIONS = [
  { subreddit: "r/watches", title: "What watch should I get for my wedding?", date: "2 hours ago" },
  { subreddit: "r/BuyItForLife", title: "Watches that last a lifetime?", date: "5 hours ago" },
  { subreddit: "r/EDC", title: "New EDC watch recommendations", date: "1 day ago" },
  { subreddit: "r/malefashionadvice", title: "Best affordable watch brands 2024", date: "2 days ago" },
];

const DEMO_COMPETITORS = [
  { name: "WatchCo", mentions: 42, trend: "up" as const },
  { name: "TimePiece Pro", mentions: 28, trend: "down" as const },
  { name: "ChronoStyle", mentions: 19, trend: "up" as const },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [loading, setLoading] = useState(true);
  const [trafficData, setTrafficData] = useState(DEMO_TRAFFIC);
  const [upvoteData, setUpvoteData] = useState(DEMO_UPVOTES);
  const [subredditData, setSubredditData] = useState(DEMO_SUBREDDITS);
  const [mentions, setMentions] = useState(DEMO_MENTIONS);
  const [competitors, setCompetitors] = useState(DEMO_COMPETITORS);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data: projects } = await supabase
          .from("projects")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);

        if (!projects?.length) {
          setLoading(false);
          return;
        }

        const daysAgo = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);

        const { data: analytics } = await supabase
          .from("analytics")
          .select("*")
          .eq("project_id", projects[0].id)
          .gte("date", startDate.toISOString().split("T")[0])
          .order("date", { ascending: true });

        if (analytics?.length) {
          setTrafficData(analytics.map((a: Record<string, unknown>) => ({
            date: new Date(a.date as string).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            clicks: (a.estimated_clicks as number) || 0,
          })));
          setUpvoteData(analytics.map((a: Record<string, unknown>) => ({
            date: new Date(a.date as string).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            upvotes: (a.total_upvotes as number) || 0,
            comments: (a.comments_posted as number) || 0,
          })));
        }

        const { data: threads } = await supabase
          .from("threads")
          .select("subreddit, title, created_at")
          .eq("project_id", projects[0].id)
          .order("created_at", { ascending: false })
          .limit(20);

        if (threads?.length) {
          const subredditCounts: Record<string, number> = {};
          threads.forEach((t: Record<string, unknown>) => {
            const sub = t.subreddit as string;
            subredditCounts[sub] = (subredditCounts[sub] || 0) + 1;
          });
          setSubredditData(
            Object.entries(subredditCounts).map(([subreddit, count]) => ({ subreddit, count }))
          );
          setMentions(threads.slice(0, 5).map((t: Record<string, unknown>) => ({
            subreddit: t.subreddit as string,
            title: t.title as string,
            date: new Date(t.created_at as string).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          })));
        }

        const { data: comps } = await supabase
          .from("competitors")
          .select("*")
          .eq("project_id", projects[0].id);

        if (comps?.length) {
          setCompetitors(comps.map((c: Record<string, unknown>) => ({
            name: c.name as string,
            mentions: (c.mention_count as number) || 0,
            trend: ((c.mention_count as number) || 0) > 20 ? "up" as const : "down" as const,
          })));
        }
      } catch {
        // Keep demo data on error
      }
      setLoading(false);
    }
    fetchAnalytics();
  }, [dateRange]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Track your Reddit marketing performance.</p>
        </div>
        <div className="flex gap-2">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Impressions" value="45.2K" change="+22% this month" changeType="positive" icon={Eye} />
        <StatCard title="Comments Posted" value={47} change="+12 this month" changeType="positive" icon={MessageSquare} />
        <StatCard title="Brand Mentions" value={156} change="+34 this month" changeType="positive" icon={BarChart3} />
        <StatCard title="AI Citations" value={8} change="+3 this month" changeType="positive" icon={TrendingUp} />
      </div>

      {/* Traffic Chart - Full Width */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-heading font-semibold text-gray-900 mb-4">Traffic Over Time</h3>
        {loading ? (
          <Skeleton className="w-full h-[300px] rounded-lg" />
        ) : (
          <TrafficChart data={trafficData} />
        )}
      </div>

      {/* Upvote & Subreddit Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-heading font-semibold text-gray-900 mb-4">Upvotes & Comments</h3>
          <UpvoteChart data={upvoteData} isLoading={loading} />
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-heading font-semibold text-gray-900 mb-4">Top Subreddits</h3>
          <SubredditChart data={subredditData} isLoading={loading} />
        </div>
      </div>

      {/* Brand Mentions & Competitor Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-heading font-semibold text-gray-900 mb-4">Brand Mentions</h3>
          {mentions.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No brand mentions detected yet.</p>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {mentions.map((mention, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                  <Badge variant="secondary" className="bg-orange-50 text-orange-600 text-xs shrink-0">
                    {mention.subreddit}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-700 truncate">{mention.title}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {mention.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-heading font-semibold text-gray-900 mb-4">Competitor Activity</h3>
          {competitors.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">
              Add competitors in Settings to track their activity.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Competitor</TableHead>
                  <TableHead className="text-right">Mentions</TableHead>
                  <TableHead className="text-right">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitors.map((comp) => (
                  <TableRow key={comp.name}>
                    <TableCell className="font-medium">{comp.name}</TableCell>
                    <TableCell className="text-right">{comp.mentions}</TableCell>
                    <TableCell className="text-right">
                      {comp.trend === "up" ? (
                        <TrendingUp className={cn("h-4 w-4 inline text-green-500")} />
                      ) : (
                        <TrendingDown className={cn("h-4 w-4 inline text-red-500")} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
