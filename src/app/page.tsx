import Link from "next/link";
import { ArrowRight, Sparkles, Zap, DollarSign, Search as SearchIcon, Bot, Map as MapIcon } from "lucide-react";
import { HeroSearch } from "@/components/search/hero-search";
import { GlowField } from "@/components/marketing/glow";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { ENTITIES } from "@/lib/entities";
import { SEARCH_INDEX } from "@/lib/search";
import { db } from "@/lib/db";
import { formatMoney } from "@/lib/utils";

const accentText: Record<string, string> = {
  pink: "text-neon-pink",
  purple: "text-neon-purple",
  blue: "text-neon-blue",
};
const accentBorder: Record<string, string> = {
  pink: "hover:border-neon-pink/40",
  purple: "hover:border-neon-purple/40",
  blue: "hover:border-neon-blue/40",
};

export default async function HomePage() {
  const [fastestCar, topMoney, trending] = await Promise.all([
    db.car.findFirst({ orderBy: { topSpeed: "desc" } }),
    db.moneyMethod.findFirst({ orderBy: { profitPerHour: "desc" } }),
    Promise.resolve(SEARCH_INDEX.slice(0, 6)),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <GlowField />
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="container relative flex flex-col items-center py-24 text-center sm:py-32">
          <Badge variant="muted" className="mb-6 animate-fade-up gap-1.5 py-1">
            <Sparkles className="size-3 text-neon-pink" /> The GTA 6 Intelligence Platform
          </Badge>
          <h1 className="max-w-4xl animate-fade-up font-display text-5xl font-extrabold leading-[1.05] tracking-tight animate-delay-100 sm:text-7xl">
            Stop searching YouTube.
            <br />
            <span className="text-gradient">Search GTA 6.</span>
          </h1>
          <p className="mt-6 max-w-2xl animate-fade-up text-lg text-muted-foreground animate-delay-200">
            Every car, weapon, business, mission and secret — in one structured,
            instantly searchable database. Find the answer in seconds, not 20-minute videos.
          </p>
          <div className="mt-10 w-full animate-fade-up animate-delay-300">
            <HeroSearch />
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="font-display text-lg font-bold text-foreground">{SEARCH_INDEX.length}+</span> entries
            </span>
            <span className="flex items-center gap-2">
              <Zap className="size-4 text-neon-pink" /> Instant search
            </span>
            <span className="flex items-center gap-2">
              <Bot className="size-4 text-neon-blue" /> AI assistant
            </span>
            <span className="flex items-center gap-2">
              <MapIcon className="size-4 text-neon-purple" /> Interactive map
            </span>
          </div>
        </div>
      </section>

      {/* Quick answers */}
      <section className="container -mt-8 grid gap-4 sm:grid-cols-2">
        {fastestCar && (
          <Link
            href={`/cars/${fastestCar.slug}`}
            className="group glass-card flex items-center justify-between gap-4 p-6 transition-all hover:border-neon-pink/40"
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Fastest car</p>
              <p className="mt-1 font-display text-2xl font-bold">{fastestCar.name}</p>
              <p className="text-sm text-neon-pink">{fastestCar.topSpeed} mph top speed</p>
            </div>
            <Zap className="size-10 text-neon-pink transition-transform group-hover:scale-110" />
          </Link>
        )}
        {topMoney && (
          <Link
            href={`/money/${topMoney.slug}`}
            className="group glass-card flex items-center justify-between gap-4 p-6 transition-all hover:border-neon-blue/40"
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Best money method</p>
              <p className="mt-1 font-display text-2xl font-bold">{topMoney.name}</p>
              <p className="text-sm text-neon-blue">{formatMoney(topMoney.profitPerHour)}/hour</p>
            </div>
            <DollarSign className="size-10 text-neon-blue transition-transform group-hover:scale-110" />
          </Link>
        )}
      </section>

      {/* Database categories */}
      <section className="container py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">The database</h2>
            <p className="mt-2 text-muted-foreground">Structured knowledge across every corner of Leonida.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {ENTITIES.map((e) => (
            <Link
              key={e.kind}
              href={e.route}
              className={`group glass-card flex flex-col gap-3 p-5 transition-all hover:-translate-y-1 ${accentBorder[e.accent]}`}
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-white/5">
                <Icon name={e.icon} className={`size-5 ${accentText[e.accent]}`} />
              </span>
              <div>
                <p className="font-display text-lg font-bold">{e.label}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{e.description}</p>
              </div>
              <span className="mt-auto flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                Explore <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="container py-10">
        <div className="mb-8 flex items-center gap-2">
          <Zap className="size-5 text-neon-pink" />
          <h2 className="font-display text-2xl font-bold tracking-tight">Trending now</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((t) => (
            <Link key={`${t.type}-${t.id}`} href={t.route} className="group glass-card p-5 transition-all hover:border-white/20">
              <div className="flex items-center justify-between">
                <Badge variant="muted">{t.typeLabel}</Badge>
                <span className="text-xs text-muted-foreground">🔥 {t.popularity}</span>
              </div>
              <p className="mt-3 font-display text-lg font-bold transition-colors group-hover:text-neon-pink">{t.name}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* AI callout */}
      <section className="container py-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 p-10 text-center sm:p-16">
          <GlowField />
          <div className="relative mx-auto max-w-2xl">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-neon-gradient shadow-neon">
              <Bot className="size-7 text-white" />
            </span>
            <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Ask the GTA 6 AI anything
            </h2>
            <p className="mt-3 text-muted-foreground">
              A retrieval-grounded assistant that answers only from the ViceHub database —
              no hallucinated stats, no generic replies. Just real answers with sources.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/ai" className="inline-flex items-center gap-2 rounded-xl bg-neon-gradient px-6 py-3 text-sm font-semibold text-white shadow-neon transition-transform hover:scale-105">
                <SearchIcon className="size-4" /> Try the AI assistant
              </Link>
              <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/5">
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
