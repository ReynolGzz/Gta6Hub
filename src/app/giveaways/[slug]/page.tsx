import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Gift, Users, Clock, Trophy } from "lucide-react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/entity/markdown";
import { EnterGiveaway } from "@/components/giveaway/enter-giveaway";
import { buildMetadata, articleJsonLd } from "@/lib/seo";
import { env } from "@/lib/env";
import { formatNumber } from "@/lib/utils";
import { liveStatus, timeRemaining, statusBadgeVariant } from "@/lib/giveaways";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = await db.giveaway.findUnique({ where: { slug } });
  if (!g) return buildMetadata({ title: "Giveaway not found", path: `/giveaways/${slug}` });
  return buildMetadata({
    title: g.title,
    description: `${g.summary} Prize: ${g.prize}. Enter free on ViceHub.`,
    path: `/giveaways/${slug}`,
    type: "article",
  });
}

export default async function GiveawayDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const giveaway = await db.giveaway.findUnique({
    where: { slug },
    include: { _count: { select: { entries: true } } },
  });
  if (!giveaway) notFound();

  const status = liveStatus(giveaway);
  const session = await auth();
  const myEntry = session?.user
    ? await db.giveawayEntry.findUnique({
        where: { giveawayId_userId: { giveawayId: giveaway.id, userId: session.user.id } },
      })
    : null;

  const jsonLd = articleJsonLd({
    headline: giveaway.title,
    description: giveaway.summary,
    path: `/giveaways/${slug}`,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container py-10">
        <Link href="/giveaways" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> All giveaways
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
          {/* Main */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-neon-gradient shadow-neon">
                <Gift className="size-6 text-white" />
              </span>
              <Badge variant={statusBadgeVariant(status)}>
                {status === "ACTIVE" ? timeRemaining(giveaway.endsAt) : status === "UPCOMING" ? "Coming soon" : "Ended"}
              </Badge>
            </div>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{giveaway.title}</h1>
            <p className="mt-3 text-lg font-semibold text-neon-purple">🎁 {giveaway.prize}</p>

            <div className="glass-card mt-8 p-6 sm:p-8">
              <Markdown content={giveaway.description} />
            </div>

            {status === "ENDED" && giveaway.winnerName && (
              <div className="glass-card mt-6 flex items-center gap-3 p-6">
                <Trophy className="size-6 text-amber-300" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Winner</p>
                  <p className="font-display text-lg font-bold">{giveaway.winnerName}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <EnterGiveaway
              slug={giveaway.slug}
              status={status}
              discordUrl={env.DISCORD_URL || undefined}
              initial={{
                entered: Boolean(myEntry),
                entries: myEntry?.entries ?? 0,
                joinedDiscord: myEntry?.bonusJoinedDiscord ?? false,
                shared: myEntry?.bonusShared ?? false,
              }}
            />

            <div className="glass-card divide-y divide-white/5 p-2">
              <Stat icon={<Users className="size-4 text-neon-blue" />} label="Total entries" value={formatNumber(giveaway._count.entries)} />
              <Stat
                icon={<Clock className="size-4 text-neon-pink" />}
                label={status === "ENDED" ? "Status" : "Time left"}
                value={status === "ENDED" ? "Ended" : timeRemaining(giveaway.endsAt)}
              />
              {giveaway.prizeValue > 0 && (
                <Stat icon={<Gift className="size-4 text-neon-purple" />} label="Prize value" value={`~$${formatNumber(giveaway.prizeValue)}`} />
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-3">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">{icon} {label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
