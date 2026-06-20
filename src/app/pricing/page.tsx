import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { UpgradeButton } from "@/components/billing/upgrade-button";
import { PREMIUM_FEATURES, PREMIUM_PRICE_USD } from "@/lib/stripe";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description: "ViceHub is free to search. Go Premium for the AI assistant, advanced tracking, custom routes and saved builds.",
  path: "/pricing",
});

const FREE_FEATURES = [
  "Full searchable database",
  "All guides & money methods",
  "Compare vehicles",
  "Basic progress tracking",
  "Community votes & comments",
  "Interactive map",
];

export default function PricingPage() {
  return (
    <>
      <PageHeader title="Pricing" icon="Sparkles" accent="pink" description="The database is free forever. Upgrade for power features." />
      <div className="container py-12">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Free */}
          <div className="glass-card p-8">
            <h3 className="font-display text-2xl font-bold">Free</h3>
            <p className="mt-1 text-sm text-muted-foreground">Everything you need to find answers fast.</p>
            <p className="mt-6 font-display text-5xl font-extrabold">$0</p>
            <p className="text-sm text-muted-foreground">forever</p>
            <ul className="mt-8 space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check className="size-4 text-neon-blue" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="mt-8 block rounded-xl border border-white/15 py-3 text-center text-sm font-semibold transition-colors hover:bg-white/5">
              Get started
            </Link>
          </div>

          {/* Premium */}
          <div className="glass-card relative overflow-hidden border-neon-pink/30 p-8 shadow-neon">
            <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-neon-pink/20 blur-[80px]" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-bold text-gradient">Premium</h3>
                <span className="rounded-full bg-neon-pink/15 px-3 py-1 text-xs font-semibold text-neon-pink">Most popular</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">For players who want every edge.</p>
              <p className="mt-6 font-display text-5xl font-extrabold">${PREMIUM_PRICE_USD}</p>
              <p className="text-sm text-muted-foreground">per month</p>
              <ul className="mt-8 space-y-3">
                {PREMIUM_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check className="size-4 text-neon-pink" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <UpgradeButton />
              </div>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-xl text-center text-xs text-muted-foreground">
          Payments are processed securely by Stripe. Without Stripe keys configured, upgrades run in a clearly-marked dev mode so you can test premium features.
        </p>
      </div>
    </>
  );
}
