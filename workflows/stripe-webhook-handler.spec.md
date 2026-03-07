# Stripe Webhook Handler — Specification (DEFERRED)

> This workflow is **deferred** until Stripe payments are activated. This document serves as the specification for future implementation.

## Overview

A webhook-triggered n8n workflow that listens for Stripe events and updates Supabase accordingly to manage user subscriptions, plan changes, and credit transactions.

## Trigger

- **Type**: Webhook (POST)
- **Path**: `/stripe-webhook`
- **Authentication**: Verify Stripe signature using `STRIPE_WEBHOOK_SECRET`

## Event Types to Handle

### 1. `checkout.session.completed`
- **Action**: Activate the user's subscription
- **Supabase Updates**:
  - `profiles` table: Set `plan` field to the purchased plan (lite, pro, max)
  - `credit_transactions` table: Insert initial credit allocation based on plan

### 2. `customer.subscription.created`
- **Action**: Record new subscription
- **Supabase Updates**:
  - `profiles` table: Update `plan`, `stripe_customer_id`, `stripe_subscription_id`

### 3. `customer.subscription.updated`
- **Action**: Handle plan upgrades/downgrades
- **Supabase Updates**:
  - `profiles` table: Update `plan` field to new plan
  - `credit_transactions` table: Adjust credits for plan change (prorate if needed)

### 4. `customer.subscription.deleted`
- **Action**: Handle cancellation
- **Supabase Updates**:
  - `profiles` table: Set `plan` to `free`
  - Optionally: Create alert notifying user of cancellation

### 5. `invoice.payment_succeeded`
- **Action**: Record successful payment and renew credits
- **Supabase Updates**:
  - `credit_transactions` table: Insert monthly credit allocation
  - `profiles` table: Update `current_period_end`

### 6. `invoice.payment_failed`
- **Action**: Handle failed payment
- **Supabase Updates**:
  - `alerts` table: Create alert notifying user of payment failure
  - After 3 consecutive failures: downgrade to free plan

## Signature Verification

```javascript
const crypto = require('crypto');
const signature = request.headers['stripe-signature'];
const payload = request.body;
const secret = process.env.STRIPE_WEBHOOK_SECRET;

// Verify using Stripe's signature verification
const expectedSig = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_SECRET_KEY` | Stripe API secret key |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |

## Plan-to-Credit Mapping

| Plan | Monthly Credits |
|------|----------------|
| Free | 10 |
| Lite | 100 |
| Pro | 500 |
| Max | Unlimited |

## Error Handling

- Log all webhook events for debugging
- Return 200 to Stripe even on processing errors (to prevent retries for non-transient failures)
- Retry transient Supabase errors up to 3 times
- Alert admin on repeated failures
