import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/navbar";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FAQ } from "@/components/marketing/faq";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for Mentionly. Start free, upgrade when you're ready. No hidden fees.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does Mentionly find relevant Reddit threads?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our AI engine continuously scans thousands of subreddits using your target keywords, competitor names, and niche topics. We score each thread based on Google ranking position, buying intent signals, freshness, and subreddit authority to surface only the highest-value opportunities.",
      },
    },
    {
      "@type": "Question",
      name: "Will my brand get banned from Reddit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. We use aged, high-karma Reddit accounts with established posting histories. Comments are crafted to be genuinely helpful and contextual — not spammy.",
      },
    },
    {
      "@type": "Question",
      name: "How are the AI comments generated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our AI analyzes the thread context, top existing comments, and your brand's tone and product details. It generates comments that naturally mention your product while providing genuine value to the conversation.",
      },
    },
    {
      "@type": "Question",
      name: "Can I cancel anytime?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, absolutely. All plans are month-to-month with no long-term contracts. Cancel anytime from your dashboard settings. We also offer a 30-day money-back guarantee.",
      },
    },
    {
      "@type": "Question",
      name: "How quickly will I see results?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most users see their first Reddit mentions live within 24-48 hours of setting up their project. Meaningful traffic increases typically appear within 1-2 weeks.",
      },
    },
    {
      "@type": "Question",
      name: "Do you support multiple brands or clients?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Pro and Max plans support multiple projects, each with their own keywords, subreddits, and brand settings. Perfect for agencies managing multiple clients.",
      },
    },
  ],
};

export default function PricingPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <Navbar />
      <PricingSection />
      <FAQ />
      <Footer />
    </main>
  );
}
