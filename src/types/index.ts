export interface Thread {
  id: string;
  project_id: string;
  reddit_thread_id: string;
  subreddit: string;
  title: string;
  url: string;
  author: string | null;
  score: number;
  num_comments: number;
  created_utc: string | null;
  google_rank: number | null;
  estimated_traffic: number;
  buying_intent: "low" | "medium" | "high";
  freshness_score: number;
  overall_score: number;
  links_allowed: boolean;
  status: "new" | "viewed" | "commented" | "skipped";
  discovered_at: string;
}

export interface Comment {
  id: string;
  project_id: string;
  thread_id: string;
  user_id: string;
  body: string;
  ai_generated: boolean;
  ai_prompt: string | null;
  edited_body: string | null;
  status: "draft" | "pending" | "scheduled" | "live" | "failed" | "deleted";
  posted_via: string | null;
  posted_at: string | null;
  scheduled_for: string | null;
  reddit_comment_id: string | null;
  upvotes: number;
  boost_upvotes_requested: number;
  boost_upvotes_delivered: number;
  credits_used: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: "free" | "lite" | "pro" | "max";
  credits_balance: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  website_url: string | null;
  description: string | null;
  target_keywords: string[];
  target_subreddits: string[];
  brand_names: string[];
  tone: "helpful" | "casual" | "professional" | "technical" | "witty";
  custom_instructions: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsRow {
  id: string;
  project_id: string;
  date: string;
  threads_discovered: number;
  comments_posted: number;
  total_upvotes: number;
  estimated_clicks: number;
  brand_mentions: number;
  llm_citations: number;
  created_at: string;
}

export interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  type: "thread" | "comment" | "alert" | "credit";
}
