import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/navbar";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FAQ } from "@/components/marketing/faq";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Pricing — Mentionly",
  description:
    "Simple, transparent pricing. Start free, upgrade when you're ready.",
};

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <PricingSection />
      <FAQ />
      <Footer />
    </main>
  );
}
