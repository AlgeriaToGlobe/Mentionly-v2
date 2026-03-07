import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const threadUpdateSchema = z.object({
  project_id: z.string().uuid(),
  reddit_thread_id: z.string(),
  subreddit: z.string(),
  title: z.string(),
  url: z.string().url().optional(),
  author: z.string().optional(),
  score: z.number().optional().default(0),
  num_comments: z.number().optional().default(0),
  google_rank: z.number().optional().nullable(),
  estimated_traffic: z.number().optional().default(0),
  buying_intent: z.number().optional().default(0),
  freshness_score: z.number().optional().default(0),
  overall_score: z.number().optional().default(0),
  links_allowed: z.boolean().optional().default(true),
  status: z.string().optional().default("new"),
});

const analyticsUpdateSchema = z.object({
  project_id: z.string().uuid(),
  date: z.string(),
  threads_discovered: z.number().optional().default(0),
  comments_posted: z.number().optional().default(0),
  total_upvotes: z.number().optional().default(0),
  estimated_clicks: z.number().optional().default(0),
  brand_mentions: z.number().optional().default(0),
  llm_citations: z.number().optional().default(0),
});

const alertCreateSchema = z.object({
  project_id: z.string().uuid(),
  type: z.enum(["new_thread", "brand_mention", "competitor_activity", "comment_status"]),
  title: z.string(),
  body: z.string().optional(),
  delivered_via: z.enum(["in_app", "email", "both"]).optional().default("in_app"),
});

const payloadSchema = z.object({
  type: z.enum(["thread_update", "analytics_update", "alert_create"]),
  data: z.record(z.unknown()),
});

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function validateSecret(request: NextRequest): boolean {
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (!secret) return false;

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7) === secret;
  }

  const webhookSecret = request.headers.get("x-webhook-secret");
  return webhookSecret === secret;
}

async function handleThreadUpdate(data: z.infer<typeof threadUpdateSchema>) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("threads")
    .upsert(data, { onConflict: "project_id,reddit_thread_id" });
  if (error) throw error;
}

async function handleAnalyticsUpdate(data: z.infer<typeof analyticsUpdateSchema>) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("analytics")
    .upsert(data, { onConflict: "project_id,date" });
  if (error) throw error;
}

async function handleAlertCreate(data: z.infer<typeof alertCreateSchema>) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("alerts")
    .insert({ ...data, is_read: false });
  if (error) throw error;
}

export async function POST(request: NextRequest) {
  try {
    if (!validateSecret(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const payloadResult = payloadSchema.safeParse(body);

    if (!payloadResult.success) {
      return NextResponse.json(
        { success: false, error: "Invalid payload structure" },
        { status: 400 }
      );
    }

    const { type, data } = payloadResult.data;

    switch (type) {
      case "thread_update": {
        const result = threadUpdateSchema.safeParse(data);
        if (!result.success) {
          return NextResponse.json(
            { success: false, error: result.error.errors },
            { status: 400 }
          );
        }
        await handleThreadUpdate(result.data);
        break;
      }
      case "analytics_update": {
        const result = analyticsUpdateSchema.safeParse(data);
        if (!result.success) {
          return NextResponse.json(
            { success: false, error: result.error.errors },
            { status: 400 }
          );
        }
        await handleAnalyticsUpdate(result.data);
        break;
      }
      case "alert_create": {
        const result = alertCreateSchema.safeParse(data);
        if (!result.success) {
          return NextResponse.json(
            { success: false, error: result.error.errors },
            { status: 400 }
          );
        }
        await handleAlertCreate(result.data);
        break;
      }
      default:
        return NextResponse.json(
          { success: false, error: "Unknown payload type" },
          { status: 422 }
        );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
