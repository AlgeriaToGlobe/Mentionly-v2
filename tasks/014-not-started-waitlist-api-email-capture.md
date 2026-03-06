# Task 014: Waitlist API & Email Capture

## Status
not-started

## Depends On
002, 007

## Context
Read `PROJECT_CONTEXT.md` at the repo root before starting.

## Objective
Create the waitlist API endpoint and wire up all email capture points across the marketing site (footer newsletter form, "Get Started" / "Join Waitlist" CTAs) so visitor emails are validated, stored in Supabase, and confirmed with a success toast.

## Scope
- Files to create or modify:
  - `src/app/api/waitlist/route.ts` (create)
  - `src/components/marketing/footer.tsx` (modify — wire up newsletter form)
  - `src/components/marketing/cta-section.tsx` (modify — wire up CTA)
  - `src/components/marketing/hero.tsx` (modify — wire up CTA if applicable)
  - `src/components/marketing/pricing-section.tsx` (modify — wire up waitlist CTAs on pricing tiers)
  - Optionally create a reusable waitlist modal/form component if needed
- Files NOT to touch:
  - Supabase migration files (waitlist table already exists from task 003)
  - Dashboard components
  - `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts` (already exist from task 002)

## Acceptance Criteria
- [ ] `src/app/api/waitlist/route.ts` exists with a POST handler
- [ ] POST handler validates email with zod (valid email format, max 255 chars)
- [ ] POST handler inserts to Supabase `waitlist` table using `service_role` key (bypasses RLS)
- [ ] Duplicate emails handled gracefully — returns success message without error (idempotent)
- [ ] Returns JSON responses: `{ success: true, message: "..." }` on success, `{ success: false, error: "..." }` on failure
- [ ] Appropriate HTTP status codes: 200 on success, 400 on validation error, 409 or 200 on duplicate, 500 on server error
- [ ] Footer newsletter form submits to `/api/waitlist` and shows success toast (sonner)
- [ ] "Get Started" / "Join Waitlist" CTAs across marketing pages submit to `/api/waitlist` or open a waitlist form
- [ ] Loading state on submit button (spinner or disabled state)
- [ ] Success toast: "You're on the list! We'll notify you when Mentionly launches."
- [ ] Error toast shows user-friendly message on failure

## Instructions

### Step 1: Create the waitlist API route
Create `src/app/api/waitlist/route.ts`:
1. Import `NextRequest`, `NextResponse` from `next/server`.
2. Import `createClient` from `@supabase/supabase-js` — create a one-off client using `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (service role bypasses RLS for insert).
3. Define a zod schema for the request body:
   - `email`: `z.string().email().max(255)`
   - `source`: `z.string().optional().default('website')`
4. Export an async `POST` function:
   - Parse and validate the request body with zod. On failure, return 400 with validation errors.
   - Insert into the `waitlist` table: `{ email, source, referrer: request.headers.get('referer'), ip_address: request.headers.get('x-forwarded-for') }`.
   - Handle duplicate: catch the unique constraint violation (Supabase error code `23505`). Return 200 with a friendly message like "You're already on the waitlist!"
   - On success, return 200 with `{ success: true, message: "You're on the list!" }`.
   - On unexpected error, log the error and return 500 with a generic error message.

### Step 2: Wire up the footer newsletter form
Modify `src/components/marketing/footer.tsx`:
1. The footer should already have an email input and submit button from task 007.
2. Make it a client component (`"use client"`) if not already.
3. Add state for: email input value, loading state, submission status.
4. On form submit:
   - Prevent default
   - Set loading to true
   - POST to `/api/waitlist` with `{ email, source: 'footer' }`
   - On success: clear input, show success toast via sonner
   - On error: show error toast
   - Set loading to false
5. Disable the submit button while loading. Show a spinner or "Submitting..." text.

### Step 3: Wire up marketing page CTAs
Modify the relevant marketing components:
1. **Hero section** (`src/components/marketing/hero.tsx`): If there's a "Get Started" or primary CTA button, either link it to `/signup` or convert it to open a waitlist email input inline.
2. **CTA section** (`src/components/marketing/cta-section.tsx`): Wire up the email capture form same as the footer — POST to `/api/waitlist` with `source: 'cta-section'`.
3. **Pricing section** (`src/components/marketing/pricing-section.tsx`): For each pricing tier CTA button, link to `/signup` for the free tier and to the waitlist flow for paid tiers (since Stripe is deferred). Add `source: 'pricing-{tier}'` to distinguish.

### Step 4: Create waitlist modal (optional)
If any CTA opens a modal instead of an inline form:
1. Create a reusable `WaitlistModal` component using shadcn Dialog.
2. Contains: heading, subtitle, email input, submit button.
3. Same POST logic as the footer form.
4. Controlled by a boolean state in the parent component.

### Step 5: Polish
1. Ensure all forms have proper `type="email"` and `required` attributes on the email input.
2. Add `aria-label` to all inputs and buttons.
3. Test the flow end-to-end: enter email → submit → see toast → check Supabase table.
4. Verify duplicate email handling shows a friendly message, not an error.
