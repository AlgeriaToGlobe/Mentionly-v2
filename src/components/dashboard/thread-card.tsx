"use client";

import { cn } from "@/lib/utils";
import type { Thread } from "@/types";
import {
  ArrowUp,
  ExternalLink,
  Globe,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ThreadCardProps {
  thread: Thread;
  selected: boolean;
  onSelect: (id: string) => void;
  onGenerateComment: (id: string) => void;
}

export function ThreadCard({
  thread,
  selected,
  onSelect,
  onGenerateComment,
}: ThreadCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border p-5 transition-all hover:shadow-card-hover",
        selected
          ? "border-orange-300 bg-orange-50/30"
          : "border-gray-200 shadow-card"
      )}
    >
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(thread.id)}
          className="mt-1.5 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
          aria-label={`Select thread: ${thread.title}`}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-700 text-xs font-medium"
              >
                {thread.subreddit}
              </Badge>
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs font-medium",
                  thread.buying_intent === "high" &&
                    "bg-green-100 text-green-700",
                  thread.buying_intent === "medium" &&
                    "bg-yellow-100 text-yellow-700",
                  thread.buying_intent === "low" && "bg-gray-100 text-gray-600"
                )}
              >
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

            <div
              className={cn(
                "flex items-center justify-center h-10 w-10 rounded-full font-heading font-bold text-sm shrink-0",
                thread.overall_score >= 75 && "bg-green-100 text-green-700",
                thread.overall_score >= 50 &&
                  thread.overall_score < 75 &&
                  "bg-yellow-100 text-yellow-700",
                thread.overall_score < 50 && "bg-gray-100 text-gray-500"
              )}
            >
              {Math.round(thread.overall_score)}
            </div>
          </div>

          <h3 className="font-heading font-semibold text-gray-900 mb-2 line-clamp-2">
            <a
              href={thread.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-600 transition-colors"
            >
              {thread.title}
              <ExternalLink className="inline ml-1 h-3.5 w-3.5 text-gray-400" />
            </a>
          </h3>

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
              {thread.estimated_traffic.toLocaleString()} est. visits/mo
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {thread.freshness_score > 0.7
                ? "Fresh"
                : thread.freshness_score > 0.3
                ? "Recent"
                : "Older"}
            </span>
          </div>
        </div>

        <Button
          size="sm"
          className="flex-shrink-0"
          onClick={() => onGenerateComment(thread.id)}
        >
          Generate Comment
        </Button>
      </div>
    </div>
  );
}
