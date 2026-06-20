import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, DollarSign, Clock, Users, TrendingUp, ShieldAlert, Wallet } from "lucide-react";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/entity/markdown";
import { ShareCard } from "@/components/entity/share-card";
import { CommunitySection } from "@/components/entity/community-section";
import { formatMoney, formatRoi } from "@/lib/utils";
import { buildMetadata, articleJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const methods = await db.moneyMethod.findMany({ select: { slug: true } });
  return methods.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = await db.moneyMethod.findUnique({ where: { slug } });
  if (!m) return buildMetadata({ title: "Method not found" });
  return buildMetadata({
    title: m.name,
    description: `${m.name} — ${formatMoney(m.profitPerHour)}/hour. ${m.summary}`,
    path: `/money/${m.slug}`,
    type: "article",
  });
}

const riskVariant: Record<string, "success" | "warning" | "danger"> = { Low: "success", Medium: "warning", High: "danger" };

export default async function MoneyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = await db.moneyMethod.findUnique({ where: { slug } });
  if (!m) notFound();

  const related = await db.moneyMethod.findMany({
    where: { slug: { not: m.slug } },
    orderBy: { profitPerHour: "desc" },
    take: 4,
  });

  const stats = [
    { icon: <DollarSign className="size-5 text-neon-blue" />, label: "Profit / hour", value: formatMoney(m.profitPerHour) },
    { icon: <Wallet className="size-5 text-neon-pink" />, label: "Investment", value: m.requiredInvestment > 0 ? formatMoney(m.requiredInvestment) : "None" },
    { icon: <TrendingUp className="size-5 text-neon-purple" />, label: "ROI", value: m.requiredInvestment > 0 ? formatRoi(m.profitPerHour, m.requiredInvestment) : "Instant payback" },
    { icon: <Users className="size-5 text-muted-foreground" />, label: "Players", value: `${m.playersRequired}` },
    { icon: <Clock className="size-5 text-muted-foreground" />, label: "Time", value: m.timeNeeded ?? "—" },
    { icon: <ShieldAlert className="size-5 text-muted-foreground" />, label: "Risk", value: m.riskLevel },
  ];

  const jsonLd = articleJsonLd({ headline: m.name, description: m.summary, path: `/money/${m.slug}` });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container py-8">
        <Link href="/money" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> All money methods
        </Link>
      </div>

      <div className="container grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="glass-card relative overflow-hidden p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-neon-blue/15 blur-[100px]" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="blue">{m.category}</Badge>
                <Badge variant={riskVariant[m.riskLevel] ?? "muted"}>{m.riskLevel} risk</Badge>
                {m.soloFriendly && <Badge variant="muted">Solo friendly</Badge>}
                {m.beginnerFriendly && <Badge variant="muted">Beginner friendly</Badge>}
              </div>
              <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight">{m.name}</h1>
              <p className="mt-3 max-w-xl text-lg text-muted-foreground">{m.summary}</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-baseline gap-2 rounded-xl border border-neon-blue/30 bg-neon-blue/10 px-5 py-3">
                  <span className="font-display text-3xl font-extrabold text-neon-blue">{formatMoney(m.profitPerHour)}</span>
                  <span className="text-sm text-muted-foreground">/ hour</span>
                </div>
                <ShareCard title={m.name} stat={`${formatMoney(m.profitPerHour)}/hr in GTA 6`} path={`/money/${m.slug}`} />
              </div>
            </div>
          </div>

          <div className="glass-card mt-6 grid grid-cols-2 gap-4 p-6 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-white/5 p-4">
                <div className="flex items-center gap-2">{s.icon}<span className="text-xs text-muted-foreground">{s.label}</span></div>
                <p className="mt-2 font-mono text-sm font-semibold">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="glass-card mt-6 p-8">
            <h2 className="mb-2 font-display text-2xl font-bold">Guide</h2>
            <Markdown content={m.guide} />
          </div>

          <CommunitySection entityType="money" entityId={m.id} className="mt-6" />
        </div>

        <aside className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="mb-2 font-display text-lg font-bold">ROI calculator</h3>
            <p className="text-sm text-muted-foreground">
              At <span className="font-mono text-neon-blue">{formatMoney(m.profitPerHour)}</span>/hr
              {m.requiredInvestment > 0 ? (
                <> with a <span className="font-mono">{formatMoney(m.requiredInvestment)}</span> investment, you break even in about <span className="font-semibold text-foreground">{(m.requiredInvestment / m.profitPerHour).toFixed(1)} hours</span>.</>
              ) : (
                <> and no upfront cost, every dollar is profit from minute one.</>
              )}
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <Row label="Per session (1h)" value={formatMoney(m.profitPerHour)} />
              <Row label="Per 3h grind" value={formatMoney(m.profitPerHour * 3)} />
              <Row label="Per 10h" value={formatMoney(m.profitPerHour * 10)} />
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="mb-4 font-display text-lg font-bold">Other methods</h3>
            <div className="space-y-2">
              {related.map((r) => (
                <Link key={r.id} href={`/money/${r.slug}`} className="flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-white/5">
                  <span>{r.name}</span>
                  <span className="font-mono text-xs text-neon-blue">{formatMoney(r.profitPerHour)}/hr</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-t border-white/5 pt-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold text-foreground">{value}</span>
    </div>
  );
}
