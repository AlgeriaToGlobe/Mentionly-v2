# Task 001: Initialize Next.js Project

## Status
not-started

## Depends On
none

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting.

## Objective
Bootstrap a Next.js 14+ project with App Router, TypeScript, Tailwind CSS, and all required dependencies, fully configured with the Mentionly design system tokens and auth middleware.

## Scope
- Files to create or modify: `package.json`, `tailwind.config.ts`, `next.config.ts`, `tsconfig.json`, `postcss.config.js`, `src/app/layout.tsx`, `middleware.ts`, `.env.local.example`, `src/lib/utils.ts`
- Files NOT to touch: `PROJECT_CONTEXT.md`, `tasks/`, `supabase/`, `workflows/`

## Acceptance Criteria
- [ ] `pnpm install` succeeds with zero errors
- [ ] `pnpm dev` starts the dev server on localhost:3000
- [ ] `pnpm build` compiles without errors
- [ ] TypeScript strict mode is enabled in `tsconfig.json`
- [ ] `@/` path alias maps to `src/`
- [ ] Tailwind config includes full Mentionly color palette (orange 50-900, neutral 50-900, status colors), typography scale, and spacing tokens
- [ ] `next/font` loads Plus Jakarta Sans (headlines) and Inter (body)
- [ ] Root layout (`src/app/layout.tsx`) applies fonts, metadata (title, description, og tags), and wraps children
- [ ] `middleware.ts` protects `/dashboard/*` routes by checking Supabase session; redirects unauthenticated users to `/login`
- [ ] `.env.local.example` contains all env vars from PROJECT_CONTEXT.md section 11
- [ ] `src/lib/utils.ts` exports `cn()` utility using `clsx` + `tailwind-merge`
- [ ] shadcn/ui is initialized with orange theme (components install to `src/components/ui/`)
- [ ] All dependencies installed: `@supabase/ssr`, `@supabase/supabase-js`, `framer-motion`, `lucide-react`, `recharts`, `react-hook-form`, `zod`, `sonner`, `@radix-ui/react-*` (via shadcn)

## Instructions

### Step 1: Create Next.js project
Run `pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm` from the project root. If the directory already has files, you may need to use `--yes` or handle the prompts. Ensure App Router and `src/` directory are used.

### Step 2: Install dependencies
```bash
pnpm add @supabase/ssr @supabase/supabase-js framer-motion lucide-react recharts react-hook-form @hookform/resolvers zod sonner clsx tailwind-merge
pnpm add -D @types/node
```

### Step 3: Initialize shadcn/ui
Run `pnpm dlx shadcn@latest init` and configure:
- Style: Default
- Base color: Orange
- CSS variables: Yes
- Components path: `src/components/ui`
- Utils path: `src/lib/utils`

Then install commonly needed components:
```bash
pnpm dlx shadcn@latest add button input label card dialog dropdown-menu accordion tabs badge separator sheet scroll-area tooltip avatar
```

### Step 4: Configure `tailwind.config.ts`
Extend the theme with Mentionly design tokens from PROJECT_CONTEXT.md section 6:

**Colors:**
- `orange`: 50 (#FFF7ED) through 900 (#7C2D12), with 500 (#F97316) as main accent
- `neutral`: 50 (#F9FAFB) through 900 (#111827)
- `status`: success (#22C55E), warning (#EAB308), error (#EF4444), info (#3B82F6)
- `background`: page (#FFFFFF), section (#F9FAFB), card (#FFFFFF)

**Font families:**
- `heading`: "Plus Jakarta Sans", sans-serif
- `body`: "Inter", sans-serif
- `mono`: "JetBrains Mono", monospace

**Font sizes (with line-height and letter-spacing):**
- `hero-title`: [64px, { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }]
- `section-title`: [42px, { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }]
- `card-title`: [22px, { lineHeight: "1.3", fontWeight: "600" }]
- `body-lg`: [18px, { lineHeight: "1.75", fontWeight: "400" }]
- `body`: [16px, { lineHeight: "1.7", fontWeight: "400" }]
- `body-sm`: [14px, { lineHeight: "1.6", fontWeight: "400" }]
- `caption`: [12px, { lineHeight: "1.5", letterSpacing: "0.05em", fontWeight: "500" }]

**Border radius:**
- `button`: 8px, `card`: 16px, `badge`: 9999px, `input`: 8px

**Box shadows:**
- `card`: "0 1px 2px rgba(0,0,0,0.05)"
- `card-hover`: "0 4px 6px rgba(0,0,0,0.07)"
- `floating`: "0 10px 15px rgba(0,0,0,0.1)"
- `stat-badge`: "0 20px 25px rgba(0,0,0,0.1)"

### Step 5: Set up fonts in `src/app/layout.tsx`
```typescript
import { Plus_Jakarta_Sans, Inter } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
```
Apply both font variables to the `<html>` tag via `className`. Set default metadata with Mentionly title, description, and OG tags per PROJECT_CONTEXT.md section 13.

### Step 6: Create `src/lib/utils.ts`
```typescript
import { clsx, type ClassValue } from "clsx";
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

### Step 7: Create `middleware.ts` at project root
```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Create a response to modify
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
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

### Step 8: Create `.env.local.example`
Copy all environment variables from PROJECT_CONTEXT.md section 11 with placeholder values. Include comments grouping them by service (Supabase, Stripe deferred, n8n, App).

### Step 9: Configure `next.config.ts`
Enable any needed image domains (e.g., Supabase storage, avatars). Set `images.remotePatterns` to allow Supabase URLs. No other special config needed.

### Step 10: Verify
Run `pnpm build` to confirm everything compiles. Fix any TypeScript or configuration errors.
