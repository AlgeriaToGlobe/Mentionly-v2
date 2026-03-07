"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CommentCard,
  type CommentCardData,
} from "@/components/dashboard/comment-card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageSquare, Loader2 } from "lucide-react";
import Link from "next/link";

const editSchema = z.object({
  edited_body: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(5000, "Comment must be under 5000 characters"),
});

type EditFormData = z.infer<typeof editSchema>;

const TAB_STATUSES = ["all", "pending", "live", "scheduled", "failed"] as const;
type TabStatus = (typeof TAB_STATUSES)[number];

const DEMO_COMMENTS: CommentCardData[] = [
  {
    id: "c1",
    thread_title: "Best watches under $500?",
    subreddit: "r/watches",
    body: "I've been wearing my AcmeWatch Pro for about 6 months now and it's held up incredibly well. The sapphire crystal and automatic movement at this price point is hard to beat. Definitely worth checking out if you're in the $300-400 range.",
    status: "live",
    upvotes: 24,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    posted_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    reddit_comment_id: "abc123",
    posted_via: "managed",
  },
  {
    id: "c2",
    thread_title: "Durable everyday watches?",
    subreddit: "r/BuyItForLife",
    body: "For BIFL watches in a reasonable budget, AcmeWatch has been a solid choice for me. Their titanium case model has survived everything I've thrown at it — hiking, swimming, you name it.",
    status: "live",
    upvotes: 18,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    posted_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    reddit_comment_id: "def456",
    posted_via: "managed",
  },
  {
    id: "c3",
    thread_title: "Watch for a new finance job?",
    subreddit: "r/malefashionadvice",
    body: "The AcmeWatch Dress series is understated enough for finance but still has that quality feel. The leather strap options are really nice too.",
    status: "pending",
    upvotes: 0,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "c4",
    thread_title: "EDC watch recommendations",
    subreddit: "r/EDC",
    body: "My EDC includes an AcmeWatch Field — lightweight, readable, and tough. The lume is fantastic for early morning runs too.",
    status: "scheduled",
    upvotes: 0,
    created_at: new Date(Date.now() - 0.5 * 86400000).toISOString(),
  },
  {
    id: "c5",
    thread_title: "Affordable luxury watches",
    subreddit: "r/frugalmalefashion",
    body: "AcmeWatch frequently runs sales that bring their automatic models under $300. For the build quality you get, it's genuinely one of the best values in the watch market right now.",
    status: "draft",
    upvotes: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "c6",
    thread_title: "Watch for graduation gift?",
    subreddit: "r/watches",
    body: "Failed to post — the thread was archived before the comment could be submitted.",
    status: "failed",
    upvotes: 0,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

export default function CommentsPage() {
  const [comments, setComments] = useState<CommentCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState<CommentCardData | null>(null);
  const [deletingComment, setDeletingComment] = useState<CommentCardData | null>(null);
  const [boostingComment, setBoostingComment] = useState<CommentCardData | null>(null);
  const [boostCount, setBoostCount] = useState(5);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
  });

  useEffect(() => {
    async function fetchComments() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setComments(DEMO_COMMENTS);
          setLoading(false);
          return;
        }

        const { data: projects } = await supabase
          .from("projects")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);

        if (!projects?.length) {
          setComments(DEMO_COMMENTS);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("comments")
          .select("id, body, edited_body, status, upvotes, created_at, posted_at, posted_via, reddit_comment_id, threads(title, subreddit)")
          .eq("project_id", projects[0].id)
          .order("created_at", { ascending: false });

        if (error || !data?.length) {
          setComments(DEMO_COMMENTS);
        } else {
          setComments(
            data.map((c: Record<string, unknown>) => {
              const thread = c.threads as Record<string, string> | null;
              return {
                id: c.id as string,
                thread_title: thread?.title || "Unknown Thread",
                subreddit: thread?.subreddit || "r/unknown",
                body: c.body as string,
                edited_body: c.edited_body as string | null,
                status: c.status as CommentCardData["status"],
                upvotes: c.upvotes as number,
                created_at: c.created_at as string,
                posted_at: c.posted_at as string | null,
                posted_via: c.posted_via as string | null,
                reddit_comment_id: c.reddit_comment_id as string | null,
              };
            })
          );
        }
      } catch {
        setComments(DEMO_COMMENTS);
      }
      setLoading(false);
    }
    fetchComments();
  }, []);

  function getFilteredComments(tab: TabStatus) {
    if (tab === "all") return comments.filter((c) => c.status !== "deleted");
    return comments.filter((c) => c.status === tab);
  }

  function getCounts() {
    const counts: Record<string, number> = {};
    for (const tab of TAB_STATUSES) {
      counts[tab] = getFilteredComments(tab).length;
    }
    return counts;
  }

  async function handleEdit(data: EditFormData) {
    if (!editingComment) return;
    setActionLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("comments")
        .update({ edited_body: data.edited_body, updated_at: new Date().toISOString() })
        .eq("id", editingComment.id);
      if (error) throw error;
      setComments((prev) =>
        prev.map((c) => c.id === editingComment.id ? { ...c, edited_body: data.edited_body } : c)
      );
      toast.success("Comment updated successfully");
    } catch {
      toast.error("Failed to update comment");
    }
    setActionLoading(false);
    setEditingComment(null);
    reset();
  }

  async function handleDelete() {
    if (!deletingComment) return;
    setActionLoading(true);
    try {
      const supabase = createClient();
      await supabase.from("comments").update({ status: "deleted" }).eq("id", deletingComment.id);
      setComments((prev) =>
        prev.map((c) => c.id === deletingComment.id ? { ...c, status: "deleted" as const } : c)
      );
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
    setActionLoading(false);
    setDeletingComment(null);
  }

  async function handleBoost() {
    if (!boostingComment) return;
    setActionLoading(true);
    try {
      const supabase = createClient();
      await supabase.from("comments").update({ boost_upvotes_requested: boostCount }).eq("id", boostingComment.id);
      toast.success(`Boost requested: ${boostCount} upvotes`);
    } catch {
      toast.error("Failed to request boost");
    }
    setActionLoading(false);
    setBoostingComment(null);
    setBoostCount(5);
  }

  const counts = getCounts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">My Comments</h1>
        <p className="text-sm text-gray-500 mt-1">{counts.all} total comments</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="flex-wrap">
          {TAB_STATUSES.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="capitalize">
              {tab} ({counts[tab]})
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_STATUSES.map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-gray-200 p-5 space-y-3">
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : getFilteredComments(tab).length === 0 ? (
              <div className="text-center py-16">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="font-heading font-semibold text-gray-900 text-lg">
                  No {tab === "all" ? "" : tab} comments
                </h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                  {tab === "all"
                    ? "Start by discovering threads and generating comments."
                    : `Comments with "${tab}" status will appear here.`}
                </p>
                <Button asChild className="mt-4">
                  <Link href="/dashboard/discover">Discover Threads</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {getFilteredComments(tab).map((comment) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    onEdit={(c) => {
                      setEditingComment(c);
                      reset({ edited_body: c.edited_body || c.body });
                    }}
                    onDelete={setDeletingComment}
                    onBoost={setBoostingComment}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Modal */}
      <Dialog open={!!editingComment} onOpenChange={(open) => !open && setEditingComment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
            <div>
              <Label htmlFor="edited_body">Comment Body</Label>
              <textarea
                id="edited_body"
                className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm min-h-[150px] focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                {...register("edited_body")}
              />
              {errors.edited_body && (
                <p className="text-sm text-red-500 mt-1">{errors.edited_body.message}</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditingComment(null)}>Cancel</Button>
              <Button type="submit" disabled={actionLoading}>
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingComment} onOpenChange={(open) => !open && setDeletingComment(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action will mark it as deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Boost Dialog */}
      <Dialog open={!!boostingComment} onOpenChange={(open) => !open && setBoostingComment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Boost Comment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Request upvotes to boost this comment&apos;s visibility.</p>
            <div>
              <Label htmlFor="boost-count">Number of upvotes</Label>
              <Input
                id="boost-count"
                type="number"
                min={1}
                max={100}
                value={boostCount}
                onChange={(e) => setBoostCount(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setBoostingComment(null)}>Cancel</Button>
              <Button onClick={handleBoost} disabled={actionLoading}>
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Request Boost
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
