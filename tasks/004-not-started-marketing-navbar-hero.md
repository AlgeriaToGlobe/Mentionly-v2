# Task 004: Marketing Page - Navbar & Hero Section

## Status
not-started

## Depends On
001

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting.

## Objective
Build the responsive marketing navbar and hero section with animated floating stat cards, warm gradient background, and dual CTA buttons, then wire them into the homepage.

## Scope
- Files to create or modify: `src/components/marketing/navbar.tsx`, `src/components/marketing/hero.tsx`, `src/app/page.tsx`
- Files NOT to touch: `src/app/dashboard/`, `supabase/`, `src/lib/supabase/`

## Acceptance Criteria
- [ ] Navbar is sticky on scroll with a background blur effect
- [ ] Navbar shows "Mentionly" logo/text on the left, nav links (Home, Features, Pricing, Blog) in center, "Sign In" (ghost) + "Get Started" (solid orange) buttons on right
- [ ] Navbar collapses to a hamburger menu on mobile (`md:` breakpoint) with a slide-out sheet/drawer containing all links
- [ ] Hero section has a warm radial gradient background (`radial-gradient(circle at 50% 50%, #FFF7ED 0%, #FFEDD5 25%, #FFFFFF 60%)`)
- [ ] Hero has a small category badge pill at top (e.g., "AI-Powered Reddit Marketing")
- [ ] Hero headline: large text using `hero-title` size on desktop, `hero-title-mobile` on mobile
- [ ] Hero subtitle: body-lg text, muted color
- [ ] Two CTA buttons: "Get Started Free" (solid orange, links to `/signup`) and "See How It Works" (ghost/outline, scrolls to features or links to `#how-it-works`)
- [ ] 3-4 floating stat cards around the hero area (e.g., "+340% Traffic", "25K+ Threads Scanned", "4.9★ Rating", "200+ Brands") with subtle shadow and Framer Motion float animation
- [ ] Trust bar below hero: "Trusted by 200+ businesses" text with a row of placeholder avatar circles
- [ ] All Framer Motion animations: fade-up on scroll reveal, staggered children, floating card hover
- [ ] Fully responsive: stacks vertically on mobile, stat cards reposition or hide on small screens
- [ ] `src/app/page.tsx` imports and renders Navbar + Hero (more sections added in later tasks)

## Instructions

### Step 1: Create `src/components/marketing/navbar.tsx`
Mark as `"use client"` (needs scroll state, mobile menu toggle).

**Structure:**
```tsx
<header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-md">
  <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    {/* Logo */}
    <Link href="/" className="font-heading text-xl font-bold text-gray-900">
      Mentionly
    </Link>

    {/* Desktop nav links */}
    <div className="hidden md:flex items-center gap-8">
      <Link href="/#features">Features</Link>
      <Link href="/pricing">Pricing</Link>
      <Link href="/blog">Blog</Link>
    </div>

    {/* Desktop CTAs */}
    <div className="hidden md:flex items-center gap-3">
      <Button variant="ghost" asChild><Link href="/login">Sign In</Link></Button>
      <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
        <Link href="/signup">Get Started</Link>
      </Button>
    </div>

    {/* Mobile hamburger */}
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
      </SheetTrigger>
      <SheetContent side="right">
        {/* All links + CTAs stacked vertically */}
      </SheetContent>
    </Sheet>
  </nav>
</header>
```

Use shadcn `Sheet` component for mobile menu. Use `lucide-react` `Menu` icon. Import `Button` from `@/components/ui/button`.

### Step 2: Create `src/components/marketing/hero.tsx`
Mark as `"use client"` (needs Framer Motion).

**Structure:**
```tsx
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const floatingStats = [
  { label: "+340% Traffic", position: "top-20 left-10" },
  { label: "25K+ Threads", position: "top-32 right-8" },
  { label: "4.9★ Rating", position: "bottom-24 left-16" },
  { label: "200+ Brands", position: "bottom-20 right-12" },
];
```

**Layout:**
- Outer section with `bg-hero-gradient` (from tailwind config) or inline radial gradient
- `max-w-7xl mx-auto px-6 py-20 md:py-32` container
- Center-aligned text content
- Category badge: `<span>` with `rounded-full bg-orange-100 text-orange-600 px-4 py-1.5 text-body-sm font-medium`
- Headline: `text-hero-title-mobile md:text-hero-title font-heading text-gray-900`
  - Example: "Turn Reddit Into Your **#1 Growth Channel**" (bold the key phrase with `<span className="text-orange-500">`)
- Subtitle: `text-body-lg text-gray-500 max-w-2xl mx-auto mt-6`
- CTA row: `flex gap-4 justify-center mt-8`
  - Primary: `bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-8 py-3 text-lg font-semibold`
  - Secondary: `border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-8 py-3 text-lg font-semibold`

**Floating stat cards:**
- Position absolutely within a relative container
- Each card: `bg-white rounded-2xl shadow-stat-badge px-4 py-3 text-sm font-semibold`
- Animate with Framer Motion `animate={{ y: [0, -8, 0] }}` with `repeat: Infinity` and staggered `delay`
- Hide or reposition on mobile (use `hidden md:block` or adjust positions)

**Trust bar:**
- Below the hero content
- "Trusted by 200+ businesses" text centered
- Row of 5-6 overlapping avatar circles (use `div` with `bg-gray-200 rounded-full w-8 h-8 border-2 border-white -ml-2`)
- Subtle, muted styling

Wrap major elements with `<motion.div {...fadeUp}>` for scroll-reveal animation. Use `viewport={{ once: true, margin: "-100px" }}` on `whileInView`.

### Step 3: Update `src/app/page.tsx`
```tsx
import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      {/* More sections will be added by Tasks 005, 006, 007 */}
    </main>
  );
}
```

This is a Server Component (no `"use client"` needed at page level since Navbar and Hero handle their own client directive).

### Step 4: Verify
- Run `pnpm dev` and check the homepage visually
- Test responsive behavior at mobile, tablet, and desktop widths
- Confirm navbar hamburger menu opens/closes on mobile
- Confirm Framer Motion animations play on scroll
- Confirm `pnpm build` passes
