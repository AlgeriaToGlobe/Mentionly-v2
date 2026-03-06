# Task 006: Marketing Page - Testimonials & Pricing

## Status
not-started

## Depends On
001

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting.

## Objective
Build the testimonials carousel section with horizontal scrolling cards and the pricing section with 4 tiers, following the design system from PROJECT_CONTEXT.md.

## Scope
- Files to create or modify: `src/components/marketing/testimonials.tsx`, `src/components/marketing/pricing-section.tsx`
- Files NOT to touch: `src/app/page.tsx` (Task 007 assembles), `src/app/dashboard/`, `supabase/`

## Acceptance Criteria
- [ ] Testimonials section has a warm gradient background (`testimonial-gradient` or `linear-gradient(180deg, #FFEDD5 0%, #FFFFFF 100%)`)
- [ ] Carousel shows 3 testimonial cards on desktop, 1 on mobile
- [ ] Left/right arrow navigation buttons and dot indicators
- [ ] Each testimonial card: review platform icon area, 5 gold/yellow star icons, bold quote headline, body text, "— Name" + date
- [ ] 6 placeholder testimonials with realistic content about Reddit marketing results
- [ ] Pricing section shows 4 tiers side-by-side on desktop, stacked on mobile
- [ ] Tiers: Starter (Free), Lite ($79/mo), Pro ($129/mo, "Recommended" badge), Max ($199/mo)
- [ ] Pro tier is visually highlighted (orange border, "Recommended" badge, solid orange CTA button)
- [ ] Other tiers have ghost/outline CTA buttons
- [ ] Each tier card: name, price, description, feature list with orange checkmarks, CTA button
- [ ] All CTAs link to `/signup` (or could link to waitlist)
- [ ] Guarantees row below pricing: "30-day money back", "Cancel anytime", "Lifetime rate lock"
- [ ] Both sections have proper section titles with `text-section-title` styling

## Instructions

### Step 1: Create `src/components/marketing/testimonials.tsx`
Mark as `"use client"` (needs carousel state + Framer Motion).

**Testimonials data array (6 items):**
```ts
const testimonials = [
  {
    platform: "G2",
    headline: "Reddit traffic went through the roof",
    body: "Within 3 weeks of using Mentionly, our Reddit referral traffic increased by 340%. The AI-generated comments are indistinguishable from organic posts.",
    author: "Sarah Chen",
    date: "Feb 2026",
  },
  {
    platform: "Trustpilot",
    headline: "Finally, Reddit marketing that works",
    body: "We tried managing Reddit manually for months. Mentionly found threads we never would have discovered and the comments actually get upvoted.",
    author: "Marcus Johnson",
    date: "Jan 2026",
  },
  {
    platform: "Product Hunt",
    headline: "Game changer for SaaS founders",
    body: "As a solo founder, I don't have time for Reddit. Mentionly handles everything — discovery, writing, posting. I just approve and watch the leads come in.",
    author: "Alex Rivera",
    date: "Mar 2026",
  },
  {
    platform: "G2",
    headline: "Best ROI of any marketing channel",
    body: "We spent $10K/month on paid ads with mediocre results. Mentionly costs a fraction and drives more qualified traffic from Reddit threads that rank on Google.",
    author: "Priya Patel",
    date: "Feb 2026",
  },
  {
    platform: "Trustpilot",
    headline: "Our brand now appears in AI answers",
    body: "The AI visibility tracking showed us that Reddit mentions are getting picked up by ChatGPT and Perplexity. Organic reach we never expected.",
    author: "David Kim",
    date: "Jan 2026",
  },
  {
    platform: "Product Hunt",
    headline: "Set it and forget it Reddit growth",
    body: "I check in once a week to approve comments. Mentionly does the rest — finding threads, generating replies, even boosting visibility. Incredible tool.",
    author: "Emma Thompson",
    date: "Mar 2026",
  },
];
```

**Carousel implementation:**
Use React state for the current index. Calculate visible cards based on window width or use CSS approach:

```tsx
const [currentIndex, setCurrentIndex] = useState(0);
const visibleCount = 3; // On desktop; handle mobile with responsive logic

function next() {
  setCurrentIndex((i) => Math.min(i + 1, testimonials.length - visibleCount));
}
function prev() {
  setCurrentIndex((i) => Math.max(i - 1, 0));
}
```

Or use a CSS `overflow-x-hidden` container with `transform: translateX()` animated by Framer Motion.

**Card structure:**
```tsx
<div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card">
  {/* Platform icon placeholder */}
  <div className="text-sm text-gray-400 mb-2">{testimonial.platform}</div>
  {/* 5 stars */}
  <div className="flex gap-0.5 mb-3">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
    ))}
  </div>
  <h3 className="font-heading font-bold text-gray-900 text-lg mb-2">"{testimonial.headline}"</h3>
  <p className="text-body-sm text-gray-500 mb-4">{testimonial.body}</p>
  <p className="text-sm text-gray-400">— {testimonial.author}, {testimonial.date}</p>
</div>
```

**Navigation:** Left/right arrow buttons (ChevronLeft, ChevronRight from lucide) positioned at sides. Dot indicators below. Disable arrows at boundaries.

**Section wrapper:**
```tsx
<section className="py-16 md:py-20" style={{ background: "linear-gradient(180deg, #FFEDD5 0%, #FFFFFF 100%)" }}>
  <div className="mx-auto max-w-7xl px-6">
    <h2 className="text-center text-section-title-mobile md:text-section-title font-heading text-gray-900 mb-4">
      Loved by Marketers
    </h2>
    <p className="text-center text-body-lg text-gray-500 mb-12 max-w-2xl mx-auto">
      See what our users are saying about growing their brands with Reddit.
    </p>
    {/* Carousel */}
  </div>
</section>
```

### Step 2: Create `src/components/marketing/pricing-section.tsx`
Mark as `"use client"` for Framer Motion animations.

**Pricing tiers data:**
```ts
const tiers = [
  {
    name: "Starter",
    price: "Free",
    priceDetail: "forever",
    description: "Try Mentionly with basic features",
    features: [
      "5 thread discoveries/month",
      "3 AI-generated comments",
      "Basic analytics",
      "1 project",
      "Community support",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Lite",
    price: "$79",
    priceDetail: "/month",
    description: "For solo founders getting started",
    features: [
      "100 thread discoveries/month",
      "50 AI-generated comments",
      "10 managed postings",
      "Full analytics dashboard",
      "3 projects",
      "Email support",
      "Competitor tracking (1)",
    ],
    cta: "Start Lite Plan",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$129",
    priceDetail: "/month",
    description: "Most popular — for growing brands",
    features: [
      "500 thread discoveries/month",
      "200 AI-generated comments",
      "50 managed postings",
      "Smart upvote boosting",
      "Full analytics + AI visibility",
      "10 projects",
      "Priority support",
      "Competitor tracking (5)",
      "Custom comment tone",
    ],
    cta: "Start Pro Plan",
    highlighted: true,
    badge: "Recommended",
  },
  {
    name: "Max",
    price: "$199",
    priceDetail: "/month",
    description: "For agencies and power users",
    features: [
      "Unlimited thread discoveries",
      "Unlimited AI comments",
      "200 managed postings",
      "Advanced upvote boosting",
      "Full analytics + AI visibility",
      "Unlimited projects",
      "Dedicated account manager",
      "Competitor tracking (unlimited)",
      "Custom comment tone",
      "API access",
      "White-label reports",
    ],
    cta: "Start Max Plan",
    highlighted: false,
  },
];
```

**Layout:**
```tsx
<section id="pricing" className="py-16 md:py-20 bg-white">
  <div className="mx-auto max-w-7xl px-6">
    <div className="text-center mb-12">
      <h2 className="text-section-title-mobile md:text-section-title font-heading text-gray-900">
        Simple, Transparent Pricing
      </h2>
      <p className="mt-4 text-body-lg text-gray-500 max-w-2xl mx-auto">
        Start free. Upgrade when you're ready. No hidden fees.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tiers.map((tier) => <PricingCard key={tier.name} {...tier} />)}
    </div>

    {/* Guarantees */}
    <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-green-500" />
        30-day money back guarantee
      </div>
      <div className="flex items-center gap-2">
        <XCircle className="h-5 w-5 text-green-500" />
        Cancel anytime
      </div>
      <div className="flex items-center gap-2">
        <Lock className="h-5 w-5 text-green-500" />
        Lifetime rate lock
      </div>
    </div>
  </div>
</section>
```

**Pricing card:**
- Default: `bg-white border border-gray-200 rounded-2xl p-6`
- Highlighted (Pro): `bg-white border-2 border-orange-500 rounded-2xl p-6 relative` with a `<Badge>` absolutely positioned at top: `absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold`
- Price: large `text-4xl font-heading font-bold text-gray-900` + small `text-body-sm text-gray-500` for "/month"
- Features: list with `Check` icon in `text-orange-500` for each item
- CTA: highlighted tier gets `bg-orange-500 hover:bg-orange-600 text-white w-full`, others get `border border-gray-300 text-gray-700 hover:bg-gray-50 w-full`
- All CTA buttons link to `/signup`

### Step 3: Verify
- `pnpm build` passes
- Components export as named exports: `Testimonials`, `PricingSection`
- Visual check at multiple breakpoints
- Carousel navigation works correctly
