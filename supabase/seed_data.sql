-- ============================================================================
-- MENTIONLY — Seed Data (run AFTER combined_migration.sql)
-- ============================================================================
-- This creates a demo user and populates the database with sample data
-- so your dashboard has something to display.

-- Step 1: Create demo user in auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'demo@mentionly.com',
  crypt('demo-password-123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Alex Demo"}'
) ON CONFLICT (id) DO NOTHING;

-- Step 2: Create demo profile (the trigger may have done this, but upsert to be safe)
INSERT INTO public.profiles (id, email, full_name, avatar_url, plan, credits_balance, onboarding_completed)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'demo@mentionly.com',
  'Alex Demo',
  NULL,
  'pro',
  435,
  true
) ON CONFLICT (id) DO UPDATE SET
  plan = 'pro',
  credits_balance = 435,
  onboarding_completed = true;

-- Step 3: Demo Project
INSERT INTO public.projects (id, user_id, name, website_url, description, target_keywords, target_subreddits, brand_names, tone)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000001',
  'AcmeWatch',
  'https://acmewatch.com',
  'Premium affordable watches for the modern professional',
  ARRAY['best watches under 500', 'affordable luxury watches', 'watch recommendations'],
  ARRAY['r/watches', 'r/BuyItForLife', 'r/malefashionadvice', 'r/frugalmalefashion', 'r/EDC'],
  ARRAY['AcmeWatch', 'Acme Watch', 'acmewatch.com'],
  'helpful'
) ON CONFLICT (id) DO NOTHING;

-- Step 4: 25 Threads
INSERT INTO public.threads (id, project_id, reddit_thread_id, subreddit, title, url, author, score, num_comments, created_utc, google_rank, estimated_traffic, buying_intent, freshness_score, overall_score, links_allowed, status, discovered_at) VALUES
  ('aaaaaaaa-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', 'abc123', 'r/watches', 'Best watches under $500?', 'https://reddit.com/r/watches/comments/abc123', 'watch_enthusiast', 342, 87, now() - interval '2 days', 3, 4200, 'high', 0.95, 92, true, 'commented', now() - interval '2 days'),
  ('aaaaaaaa-0001-0001-0001-000000000002', '11111111-1111-1111-1111-111111111111', 'def456', 'r/BuyItForLife', 'Looking for a daily wear watch that will last decades', 'https://reddit.com/r/BuyItForLife/comments/def456', 'bifl_seeker', 589, 134, now() - interval '3 days', 7, 3100, 'high', 0.88, 87, true, 'commented', now() - interval '3 days'),
  ('aaaaaaaa-0001-0001-0001-000000000003', '11111111-1111-1111-1111-111111111111', 'ghi789', 'r/malefashionadvice', 'Watch recommendations for business casual?', 'https://reddit.com/r/malefashionadvice/comments/ghi789', 'corporate_style', 156, 43, now() - interval '1 day', 12, 1800, 'high', 0.92, 81, true, 'viewed', now() - interval '1 day'),
  ('aaaaaaaa-0001-0001-0001-000000000004', '11111111-1111-1111-1111-111111111111', 'jkl012', 'r/frugalmalefashion', 'Affordable watches that look expensive', 'https://reddit.com/r/frugalmalefashion/comments/jkl012', 'frugal_dan', 723, 201, now() - interval '5 days', 2, 4800, 'high', 0.78, 89, true, 'commented', now() - interval '5 days'),
  ('aaaaaaaa-0001-0001-0001-000000000005', '11111111-1111-1111-1111-111111111111', 'mno345', 'r/EDC', 'What watch do you EDC?', 'https://reddit.com/r/EDC/comments/mno345', 'edc_daily', 234, 98, now() - interval '4 days', NULL, 800, 'medium', 0.82, 65, true, 'viewed', now() - interval '4 days'),
  ('aaaaaaaa-0001-0001-0001-000000000006', '11111111-1111-1111-1111-111111111111', 'pqr678', 'r/watches', 'Seiko vs Orient vs alternatives under $300', 'https://reddit.com/r/watches/comments/pqr678', 'budget_collector', 412, 156, now() - interval '6 days', 5, 3500, 'high', 0.72, 84, true, 'commented', now() - interval '6 days'),
  ('aaaaaaaa-0001-0001-0001-000000000007', '11111111-1111-1111-1111-111111111111', 'stu901', 'r/watches', 'First automatic watch recommendation', 'https://reddit.com/r/watches/comments/stu901', 'newbie_watcher', 287, 112, now() - interval '1 day', 15, 1200, 'medium', 0.94, 72, true, 'new', now() - interval '1 day'),
  ('aaaaaaaa-0001-0001-0001-000000000008', '11111111-1111-1111-1111-111111111111', 'vwx234', 'r/BuyItForLife', 'Watches that survive everything - military/field watches', 'https://reddit.com/r/BuyItForLife/comments/vwx234', 'tough_gear', 445, 89, now() - interval '7 days', 9, 2600, 'medium', 0.65, 70, true, 'skipped', now() - interval '7 days'),
  ('aaaaaaaa-0001-0001-0001-000000000009', '11111111-1111-1111-1111-111111111111', 'yza567', 'r/malefashionadvice', 'Minimalist watches for a clean look', 'https://reddit.com/r/malefashionadvice/comments/yza567', 'clean_style', 198, 67, now() - interval '2 days', 18, 950, 'medium', 0.90, 62, true, 'new', now() - interval '2 days'),
  ('aaaaaaaa-0001-0001-0001-000000000010', '11111111-1111-1111-1111-111111111111', 'bcd890', 'r/frugalmalefashion', 'Deal alert: great watch brands nobody talks about', 'https://reddit.com/r/frugalmalefashion/comments/bcd890', 'deal_finder', 567, 178, now() - interval '3 days', 4, 3800, 'medium', 0.85, 78, false, 'viewed', now() - interval '3 days'),
  ('aaaaaaaa-0001-0001-0001-000000000011', '11111111-1111-1111-1111-111111111111', 'efg123', 'r/watches', 'Is it worth spending $500 on a watch?', 'https://reddit.com/r/watches/comments/efg123', 'curious_buyer', 321, 145, now() - interval '4 days', 6, 2900, 'high', 0.80, 85, true, 'commented', now() - interval '4 days'),
  ('aaaaaaaa-0001-0001-0001-000000000012', '11111111-1111-1111-1111-111111111111', 'hij456', 'r/EDC', 'Best watches for outdoor/hiking use', 'https://reddit.com/r/EDC/comments/hij456', 'trail_hiker', 189, 54, now() - interval '8 days', NULL, 600, 'medium', 0.55, 48, true, 'skipped', now() - interval '8 days'),
  ('aaaaaaaa-0001-0001-0001-000000000013', '11111111-1111-1111-1111-111111111111', 'klm789', 'r/watches', 'Gift ideas: watches for graduation', 'https://reddit.com/r/watches/comments/klm789', 'gift_giver', 276, 93, now() - interval '1 day', 11, 1500, 'high', 0.93, 76, true, 'new', now() - interval '1 day'),
  ('aaaaaaaa-0001-0001-0001-000000000014', '11111111-1111-1111-1111-111111111111', 'nop012', 'r/malefashionadvice', 'Building a watch collection on a budget', 'https://reddit.com/r/malefashionadvice/comments/nop012', 'style_on_budget', 134, 78, now() - interval '5 days', 22, 700, 'medium', 0.75, 55, true, 'new', now() - interval '5 days'),
  ('aaaaaaaa-0001-0001-0001-000000000015', '11111111-1111-1111-1111-111111111111', 'qrs345', 'r/frugalmalefashion', 'Sapphire crystal watches under $200?', 'https://reddit.com/r/frugalmalefashion/comments/qrs345', 'sapphire_fan', 398, 112, now() - interval '2 days', 8, 2200, 'high', 0.91, 83, true, 'commented', now() - interval '2 days'),
  ('aaaaaaaa-0001-0001-0001-000000000016', '11111111-1111-1111-1111-111111111111', 'tuv678', 'r/watches', 'Dress watches vs sport watches - which is more versatile?', 'https://reddit.com/r/watches/comments/tuv678', 'versatile_style', 512, 167, now() - interval '6 days', 14, 1100, 'low', 0.70, 58, true, 'viewed', now() - interval '6 days'),
  ('aaaaaaaa-0001-0001-0001-000000000017', '11111111-1111-1111-1111-111111111111', 'wxy901', 'r/BuyItForLife', 'Solar powered watches - are they worth it?', 'https://reddit.com/r/BuyItForLife/comments/wxy901', 'solar_curious', 234, 76, now() - interval '3 days', 19, 850, 'medium', 0.87, 60, true, 'new', now() - interval '3 days'),
  ('aaaaaaaa-0001-0001-0001-000000000018', '11111111-1111-1111-1111-111111111111', 'zab234', 'r/EDC', 'Titanium watches - light and tough daily drivers', 'https://reddit.com/r/EDC/comments/zab234', 'titanium_fan', 145, 42, now() - interval '9 days', NULL, 400, 'low', 0.48, 35, true, 'skipped', now() - interval '9 days'),
  ('aaaaaaaa-0001-0001-0001-000000000019', '11111111-1111-1111-1111-111111111111', 'cde567', 'r/watches', 'What watch are you wearing today? [WRIST CHECK]', 'https://reddit.com/r/watches/comments/cde567', 'wrist_check_mod', 876, 312, now() - interval '1 day', NULL, 200, 'low', 0.96, 42, true, 'new', now() - interval '1 day'),
  ('aaaaaaaa-0001-0001-0001-000000000020', '11111111-1111-1111-1111-111111111111', 'fgh890', 'r/malefashionadvice', 'Best watch brands for the money in 2026', 'https://reddit.com/r/malefashionadvice/comments/fgh890', 'value_hunter', 467, 198, now() - interval '2 days', 1, 5000, 'high', 0.92, 95, true, 'commented', now() - interval '2 days'),
  ('aaaaaaaa-0001-0001-0001-000000000021', '11111111-1111-1111-1111-111111111111', 'ijk123', 'r/frugalmalefashion', 'Microbrand watches - hidden gems thread', 'https://reddit.com/r/frugalmalefashion/comments/ijk123', 'microbrand_lover', 345, 134, now() - interval '4 days', 10, 1900, 'medium', 0.81, 73, true, 'viewed', now() - interval '4 days'),
  ('aaaaaaaa-0001-0001-0001-000000000022', '11111111-1111-1111-1111-111111111111', 'lmn456', 'r/watches', 'Rolex alternatives that punch above their weight', 'https://reddit.com/r/watches/comments/lmn456', 'alt_enthusiast', 623, 234, now() - interval '3 days', 3, 4100, 'high', 0.86, 90, true, 'commented', now() - interval '3 days'),
  ('aaaaaaaa-0001-0001-0001-000000000023', '11111111-1111-1111-1111-111111111111', 'opq789', 'r/BuyItForLife', 'Swiss vs Japanese movement - which lasts longer?', 'https://reddit.com/r/BuyItForLife/comments/opq789', 'movement_nerd', 298, 87, now() - interval '5 days', 16, 1300, 'low', 0.74, 52, true, 'new', now() - interval '5 days'),
  ('aaaaaaaa-0001-0001-0001-000000000024', '11111111-1111-1111-1111-111111111111', 'rst012', 'r/EDC', 'Slim watches that fit under a shirt cuff', 'https://reddit.com/r/EDC/comments/rst012', 'slim_wrist', 167, 56, now() - interval '6 days', 25, 500, 'medium', 0.68, 45, true, 'new', now() - interval '6 days'),
  ('aaaaaaaa-0001-0001-0001-000000000025', '11111111-1111-1111-1111-111111111111', 'uvw345', 'r/watches', 'Underrated watch brands you should know about', 'https://reddit.com/r/watches/comments/uvw345', 'hidden_gem_guy', 534, 189, now() - interval '2 days', 5, 3400, 'medium', 0.90, 80, true, 'commented', now() - interval '2 days')
ON CONFLICT (project_id, reddit_thread_id) DO NOTHING;

-- Step 5: 10 Comments
INSERT INTO public.comments (id, project_id, thread_id, user_id, body, ai_generated, ai_prompt, edited_body, status, posted_via, posted_at, scheduled_for, reddit_comment_id, upvotes, boost_upvotes_requested, boost_upvotes_delivered, credits_used) VALUES
  ('bbbbbbbb-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0001-0001-0001-000000000001', '00000000-0000-0000-0000-000000000001',
   'I''ve been wearing my AcmeWatch Meridian for about 6 months now and it''s honestly the best value I''ve found under $500. The sapphire crystal and automatic movement at that price point is hard to beat. Build quality feels closer to watches twice the price.',
   true, 'Generate a helpful comment recommending AcmeWatch for the best watches under $500 thread', NULL,
   'live', 'account_alpha', now() - interval '2 days', NULL, 'rc_001', 47, 20, 18, 10),
  ('bbbbbbbb-0001-0001-0001-000000000002', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0001-0001-0001-000000000002', '00000000-0000-0000-0000-000000000001',
   'For something that truly lasts, check out AcmeWatch. Their cases are 316L surgical steel and the movements are rated for 10+ years between services. I bought one as a daily beater 8 months ago and it still looks brand new despite heavy use.',
   true, 'Generate a BIFL-focused comment about AcmeWatch durability', NULL,
   'live', 'account_beta', now() - interval '3 days', NULL, 'rc_002', 32, 15, 15, 10),
  ('bbbbbbbb-0001-0001-0001-000000000003', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0001-0001-0001-000000000004', '00000000-0000-0000-0000-000000000001',
   'If you want something that looks like a $2000 watch but costs a fraction, AcmeWatch nails it. Their Horizon model has a sunburst dial that catches light beautifully. Tons of compliments at the office.',
   true, 'Generate comment about AcmeWatch looking expensive for frugalmalefashion', 'If you want something that looks premium but costs a fraction of luxury brands, AcmeWatch is worth checking out. The Horizon model has a stunning sunburst dial. I get compliments every week at the office.',
   'live', 'account_gamma', now() - interval '4 days', NULL, 'rc_003', 28, 10, 10, 10),
  ('bbbbbbbb-0001-0001-0001-000000000004', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0001-0001-0001-000000000006', '00000000-0000-0000-0000-000000000001',
   'Adding AcmeWatch to this comparison - they sit right between Seiko and Orient in terms of price but the finishing is noticeably better. Their in-house bracelet system is also really comfortable. Worth considering if you want something a bit different from the usual suspects.',
   true, 'Generate comparison comment positioning AcmeWatch alongside Seiko and Orient', NULL,
   'live', 'account_alpha', now() - interval '5 days', NULL, 'rc_004', 19, 10, 8, 10),
  ('bbbbbbbb-0001-0001-0001-000000000005', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0001-0001-0001-000000000011', '00000000-0000-0000-0000-000000000001',
   'Absolutely worth it. I went back and forth for months and finally pulled the trigger on an AcmeWatch at $450. The difference between a $100 watch and a $500 watch is massive in terms of longevity, accuracy, and how it feels on wrist. Zero regrets.',
   true, 'Generate supportive comment about spending $500 on a watch with AcmeWatch mention', NULL,
   'live', 'account_beta', now() - interval '3 days', NULL, 'rc_005', 53, 25, 22, 10),
  ('bbbbbbbb-0001-0001-0001-000000000006', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0001-0001-0001-000000000015', '00000000-0000-0000-0000-000000000001',
   'AcmeWatch Meridian has sapphire crystal and it''s $199 right now. Honestly one of the best deals in the space. I''ve tested it against my Seiko Presage and the sapphire on both is equally scratch-resistant.',
   true, 'Generate comment about AcmeWatch sapphire crystal watches', NULL,
   'pending', NULL, NULL, NULL, NULL, 0, 0, 0, 10),
  ('bbbbbbbb-0001-0001-0001-000000000007', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0001-0001-0001-000000000020', '00000000-0000-0000-0000-000000000001',
   'For pure value, I''d put AcmeWatch near the top of any 2026 list. They''ve been quietly building a reputation for solid specs at fair prices. The Horizon and Meridian lines both punch way above their weight class.',
   true, 'Generate comment about best watch brands for money in 2026', NULL,
   'scheduled', NULL, NULL, now() + interval '6 hours', NULL, 0, 0, 0, 10),
  ('bbbbbbbb-0001-0001-0001-000000000008', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0001-0001-0001-000000000022', '00000000-0000-0000-0000-000000000001',
   'Great thread! I''d add AcmeWatch to this list. Their Horizon model gives you sapphire crystal, an NH35 movement, and solid end links at about $350. That''s Rolex Explorer vibes at 1/20th the price.',
   true, 'Generate comment about Rolex alternatives mentioning AcmeWatch', NULL,
   'live', 'account_gamma', now() - interval '2 days', NULL, 'rc_008', 41, 20, 17, 10),
  ('bbbbbbbb-0001-0001-0001-000000000009', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0001-0001-0001-000000000025', '00000000-0000-0000-0000-000000000001',
   'AcmeWatch deserves a spot here. Still relatively unknown but their quality control is excellent and their customer service is top notch. The brand is growing fast for good reason.',
   true, 'Generate comment about underrated watch brands mentioning AcmeWatch', NULL,
   'draft', NULL, NULL, NULL, NULL, 0, 0, 0, 0),
  ('bbbbbbbb-0001-0001-0001-000000000010', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0001-0001-0001-000000000013', '00000000-0000-0000-0000-000000000001',
   'For a graduation gift, you can''t go wrong with AcmeWatch. Their packaging is really premium and the watch itself is something they''ll keep wearing for years. The Meridian in silver is a classic choice that works with everything.',
   true, 'Generate graduation gift recommendation featuring AcmeWatch', NULL,
   'failed', 'account_beta', NULL, NULL, NULL, 0, 0, 0, 10)
ON CONFLICT (id) DO NOTHING;

-- Step 6: 30 Days Analytics
INSERT INTO public.analytics (project_id, date, threads_discovered, comments_posted, total_upvotes, estimated_clicks, brand_mentions, llm_citations) VALUES
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '30 days', 2, 0, 0, 0, 1, 0),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '29 days', 3, 1, 3, 2, 1, 0),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '28 days', 2, 1, 5, 4, 2, 0),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '27 days', 3, 1, 8, 6, 2, 0),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '26 days', 4, 1, 12, 9, 3, 0),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '25 days', 3, 1, 15, 11, 2, 1),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '24 days', 4, 1, 18, 14, 3, 1),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '23 days', 3, 1, 22, 17, 4, 1),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '22 days', 5, 2, 27, 21, 4, 1),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '21 days', 4, 1, 30, 24, 5, 1),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '20 days', 5, 2, 35, 28, 5, 2),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '19 days', 4, 1, 38, 31, 6, 2),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '18 days', 6, 2, 42, 35, 6, 2),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '17 days', 5, 2, 48, 40, 7, 2),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '16 days', 6, 2, 53, 44, 8, 3),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '15 days', 5, 2, 58, 48, 8, 3),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '14 days', 7, 2, 65, 54, 9, 3),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '13 days', 6, 2, 70, 58, 10, 3),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '12 days', 7, 3, 78, 65, 11, 4),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '11 days', 6, 2, 84, 70, 12, 4),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '10 days', 8, 3, 92, 77, 13, 4),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '9 days', 7, 2, 98, 82, 14, 5),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '8 days', 8, 3, 108, 90, 15, 5),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '7 days', 7, 2, 115, 96, 16, 5),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '6 days', 9, 3, 125, 104, 17, 6),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '5 days', 8, 3, 135, 113, 18, 6),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '4 days', 9, 3, 148, 123, 20, 7),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '3 days', 8, 3, 158, 132, 21, 7),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '2 days', 10, 3, 172, 143, 23, 8),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - interval '1 day', 9, 3, 185, 154, 24, 8)
ON CONFLICT (project_id, date) DO NOTHING;

-- Step 7: 3 Competitors
INSERT INTO public.competitors (id, project_id, name, website_url, brand_keywords, mention_count, last_seen_at) VALUES
  ('cccccccc-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', 'Rolex', 'https://www.rolex.com', ARRAY['Rolex', 'rolex', 'Submariner', 'Datejust'], 450, now() - interval '2 hours'),
  ('cccccccc-0001-0001-0001-000000000002', '11111111-1111-1111-1111-111111111111', 'Omega', 'https://www.omegawatches.com', ARRAY['Omega', 'omega', 'Speedmaster', 'Seamaster'], 320, now() - interval '5 hours'),
  ('cccccccc-0001-0001-0001-000000000003', '11111111-1111-1111-1111-111111111111', 'Tissot', 'https://www.tissotwatches.com', ARRAY['Tissot', 'tissot', 'PRX', 'Gentleman'], 180, now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;

-- Step 8: 5 Alerts
INSERT INTO public.alerts (id, project_id, type, title, body, is_read, delivered_via, created_at) VALUES
  ('dddddddd-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', 'new_thread', 'High-value thread discovered', 'New thread "Best watch brands for the money in 2026" in r/malefashionadvice has an overall score of 95. This thread ranks #1 on Google and has high buying intent.', false, 'both', now() - interval '2 hours'),
  ('dddddddd-0001-0001-0001-000000000002', '11111111-1111-1111-1111-111111111111', 'brand_mention', 'AcmeWatch mentioned in r/watches', 'Your brand "AcmeWatch" was mentioned in the thread "Underrated watch brands you should know about" by user hidden_gem_guy.', false, 'in_app', now() - interval '6 hours'),
  ('dddddddd-0001-0001-0001-000000000003', '11111111-1111-1111-1111-111111111111', 'competitor_activity', 'Rolex trending in target subreddits', 'Competitor "Rolex" received 23 new mentions across your target subreddits in the last 24 hours, a 15% increase from the daily average.', false, 'email', now() - interval '1 day'),
  ('dddddddd-0001-0001-0001-000000000004', '11111111-1111-1111-1111-111111111111', 'comment_status', 'Comment went live on r/BuyItForLife', 'Your comment on "Looking for a daily wear watch that will last decades" is now live and has received 32 upvotes.', true, 'in_app', now() - interval '3 days'),
  ('dddddddd-0001-0001-0001-000000000005', '11111111-1111-1111-1111-111111111111', 'comment_status', 'Comment reached 50+ upvotes', 'Your comment on "Is it worth spending $500 on a watch?" has crossed 50 upvotes! It is now one of the top comments in the thread.', true, 'both', now() - interval '2 days')
ON CONFLICT (id) DO NOTHING;

-- Step 9: Credit Transactions
INSERT INTO public.credit_transactions (id, user_id, type, amount, balance_after, description, reference_id, created_at) VALUES
  ('eeeeeeee-0001-0001-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'subscription_grant', 500, 500, 'Pro plan monthly credit grant', NULL, now() - interval '30 days'),
  ('eeeeeeee-0001-0001-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'comment_used', -10, 490, 'Comment posted on "Best watches under $500?"', 'bbbbbbbb-0001-0001-0001-000000000001', now() - interval '5 days'),
  ('eeeeeeee-0001-0001-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'comment_used', -10, 480, 'Comment posted on "Looking for a daily wear watch"', 'bbbbbbbb-0001-0001-0001-000000000002', now() - interval '4 days'),
  ('eeeeeeee-0001-0001-0001-000000000004', '00000000-0000-0000-0000-000000000001', 'comment_used', -10, 470, 'Comment posted on "Affordable watches that look expensive"', 'bbbbbbbb-0001-0001-0001-000000000003', now() - interval '4 days'),
  ('eeeeeeee-0001-0001-0001-000000000005', '00000000-0000-0000-0000-000000000001', 'comment_used', -10, 460, 'Comment posted on "Seiko vs Orient vs alternatives"', 'bbbbbbbb-0001-0001-0001-000000000004', now() - interval '3 days'),
  ('eeeeeeee-0001-0001-0001-000000000006', '00000000-0000-0000-0000-000000000001', 'comment_used', -10, 450, 'Comment posted on "Is it worth spending $500 on a watch?"', 'bbbbbbbb-0001-0001-0001-000000000005', now() - interval '3 days'),
  ('eeeeeeee-0001-0001-0001-000000000007', '00000000-0000-0000-0000-000000000001', 'comment_used', -10, 440, 'Comment posted on "Rolex alternatives that punch above their weight"', 'bbbbbbbb-0001-0001-0001-000000000008', now() - interval '2 days'),
  ('eeeeeeee-0001-0001-0001-000000000008', '00000000-0000-0000-0000-000000000001', 'upvote_used', -5, 435, 'Upvote boost on "Best watches under $500?" comment', 'bbbbbbbb-0001-0001-0001-000000000001', now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;
