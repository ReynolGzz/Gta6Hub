import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Zap, MapPin, Lock, Car as CarIcon, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { StatBar } from "@/components/entity/stat-bar";
import { ShareCard } from "@/components/entity/share-card";
import { CommunitySection } from "@/components/entity/community-section";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/utils";
import { buildMetadata, vehicleJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const cars = await db.car.findMany({ select: { slug: true } });
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const car = await db.car.findUnique({ where: { slug } });
  if (!car) return buildMetadata({ title: "Car not found" });
  return buildMetadata({
    title: car.name,
    description: `${car.name} — ${car.topSpeed} mph top speed, ${formatMoney(car.price)}. ${car.summary}`,
    path: `/cars/${car.slug}`,
    type: "article",
  });
}

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = await db.car.findUnique({ where: { slug } });
  if (!car) notFound();

  const [sameClass, alsoViewed] = await Promise.all([
    db.car.findMany({ where: { category: car.category, slug: { not: car.slug } }, orderBy: { topSpeed: "desc" }, take: 4 }),
    db.car.findMany({ where: { slug: { not: car.slug } }, orderBy: { popularity: "desc" }, take: 4 }),
  ]);

  // Best alternatives: closest top speed in a different price bracket.
  const alternatives = [...sameClass].sort(
    (a, b) => Math.abs(a.topSpeed - car.topSpeed) - Math.abs(b.topSpeed - car.topSpeed)
  ).slice(0, 3);

  const jsonLd = vehicleJsonLd(car);

  const specs: { label: string; value: string }[] = [
    { label: "Category", value: car.category },
    { label: "Top Speed", value: `${car.topSpeed} mph` },
    { label: "Price", value: formatMoney(car.price) },
    { label: "Location", value: car.location ?? "—" },
    { label: "Unlock", value: car.unlockMethod ?? "—" },
    { label: "Real-life inspiration", value: car.realLifeInspiration ?? "—" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container py-8">
        <Link href="/cars" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> All cars
        </Link>
      </div>

      <div className="container grid gap-8 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2">
          <div className="glass-card relative overflow-hidden p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-neon-pink/15 blur-[100px]" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{car.category}</Badge>
                <span className="text-xs text-muted-foreground">🔥 {car.popularity} popularity</span>
              </div>
              <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight">{car.name}</h1>
              <p className="mt-3 max-w-xl text-lg text-muted-foreground">{car.summary}</p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-neon-pink/30 bg-neon-pink/10 px-4 py-2">
                  <Zap className="size-5 text-neon-pink" />
                  <span className="font-display text-2xl font-bold">{car.topSpeed}</span>
                  <span className="text-sm text-muted-foreground">mph</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2">
                  <span className="font-display text-2xl font-bold">{formatMoney(car.price)}</span>
                </div>
                <ShareCard title={car.name} stat={`${car.topSpeed} mph · ${formatMoney(car.price)}`} path={`/cars/${car.slug}`} />
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="glass-card mt-6 p-8">
            <h2 className="mb-6 font-display text-2xl font-bold">Performance</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <StatBar label="Top Speed" value={car.topSpeed} max={300} accent="pink" display={`${car.topSpeed} mph`} />
              <StatBar label="Acceleration" value={car.acceleration} accent="blue" />
              <StatBar label="Braking" value={car.braking} accent="purple" />
              <StatBar label="Handling" value={car.handling} accent="blue" />
            </div>
          </div>

          {/* Specs */}
          <div className="glass-card mt-6 p-8">
            <h2 className="mb-4 font-display text-2xl font-bold">Specifications</h2>
            <dl className="divide-y divide-white/5">
              {specs.map((s) => (
                <div key={s.label} className="flex items-center justify-between py-3">
                  <dt className="text-sm text-muted-foreground">{s.label}</dt>
                  <dd className="text-sm font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Community */}
          <CommunitySection entityType="cars" entityId={car.id} className="mt-6" />
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {alternatives.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
                <Sparkles className="size-4 text-neon-pink" /> Best alternatives
              </h3>
              <div className="space-y-3">
                {alternatives.map((a) => (
                  <Link key={a.id} href={`/cars/${a.slug}`} className="flex items-center justify-between rounded-xl border border-white/5 p-3 transition-colors hover:border-neon-pink/30">
                    <div>
                      <p className="text-sm font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.topSpeed} mph</p>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{formatMoney(a.price)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {car.location && (
            <div className="glass-card p-6">
              <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
                <MapPin className="size-4 text-neon-blue" /> Where to find it
              </h3>
              <p className="text-sm text-muted-foreground">{car.location}</p>
              {car.unlockMethod && (
                <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                  <Lock className="mt-0.5 size-4 shrink-0 text-neon-purple" /> {car.unlockMethod}
                </p>
              )}
              <Link href="/map" className="mt-4 inline-flex items-center gap-1 text-sm text-neon-blue hover:underline">
                View on map →
              </Link>
            </div>
          )}

          <div className="glass-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
              <CarIcon className="size-4 text-neon-purple" /> Users also viewed
            </h3>
            <div className="space-y-2">
              {alsoViewed.map((a) => (
                <Link key={a.id} href={`/cars/${a.slug}`} className="flex items-center justify-between rounded-lg px-2 py-2 text-sm transition-colors hover:bg-white/5">
                  <span>{a.name}</span>
                  <span className="text-xs text-muted-foreground">{a.topSpeed} mph</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
