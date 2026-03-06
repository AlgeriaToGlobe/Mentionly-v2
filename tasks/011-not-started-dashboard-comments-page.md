# Task 011: Dashboard - Comments Management Page

## Status
not-started

## Depends On
009

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting.

## Objective
Build the comments management page for the dashboard, allowing users to view, filter, edit, delete, and boost their Reddit comments across multiple status tabs.

## Scope
- Files to create or modify:
  - `src/app/dashboard/comments/page.tsx`
  - `src/components/dashboard/comment-card.tsx`
- Files NOT to touch:
  - `src/app/dashboard/layout.tsx` (already exists from task 009)
  - `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts` (already exist from task 002)
  - Any marketing page components

## Acceptance Criteria
- [ ] `src/app/dashboard/comments/page.tsx` exists and renders at `/dashboard/comments`
- [ ] `src/components/dashboard/comment-card.tsx` exists as a named export
- [ ] Tabbed view with five tabs: All, Pending, Live, Scheduled, Failed (using shadcn Tabs component)
- [ ] Each tab filters comments by status from the Supabase `comments` table
- [ ] Each comment card displays: Reddit thread title, subreddit badge, comment body preview (truncated to ~150 chars), status badge (color-coded: pending=warning, live=success, scheduled=info, failed=error), upvote count, posted date, `posted_via` indicator
- [ ] Actions per comment card: Edit (opens modal with textarea), Delete (opens confirm dialog), Boost (opens upvote request dialog), View on Reddit (external link using `reddit_comment_id`)
- [ ] Edit modal uses react-hook-form + zod for validation and updates `edited_body` in Supabase
- [ ] Delete action uses a shadcn AlertDialog for confirmation before setting status to `deleted`
- [ ] Each tab shows a designed empty state with an appropriate message and CTA
- [ ] Loading skeleton renders while data is being fetched
- [ ] Page uses the orange accent color scheme per the design system
- [ ] Mobile-responsive layout (cards stack vertically on mobile, grid on desktop)
- [ ] Toast notification (sonner) on successful edit, delete, or boost action

## Instructions

### Step 1: Create the CommentCard component
Create `src/components/dashboard/comment-card.tsx`:
1. Define a `CommentCardProps` interface matching the `comments` table schema joined with thread title and subreddit from the `threads` table.
2. Render a card with `rounded-2xl border border-gray-200 shadow-sm` styling.
3. Card header: subreddit badge (`rounded-full` with orange-50 bg), thread title (linked text, truncated), status badge with color mapping:
   - `draft` / `pending`: yellow/warning (`bg-yellow-100 text-yellow-800`)
   - `live`: green/success (`bg-green-100 text-green-800`)
   - `scheduled`: blue/info (`bg-blue-100 text-blue-800`)
   - `failed`: red/error (`bg-red-100 text-red-800`)
   - `deleted`: gray (`bg-gray-100 text-gray-600`)
4. Card body: comment body preview truncated to ~150 characters with ellipsis.
5. Card footer: upvote count (with ArrowUp icon from Lucide), posted date (formatted with `formatDate` util), `posted_via` text, and action buttons row.
6. Action buttons: Edit (Pencil icon), Delete (Trash2 icon), Boost (TrendingUp icon), View on Reddit (ExternalLink icon). Each triggers its respective handler passed via props.

### Step 2: Create the Comments page
Create `src/app/dashboard/comments/page.tsx`:
1. Mark as `"use client"` since it uses tabs, state, and data fetching hooks.
2. Export default function `CommentsPage`.
3. Set up state for active tab filter (`all | pending | live | scheduled | failed`).
4. Fetch comments from Supabase with a join on the `threads` table to get thread title and subreddit. Filter by the current user's `project_id`.
5. Use shadcn `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` components.
6. For each tab, filter comments by status. The "All" tab shows all non-deleted comments.
7. Render a grid of `CommentCard` components (`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6`).

### Step 3: Implement loading skeleton
1. Create a skeleton card that mirrors the CommentCard layout using shadcn Skeleton component.
2. Show 6 skeleton cards in the grid while data is loading.

### Step 4: Implement empty states
1. For each tab, if no comments match the filter, show an empty state.
2. Empty state includes an icon (MessageSquare from Lucide), heading text, descriptive text, and a CTA button (e.g., "Discover Threads" linking to `/dashboard/discover`).

### Step 5: Implement action modals
1. **Edit Modal**: Use shadcn Dialog. Pre-fill a textarea with the current comment body (or `edited_body` if exists). Validate with zod (min 10 chars, max 5000 chars). On submit, update `edited_body` and `updated_at` in Supabase. Show success toast.
2. **Delete Dialog**: Use shadcn AlertDialog. On confirm, update comment status to `deleted` in Supabase. Show success toast. Remove card from view.
3. **Boost Dialog**: Use shadcn Dialog with a number input for requested upvotes. Update `boost_upvotes_requested` in Supabase. Show success toast.
4. **View on Reddit**: Open `https://reddit.com/comments/{reddit_comment_id}` in a new tab.

### Step 6: Polish
1. Add page title "My Comments" with a subtitle showing total comment count.
2. Add count badges to each tab trigger showing the number of comments per status.
3. Ensure all interactive elements have proper ARIA labels.
4. Test responsive layout at 375px, 768px, and 1280px breakpoints.
