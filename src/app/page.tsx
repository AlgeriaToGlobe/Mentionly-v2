import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { TrustBar } from "@/components/marketing/trust-bar";
import { FeaturesBento } from "@/components/marketing/features-bento";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Testimonials } from "@/components/marketing/testimonials";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FAQ } from "@/components/marketing/faq";
import { CTASection } from "@/components/marketing/cta-section";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Mentionly — Turn Reddit Into Your #1 Growth Channel",
  description:
    "Discover high-intent Reddit threads, generate natural comments, and get your brand mentioned organically. AI-powered Reddit marketing for modern brands.",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mentionly",
  url: "https://mentionly.com",
  logo: "https://mentionly.com/images/logo.png",
  description: "AI-powered Reddit marketing platform",
};

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Mentionly",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareAppSchema),
        }}
      />
      <Navbar />
      <Hero />
      <TrustBar />
      <FeaturesBento />
      <HowItWorks />
      <Testimonials />
      <PricingSection />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  );
}
