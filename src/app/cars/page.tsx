import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { CarsExplorer, type CarRow } from "@/components/cars/cars-explorer";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cars Database",
  description:
    "Every GTA 6 vehicle with top speed, acceleration, handling, price and location. Filter by class and sort to find the fastest car.",
  path: "/cars",
});

export default async function CarsPage() {
  const cars = await db.car.findMany({ orderBy: { topSpeed: "desc" } });
  const rows: CarRow[] = cars.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    summary: c.summary,
    category: c.category,
    topSpeed: c.topSpeed,
    acceleration: c.acceleration,
    braking: c.braking,
    handling: c.handling,
    price: c.price,
    realLifeInspiration: c.realLifeInspiration,
  }));

  const jsonLd = itemListJsonLd(
    "GTA 6 Cars",
    cars.map((c) => ({ name: c.name, url: `/cars/${c.slug}` }))
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        title="Cars"
        icon="Car"
        accent="pink"
        description="Every vehicle in GTA 6 with full performance stats. Filter by class, sort by speed or price, and compare up to three side by side."
      />
      <div className="container py-10">
        <CarsExplorer cars={rows} />
      </div>
    </>
  );
}
