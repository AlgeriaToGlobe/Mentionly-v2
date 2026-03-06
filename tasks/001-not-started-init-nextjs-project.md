# Task 001: Initialize Next.js Project

## Status
not-started

## Depends On
none

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting.

## Objective
Set up a fully configured Next.js 14+ project with App Router, TypeScript, Tailwind CSS, and all required dependencies so that subsequent tasks can build features immediately.

## Scope
- Files to create or modify: `package.json`, `tailwind.config.ts`, `next.config.ts`, `tsconfig.json`, `postcss.config.js`, `src/app/layout.tsx`, `middleware.ts`, `.env.local.example`, `src/lib/utils.ts`, `src/lib/constants.ts`, `components.json` (shadcn config)
- Files NOT to touch: `PROJECT_CONTEXT.md`, `tasks/`, `supabase/`, `workflows/`

## Acceptance Criteria
- [ ] `pnpm install` completes without errors
- [ ] `pnpm dev` starts the dev server on localhost:3000
- [ ] `pnpm build` completes without TypeScript or build errors
- [ ] TypeScript strict mode is enabled in `tsconfig.json`
- [ ] Tailwind CSS is working with custom design tokens (orange palette, gray palette, fonts, shadows, background gradients)
- [ ] Plus Jakarta Sans (headlines) and Inter (body) load via `next/font`
- [ ] `@/` path alias resolves to `src/`
- [ ] shadcn/ui is initialized and at least one component (Button) can be imported from `src/components/ui/`
- [ ] `.env.local.example` contains all required environment variable templates from PROJECT_CONTEXT.md section 11
- [ ] `middleware.ts` protects `/dashboard/*` routes and redirects unauthenticated users to `/login`
- [ ] `src/lib/utils.ts` exports a `cn()` utility (clsx + tailwind-merge), `formatDate()`, and `formatNumber()`
- [ ] `src/lib/constants.ts` exports `PLAN_TIERS` and dashboard `NAV_ITEMS`
- [ ] Root layout (`src/app/layout.tsx`) sets up fonts, metadata (title, description, OG tags per section 13), and wraps children
- [ ] All dependencies installed: `@supabase/ssr`, `@supabase/supabase-js`, `framer-motion`, `lucide-react`, `recharts`, `react-hook-form`, `zod`, `sonner`, `@hookform/resolvers`

## Instructions

### Step 1: Initialize the Next.js project
```bash
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
```
If the directory already has files, you may need to work around that. Ensure the App Router (`src/app/`) structure is used.

### Step 2: Install all dependencies
```bash
pnpm add @supabase/ssr @supabase/supabase-js framer-motion lucide-react recharts react-hook-form zod sonner @hookform/resolvers clsx tailwind-merge
pnpm add -D @types/node
```

### Step 3: Initialize shadcn/ui
```bash
pnpm dlx shadcn@latest init
```
When prompted:
- Style: Default
- Base color: Orange
- CSS variables: Yes
- Path alias: `@/`
- Components path: `src/components/ui`
- Utils path: `src/lib/utils`

Then add commonly used components:
```bash
pnpm dlx shadcn@latest add button input label card badge separator dropdown-menu dialog sheet accordion tabs tooltip avatar scroll-area
```

### Step 4: Configure `tailwind.config.ts`
Extend the theme with the full design system from PROJECT_CONTEXT.md Section 6. Merge with whatever shadcn generates (shadcn adds its own CSS variable-based color system — keep both).

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
        },
        success: "#22C55E",
        warning: "#EAB308",
        error: "#EF4444",
        info: "#3B82F6",
      },
      fontFamily: {
        heading: ["var(--font-plus-jakarta-sans)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "hero-title": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "hero-title-mobile": ["36px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "section-title": ["42px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "section-title-mobile": ["28px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "card-title": ["22px", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.75", fontWeight: "400" }],
        "body": ["16px", { lineHeight: "1.7", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.6", fontWeight: "400" }],
        "caption": ["12px", { lineHeight: "1.5", letterSpacing: "0.05em", fontWeight: "500" }],
      },
      borderRadius: {
        "2xl": "16px",
      },
      boxShadow: {
        "card": "0 1px 2px rgba(0,0,0,0.05)",
        "card-hover": "0 4px 6px rgba(0,0,0,0.07)",
        "floating": "0 10px 15px rgba(0,0,0,0.1)",
        "stat-badge": "0 20px 25px rgba(0,0,0,0.1)",
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at 50% 50%, #FFF7ED 0%, #FFEDD5 25%, #FFFFFF 60%)",
        "testimonial-gradient": "linear-gradient(180deg, #FFEDD5 0%, #FFFFFF 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
```

### Step 5: Set up `next/font` in `src/app/layout.tsx`
```tsx
import { Plus_Jakarta_Sans, Inter } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
```

Apply both font variables to the `<html>` tag's className: `className={`${plusJakartaSans.variable} ${inter.variable} font-body antialiased`}`.

Set metadata in layout.tsx per PROJECT_CONTEXT.md section 13:
```tsx
export const metadata: Metadata = {
  title: "Mentionly — AI-Powered Reddit Marketing Platform",
  description: "Discover high-intent Reddit threads, generate natural comments, and get your brand mentioned — all without managing a single Reddit account.",
  openGraph: {
    title: "Mentionly — Turn Reddit Into Your #1 Growth Channel",
    description: "Discover high-intent Reddit threads, generate natural comments, and get your brand mentioned.",
    url: "https://mentionly.com",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
};
```

### Step 6: Create `src/lib/utils.ts`
```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num);
}
```

### Step 7: Create `src/lib/constants.ts`
```ts
export const PLAN_TIERS = [
  {
    name: "Starter",
    price: "Free",
    priceDetail: "forever",
    description: "Try Mentionly with basic features",
    features: ["5 thread discoveries/month", "3 AI-generated comments", "Basic analytics", "1 project", "Community support"],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Lite",
    price: "$79",
    priceDetail: "/month",
    description: "For solo founders getting started",
    features: ["100 thread discoveries/month", "50 AI-generated comments", "10 managed postings", "Full analytics", "3 projects", "Email support"],
    cta: "Start Lite Plan",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$129",
    priceDetail: "/month",
    description: "Most popular — for growing brands",
    features: ["500 thread discoveries/month", "200 AI-generated comments", "50 managed postings", "Smart upvote boosting", "Full analytics + AI visibility", "10 projects", "Priority support", "Competitor tracking (5)"],
    cta: "Start Pro Plan",
    highlighted: true,
    badge: "Recommended",
  },
  {
    name: "Max",
    price: "$199",
    priceDetail: "/month",
    description: "For agencies and power users",
    features: ["Unlimited discoveries", "Unlimited AI comments", "200 managed postings", "Advanced upvote boosting", "Full analytics + AI visibility", "Unlimited projects", "Dedicated account manager", "API access"],
    cta: "Start Max Plan",
    highlighted: false,
  },
] as const;

export const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Discover", href: "/dashboard/discover", icon: "Search" },
  { label: "Comments", href: "/dashboard/comments", icon: "MessageSquare" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "BarChart3" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
] as const;

export const MAX_CREDITS = 10000;
export const APP_NAME = "Mentionly";
export const APP_URL = "https://mentionly.com";
```

### Step 8: Create `.env.local.example`
Copy the exact environment variables from PROJECT_CONTEXT.md Section 11, with placeholder values:
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Stripe (DEFERRED)
# STRIPE_SECRET_KEY=sk_live_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# n8n
N8N_WEBHOOK_BASE_URL=https://your-n8n-instance.com
N8N_WEBHOOK_SECRET=your-shared-secret

# App
NEXT_PUBLIC_APP_URL=https://mentionly.com
NEXT_PUBLIC_APP_NAME=Mentionly
```

### Step 9: Create `middleware.ts` at project root
```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
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

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

### Step 10: Configure `next.config.ts`
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
```

### Step 11: Verify
Run `pnpm build` — it must complete without errors. Confirm the dev server starts and shows a default page at localhost:3000.
