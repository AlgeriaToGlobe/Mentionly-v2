"use client";

import { motion } from "framer-motion";
import { Search, MessageSquare, Users, BarChart3 } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    title: "Find High-Intent Reddit Threads",
    description:
      "Our AI scans thousands of subreddits to surface threads that rank on Google, mention competitors, and show buying intent.",
    icon: Search,
    illustration: "discovery",
  },
  {
    title: "Generate Natural, Non-Spammy Comments",
    description:
      "AI crafts contextual comments that mention your brand naturally — no templates, no spam.",
    icon: MessageSquare,
    illustration: "comments",
  },
  {
    title: "Post Through Aged, Trusted Accounts",
    description:
      "We maintain a network of high-karma Reddit accounts so your mentions stick.",
    icon: Users,
    illustration: "accounts",
  },
  {
    title: "Track Every Mention's Impact",
    description:
      "See upvotes, traffic estimates, Google rankings, and AI citation tracking in real time.",
    icon: BarChart3,
    illustration: "analytics",
  },
];

function DiscoveryIllustration() {
  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-4 h-40 flex flex-col gap-2">
      <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
        <Search className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-400">Search threads...</span>
      </div>
      <div className="flex gap-2">
        <span className="rounded-full bg-orange-100 text-orange-600 px-2 py-0.5 text-xs">
          r/watches
        </span>
        <span className="rounded-full bg-gray-100 text-gray-600 px-2 py-0.5 text-xs">
          High Intent
        </span>
      </div>
      <div className="flex-1 space-y-1.5">
        <div className="bg-white rounded border border-gray-100 px-3 py-1.5 text-xs text-gray-600">
          Best watches under $500?
        </div>
        <div className="bg-white rounded border border-gray-100 px-3 py-1.5 text-xs text-gray-600">
          Looking for daily wear recs
        </div>
      </div>
    </div>
  );
}

function CommentsIllustration() {
  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-4 h-40 flex flex-col gap-2">
      <div className="bg-white rounded-lg border border-gray-200 p-3 text-xs text-gray-600">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-5 w-5 rounded-full bg-orange-200" />
          <span className="font-medium text-gray-800">AI Draft</span>
        </div>
        I&apos;ve been using AcmeWatch for about 6 months now and it&apos;s
        held up incredibly well for the price...
      </div>
      <div className="flex gap-2 mt-auto">
        <span className="rounded-lg bg-orange-500 text-white px-3 py-1 text-xs font-medium">
          Approve
        </span>
        <span className="rounded-lg bg-gray-100 text-gray-600 px-3 py-1 text-xs font-medium">
          Edit
        </span>
      </div>
    </div>
  );
}

function AccountsIllustration() {
  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-4 h-40 flex items-center justify-center relative">
      <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
        M
      </div>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * 60 * Math.PI) / 180;
        const x = Math.cos(angle) * 48;
        const y = Math.sin(angle) * 48;
        return (
          <div
            key={i}
            className="absolute h-8 w-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xs font-medium text-gray-500"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            {["5y", "3y", "7y", "4y", "6y", "2y"][i]}
          </div>
        );
      })}
    </div>
  );
}

function AnalyticsIllustration() {
  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-4 h-40 flex items-end gap-2 relative">
      {[40, 55, 45, 65, 75, 60, 85].map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm bg-orange-200"
          style={{ height: `${h}%` }}
        />
      ))}
      <div className="absolute top-3 right-3 bg-white rounded-lg shadow-card px-2 py-1 text-xs font-bold text-green-600">
        +42%
      </div>
    </div>
  );
}

const illustrations: Record<string, () => React.JSX.Element> = {
  discovery: DiscoveryIllustration,
  comments: CommentsIllustration,
  accounts: AccountsIllustration,
  analytics: AnalyticsIllustration,
};

export function FeaturesBento() {
  return (
    <section id="features" className="py-16 md:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-section-title-mobile md:text-section-title font-heading text-gray-900">
            Everything You Need to Win on Reddit
          </h2>
          <p className="mt-4 text-body-lg text-gray-500 max-w-2xl mx-auto">
            From thread discovery to comment posting — Mentionly handles the
            entire Reddit marketing workflow.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature) => {
            const Illustration = illustrations[feature.illustration];
            return (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <Illustration />
                <h3 className="text-card-title font-heading text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-body-sm text-gray-500">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
