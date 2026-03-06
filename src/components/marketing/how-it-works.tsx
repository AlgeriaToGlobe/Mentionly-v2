"use client";

import { motion } from "framer-motion";
import { Globe, Search, MessageSquare, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const steps: { number: number; icon: LucideIcon; title: string; description: string }[] = [
  {
    number: 1,
    icon: Globe,
    title: "Enter Your URL",
    description:
      "Add your website and target keywords. We'll understand your product and audience.",
  },
  {
    number: 2,
    icon: Search,
    title: "Discover Threads",
    description:
      "Our AI scans Reddit 24/7 for threads that rank on Google and match your niche.",
  },
  {
    number: 3,
    icon: MessageSquare,
    title: "Generate & Approve",
    description:
      "Review AI-generated comments that mention your brand naturally. Edit or approve with one click.",
  },
  {
    number: 4,
    icon: Rocket,
    title: "We Handle the Rest",
    description:
      "We post through trusted accounts and boost visibility. You just watch the traffic roll in.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-section-title-mobile md:text-section-title font-heading text-gray-900">
            How It Works
          </h2>
          <p className="mt-4 text-body-lg text-gray-500 max-w-2xl mx-auto">
            Get your brand mentioned in high-traffic Reddit threads in 4 simple
            steps.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={fadeUp}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-heading font-bold text-lg">
                {step.number}
              </div>
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center">
                <step.icon className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="text-card-title font-heading text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-body-sm text-gray-500">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
