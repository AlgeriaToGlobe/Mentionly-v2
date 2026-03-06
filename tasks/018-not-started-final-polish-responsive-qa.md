# Task 018: Final Polish, Responsive QA & README

## Status
not-started

## Depends On
011, 012, 013, 014, 015, 016, 017

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting. This is the final task — all previous tasks must be completed before starting this one.

## Objective
Perform a comprehensive quality assurance pass across the entire application: verify responsive layouts at all breakpoints, fix layout issues, confirm animations work without layout shifts, test all navigation and auth flows, and create a production-ready README.

## Scope
- Files to create or modify:
  - Any file that has responsive or layout issues (fix as discovered)
  - `README.md` (create at project root)
- Files NOT to touch:
  - Supabase migration files (schema is finalized)
  - `workflows/` JSON files (finalized in task 016)
  - `PROJECT_CONTEXT.md`

## Acceptance Criteria
- [ ] All pages render correctly at mobile (375px), tablet (768px), and desktop (1280px+) breakpoints
- [ ] No horizontal scrollbar appears on any page at any breakpoint
- [ ] No text overflow or truncation issues on any page
- [ ] All Framer Motion animations play correctly and do not cause layout shifts or CLS issues
- [ ] All internal links navigate to the correct pages (no 404s)
- [ ] All external links (e.g., "View on Reddit") open in new tabs with `rel="noopener noreferrer"`
- [ ] Loading states render properly on all dashboard pages (skeletons visible during data fetch)
- [ ] Empty states render properly on all dashboard pages (when no data exists)
- [ ] Auth flow works end-to-end: signup -> email confirmation callback -> redirect to dashboard
- [ ] Login flow works: login -> redirect to dashboard
- [ ] Unauthenticated users visiting `/dashboard/*` routes are redirected to `/login`
- [ ] All forms submit correctly and show appropriate toast notifications
- [ ] No `console.log` statements in production code
- [ ] `README.md` exists at project root with comprehensive documentation

## Instructions

### Step 1: Responsive QA — Mobile (375px)
Test each page at 375px viewport width:
1. **Marketing pages**: `/`, `/pricing`, `/blog`, `/login`, `/signup`
   - Navbar collapses to hamburger menu
   - Hero text is readable (36px title as per design system)
   - Feature cards stack vertically
   - Pricing cards stack vertically
   - FAQ accordion works
   - Footer stacks into a single column
   - All CTAs are tappable (min 44px touch target)
2. **Dashboard pages**: `/dashboard`, `/dashboard/discover`, `/dashboard/comments`, `/dashboard/analytics`, `/dashboard/settings`
   - Sidebar collapses or becomes a slide-out drawer
   - Stat cards stack vertically
   - Charts are readable and don't overflow
   - Tables scroll horizontally if needed
   - Tab lists wrap or scroll horizontally
   - Forms use full width inputs

### Step 2: Responsive QA — Tablet (768px)
Test each page at 768px viewport width:
1. Marketing pages use 2-column grids where appropriate
2. Dashboard sidebar may be collapsed by default
3. Charts display at reasonable sizes
4. No awkward whitespace or oversized elements

### Step 3: Responsive QA — Desktop (1280px+)
Test each page at 1280px and 1440px:
1. Content stays within `max-w-7xl` container
2. Dashboard uses full sidebar + content area layout
3. Charts display in multi-column grid as designed
4. No elements stretch beyond their intended width

### Step 4: Animation QA
1. Scroll through the homepage and verify all Framer Motion scroll-reveal animations trigger correctly.
2. Verify `viewport: { once: true }` is set so animations don't re-trigger on scroll back.
3. Check that no animation causes a visible layout shift (CLS).
4. Verify card hover animations (`whileHover: { y: -4 }`) work on desktop and don't interfere on mobile.
5. Confirm no animation blocks interaction or causes jank.

### Step 5: Navigation QA
1. Click every link in the navbar and verify it navigates correctly.
2. Click every link in the footer and verify it navigates correctly.
3. Click every CTA button and verify the action (navigation, modal, form submission).
4. Verify the dashboard sidebar links all navigate to their respective pages.
5. Verify the "View on Reddit" external links open in a new tab with proper `rel` attributes.
6. Check for any broken links or 404 pages.

### Step 6: Auth flow QA
1. **Signup flow**: Navigate to `/signup`, fill out the form, submit. Verify the confirmation email flow works via Supabase. After callback, user should land on `/dashboard`.
2. **Login flow**: Navigate to `/login`, enter credentials, submit. User should be redirected to `/dashboard`.
3. **Protected routes**: While logged out, navigate to `/dashboard`. Verify redirect to `/login`.
4. **Logout**: From the dashboard, trigger logout. Verify redirect to `/` or `/login`.

### Step 7: Loading and empty states QA
1. On each dashboard page, verify loading skeletons appear during initial data fetch.
2. With no seed data, verify each dashboard page shows its empty state with appropriate messaging and CTAs.
3. Verify the thread discovery page shows an empty state when no threads match filters.
4. Verify the comments page tabs all show empty states when no comments exist in that status.

### Step 8: Code cleanup
1. Search for and remove any `console.log` statements across the codebase.
2. Remove any TODO comments that have been addressed.
3. Verify no hardcoded test data remains in component files (seed data should come from Supabase only).
4. Ensure all TypeScript files compile without errors (`pnpm build` succeeds).

### Step 9: Create README.md
Create `README.md` at the project root with the following sections:

1. **Project Overview**
   - Product name, tagline, one-paragraph description
   - Key features list

2. **Tech Stack**
   - Table of technologies used (from PROJECT_CONTEXT.md section 2)

3. **Prerequisites**
   - Node.js 20+, pnpm, Supabase account, Vercel account (optional), n8n instance (optional)

4. **Local Development Setup**
   - Clone the repo
   - `pnpm install`
   - Copy `.env.local.example` to `.env.local` and fill in values
   - `pnpm dev` to start the dev server
   - Open `http://localhost:3000`

5. **Supabase Setup**
   - Create a new Supabase project
   - Run migrations in order from `supabase/migrations/`
   - Enable email auth provider
   - Configure Google OAuth (optional)
   - Set redirect URLs
   - Copy project URL and keys to `.env.local`

6. **Vercel Deployment**
   - Connect GitHub repo to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy

7. **n8n Workflow Import**
   - Navigate to n8n instance
   - Import each JSON file from `workflows/` directory
   - Configure environment variables in n8n
   - Activate workflows

8. **Environment Variables**
   - Table of all env vars with description, required/optional, and example values
   - Reference `.env.local.example` for the full list

9. **Project Structure**
   - Brief overview of the folder structure (abbreviated version of PROJECT_CONTEXT.md section 3)

10. **License**
    - Placeholder or actual license
