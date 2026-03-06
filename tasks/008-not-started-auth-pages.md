# Task 008: Auth Pages (Login & Signup)

## Status
not-started

## Depends On
002

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting.

## Objective
Build the login and signup pages with email/password forms, Google OAuth button, and magic link option, fully integrated with Supabase Auth and styled consistently with the marketing site.

## Scope
- Files to create or modify: `src/app/login/page.tsx`, `src/app/signup/page.tsx`
- Files NOT to touch: `src/app/dashboard/`, `supabase/migrations/`, `src/components/marketing/`

## Acceptance Criteria
- [ ] `/login` page renders a centered auth form with email, password, "Sign In" button
- [ ] `/login` has a Google OAuth button ("Continue with Google") that calls `supabase.auth.signInWithOAuth({ provider: 'google' })`
- [ ] `/login` has a "Sign in with Magic Link" option that sends a magic link email via `supabase.auth.signInWithOtp({ email })`
- [ ] `/login` has a link to `/signup` ("Don't have an account? Sign up")
- [ ] `/signup` page renders a centered auth form with full name, email, password, "Create Account" button
- [ ] `/signup` has a Google OAuth button identical to login
- [ ] `/signup` has a link to `/login` ("Already have an account? Sign in")
- [ ] Both forms use `react-hook-form` with `zod` validation schemas
- [ ] Email validation: required, valid email format
- [ ] Password validation: required, minimum 8 characters
- [ ] Name validation (signup only): required, minimum 2 characters
- [ ] Loading states: buttons show spinner/loading text while auth request is in progress
- [ ] Error states: form-level error message displayed below form (e.g., "Invalid credentials", "Email already registered")
- [ ] Success redirect: after successful login/signup, redirect to `/dashboard`
- [ ] Magic link success: show a "Check your email" message instead of redirecting
- [ ] Forms use shadcn `Input`, `Label`, `Button` components
- [ ] Pages have correct metadata per PROJECT_CONTEXT.md
- [ ] Styling is consistent: centered card layout, clean, matches marketing site feel
- [ ] `pnpm build` passes with no errors

## Instructions

### Step 1: Create `src/app/login/page.tsx`
Mark as `"use client"` (needs hooks, form state, Supabase client).

**Imports:**
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
```

**Zod schema:**
```tsx
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type LoginFormData = z.infer<typeof loginSchema>;
```

**Component logic:**
```tsx
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  async function handleGoogleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function handleMagicLink() {
    const email = getValues("email");
    if (!email) { setError("Please enter your email first"); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) { setError(error.message); }
    else { setMagicLinkSent(true); }
    setLoading(false);
  }
}
```

**Layout:**
```tsx
<div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
  <div className="w-full max-w-md">
    {/* Logo */}
    <Link href="/" className="block text-center font-heading text-2xl font-bold text-gray-900 mb-8">
      Mentionly
    </Link>

    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-card">
      <h1 className="text-card-title font-heading text-gray-900 text-center mb-6">
        Welcome back
      </h1>

      {/* Google OAuth button */}
      <Button
        variant="outline"
        className="w-full mb-4"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        {/* Google icon SVG */}
        Continue with Google
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-400">or</span>
        </div>
      </div>

      {/* Magic link sent state */}
      {magicLinkSent ? (
        <div className="text-center py-4">
          <p className="text-body text-gray-700 font-medium">Check your email</p>
          <p className="text-body-sm text-gray-500 mt-2">We sent a magic link to your email address.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
            {errors.email && <p className="text-sm text-error mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
            {errors.password && <p className="text-sm text-error mt-1">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : "Sign In"}
          </Button>

          <button
            type="button"
            onClick={handleMagicLink}
            className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium"
            disabled={loading}
          >
            Sign in with Magic Link
          </button>
        </form>
      )}
    </div>

    <p className="mt-6 text-center text-sm text-gray-500">
      Don't have an account?{" "}
      <Link href="/signup" className="text-orange-600 hover:text-orange-700 font-medium">Sign up</Link>
    </p>
  </div>
</div>
```

Note: Since this is a `"use client"` page component, metadata must be set via a separate `metadata` export in a layout or a `generateMetadata` function. Alternatively, set the `<title>` using `document.title` or a `Head` component. The simplest approach: create a small wrapper or just set metadata in the closest layout. If the root layout already has default metadata, the page can override it by exporting metadata from a co-located `layout.tsx` — or simply accept the default for now.

### Step 2: Create `src/app/signup/page.tsx`
Very similar to login. Key differences:

**Zod schema adds `fullName`:**
```tsx
const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
```

**Submit handler uses `signUp`:**
```tsx
const { error } = await supabase.auth.signUp({
  email: data.email,
  password: data.password,
  options: {
    data: { full_name: data.fullName },
    emailRedirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

**After signup:** Show a "Check your email to confirm" message (since email confirmation is enabled), or redirect to `/dashboard` if auto-confirm is on for development.

**Form adds name field before email:**
```tsx
<div>
  <Label htmlFor="fullName">Full Name</Label>
  <Input id="fullName" type="text" placeholder="John Doe" {...register("fullName")} />
  {errors.fullName && <p className="text-sm text-error mt-1">{errors.fullName.message}</p>}
</div>
```

**Bottom link:** "Already have an account? Sign in" linking to `/login`.

### Step 3: Verify
- `pnpm build` passes
- Both pages render correctly with proper styling
- Form validation shows inline errors
- Google OAuth button triggers Supabase OAuth flow (will redirect to Google — may fail without Google client ID configured, but the code path must be correct)
- Magic link button sends OTP email (will fail without Supabase configured, but code path correct)
- Password login calls `signInWithPassword` correctly
