# Task 002: Supabase Client & Auth Setup

## Status
not-started

## Depends On
001

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting. Pay special attention to sections 8 (Database Schema), 9 (Auth Configuration), and 11 (Environment Variables).

## Objective
Create all Supabase client utilities, auth callback handler, user hook, and TypeScript database types so that any page/component can interact with Supabase for auth and data.

## Scope
- Files to create or modify: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`, `src/app/auth/callback/route.ts`, `src/hooks/use-user.ts`, `src/types/database.ts`, `src/types/index.ts`
- Files NOT to touch: `middleware.ts` (already created in Task 001 — but update it to use the new `updateSession` helper), `tailwind.config.ts`, `package.json`, any marketing or dashboard components

## Acceptance Criteria
- [ ] `createBrowserClient()` from `src/lib/supabase/client.ts` returns a typed Supabase client for use in Client Components
- [ ] `createServerSupabaseClient()` from `src/lib/supabase/server.ts` returns a typed Supabase client for use in Server Components and Route Handlers
- [ ] `src/lib/supabase/middleware.ts` exports `updateSession(request)` that refreshes the auth session (used by root `middleware.ts`)
- [ ] Root `middleware.ts` is updated to import and delegate to `updateSession`
- [ ] `src/app/auth/callback/route.ts` handles the OAuth/magic-link redirect, exchanges code for session, and redirects to `/dashboard`
- [ ] `useUser()` hook returns `{ user, profile, loading, error }` and works in Client Components
- [ ] `src/types/database.ts` exports a `Database` type matching the full Supabase schema from PROJECT_CONTEXT.md section 8 (all 9 tables: profiles, projects, threads, comments, analytics, competitors, waitlist, alerts, credit_transactions)
- [ ] Each table type has `Row`, `Insert`, and `Update` variants with correct optionality
- [ ] `src/types/index.ts` re-exports convenience type aliases (Profile, Project, Thread, Comment, etc.) and enum union types (Plan, Tone, CommentStatus, etc.)
- [ ] All files use strict TypeScript with no `any` types
- [ ] `pnpm build` passes with no errors

## Instructions

### Step 1: Create directory structure
```bash
mkdir -p src/lib/supabase src/hooks src/types src/app/auth/callback
```

### Step 2: Create `src/types/database.ts`
This file defines the Supabase-generated-style `Database` type. It must match every table, column, and type in PROJECT_CONTEXT.md Section 8 exactly.

**Type mapping from SQL to TypeScript:**
- `UUID` -> `string`
- `TEXT` -> `string`
- `TEXT[]` -> `string[]`
- `INTEGER` -> `number`
- `REAL` -> `number`
- `BOOLEAN` -> `boolean`
- `TIMESTAMPTZ` / `DATE` -> `string`
- `CHECK (col IN ('a','b'))` -> `"a" | "b"`
- Nullable columns -> `type | null`

**For each table, define three variants:**
- `Row`: All columns typed. Non-nullable = required type, nullable = `type | null`
- `Insert`: Columns with `DEFAULT` or nullable are optional (`?`). Columns with `NOT NULL` and no default are required
- `Update`: All columns optional (Partial of Row)

Structure:
```ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          plan: "free" | "lite" | "pro" | "max";
          credits_balance: number;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: "free" | "lite" | "pro" | "max";
          credits_balance?: number;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: "free" | "lite" | "pro" | "max";
          credits_balance?: number;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      // ... define projects, threads, comments, analytics, competitors, waitlist, alerts, credit_transactions
      // with the same Row/Insert/Update pattern
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
```

Complete ALL 9 tables with every column from PROJECT_CONTEXT.md Section 8.

### Step 3: Create `src/types/index.ts`
```ts
import type { Database } from "./database";

export type { Database } from "./database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Thread = Database["public"]["Tables"]["threads"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type Analytics = Database["public"]["Tables"]["analytics"]["Row"];
export type Competitor = Database["public"]["Tables"]["competitors"]["Row"];
export type WaitlistEntry = Database["public"]["Tables"]["waitlist"]["Row"];
export type Alert = Database["public"]["Tables"]["alerts"]["Row"];
export type CreditTransaction = Database["public"]["Tables"]["credit_transactions"]["Row"];

export type Plan = "free" | "lite" | "pro" | "max";
export type Tone = "helpful" | "casual" | "professional" | "technical" | "witty";
export type ThreadStatus = "new" | "viewed" | "commented" | "skipped";
export type CommentStatus = "draft" | "pending" | "scheduled" | "live" | "failed" | "deleted";
export type BuyingIntent = "low" | "medium" | "high";
export type AlertType = "new_thread" | "brand_mention" | "competitor_activity" | "comment_status";
export type AlertDelivery = "in_app" | "email" | "both";
export type CreditTransactionType = "purchase" | "subscription_grant" | "comment_used" | "post_used" | "upvote_used" | "refund";
```

### Step 4: Create `src/lib/supabase/client.ts` (Browser Client)
```ts
"use client";

import { createBrowserClient as createClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export function createBrowserClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Step 5: Create `src/lib/supabase/server.ts` (Server Client)
```ts
import { createServerClient as createClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component where cookies can't be set.
            // Safe to ignore if middleware refreshes sessions.
          }
        },
      },
    }
  );
}
```

### Step 6: Create `src/lib/supabase/middleware.ts`
```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

Then update the root `middleware.ts` to use this helper:
```ts
import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

### Step 7: Create `src/app/auth/callback/route.ts`
```ts
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
```

### Step 8: Create `src/hooks/use-user.ts`
```ts
"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createBrowserClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient();

    async function getUser() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        setUser(user);

        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          if (profileError) throw profileError;
          setProfile(profileData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user");
      } finally {
        setLoading(false);
      }
    }

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, profile, loading, error };
}
```

### Step 9: Verify
- Run `pnpm build` — must pass with no TypeScript errors
- All imports resolve correctly via `@/` alias
- The `Database` type covers every table and column from PROJECT_CONTEXT.md Section 8
- The auth callback handler properly exchanges code for session
- The `useUser` hook fetches both auth user and profile data
