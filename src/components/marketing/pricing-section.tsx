"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ShieldCheck, XCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const tiers = [
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
      "Full analytics dashboard",
      "3 projects",
      "Email support",
      "Competitor tracking (1)",
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
      "Custom comment tone",
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
      "Unlimited thread discoveries",
      "Unlimited AI comments",
      "200 managed postings",
      "Advanced upvote boosting",
      "Full analytics + AI visibility",
      "Unlimited projects",
      "Dedicated account manager",
      "Competitor tracking (unlimited)",
      "Custom comment tone",
      "API access",
      "White-label reports",
    ],
    cta: "Start Max Plan",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 md:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-section-title-mobile md:text-section-title font-heading text-gray-900">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-body-lg text-gray-500 max-w-2xl mx-auto">
            Start free. Upgrade when you&apos;re ready. No hidden fees.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={fadeUp}
              className={cn(
                "relative rounded-2xl p-6",
                tier.highlighted
                  ? "border-2 border-orange-500 bg-white"
                  : "border border-gray-200 bg-white"
              )}
            >
              {tier.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {tier.badge}
                </Badge>
              )}

              <h3 className="font-heading font-semibold text-gray-900 text-lg">
                {tier.name}
              </h3>
              <p className="mt-1 text-body-sm text-gray-500">
                {tier.description}
              </p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-heading font-bold text-gray-900">
                  {tier.price}
                </span>
                <span className="text-body-sm text-gray-500">
                  {tier.priceDetail}
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-body-sm text-gray-600"
                  >
                    <Check className="h-4 w-4 mt-0.5 text-orange-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Button
                  asChild
                  className="w-full"
                  variant={tier.highlighted ? "default" : "outline"}
                >
                  <Link href="/signup">{tier.cta}</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            30-day money back guarantee
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-green-500" />
            Cancel anytime
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-green-500" />
            Lifetime rate lock
          </div>
        </div>
      </div>
    </section>
  );
}
