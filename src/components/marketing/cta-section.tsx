import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section
      className="py-16 md:py-20"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #FFF7ED 0%, #FFEDD5 40%, #FFFFFF 80%)",
      }}
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-section-title-mobile md:text-section-title font-heading text-gray-900">
          Ready to Turn Reddit Into Your Growth Engine?
        </h2>
        <p className="mt-4 text-body-lg text-gray-500 max-w-2xl mx-auto">
          Join 200+ brands already using Mentionly to get discovered on Reddit
          and beyond.
        </p>
        <div className="mt-8">
          <Button
            asChild
            size="lg"
            className="px-8 py-3 text-lg font-semibold"
          >
            <Link href="/signup">Get Started Free</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-gray-400">
          No credit card required. Free plan available.
        </p>
      </div>
    </section>
  );
}
