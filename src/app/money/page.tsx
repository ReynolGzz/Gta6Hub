import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { MoneyExplorer, type MoneyRow } from "@/components/money/money-explorer";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Best Money Methods",
  description:
    "The most profitable ways to make money in GTA 6, ranked by profit per hour and ROI. Filter by solo and beginner friendly.",
  path: "/money",
});

export default async function MoneyPage() {
  const methods = await db.moneyMethod.findMany({ orderBy: { profitPerHour: "desc" } });
  const rows: MoneyRow[] = methods.map((m) => ({
    id: m.id,
    slug: m.slug,
    name: m.name,
    summary: m.summary,
    category: m.category,
    profitPerHour: m.profitPerHour,
    difficulty: m.difficulty,
    requiredInvestment: m.requiredInvestment,
    playersRequired: m.playersRequired,
    timeNeeded: m.timeNeeded,
    riskLevel: m.riskLevel,
    popularity: m.popularity,
    soloFriendly: m.soloFriendly,
    beginnerFriendly: m.beginnerFriendly,
  }));

  const jsonLd = itemListJsonLd("GTA 6 Money Methods", methods.map((m) => ({ name: m.name, url: `/money/${m.slug}` })));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        title="Money Methods"
        icon="DollarSign"
        accent="blue"
        description="Every way to make money in GTA 6, ranked. Sort by profit, effort or investment and filter for solo and beginner play."
      />
      <div className="container py-10">
        <MoneyExplorer methods={rows} />
      </div>
    </>
  );
}
