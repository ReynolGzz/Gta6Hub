import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { GiveawayCard, type GiveawayCardData } from "@/components/giveaway/giveaway-card";
import { DiscordButton } from "@/components/community/discord-button";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";
import { liveStatus } from "@/lib/giveaways";

export const metadata: Metadata = buildMetadata({
  title: "GTA 6 Giveaways & Prizes",
  description:
    "Win free GTA 6 copies, in-game cash, gift cards and merch in ViceHub's community giveaways. Enter free and earn bonus entries.",
  path: "/giveaways",
});

// Giveaways change with the clock — don't statically cache.
export const dynamic = "force-dynamic";

const ORDER: Record<string, number> = { ACTIVE: 0, UPCOMING: 1, ENDED: 2 };

export default async function GiveawaysPage() {
  const giveaways = await db.giveaway.findMany({
    orderBy: [{ featured: "desc" }, { endsAt: "asc" }],
    include: { _count: { select: { entries: true } } },
  });

  const cards: (GiveawayCardData & { order: number })[] = giveaways
    .map((g) => ({
      slug: g.slug,
      title: g.title,
      prize: g.prize,
      summary: g.summary,
      status: g.status,
      startsAt: g.startsAt,
      endsAt: g.endsAt,
      winnerName: g.winnerName,
      featured: g.featured,
      entryCount: g._count.entries,
      order: ORDER[liveStatus(g)] ?? 3,
    }))
    .sort((a, b) => a.order - b.order || (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  const jsonLd = itemListJsonLd(
    "ViceHub GTA 6 Giveaways",
    giveaways.map((g) => ({ name: g.title, url: `/giveaways/${g.slug}` }))
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        title="Giveaways"
        icon="Gift"
        accent="purple"
        description="Free community prize draws — GTA 6 copies, in-game cash, gift cards and merch. Enter free, then earn bonus entries for joining the community."
      >
        <DiscordButton />
      </PageHeader>

      <div className="container py-10">
        {cards.length === 0 ? (
          <p className="text-muted-foreground">No giveaways yet — check back soon.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((g) => (
              <GiveawayCard key={g.slug} g={g} />
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Giveaways are run by ViceHub for the community. No purchase necessary. Winners are
          drawn at random and announced on this page and our Discord.
        </p>
      </div>
    </>
  );
}
