# Mentionly — AI-Powered Reddit Marketing Platform

**Turn Reddit into your #1 growth channel.** Mentionly discovers high-intent Reddit threads, generates natural comments, and gets your brand mentioned — all without managing a single Reddit account.

## Key Features

- **Thread Discovery Engine** — AI scans thousands of subreddits using your keywords, scoring threads by buying intent, freshness, and Google ranking potential
- **AI Comment Generation** — Context-aware comments that naturally mention your product while adding genuine value to conversations
- **Managed Account Network** — Aged, high-karma Reddit accounts with established posting histories
- **Smart Upvote Boosting** — Gradual, natural upvote delivery that mimics organic engagement
- **Analytics Dashboard** — Track impressions, clicks, brand mentions, and AI citations across all platforms
- **AI Visibility Tracking** — Monitor when your brand appears in ChatGPT, Perplexity, and Google AI Overviews

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3.4+ |
| UI Components | shadcn/ui + Radix UI |
| Icons | Lucide React |
| Animations | Framer Motion |
| Charts | Recharts |
| Auth | Supabase Auth (@supabase/ssr) |
| Database | Supabase PostgreSQL + RLS |
| Email | Resend (via n8n) |
| Automation | n8n Pro |
| Hosting | Vercel |
| Package Manager | pnpm |

## Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Supabase account ([supabase.com](https://supabase.com))
- Vercel account (optional, for deployment)
- n8n instance (optional, for automation workflows)

## Local Development Setup

```bash
# Clone the repository
git clone https://github.com/AlgeriaToGlobe/Mentionly-v2.git
cd Mentionly-v2

# Install dependencies
pnpm install

# Copy environment variables
cp .env.local.example .env.local
# Fill in your Supabase credentials and other values

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the migrations in order from `supabase/migrations/`:
   ```bash
   # Using Supabase CLI
   supabase db push
   # Or run each migration file manually in the SQL editor
   ```
3. Enable **Email** auth provider in Authentication → Providers
4. (Optional) Configure **Google OAuth** provider
5. Set redirect URLs in Authentication → URL Configuration:
   - Site URL: `http://localhost:3000` (dev) or `https://your-domain.com` (prod)
   - Redirect URLs: `http://localhost:3000/auth/callback`, `https://your-domain.com/auth/callback`
6. Copy your project URL and keys to `.env.local`

## Vercel Deployment

1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Set all environment variables from `.env.local` in the Vercel dashboard
3. Deploy — Vercel auto-detects Next.js settings

## n8n Workflow Import

1. Navigate to your n8n instance
2. For each JSON file in the `workflows/` directory:
   - Go to **Workflows** → **Add Workflow** → **Import from File**
   - Select or paste the workflow JSON
3. Configure environment variables in **Settings** → **Variables**:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `N8N_WEBHOOK_SECRET`
4. Activate each workflow when ready

See [`workflows/README.md`](./workflows/README.md) for detailed workflow descriptions.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | Yes |
| `N8N_WEBHOOK_BASE_URL` | n8n instance URL | No |
| `N8N_WEBHOOK_SECRET` | Shared secret for webhook auth | No |
| `NEXT_PUBLIC_APP_URL` | Public app URL | No |

## Project Structure

```
├── public/                  # Static assets (favicon, og-image, robots.txt)
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/             # API routes (waitlist, n8n webhook)
│   │   ├── auth/            # Auth callback handler
│   │   ├── dashboard/       # Protected dashboard pages
│   │   ├── login/           # Login page
│   │   ├── signup/          # Signup page
│   │   ├── pricing/         # Pricing page
│   │   ├── blog/            # Blog page
│   │   ├── layout.tsx       # Root layout with metadata
│   │   ├── page.tsx         # Marketing homepage
│   │   └── sitemap.ts       # Dynamic sitemap generation
│   ├── components/
│   │   ├── ui/              # shadcn/ui base components
│   │   ├── marketing/       # Marketing page sections
│   │   └── dashboard/       # Dashboard components & charts
│   ├── lib/
│   │   ├── supabase/        # Supabase client/server utilities
│   │   └── utils.ts         # Shared utilities
│   └── hooks/               # Custom React hooks
├── supabase/
│   └── migrations/          # Database migration files
├── workflows/               # n8n workflow JSON files
├── middleware.ts             # Auth middleware for protected routes
└── tailwind.config.ts       # Tailwind CSS configuration
```

## License

MIT
