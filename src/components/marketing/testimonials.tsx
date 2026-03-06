"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    platform: "G2",
    headline: "Reddit traffic went through the roof",
    body: "Within 3 weeks of using Mentionly, our Reddit referral traffic increased by 340%. The AI-generated comments are indistinguishable from organic posts.",
    author: "Sarah Chen",
    date: "Feb 2026",
  },
  {
    platform: "Trustpilot",
    headline: "Finally, Reddit marketing that works",
    body: "We tried managing Reddit manually for months. Mentionly found threads we never would have discovered and the comments actually get upvoted.",
    author: "Marcus Johnson",
    date: "Jan 2026",
  },
  {
    platform: "Product Hunt",
    headline: "Game changer for SaaS founders",
    body: "As a solo founder, I don't have time for Reddit. Mentionly handles everything — discovery, writing, posting. I just approve and watch the leads come in.",
    author: "Alex Rivera",
    date: "Mar 2026",
  },
  {
    platform: "G2",
    headline: "Best ROI of any marketing channel",
    body: "We spent $10K/month on paid ads with mediocre results. Mentionly costs a fraction and drives more qualified traffic from Reddit threads that rank on Google.",
    author: "Priya Patel",
    date: "Feb 2026",
  },
  {
    platform: "Trustpilot",
    headline: "Our brand now appears in AI answers",
    body: "The AI visibility tracking showed us that Reddit mentions are getting picked up by ChatGPT and Perplexity. Organic reach we never expected.",
    author: "David Kim",
    date: "Jan 2026",
  },
  {
    platform: "Product Hunt",
    headline: "Set it and forget it Reddit growth",
    body: "I check in once a week to approve comments. Mentionly does the rest — finding threads, generating replies, even boosting visibility. Incredible tool.",
    author: "Emma Thompson",
    date: "Mar 2026",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = testimonials.length - 1;

  function next() {
    setCurrentIndex((i) => Math.min(i + 1, maxIndex));
  }

  function prev() {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }

  return (
    <section
      className="py-16 md:py-20"
      style={{
        background:
          "linear-gradient(180deg, #FFEDD5 0%, #FFFFFF 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-section-title-mobile md:text-section-title font-heading text-gray-900">
            Loved by Marketers
          </h2>
          <p className="mt-4 text-body-lg text-gray-500 max-w-2xl mx-auto">
            See what our users are saying about growing their brands with
            Reddit.
          </p>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {testimonials
                  .slice(currentIndex, currentIndex + 3)
                  .map((testimonial) => (
                    <div
                      key={testimonial.author}
                      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card"
                    >
                      <div className="text-sm text-gray-400 mb-2">
                        {testimonial.platform}
                      </div>
                      <div className="flex gap-0.5 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <h3 className="font-heading font-bold text-gray-900 text-lg mb-2">
                        &ldquo;{testimonial.headline}&rdquo;
                      </h3>
                      <p className="text-body-sm text-gray-500 mb-4">
                        {testimonial.body}
                      </p>
                      <p className="text-sm text-gray-400">
                        — {testimonial.author}, {testimonial.date}
                      </p>
                    </div>
                  ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              disabled={currentIndex === 0}
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i === currentIndex ? "bg-orange-500" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to testimonial group ${i + 1}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              disabled={currentIndex >= maxIndex}
              aria-label="Next testimonials"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
