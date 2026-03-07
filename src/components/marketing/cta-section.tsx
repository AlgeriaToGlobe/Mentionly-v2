"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function CTASection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "cta-section" }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "You're on the list! We'll notify you when Mentionly launches.");
        setEmail("");
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

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
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            aria-label="Email address"
          />
          <Button
            type="submit"
            size="lg"
            className="px-8 py-3 text-lg font-semibold"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Get Started Free"
            )}
          </Button>
        </form>
        <p className="mt-4 text-sm text-gray-400">
          No credit card required. Free plan available.
        </p>
      </div>
    </section>
  );
}
