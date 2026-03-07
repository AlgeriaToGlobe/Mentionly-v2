"use client";

import { useState } from "react";
import Link from "next/link";
import { Twitter, Linkedin, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function Footer() {
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
        body: JSON.stringify({ email, source: "footer" }),
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
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-heading text-xl font-bold text-white">
              Mentionly
            </Link>
            <p className="mt-3 text-sm">
              AI-powered Reddit marketing platform. Get your brand mentioned in
              the threads that matter.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-white mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-white mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#faq" className="hover:text-white transition-colors">Help / FAQ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-white mb-3">Stay Updated</h4>
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <input
                type="email"
                required
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-orange-500 focus:outline-none"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
                aria-label="Subscribe to newsletter"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
              </button>
            </form>
            <div className="mt-4 flex gap-3">
              <a href="#" className="hover:text-white transition-colors" aria-label="Follow on X">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Follow on LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Mentionly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
