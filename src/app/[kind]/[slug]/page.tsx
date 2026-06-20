import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { ShareCard } from "@/components/entity/share-card";
import { CommunitySection } from "@/components/entity/community-section";
import { entityByKind, GENERIC_ENTITIES } from "@/lib/entities";
import { buildMetadata, articleJsonLd } from "@/lib/seo";
import { parseJson, formatMoney } from "@/lib/utils";

export async function generateStaticParams() {
  const params: { kind: string; slug: string }[] = [];
  for (const cfg of GENERIC_ENTITIES) {
    const rows = await db.entity.findMany({ where: { type: cfg.dbType! }, select: { slug: true } });
    for (const r of rows) params.push({ kind: cfg.kind, slug: r.slug });
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ kind: string; slug: string }> }): Promise<Metadata> {
  const { kind, slug } = await params;
  const cfg = entityByKind(kind);
  if (!cfg?.dbType) return buildMetadata({ title: "Not found" });
  const e = await db.entity.findUnique({ where: { type_slug: { type: cfg.dbType, slug } } });
  if (!e) return buildMetadata({ title: "Not found" });
  return buildMetadata({ title: e.name, description: e.summary, path: `${cfg.route}/${e.slug}`, type: "article" });
}

const accentText: Record<string, string> = { pink: "text-neon-pink", purple: "text-neon-purple", blue: "text-neon-blue" };

export default async function EntityDetailPage({ params }: { params: Promise<{ kind: string; slug: string }> }) {
  const { kind, slug } = await params;
  const cfg = entityByKind(kind);
  if (!cfg?.dbType) notFound();

  const e = await db.entity.findUnique({ where: { type_slug: { type: cfg.dbType, slug } } });
  if (!e) notFound();

  const data = parseJson<Record<string, unknown>>(e.data, {});
  const related = await db.entity.findMany({
    where: { type: cfg.dbType, slug: { not: e.slug } },
    orderBy: { popularity: "desc" },
    take: 5,
  });

  const fields = (cfg.fields ?? []).filter((f) => data[f.key] != null);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd({ headline: e.name, description: e.summary, path: `${cfg.route}/${e.slug}` })) }} />

      <div className="container py-8">
        <Link href={cfg.route} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> All {cfg.label.toLowerCase()}
        </Link>
      </div>

      <div className="container grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="glass-card relative overflow-hidden p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-neon-purple/15 blur-[100px]" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-white/5">
                  <Icon name={cfg.icon} className={`size-6 ${accentText[cfg.accent]}`} />
                </span>
                {e.category && <Badge variant="muted">{e.category}</Badge>}
                <Badge variant="outline">{cfg.singular}</Badge>
              </div>
              <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight">{e.name}</h1>
              <p className="mt-3 max-w-xl text-lg text-muted-foreground">{e.summary}</p>
              <div className="mt-6">
                <ShareCard title={e.name} stat={cfg.singular} path={`${cfg.route}/${e.slug}`} />
              </div>
            </div>
          </div>

          {fields.length > 0 && (
            <div className="glass-card mt-6 p-8">
              <h2 className="mb-4 font-display text-2xl font-bold">Details</h2>
              <dl className="divide-y divide-white/5">
                {fields.map((f) => (
                  <div key={f.key} className="flex items-center justify-between py-3">
                    <dt className="text-sm text-muted-foreground">{f.label}</dt>
                    <dd className="font-mono text-sm font-medium">
                      {f.type === "money" ? formatMoney(Number(data[f.key])) : String(data[f.key])}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <CommunitySection entityType={cfg.kind} entityId={e.id} className="mt-6" />
        </div>

        <aside className="space-y-6">
          {cfg.mappable && e.lat != null && e.lng != null && (
            <div className="glass-card p-6">
              <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
                <MapPin className="size-4 text-neon-blue" /> Location
              </h3>
              <p className="font-mono text-sm text-muted-foreground">{e.lat.toFixed(3)}, {e.lng.toFixed(3)}</p>
              <Link href="/map" className="mt-3 inline-flex text-sm text-neon-blue hover:underline">View on map →</Link>
            </div>
          )}

          <div className="glass-card p-6">
            <h3 className="mb-4 font-display text-lg font-bold">More {cfg.label.toLowerCase()}</h3>
            <div className="space-y-2">
              {related.map((r) => (
                <Link key={r.id} href={`${cfg.route}/${r.slug}`} className="block rounded-lg px-2 py-2 text-sm hover:bg-white/5">
                  {r.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
