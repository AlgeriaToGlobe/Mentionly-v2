"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowBigUp,
  ExternalLink,
  Pencil,
  Trash2,
  TrendingUp,
  Clock,
} from "lucide-react";

export interface CommentCardData {
  id: string;
  thread_title: string;
  subreddit: string;
  body: string;
  edited_body?: string | null;
  status: "draft" | "pending" | "scheduled" | "live" | "failed" | "deleted";
  upvotes: number;
  created_at: string;
  posted_at?: string | null;
  posted_via?: string | null;
  reddit_comment_id?: string | null;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  pending: "bg-yellow-100 text-yellow-700",
  scheduled: "bg-blue-100 text-blue-700",
  live: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  deleted: "bg-gray-100 text-gray-400 line-through",
};

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

interface CommentCardProps {
  comment: CommentCardData;
  onEdit: (comment: CommentCardData) => void;
  onDelete: (comment: CommentCardData) => void;
  onBoost: (comment: CommentCardData) => void;
}

export function CommentCard({
  comment,
  onEdit,
  onDelete,
  onBoost,
}: CommentCardProps) {
  const displayBody = comment.edited_body || comment.body;
  const truncatedBody =
    displayBody.length > 150 ? displayBody.slice(0, 150) + "..." : displayBody;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="secondary"
            className="bg-orange-50 text-orange-600 rounded-full text-xs"
          >
            {comment.subreddit}
          </Badge>
          <span className="text-sm text-gray-700 font-medium truncate max-w-[200px]">
            {comment.thread_title}
          </span>
        </div>
        <Badge
          variant="secondary"
          className={cn("text-xs shrink-0", statusColors[comment.status])}
        >
          {comment.status}
        </Badge>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">{truncatedBody}</p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          {comment.status === "live" && (
            <span className="flex items-center gap-1">
              <ArrowBigUp className="h-4 w-4" />
              {comment.upvotes}
            </span>
          )}
          {(comment.posted_at || comment.created_at) && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeDate(comment.posted_at || comment.created_at)}
            </span>
          )}
          {comment.posted_via && (
            <span className="text-gray-300">{comment.posted_via}</span>
          )}
        </div>

        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onEdit(comment)}
            aria-label="Edit comment"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onDelete(comment)}
            aria-label="Delete comment"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onBoost(comment)}
            aria-label="Boost comment"
          >
            <TrendingUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            asChild
            aria-label="View on Reddit"
          >
            <a
              href={
                comment.reddit_comment_id
                  ? `https://reddit.com/comments/${comment.reddit_comment_id}`
                  : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                !comment.reddit_comment_id &&
                  "pointer-events-none opacity-40"
              )}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
