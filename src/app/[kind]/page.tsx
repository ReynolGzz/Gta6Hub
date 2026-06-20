import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { entityByKind, GENERIC_ENTITIES } from "@/lib/entities";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";
import { parseJson, formatMoney } from "@/lib/utils";

// Pre-render the generic list routes (cars/money have their own pages).
export function generateStaticParams() {
  return GENERIC_ENTITIES.map((e) => ({ kind: e.kind }));
}

export async function generateMetadata({ params }: { params: Promise<{ kind: string }> }): Promise<Metadata> {
  const { kind } = await params;
  const cfg = entityByKind(kind);
  if (!cfg || !cfg.dbType) return buildMetadata({ title: "Not found" });
  return buildMetadata({ title: cfg.label, description: cfg.description, path: cfg.route });
}

const accentText: Record<string, string> = { pink: "text-neon-pink", purple: "text-neon-purple", blue: "text-neon-blue" };

export default async function EntityListPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  const cfg = entityByKind(kind);
  if (!cfg || !cfg.dbType) notFound();

  const entities = await db.entity.findMany({
    where: { type: cfg.dbType },
    orderBy: { popularity: "desc" },
  });

  const jsonLd = itemListJsonLd(cfg.label, entities.map((e) => ({ name: e.name, url: `${cfg.route}/${e.slug}` })));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader title={cfg.label} icon={cfg.icon} accent={cfg.accent} description={cfg.description} />
      <div className="container py-10">
        {entities.length === 0 ? (
          <div className="glass-card p-12 text-center text-muted-foreground">No {cfg.label.toLowerCase()} yet.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entities.map((e) => {
              const data = parseJson<Record<string, unknown>>(e.data, {});
              const primary = cfg.fields?.[0];
              const primaryVal = primary ? data[primary.key] : undefined;
              return (
                <Link
                  key={e.id}
                  href={`${cfg.route}/${e.slug}`}
                  className="group glass-card flex flex-col gap-3 p-5 transition-all hover:-translate-y-1 hover:border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-white/5">
                      <Icon name={cfg.icon} className={`size-5 ${accentText[cfg.accent]}`} />
                    </span>
                    {e.category && <Badge variant="muted">{e.category}</Badge>}
                  </div>
                  <div>
                    <h3 className={`font-display text-lg font-bold transition-colors group-hover:${accentText[cfg.accent]}`}>{e.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{e.summary}</p>
                  </div>
                  {primary && primaryVal != null && (
                    <p className="mt-auto text-sm">
                      <span className="text-muted-foreground">{primary.label}: </span>
                      <span className="font-mono font-medium">
                        {primary.type === "money" ? formatMoney(Number(primaryVal)) : String(primaryVal)}
                      </span>
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
