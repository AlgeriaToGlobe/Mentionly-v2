export const PLAN_TIERS = [
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
      "Full analytics",
      "3 projects",
      "Email support",
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
      "Unlimited discoveries",
      "Unlimited AI comments",
      "200 managed postings",
      "Advanced upvote boosting",
      "Full analytics + AI visibility",
      "Unlimited projects",
      "Dedicated account manager",
      "API access",
    ],
    cta: "Start Max Plan",
    highlighted: false,
  },
] as const;

export const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Discover", href: "/dashboard/discover", icon: "Search" },
  { label: "Comments", href: "/dashboard/comments", icon: "MessageSquare" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "BarChart3" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
] as const;

export const MAX_CREDITS = 10000;
export const APP_NAME = "Mentionly";
export const APP_URL = "https://mentionly.com";
