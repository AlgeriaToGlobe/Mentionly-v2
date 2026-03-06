# Task 005: Marketing Page - Features Bento Grid & How It Works

## Status
not-started

## Depends On
001

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting.

## Objective
Build the features bento grid section with mini-illustrations and the "How It Works" 4-step section, both with Framer Motion staggered reveal animations.

## Scope
- Files to create or modify: `src/components/marketing/features-bento.tsx`, `src/components/marketing/how-it-works.tsx`
- Files NOT to touch: `src/app/page.tsx` (Task 007 assembles all sections), `src/app/dashboard/`, `supabase/`

## Acceptance Criteria
- [ ] Features bento grid renders a 2x2 grid on desktop, single column on mobile
- [ ] Each bento card has: a visual/illustration area at top (built with Tailwind + Lucide icons, not images), bold title, description paragraph
- [ ] Cards have white background, `border border-gray-200`, `rounded-2xl`, `p-6`, `shadow-card` on hover transitions to `shadow-card-hover`
- [ ] The 4 feature cards cover: Thread Discovery (search UI mockup), AI Comment Generation (chat interface mockup), Integration Network (orbiting account icons), Analytics Dashboard (chart with floating badge)
- [ ] "How It Works" section has 4 numbered steps in a horizontal layout on desktop, vertical on mobile
- [ ] Each step: orange number badge (circle), icon, title, short description
- [ ] Steps are: 1. Enter Your URL, 2. Discover Threads, 3. Generate & Approve, 4. We Handle the Rest
- [ ] Both sections use Framer Motion `whileInView` with staggered children for reveal animation
- [ ] Section titles use `text-section-title-mobile md:text-section-title font-heading` styling
- [ ] Both sections have proper `id` attributes for anchor linking (`#features`, `#how-it-works`)

## Instructions

### Step 1: Create `src/components/marketing/features-bento.tsx`
Mark as `"use client"` for Framer Motion.

**Section wrapper:**
```tsx
<section id="features" className="py-16 md:py-20 bg-white">
  <div className="mx-auto max-w-7xl px-6">
    <motion.div className="text-center mb-12" {...fadeUp}>
      <h2 className="text-section-title-mobile md:text-section-title font-heading text-gray-900">
        Everything You Need to Win on Reddit
      </h2>
      <p className="mt-4 text-body-lg text-gray-500 max-w-2xl mx-auto">
        From thread discovery to comment posting — Mentionly handles the entire Reddit marketing workflow.
      </p>
    </motion.div>
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      variants={stagger}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
    >
      {features.map((feature) => (
        <FeatureCard key={feature.title} {...feature} />
      ))}
    </motion.div>
  </div>
</section>
```

**Feature cards data:**
1. **Thread Discovery** — "Find High-Intent Reddit Threads" / "Our AI scans thousands of subreddits to surface threads that rank on Google, mention competitors, and show buying intent." / Mini-illustration: a search bar with filter pills and a list of 2-3 mini thread rows
2. **AI Comment Generation** — "Generate Natural, Non-Spammy Comments" / "AI crafts contextual comments that mention your brand naturally — no templates, no spam." / Mini-illustration: a chat-bubble UI showing a draft comment
3. **Managed Accounts** — "Post Through Aged, Trusted Accounts" / "We maintain a network of high-karma Reddit accounts so your mentions stick." / Mini-illustration: orbiting circles around a center logo
4. **Analytics Dashboard** — "Track Every Mention's Impact" / "See upvotes, traffic estimates, Google rankings, and AI citation tracking in real time." / Mini-illustration: a small bar chart with a floating "+42%" badge

**Mini-illustrations:** Build each using divs, Tailwind classes, and Lucide icons. Example for thread discovery:
```tsx
<div className="bg-gray-50 rounded-xl p-4 mb-4 h-40 flex flex-col gap-2">
  <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
    <Search className="h-4 w-4 text-gray-400" />
    <span className="text-sm text-gray-400">Search threads...</span>
  </div>
  <div className="flex gap-2">
    <span className="rounded-full bg-orange-100 text-orange-600 px-2 py-0.5 text-xs">r/watches</span>
    <span className="rounded-full bg-gray-100 text-gray-600 px-2 py-0.5 text-xs">High Intent</span>
  </div>
  <div className="flex-1 space-y-1.5">
    <div className="bg-white rounded border border-gray-100 px-3 py-1.5 text-xs text-gray-600">Best watches under $500?</div>
    <div className="bg-white rounded border border-gray-100 px-3 py-1.5 text-xs text-gray-600">Looking for daily wear recs</div>
  </div>
</div>
```

Build similar mini-illustrations for each card. Keep them simple but visually communicative.

**Animation:** Each card uses `motion.div` with the `fadeUp` variant. The parent grid uses `stagger` with `staggerChildren: 0.1`.

### Step 2: Create `src/components/marketing/how-it-works.tsx`
Mark as `"use client"` for Framer Motion.

**Section wrapper:**
```tsx
<section id="how-it-works" className="py-16 md:py-20 bg-gray-50">
  <div className="mx-auto max-w-7xl px-6">
    <motion.div className="text-center mb-12" {...fadeUp}>
      <h2 className="text-section-title-mobile md:text-section-title font-heading text-gray-900">
        How It Works
      </h2>
      <p className="mt-4 text-body-lg text-gray-500 max-w-2xl mx-auto">
        Get your brand mentioned in high-traffic Reddit threads in 4 simple steps.
      </p>
    </motion.div>
    <motion.div
      className="grid grid-cols-1 md:grid-cols-4 gap-8"
      variants={stagger}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
    >
      {steps.map((step) => <StepCard key={step.number} {...step} />)}
    </motion.div>
  </div>
</section>
```

**Steps data:**
1. Number: 1, Icon: `Globe` (lucide), Title: "Enter Your URL", Description: "Add your website and target keywords. We'll understand your product and audience."
2. Number: 2, Icon: `Search` (lucide), Title: "Discover Threads", Description: "Our AI scans Reddit 24/7 for threads that rank on Google and match your niche."
3. Number: 3, Icon: `MessageSquare` (lucide), Title: "Generate & Approve", Description: "Review AI-generated comments that mention your brand naturally. Edit or approve with one click."
4. Number: 4, Icon: `Rocket` (lucide), Title: "We Handle the Rest", Description: "We post through trusted accounts and boost visibility. You just watch the traffic roll in."

**Step card:**
```tsx
<motion.div variants={fadeUp} className="text-center">
  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-heading font-bold text-lg">
    {step.number}
  </div>
  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center">
    <step.icon className="h-6 w-6 text-gray-700" />
  </div>
  <h3 className="text-card-title font-heading text-gray-900">{step.title}</h3>
  <p className="mt-2 text-body-sm text-gray-500">{step.description}</p>
</motion.div>
```

### Step 3: Verify
- Run `pnpm build` — no errors
- Components export as named exports: `FeaturesBento`, `HowItWorks`
- Visual check at multiple breakpoints
