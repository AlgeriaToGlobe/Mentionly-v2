"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does Mentionly find relevant Reddit threads?",
    answer:
      "Our AI engine continuously scans thousands of subreddits using your target keywords, competitor names, and niche topics. We score each thread based on Google ranking position, buying intent signals, freshness, and subreddit authority to surface only the highest-value opportunities.",
  },
  {
    question: "Will my brand get banned from Reddit?",
    answer:
      "No. We use aged, high-karma Reddit accounts with established posting histories. Comments are crafted to be genuinely helpful and contextual — not spammy. Our posting patterns mimic natural user behavior, including gradual upvote delivery, to stay well within Reddit's guidelines.",
  },
  {
    question: "How are the AI comments generated?",
    answer:
      "Our AI analyzes the thread context, top existing comments, and your brand's tone and product details. It generates comments that naturally mention your product while providing genuine value to the conversation. You can review, edit, and approve every comment before it's posted.",
  },
  {
    question: "What is AI visibility tracking?",
    answer:
      "We monitor whether your brand appears in AI-generated search results from tools like ChatGPT, Perplexity, and Google AI Overviews. Reddit content is increasingly cited by these AI systems, so we track when your mentions get picked up.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, absolutely. All plans are month-to-month with no long-term contracts. Cancel anytime from your dashboard settings. You'll retain access until the end of your billing period. We also offer a 30-day money-back guarantee.",
  },
  {
    question: "How quickly will I see results?",
    answer:
      "Most users see their first Reddit mentions live within 24-48 hours of setting up their project. Meaningful traffic increases typically appear within 1-2 weeks as comments accumulate upvotes and threads continue ranking on Google.",
  },
  {
    question: "Do you support multiple brands or clients?",
    answer:
      "Yes. Pro and Max plans support multiple projects, each with their own keywords, subreddits, and brand settings. This makes Mentionly perfect for agencies managing multiple clients or businesses with multiple product lines.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-16 md:py-20 bg-gray-50">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center text-section-title-mobile md:text-section-title font-heading text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-body-lg text-gray-500 mb-12">
          Everything you need to know about Mentionly.
        </p>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white border border-gray-200 rounded-xl px-6"
            >
              <AccordionTrigger className="text-left font-heading font-semibold text-gray-900 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-body text-gray-500">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
