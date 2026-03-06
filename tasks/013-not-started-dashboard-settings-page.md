# Task 013: Dashboard - Settings Page

## Status
not-started

## Depends On
009

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting.

## Objective
Build the settings page for the dashboard with tabbed sections for account management, keyword configuration, notification preferences, and stubbed sections for billing, team, and API access.

## Scope
- Files to create or modify:
  - `src/app/dashboard/settings/page.tsx`
  - `src/components/dashboard/settings/account-form.tsx`
  - `src/components/dashboard/settings/keywords-form.tsx`
  - `src/components/dashboard/settings/notifications-form.tsx`
- Files NOT to touch:
  - `src/app/dashboard/layout.tsx` (already exists from task 009)
  - `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts` (already exist from task 002)
  - Any marketing page components

## Acceptance Criteria
- [ ] `src/app/dashboard/settings/page.tsx` exists and renders at `/dashboard/settings`
- [ ] `src/components/dashboard/settings/account-form.tsx` exists as a named export
- [ ] `src/components/dashboard/settings/keywords-form.tsx` exists as a named export
- [ ] `src/components/dashboard/settings/notifications-form.tsx` exists as a named export
- [ ] Tabbed layout with six tabs: Account, Keywords, Notifications, Billing, Team, API (using shadcn Tabs)
- [ ] **Account tab**: displays name input (editable), email input (readonly/disabled), avatar upload field (uploads to Supabase Storage), and password change form (current password, new password, confirm password)
- [ ] **Keywords tab**: tag input for `target_keywords`, tag input for `target_subreddits`, tag input for `brand_names`. Each tag input allows adding/removing items. Data saves to the user's project in Supabase `projects` table
- [ ] **Notifications tab**: toggle switches for email frequency preferences — new thread alerts, brand mention alerts, weekly digest. Uses shadcn Switch components
- [ ] **Billing tab**: shows current plan name from user profile, displays "Payments coming soon" message, includes a link/button to join the waitlist
- [ ] **Team tab**: shows "Available on Pro/Max plans" message with upgrade CTA
- [ ] **API tab**: shows "Available on Max plan" message, displays a placeholder API key UI (masked key with copy button)
- [ ] All editable forms use react-hook-form with zod validation schemas
- [ ] Toast notifications (sonner) appear on successful save or on validation/server errors
- [ ] Loading states while fetching current settings from Supabase
- [ ] Mobile-responsive layout: tabs become a vertical list or select dropdown on small screens

## Instructions

### Step 1: Create the AccountForm component
Create `src/components/dashboard/settings/account-form.tsx`:
1. Mark as `"use client"`.
2. Use `react-hook-form` with `zodResolver`. Define a zod schema:
   - `full_name`: string, min 1, max 100
   - `avatar_url`: string (optional, URL format)
3. Fetch current profile data from Supabase `profiles` table on mount. Pre-fill form.
4. **Name field**: shadcn Input, editable.
5. **Email field**: shadcn Input, `disabled` attribute, shows `auth.users` email.
6. **Avatar upload**: File input that uploads to Supabase Storage bucket `avatars` at path `{user_id}/avatar.{ext}`. On successful upload, update `avatar_url` in `profiles` table. Show current avatar as a preview circle.
7. **Password change section**: Three shadcn Input fields (current password, new password, confirm). Zod schema: new password min 8 chars, confirm must match. On submit, call Supabase `auth.updateUser({ password })`.
8. Save button triggers profile update via Supabase. Show sonner toast on success/error.

### Step 2: Create the KeywordsForm component
Create `src/components/dashboard/settings/keywords-form.tsx`:
1. Mark as `"use client"`.
2. Fetch the user's active project from Supabase `projects` table.
3. Build a tag input component (or use a simple pattern): an input field + Enter key handler that adds tags to an array. Each tag renders as a pill/badge with an X button to remove.
4. Three tag input sections:
   - **Target Keywords**: manages `target_keywords` array on the project
   - **Target Subreddits**: manages `target_subreddits` array (auto-prefix with "r/" if missing)
   - **Brand Names**: manages `brand_names` array
5. Save button updates the project record in Supabase. Show toast on success.
6. Use react-hook-form to manage the form state. Zod validation: each array must have at most 50 items, each string max 100 chars.

### Step 3: Create the NotificationsForm component
Create `src/components/dashboard/settings/notifications-form.tsx`:
1. Mark as `"use client"`.
2. Render three toggle rows using shadcn Switch:
   - "New Thread Alerts" — notify when high-score threads are discovered
   - "Brand Mention Alerts" — notify when brand is mentioned in Reddit
   - "Weekly Digest" — receive a weekly email summary
3. Each toggle has a label and descriptive subtext.
4. For MVP, store preferences in localStorage or as a JSON column on the profile (if a `notification_preferences` column exists) or simply show the UI with a toast "Preferences saved" without backend persistence (note this in a code comment).
5. Save button with toast confirmation.

### Step 4: Create the Settings page
Create `src/app/dashboard/settings/page.tsx`:
1. Mark as `"use client"`.
2. Export default function `SettingsPage`.
3. Use shadcn `Tabs` with `TabsList`, `TabsTrigger`, `TabsContent` for the six tabs.
4. **Account tab content**: Render `<AccountForm />`.
5. **Keywords tab content**: Render `<KeywordsForm />`.
6. **Notifications tab content**: Render `<NotificationsForm />`.
7. **Billing tab content**: Render inline:
   - Current plan badge (read from profile `plan` field, e.g., "Free Plan")
   - Heading: "Payments Coming Soon"
   - Body text explaining that paid plans are launching soon
   - CTA button: "Join Waitlist" linking to the waitlist or scrolling to footer form
8. **Team tab content**: Render inline:
   - Lock icon (Lucide `Users`)
   - Heading: "Team Management"
   - Body: "Available on Pro and Max plans. Upgrade to invite team members."
   - Disabled "Invite Member" button
9. **API tab content**: Render inline:
   - Lock icon (Lucide `Key`)
   - Heading: "API Access"
   - Body: "Available on Max plan. Access the Mentionly API to integrate with your tools."
   - Placeholder API key display: `mk_••••••••••••••••` with a copy button (disabled)
   - "Upgrade to Max" button

### Step 5: Responsive layout
1. On desktop (md+), render tabs horizontally with `TabsList` as a row.
2. On mobile, consider using a vertical tab layout or a select dropdown to switch between sections.
3. Each form section should be wrapped in a card container (`rounded-2xl border border-gray-200 p-6`).

### Step 6: Polish
1. Page title: "Settings" with subtitle "Manage your account and project configuration."
2. Ensure all form inputs have proper labels and ARIA attributes.
3. Disabled/stubbed tabs should still be clickable but show their "coming soon" content.
4. Test all form submissions and verify toast messages appear correctly.
