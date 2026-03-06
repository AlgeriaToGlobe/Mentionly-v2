"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const floatingStats = [
  { label: "+340% Traffic", position: "top-16 left-4 md:top-20 md:left-10" },
  { label: "25K+ Threads", position: "top-24 right-2 md:top-32 md:right-8" },
  { label: "4.9★ Rating", position: "bottom-32 left-8 md:bottom-24 md:left-16" },
  { label: "200+ Brands", position: "bottom-24 right-4 md:bottom-20 md:right-12" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-32 relative">
        {floatingStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className={`absolute ${stat.position} hidden md:block bg-white rounded-2xl shadow-stat-badge px-4 py-3 text-sm font-semibold text-gray-900 z-10`}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            {stat.label}
          </motion.div>
        ))}

        <div className="relative z-20 text-center">
          <motion.div {...fadeUp}>
            <span className="inline-block rounded-full bg-orange-100 text-orange-600 px-4 py-1.5 text-body-sm font-medium">
              AI-Powered Reddit Marketing
            </span>
          </motion.div>

          <motion.h1
            className="mt-6 text-hero-title-mobile md:text-hero-title font-heading text-gray-900"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            Turn Reddit Into Your{" "}
            <span className="text-orange-500">#1 Growth Channel</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-body-lg text-gray-500 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            Discover high-intent Reddit threads, generate natural comments, and
            get your brand mentioned — all without managing a single Reddit
            account.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <Button asChild size="lg" className="px-8 py-3 text-lg font-semibold">
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg font-semibold"
            >
              <Link href="/#how-it-works">See How It Works</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
