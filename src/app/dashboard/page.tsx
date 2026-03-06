import Link from "next/link";
import {
  MessageSquare,
  ThumbsUp,
  TrendingUp,
  Briefcase,
  Coins,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { TrafficChart } from "@/components/dashboard/charts/traffic-chart";
import { Button } from "@/components/ui/button";
import type { ActivityItem } from "@/types";

const DEMO_STATS = {
  totalComments: 47,
  totalUpvotes: 892,
  estTraffic: "12.4K",
  activeCampaigns: 3,
  creditsRemaining: 340,
};

const DEMO_ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    message: "New high-intent thread discovered in r/watches",
    timestamp: "2 hours ago",
    type: "thread",
  },
  {
    id: "2",
    message: "Comment posted in r/BuyItForLife — 12 upvotes",
    timestamp: "4 hours ago",
    type: "comment",
  },
  {
    id: "3",
    message: "Competitor mention: Omega spotted in r/malefashionadvice",
    timestamp: "6 hours ago",
    type: "alert",
  },
  {
    id: "4",
    message: "Comment approved and scheduled for r/EDC",
    timestamp: "8 hours ago",
    type: "comment",
  },
  {
    id: "5",
    message: "10 credits used for comment generation",
    timestamp: "8 hours ago",
    type: "credit",
  },
  {
    id: "6",
    message: "New thread discovered in r/frugalmalefashion",
    timestamp: "12 hours ago",
    type: "thread",
  },
];

export default function DashboardOverview() {
  const stats = DEMO_STATS;
  const activity = DEMO_ACTIVITY;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Comments"
          value={stats.totalComments}
          change="+8 this week"
          changeType="positive"
          icon={MessageSquare}
        />
        <StatCard
          title="Total Upvotes"
          value={stats.totalUpvotes}
          change="+124 this week"
          changeType="positive"
          icon={ThumbsUp}
        />
        <StatCard
          title="Est. Traffic"
          value={stats.estTraffic}
          change="+18% vs last week"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Active Campaigns"
          value={stats.activeCampaigns}
          changeType="neutral"
          icon={Briefcase}
        />
        <StatCard
          title="Credits"
          value={stats.creditsRemaining}
          change="340 remaining"
          changeType="neutral"
          icon={Coins}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/dashboard/discover">Discover Threads</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/comments">View Comments</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/analytics">View Analytics</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed items={activity} />
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card">
          <h3 className="font-heading font-semibold text-gray-900 mb-4">
            Traffic Trend
          </h3>
          <TrafficChart />
        </div>
      </div>
    </div>
  );
}
