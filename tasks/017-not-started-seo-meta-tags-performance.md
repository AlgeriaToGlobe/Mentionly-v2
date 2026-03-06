# Task 017: SEO, Meta Tags & Performance

## Status
not-started

## Depends On
007

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting. See section 13 (SEO & Meta) for metadata values and structured data requirements.

## Objective
Add comprehensive SEO metadata, structured data, sitemap, robots.txt, and performance optimizations across all pages to ensure the site is fully indexed by search engines and loads fast.

## Scope
- Files to create or modify:
  - `src/app/layout.tsx` (modify — add complete metadata)
  - `src/app/page.tsx` (modify — add per-page metadata, JSON-LD structured data)
  - `src/app/pricing/page.tsx` (modify — add per-page metadata, FAQ schema)
  - `src/app/login/page.tsx` (modify — add per-page metadata)
  - `src/app/signup/page.tsx` (modify — add per-page metadata)
  - `src/app/blog/page.tsx` (modify — add per-page metadata)
  - `public/robots.txt` (create)
  - `src/app/sitemap.ts` (create — dynamic sitemap generation)
- Files NOT to touch:
  - Dashboard page components (no SEO needed for authenticated pages)
  - Supabase migration files
  - `src/lib/supabase/` files
  - `workflows/` files

## Acceptance Criteria
- [ ] `src/app/layout.tsx` exports a complete `metadata` object with: title (template), description, OpenGraph (title, description, url, siteName, images, type), Twitter card (card, title, description, images), favicon, theme-color, metadataBase
- [ ] Each public page exports its own `metadata` with page-specific title and description
- [ ] Homepage (`src/app/page.tsx`) per-page title: "Mentionly — Turn Reddit Into Your #1 Growth Channel"
- [ ] Pricing page title: "Pricing — Mentionly"
- [ ] Login page title: "Log In — Mentionly"
- [ ] Signup page title: "Sign Up — Mentionly"
- [ ] Homepage includes JSON-LD structured data for `Organization` schema and `SoftwareApplication` schema
- [ ] Pricing page includes JSON-LD structured data for `FAQPage` schema (using FAQ content)
- [ ] `public/robots.txt` exists with appropriate rules (allow all public pages, disallow `/dashboard`, `/api`)
- [ ] `src/app/sitemap.ts` exists and generates a valid sitemap with all public routes
- [ ] All images on marketing pages use `next/image` component with proper `width`, `height`, and `alt` attributes
- [ ] Below-fold images use `loading="lazy"` (or Next.js Image default lazy loading)
- [ ] No unoptimized `<img>` tags on public pages

## Instructions

### Step 1: Update root layout metadata
Modify `src/app/layout.tsx`:
1. Add or update the exported `metadata` object (Next.js Metadata API):
   ```typescript
   export const metadata: Metadata = {
     metadataBase: new URL('https://mentionly.com'),
     title: {
       default: 'Mentionly — AI-Powered Reddit Marketing Platform',
       template: '%s | Mentionly',
     },
     description: 'Discover high-intent Reddit threads, generate natural comments, and get your brand mentioned — all without managing a single Reddit account.',
     openGraph: {
       title: 'Mentionly — AI-Powered Reddit Marketing Platform',
       description: 'Turn Reddit into your #1 growth channel with AI-powered thread discovery and comment generation.',
       url: 'https://mentionly.com',
       siteName: 'Mentionly',
       images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Mentionly' }],
       type: 'website',
     },
     twitter: {
       card: 'summary_large_image',
       title: 'Mentionly — AI-Powered Reddit Marketing Platform',
       description: 'Turn Reddit into your #1 growth channel.',
       images: ['/og-image.png'],
     },
     icons: { icon: '/favicon.ico' },
     themeColor: '#F97316',
   }
   ```
2. Ensure `metadataBase` is set so relative image paths resolve correctly.

### Step 2: Add per-page metadata
For each public page, add a `metadata` export:
1. **Homepage** (`src/app/page.tsx`): `title: "Mentionly — Turn Reddit Into Your #1 Growth Channel"`, custom description.
2. **Pricing** (`src/app/pricing/page.tsx`): `title: "Pricing"` (will render as "Pricing | Mentionly" via template), pricing-specific description.
3. **Login** (`src/app/login/page.tsx`): `title: "Log In"`.
4. **Signup** (`src/app/signup/page.tsx`): `title: "Sign Up"`.
5. **Blog** (`src/app/blog/page.tsx`): `title: "Blog"`.

### Step 3: Add JSON-LD structured data to homepage
In `src/app/page.tsx`:
1. Add a `<script type="application/ld+json">` tag in the page component (or use Next.js `generateMetadata` with `other`).
2. Include `Organization` schema:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Organization",
     "name": "Mentionly",
     "url": "https://mentionly.com",
     "logo": "https://mentionly.com/images/logo.png",
     "description": "AI-powered Reddit marketing platform"
   }
   ```
3. Include `SoftwareApplication` schema:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "SoftwareApplication",
     "name": "Mentionly",
     "applicationCategory": "BusinessApplication",
     "operatingSystem": "Web",
     "offers": {
       "@type": "Offer",
       "price": "0",
       "priceCurrency": "USD"
     }
   }
   ```

### Step 4: Add FAQ schema to pricing page
In `src/app/pricing/page.tsx`:
1. Add a `<script type="application/ld+json">` tag with `FAQPage` schema.
2. Populate the `mainEntity` array with the FAQ questions and answers from the pricing page's FAQ section.

### Step 5: Create robots.txt
Create `public/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /dashboard/*
Disallow: /api
Disallow: /api/*
Disallow: /auth/callback

Sitemap: https://mentionly.com/sitemap.xml
```

### Step 6: Create dynamic sitemap
Create `src/app/sitemap.ts`:
1. Export a default function that returns a `MetadataRoute.Sitemap` array.
2. Include all public routes with appropriate `lastModified`, `changeFrequency`, and `priority`:
   - `/` — priority 1.0, changeFrequency 'weekly'
   - `/pricing` — priority 0.8, changeFrequency 'monthly'
   - `/blog` — priority 0.5, changeFrequency 'weekly'
   - `/login` — priority 0.3, changeFrequency 'yearly'
   - `/signup` — priority 0.3, changeFrequency 'yearly'

### Step 7: Optimize images
1. Audit all marketing page components for `<img>` tags. Replace with `next/image` (`Image` component from `next/image`).
2. Ensure all `Image` components have explicit `width` and `height` props (or use `fill` with a sized container).
3. Add descriptive `alt` text to every image.
4. Below-fold images: Next.js Image lazy loads by default; verify no `priority` prop is set on below-fold images.
5. Hero/above-fold images: add `priority` prop for LCP optimization.
