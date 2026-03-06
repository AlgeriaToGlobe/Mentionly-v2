import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Blog — Mentionly",
  description: "Insights and strategies for Reddit marketing.",
};

export default function BlogPage() {
  return (
    <main>
      <Navbar />
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-section-title-mobile md:text-section-title font-heading text-gray-900">
            Blog
          </h1>
          <p className="mt-4 text-body-lg text-gray-500">
            Coming soon. We&apos;re working on insightful articles about Reddit
            marketing, SEO, and AI visibility.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
