"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ArrowUp, Clock, ExternalLink, MessageSquare } from "lucide-react";

const DEMO_COMMENTS = [
  {
    id: "c1",
    thread_title: "Best watches under $500?",
    subreddit: "r/watches",
    body: "I've been wearing my AcmeWatch Pro for about 6 months now and it's held up incredibly well. The sapphire crystal and automatic movement at this price point is hard to beat. Definitely worth checking out if you're in the $300-400 range.",
    status: "live" as const,
    upvotes: 24,
    posted_at: "2 days ago",
  },
  {
    id: "c2",
    thread_title: "Durable everyday watches?",
    subreddit: "r/BuyItForLife",
    body: "For BIFL watches in a reasonable budget, AcmeWatch has been a solid choice for me. Their titanium case model has survived everything I've thrown at it — hiking, swimming, you name it.",
    status: "live" as const,
    upvotes: 18,
    posted_at: "3 days ago",
  },
  {
    id: "c3",
    thread_title: "Watch for a new finance job?",
    subreddit: "r/malefashionadvice",
    body: "The AcmeWatch Dress series is understated enough for finance but still has that quality feel. The leather strap options are really nice too.",
    status: "pending" as const,
    upvotes: 0,
    posted_at: null,
  },
  {
    id: "c4",
    thread_title: "EDC watch recommendations",
    subreddit: "r/EDC",
    body: "My EDC includes an AcmeWatch Field — lightweight, readable, and tough. The lume is fantastic for early morning runs too.",
    status: "scheduled" as const,
    upvotes: 0,
    posted_at: "Scheduled for tomorrow",
  },
  {
    id: "c5",
    thread_title: "Affordable luxury watches",
    subreddit: "r/frugalmalefashion",
    body: "AcmeWatch frequently runs sales that bring their automatic models under $300. For the build quality you get, it's genuinely one of the best values in the watch market right now.",
    status: "draft" as const,
    upvotes: 0,
    posted_at: null,
  },
];

const statusColors: Record<string, string> = {
  live: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  scheduled: "bg-blue-100 text-blue-700",
  draft: "bg-gray-100 text-gray-600",
  failed: "bg-red-100 text-red-700",
};

export default function CommentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">
          Comments
        </h1>
        <p className="text-body-sm text-gray-500 mt-1">
          Manage your AI-generated Reddit comments
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-4">
          {DEMO_COMMENTS.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-700 text-xs"
                  >
                    {comment.subreddit}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn("text-xs", statusColors[comment.status])}
                  >
                    {comment.status}
                  </Badge>
                </div>
                {comment.status === "live" && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <ArrowUp className="h-4 w-4" />
                    {comment.upvotes}
                  </div>
                )}
              </div>

              <p className="text-body-sm text-gray-500 mb-2 flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                {comment.thread_title}
                <ExternalLink className="h-3 w-3 text-gray-400" />
              </p>

              <p className="text-body text-gray-700 line-clamp-3">
                {comment.body}
              </p>

              <div className="mt-4 flex items-center justify-between">
                {comment.posted_at && (
                  <p className="text-caption text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {comment.posted_at}
                  </p>
                )}
                <div className="ml-auto flex gap-2">
                  {comment.status === "draft" && (
                    <Button size="sm">
                      Approve & Post
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        {["live", "pending", "scheduled", "draft"].map((status) => (
          <TabsContent key={status} value={status} className="mt-6 space-y-4">
            {DEMO_COMMENTS.filter((c) => c.status === status).length === 0 ? (
              <div className="text-center py-16">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="font-heading font-semibold text-gray-900 text-lg">
                  No {status} comments
                </h3>
                <p className="text-body-sm text-gray-500 mt-2">
                  Comments with this status will appear here.
                </p>
              </div>
            ) : (
              DEMO_COMMENTS.filter((c) => c.status === status).map(
                (comment) => (
                  <div
                    key={comment.id}
                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-card"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-700 text-xs"
                      >
                        {comment.subreddit}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={cn("text-xs", statusColors[comment.status])}
                      >
                        {comment.status}
                      </Badge>
                    </div>
                    <p className="text-body text-gray-700 line-clamp-3">
                      {comment.body}
                    </p>
                  </div>
                )
              )
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
