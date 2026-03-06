# Task 002: Supabase Client & Auth Setup

## Status
not-started

## Depends On
001

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting. Pay special attention to sections 8 (Database Schema), 9 (Auth Configuration), and 11 (Environment Variables).

## Objective
Create all Supabase client utilities (browser, server, middleware helper), the auth callback route handler, a `useUser` hook, and full TypeScript types matching the database schema.

## Scope
- Files to create or modify: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`, `src/app/auth/callback/route.ts`, `src/hooks/use-user.ts`, `src/types/database.ts`, `src/types/index.ts`
- Files NOT to touch: `middleware.ts` (already created in Task 001), `tailwind.config.ts`, `package.json`, any marketing or dashboard components

## Acceptance Criteria
- [ ] `src/lib/supabase/client.ts` exports a `createBrowserClient()` function that returns a typed Supabase client for use in Client Components
- [ ] `src/lib/supabase/server.ts` exports a `createServerClient()` function that returns a typed Supabase client for use in Server Components and Route Handlers (uses `cookies()` from `next/headers`)
- [ ] `src/lib/supabase/middleware.ts` exports a helper function `updateSession(request)` that refreshes the auth session and returns the response (used by root `middleware.ts`)
- [ ] `src/app/auth/callback/route.ts` handles the OAuth/magic-link redirect: exchanges the auth code for a session and redirects to `/dashboard`
- [ ] `src/hooks/use-user.ts` exports a `useUser()` hook that returns `{ user, loading, error }` using the browser client
- [ ] `src/types/database.ts` contains full TypeScript types for all Supabase tables (profiles, projects, threads, comments, analytics, competitors, waitlist, alerts, credit_transactions) matching PROJECT_CONTEXT.md section 8 exactly
- [ ] `src/types/index.ts` re-exports database types and defines shared app types (e.g., `Plan`, `CommentStatus`, `ThreadStatus`, `BuyingIntent`, `Tone`)
- [ ] All files use proper TypeScript types (no `any`)
- [ ] All files compile without errors (`pnpm build` passes)

## Instructions

### Step 1: Create directory structure
```bash
mkdir -p src/lib/supabase src/hooks src/types src/app/auth/callback
```

### Step 2: Create `src/lib/supabase/client.ts` (Browser Client)
This is used in Client Components (`"use client"` files).

```typescript
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

### Step 3: Create `src/lib/supabase/server.ts` (Server Client)
This is used in Server Components, Server Actions, and Route Handlers.

```typescript
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
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method is called from a Server Component
            // where cookies can't be set. This can be ignored if
            // middleware is refreshing sessions.
          }
        },
      },
    }
  );
}
```

### Step 4: Create `src/lib/supabase/middleware.ts` (Middleware Helper)
This helper is called by the root `middleware.ts`. It refreshes the Supabase auth session on every request to keep it alive.

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is not signed in and the route is protected, redirect to login
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

Then update the root `middleware.ts` to import and use `updateSession` from this file instead of duplicating logic:
```typescript
import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

### Step 5: Create `src/app/auth/callback/route.ts`
This handles the redirect from Supabase Auth (OAuth, magic links, email confirmation).

```typescript
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
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to login with error if code exchange fails
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
```

### Step 6: Create `src/hooks/use-user.ts`
```typescript
"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient();

    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to get user");
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, error };
}
```

### Step 7: Create `src/types/database.ts`
Define the full `Database` type matching every table in PROJECT_CONTEXT.md section 8. Structure it as:

```typescript
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { /* all columns with TS types */ };
        Insert: { /* required + optional columns */ };
        Update: { /* all optional */ };
      };
      projects: { Row: {...}; Insert: {...}; Update: {...}; };
      threads: { Row: {...}; Insert: {...}; Update: {...}; };
      comments: { Row: {...}; Insert: {...}; Update: {...}; };
      analytics: { Row: {...}; Insert: {...}; Update: {...}; };
      competitors: { Row: {...}; Insert: {...}; Update: {...}; };
      waitlist: { Row: {...}; Insert: {...}; Update: {...}; };
      alerts: { Row: {...}; Insert: {...}; Update: {...}; };
      credit_transactions: { Row: {...}; Insert: {...}; Update: {...}; };
    };
  };
};
```

Map SQL types to TypeScript:
- `UUID` -> `string`
- `TEXT` -> `string`
- `TEXT[]` -> `string[]`
- `INTEGER` -> `number`
- `REAL` -> `number`
- `BOOLEAN` -> `boolean`
- `TIMESTAMPTZ` -> `string`
- `DATE` -> `string`
- `CHECK (col IN ('a','b'))` -> `"a" | "b"`

For each table:
- `Row`: All columns typed (non-nullable have required types, nullable use `| null`)
- `Insert`: Columns with DEFAULT are optional (use `?`), columns with NOT NULL and no default are required
- `Update`: All columns are optional (`Partial<Row>` essentially)

### Step 8: Create `src/types/index.ts`
Re-export the database types and add convenience aliases:

```typescript
export type { Database } from "./database";

// Table row type shortcuts
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Thread = Database["public"]["Tables"]["threads"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type Analytics = Database["public"]["Tables"]["analytics"]["Row"];
export type Competitor = Database["public"]["Tables"]["competitors"]["Row"];
export type WaitlistEntry = Database["public"]["Tables"]["waitlist"]["Row"];
export type Alert = Database["public"]["Tables"]["alerts"]["Row"];
export type CreditTransaction = Database["public"]["Tables"]["credit_transactions"]["Row"];

// Enum types
export type Plan = "free" | "lite" | "pro" | "max";
export type Tone = "helpful" | "casual" | "professional" | "technical" | "witty";
export type ThreadStatus = "new" | "viewed" | "commented" | "skipped";
export type CommentStatus = "draft" | "pending" | "scheduled" | "live" | "failed" | "deleted";
export type BuyingIntent = "low" | "medium" | "high";
export type AlertType = "new_thread" | "brand_mention" | "competitor_activity" | "comment_status";
export type AlertDelivery = "in_app" | "email" | "both";
export type CreditTransactionType = "purchase" | "subscription_grant" | "comment_used" | "post_used" | "upvote_used" | "refund";
```

Import `Database` type properly from the local `database.ts` file.

### Step 9: Verify
Run `pnpm build` to confirm everything compiles. Check that there are no TypeScript errors in any of the created files.
