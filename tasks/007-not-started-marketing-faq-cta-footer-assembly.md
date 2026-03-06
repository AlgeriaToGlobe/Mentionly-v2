# Task 007: Marketing Page - FAQ, CTA, Footer & Full Assembly

## Status
not-started

## Depends On
004, 005, 006

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting.

## Objective
Build the FAQ accordion, final CTA band, footer, and trust bar components, then assemble ALL marketing sections into the homepage in the correct order. Also create the dedicated `/pricing` and `/blog` placeholder pages.

## Scope
- Files to create or modify: `src/components/marketing/faq.tsx`, `src/components/marketing/cta-section.tsx`, `src/components/marketing/footer.tsx`, `src/components/marketing/trust-bar.tsx`, `src/app/page.tsx`, `src/app/pricing/page.tsx`, `src/app/blog/page.tsx`
- Files NOT to touch: `src/app/dashboard/`, `supabase/`, `src/lib/supabase/`

## Acceptance Criteria
- [ ] FAQ section renders an accordion with 7 questions, clean expand/collapse with +/- icon rotation
- [ ] CTA section renders a bold headline, subtitle, and orange CTA button on a warm gradient background
- [ ] Footer renders with link columns, social icons, newsletter mini-form, and company info on dark background
- [ ] Trust bar renders "Trusted by 200+ businesses" with avatar row (if not already part of hero)
- [ ] `src/app/page.tsx` renders all sections in order: Navbar, Hero, Trust Bar (if separate), Features Bento, How It Works, Testimonials, Pricing, FAQ, CTA, Footer
- [ ] `/pricing` page renders: Navbar, PricingSection, FAQ, Footer
- [ ] `/blog` page renders: Navbar, placeholder "Coming Soon" content, Footer
- [ ] All pages have correct metadata (title, description) per PROJECT_CONTEXT.md Section 13
- [ ] Smooth scroll works for anchor links (#features, #pricing, #how-it-works)
- [ ] All sections maintain consistent spacing (py-16 md:py-20)

## Instructions

### Step 1: Create `src/components/marketing/faq.tsx`
Mark as `"use client"` (accordion interaction).

Use shadcn `Accordion` component (from `@/components/ui/accordion`). If not already installed, the implementing agent should run:
```bash
pnpm dlx shadcn@latest add accordion
```

**FAQ data (7 questions):**
```ts
const faqs = [
  {
    question: "How does Mentionly find relevant Reddit threads?",
    answer: "Our AI engine continuously scans thousands of subreddits using your target keywords, competitor names, and niche topics. We score each thread based on Google ranking position, buying intent signals, freshness, and subreddit authority to surface only the highest-value opportunities.",
  },
  {
    question: "Will my brand get banned from Reddit?",
    answer: "No. We use aged, high-karma Reddit accounts with established posting histories. Comments are crafted to be genuinely helpful and contextual — not spammy. Our posting patterns mimic natural user behavior, including gradual upvote delivery, to stay well within Reddit's guidelines.",
  },
  {
    question: "How are the AI comments generated?",
    answer: "Our AI analyzes the thread context, top existing comments, and your brand's tone and product details. It generates comments that naturally mention your product while providing genuine value to the conversation. You can review, edit, and approve every comment before it's posted.",
  },
  {
    question: "What is AI visibility tracking?",
    answer: "We monitor whether your brand appears in AI-generated search results from tools like ChatGPT, Perplexity, and Google AI Overviews. Reddit content is increasingly cited by these AI systems, so we track when your mentions get picked up.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, absolutely. All plans are month-to-month with no long-term contracts. Cancel anytime from your dashboard settings. You'll retain access until the end of your billing period. We also offer a 30-day money-back guarantee.",
  },
  {
    question: "How quickly will I see results?",
    answer: "Most users see their first Reddit mentions live within 24-48 hours of setting up their project. Meaningful traffic increases typically appear within 1-2 weeks as comments accumulate upvotes and threads continue ranking on Google.",
  },
  {
    question: "Do you support multiple brands or clients?",
    answer: "Yes. Pro and Max plans support multiple projects, each with their own keywords, subreddits, and brand settings. This makes Mentionly perfect for agencies managing multiple clients or businesses with multiple product lines.",
  },
];
```

**Structure:**
```tsx
<section id="faq" className="py-16 md:py-20 bg-gray-50">
  <div className="mx-auto max-w-3xl px-6">
    <h2 className="text-center text-section-title-mobile md:text-section-title font-heading text-gray-900 mb-4">
      Frequently Asked Questions
    </h2>
    <p className="text-center text-body-lg text-gray-500 mb-12">
      Everything you need to know about Mentionly.
    </p>
    <Accordion type="single" collapsible className="space-y-3">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="bg-white border border-gray-200 rounded-xl px-6"
        >
          <AccordionTrigger className="text-left font-heading font-semibold text-gray-900 hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-body text-gray-500">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
</section>
```

### Step 2: Create `src/components/marketing/cta-section.tsx`
```tsx
<section className="py-16 md:py-20" style={{ background: "radial-gradient(circle at 50% 50%, #FFF7ED 0%, #FFEDD5 40%, #FFFFFF 80%)" }}>
  <div className="mx-auto max-w-4xl px-6 text-center">
    <h2 className="text-section-title-mobile md:text-section-title font-heading text-gray-900">
      Ready to Turn Reddit Into Your Growth Engine?
    </h2>
    <p className="mt-4 text-body-lg text-gray-500 max-w-2xl mx-auto">
      Join 200+ brands already using Mentionly to get discovered on Reddit and beyond.
    </p>
    <div className="mt-8">
      <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-lg">
        <Link href="/signup">Get Started Free</Link>
      </Button>
    </div>
    <p className="mt-4 text-sm text-gray-400">No credit card required. Free plan available.</p>
  </div>
</section>
```

Can be a Server Component unless animations are added. If Framer Motion fade-up is desired, mark `"use client"`.

### Step 3: Create `src/components/marketing/footer.tsx`
```tsx
<footer className="bg-gray-900 text-gray-400 py-12">
  <div className="mx-auto max-w-7xl px-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {/* Column 1: Brand */}
      <div className="col-span-2 md:col-span-1">
        <Link href="/" className="font-heading text-xl font-bold text-white">Mentionly</Link>
        <p className="mt-3 text-sm">AI-powered Reddit marketing platform. Get your brand mentioned in the threads that matter.</p>
      </div>

      {/* Column 2: Product */}
      <div>
        <h4 className="font-heading font-semibold text-white mb-3">Product</h4>
        <ul className="space-y-2 text-sm">
          <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
          <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
          <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
          <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
        </ul>
      </div>

      {/* Column 3: Support */}
      <div>
        <h4 className="font-heading font-semibold text-white mb-3">Support</h4>
        <ul className="space-y-2 text-sm">
          <li><Link href="#faq" className="hover:text-white transition-colors">Help / FAQ</Link></li>
          <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
          <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
        </ul>
      </div>

      {/* Column 4: Newsletter + Social */}
      <div>
        <h4 className="font-heading font-semibold text-white mb-3">Stay Updated</h4>
        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter email"
            className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-orange-500 focus:outline-none"
          />
          <button className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600">
            Subscribe
          </button>
        </form>
        <div className="mt-4 flex gap-3">
          {/* X (Twitter) icon */}
          <a href="#" className="hover:text-white transition-colors" aria-label="Follow on X">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">...</svg>
          </a>
          {/* LinkedIn icon */}
          <a href="#" className="hover:text-white transition-colors" aria-label="Follow on LinkedIn">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">...</svg>
          </a>
        </div>
      </div>
    </div>

    <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm">
      <p>&copy; {new Date().getFullYear()} Mentionly. All rights reserved.</p>
    </div>
  </div>
</footer>
```

If the footer uses `onSubmit` or other interactivity, mark `"use client"`. For the social SVG icons, use simple inline SVGs for X (Twitter) and LinkedIn, or use Lucide's `Twitter` / `Linkedin` icons if available.

### Step 4: Create `src/components/marketing/trust-bar.tsx` (if not already part of hero)
Check if Task 004's hero already includes a trust bar. If it does, this component may not be needed separately. If the hero doesn't include it, create:
```tsx
<section className="py-8 bg-white">
  <div className="mx-auto max-w-7xl px-6 flex flex-col items-center gap-3">
    <p className="text-sm text-gray-400 font-medium">Trusted by 200+ businesses</p>
    <div className="flex -space-x-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white" />
      ))}
    </div>
  </div>
</section>
```

### Step 5: Assemble `src/app/page.tsx`
```tsx
import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { TrustBar } from "@/components/marketing/trust-bar";
import { FeaturesBento } from "@/components/marketing/features-bento";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Testimonials } from "@/components/marketing/testimonials";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FAQ } from "@/components/marketing/faq";
import { CTASection } from "@/components/marketing/cta-section";
import { Footer } from "@/components/marketing/footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustBar />
      <FeaturesBento />
      <HowItWorks />
      <Testimonials />
      <PricingSection />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  );
}
```

Set page metadata:
```tsx
export const metadata: Metadata = {
  title: "Mentionly — Turn Reddit Into Your #1 Growth Channel",
};
```

### Step 6: Create `src/app/pricing/page.tsx`
```tsx
import { Metadata } from "next";
import { Navbar } from "@/components/marketing/navbar";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FAQ } from "@/components/marketing/faq";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Pricing — Mentionly",
  description: "Simple, transparent pricing. Start free, upgrade when you're ready.",
};

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <PricingSection />
      <FAQ />
      <Footer />
    </main>
  );
}
```

### Step 7: Create `src/app/blog/page.tsx`
```tsx
import { Metadata } from "next";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Blog — Mentionly",
  description: "Insights and strategies for Reddit marketing.",
};

export default function BlogPage() {
  return (
    <main>
      <Navbar />
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-section-title-mobile md:text-section-title font-heading text-gray-900">
            Blog
          </h1>
          <p className="mt-4 text-body-lg text-gray-500">
            Coming soon. We're working on insightful articles about Reddit marketing, SEO, and AI visibility.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
```

### Step 8: Verify
- `pnpm build` passes with no errors
- Homepage renders all sections in correct order
- `/pricing` and `/blog` routes work
- Smooth scroll anchor links work (#features, #pricing, #how-it-works, #faq)
- All responsive breakpoints look correct
