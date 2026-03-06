# Task 009: Dashboard Layout (Sidebar, Topbar, Overview)

## Status
not-started

## Depends On
002

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting.

## Objective
Build the dashboard shell (sidebar navigation, top bar, responsive layout) and the overview page with stat cards, activity feed, quick actions, and a traffic trend chart.

## Scope
- Files to create or modify: `src/components/dashboard/sidebar.tsx`, `src/components/dashboard/topbar.tsx`, `src/app/dashboard/layout.tsx`, `src/app/dashboard/page.tsx`, `src/components/dashboard/stat-card.tsx`, `src/components/dashboard/activity-feed.tsx`
- Files NOT to touch: `src/components/marketing/`, `src/app/page.tsx`, `supabase/migrations/`

## Acceptance Criteria
- [ ] Dashboard layout has a fixed sidebar on the left (desktop) and a top bar spanning the content area
- [ ] Sidebar shows: Mentionly logo at top, nav items (Overview, Discover, Comments, Analytics, Settings), active state with orange highlight, user avatar + name at bottom
- [ ] Sidebar is collapsible on mobile (hamburger trigger in topbar, slide-out sheet)
- [ ] Topbar shows: page title (dynamic), search bar, notification bell with unread badge count, user dropdown (profile, settings, sign out)
- [ ] Dashboard overview page shows a grid of 5 stat cards: Total Comments, Total Upvotes, Est. Traffic, Active Campaigns, Credits Remaining
- [ ] Each stat card shows: icon, label, value, and a small trend indicator (e.g., "+12% from last week")
- [ ] Activity feed shows 5-8 recent activity items (e.g., "New thread discovered in r/watches", "Comment posted in r/BuyItForLife") with timestamps
- [ ] Quick action buttons: "Discover Threads", "Create Comment", "View Analytics"
- [ ] A small traffic trend line chart using Recharts showing last 7-30 days of estimated clicks
- [ ] Data comes from Supabase queries (server-side fetch) or falls back to hardcoded demo constants if no DB connection
- [ ] All components follow the design system (card styling, fonts, colors, spacing)
- [ ] Layout is fully responsive
- [ ] `pnpm build` passes

## Instructions

### Step 1: Create `src/components/dashboard/stat-card.tsx`
```tsx
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-body-sm text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-heading font-bold text-gray-900">{value}</p>
          {change && (
            <p className={cn(
              "mt-1 text-sm font-medium",
              changeType === "positive" && "text-green-600",
              changeType === "negative" && "text-red-600",
              changeType === "neutral" && "text-gray-400",
            )}>
              {change}
            </p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
          <Icon className="h-6 w-6 text-orange-500" />
        </div>
      </div>
    </div>
  );
}
```

### Step 2: Create `src/components/dashboard/activity-feed.tsx`
```tsx
interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  type: "thread" | "comment" | "alert" | "credit";
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card">
      <h3 className="font-heading font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            {/* Color-coded dot based on type */}
            <div className={cn(
              "mt-1.5 h-2 w-2 rounded-full flex-shrink-0",
              item.type === "thread" && "bg-blue-500",
              item.type === "comment" && "bg-green-500",
              item.type === "alert" && "bg-orange-500",
              item.type === "credit" && "bg-gray-400",
            )} />
            <div className="flex-1 min-w-0">
              <p className="text-body-sm text-gray-700">{item.message}</p>
              <p className="text-caption text-gray-400">{item.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Step 3: Create `src/components/dashboard/sidebar.tsx`
Mark as `"use client"` (needs active route state, mobile toggle).

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Search,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Discover", href: "/dashboard/discover", icon: Search },
  { label: "Comments", href: "/dashboard/comments", icon: MessageSquare },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];
```

**Structure:**
- Fixed left sidebar: `fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col`
- Logo at top: `px-6 py-5 font-heading text-xl font-bold text-gray-900`
- Nav list in the middle: each item is a `<Link>` with:
  - Default: `flex items-center gap-3 px-4 py-2.5 mx-3 rounded-lg text-gray-600 hover:bg-gray-50`
  - Active (pathname matches): `bg-orange-50 text-orange-600 font-medium`
  - For "Overview", match exact path. For others, match startsWith.
- User section at bottom: `mt-auto px-4 py-4 border-t border-gray-200` showing avatar circle + name (accept as props or hardcode demo data)
- Hide sidebar on mobile: `hidden lg:flex` and provide a sheet/drawer triggered from topbar

### Step 4: Create `src/components/dashboard/topbar.tsx`
Mark as `"use client"` (dropdown interactions).

```tsx
"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  title: string;
  onMenuClick?: () => void;
}

export function Topbar({ title, onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6">
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <h1 className="font-heading font-semibold text-gray-900 text-lg">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm outline-none placeholder:text-gray-400 w-48"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
            3
          </span>
        </Button>

        {/* User dropdown */}
        {/* Use shadcn DropdownMenu with avatar trigger */}
        {/* Items: Profile, Settings, Sign Out */}
      </div>
    </header>
  );
}
```

For sign out, call `supabase.auth.signOut()` then `router.push("/login")`.

### Step 5: Create `src/app/dashboard/layout.tsx`
```tsx
"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="lg:pl-64">
        <Topbar title="Dashboard" onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
```

Note: The topbar `title` prop could be made dynamic based on the current route using `usePathname()`.

### Step 6: Create `src/app/dashboard/page.tsx`
This can be a Server Component that fetches data from Supabase, or a Client Component with `useEffect`. Prefer Server Component for initial data load.

**If Server Component:**
```tsx
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { MessageSquare, ThumbsUp, TrendingUp, Briefcase, Coins } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Fallback demo data if Supabase query fails
const DEMO_STATS = {
  totalComments: 47,
  totalUpvotes: 892,
  estTraffic: "12.4K",
  activeCampaigns: 3,
  creditsRemaining: 340,
};

const DEMO_ACTIVITY = [
  { id: "1", message: "New high-intent thread discovered in r/watches", timestamp: "2 hours ago", type: "thread" as const },
  { id: "2", message: "Comment posted in r/BuyItForLife — 12 upvotes", timestamp: "4 hours ago", type: "comment" as const },
  { id: "3", message: "Competitor mention: Omega spotted in r/malefashionadvice", timestamp: "6 hours ago", type: "alert" as const },
  { id: "4", message: "Comment approved and scheduled for r/EDC", timestamp: "8 hours ago", type: "comment" as const },
  { id: "5", message: "10 credits used for comment generation", timestamp: "8 hours ago", type: "credit" as const },
  { id: "6", message: "New thread discovered in r/frugalmalefashion", timestamp: "12 hours ago", type: "thread" as const },
];

export default async function DashboardOverview() {
  // Attempt to fetch real data from Supabase
  let stats = DEMO_STATS;
  let activity = DEMO_ACTIVITY;

  try {
    const supabase = await createClient();
    // Fetch stats from comments, analytics, projects tables
    // If successful, override stats/activity
    // If fails (no DB), fall through to demo data
  } catch {
    // Use demo data
  }

  return (
    <div className="space-y-6">
      {/* Stat cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Comments" value={stats.totalComments} change="+8 this week" changeType="positive" icon={MessageSquare} />
        <StatCard title="Total Upvotes" value={stats.totalUpvotes} change="+124 this week" changeType="positive" icon={ThumbsUp} />
        <StatCard title="Est. Traffic" value={stats.estTraffic} change="+18% vs last week" changeType="positive" icon={TrendingUp} />
        <StatCard title="Active Campaigns" value={stats.activeCampaigns} changeType="neutral" icon={Briefcase} />
        <StatCard title="Credits" value={stats.creditsRemaining} change="340 remaining" changeType="neutral" icon={Coins} />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
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
        {/* Activity feed — takes 2 cols */}
        <div className="lg:col-span-2">
          <ActivityFeed items={activity} />
        </div>

        {/* Traffic chart — takes 1 col */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card">
          <h3 className="font-heading font-semibold text-gray-900 mb-4">Traffic Trend</h3>
          {/* Recharts AreaChart or LineChart showing last 30 days estimated_clicks */}
          {/* Use a client component wrapper for the chart */}
          <TrafficChart />
        </div>
      </div>
    </div>
  );
}
```

**Create a small client component for the Recharts chart:**
Create `src/components/dashboard/charts/traffic-chart.tsx`:
```tsx
"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const demoData = [
  { date: "Mar 1", clicks: 120 },
  { date: "Mar 2", clicks: 145 },
  // ... 30 days of demo data with growth trend
];

export function TrafficChart({ data }: { data?: { date: string; clicks: number }[] }) {
  const chartData = data ?? demoData;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
        <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
        <Tooltip />
        <Area type="monotone" dataKey="clicks" stroke="#F97316" fill="#FFF7ED" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

### Step 7: Verify
- `pnpm build` passes
- `/dashboard` renders with sidebar, topbar, stat cards, activity feed, chart
- Sidebar highlights the active route
- Mobile sidebar opens/closes via hamburger
- Responsive layout works at all breakpoints
- Chart renders with demo data
