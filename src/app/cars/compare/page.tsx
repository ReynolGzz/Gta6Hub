import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { formatMoney } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Compare Cars",
  description: "Compare GTA 6 vehicles side by side: top speed, acceleration, braking, handling and price.",
  path: "/cars/compare",
});

const ROWS: { label: string; key: "topSpeed" | "acceleration" | "braking" | "handling" | "price"; fmt?: (n: number) => string; higher: boolean }[] = [
  { label: "Top Speed (mph)", key: "topSpeed", higher: true },
  { label: "Acceleration", key: "acceleration", higher: true },
  { label: "Braking", key: "braking", higher: true },
  { label: "Handling", key: "handling", higher: true },
  { label: "Price", key: "price", fmt: formatMoney, higher: false },
];

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const { ids } = await searchParams;
  const slugs = (ids ?? "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const cars = slugs.length
    ? await db.car.findMany({ where: { slug: { in: slugs } } })
    : [];
  // Preserve the order the user selected.
  const ordered = slugs.map((s) => cars.find((c) => c.slug === s)).filter(Boolean) as typeof cars;

  return (
    <>
      <PageHeader title="Compare" icon="GitCompareArrows" accent="blue" description="Vehicles head-to-head. Best value in each row is highlighted." />
      <div className="container py-10">
        <Link href="/cars" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to cars
        </Link>

        {ordered.length < 2 ? (
          <div className="glass-card p-12 text-center text-muted-foreground">
            Select 2–3 cars from the <Link href="/cars" className="text-neon-pink hover:underline">cars database</Link> to compare them.
          </div>
        ) : (
          <div className="glass-card overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-5 text-left text-sm font-medium text-muted-foreground">Spec</th>
                  {ordered.map((c) => (
                    <th key={c.id} className="p-5 text-left">
                      <Link href={`/cars/${c.slug}`} className="font-display text-lg font-bold hover:text-neon-pink">{c.name}</Link>
                      <p className="text-xs font-normal text-muted-foreground">{c.category}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => {
                  const values = ordered.map((c) => c[row.key]);
                  const best = row.higher ? Math.max(...values) : Math.min(...values);
                  return (
                    <tr key={row.key} className="border-b border-white/5">
                      <td className="p-5 text-sm text-muted-foreground">{row.label}</td>
                      {ordered.map((c) => {
                        const v = c[row.key];
                        const isBest = v === best;
                        return (
                          <td key={c.id} className="p-5">
                            <span className={isBest ? "font-mono font-bold text-neon-pink" : "font-mono"}>
                              {row.fmt ? row.fmt(v) : v}
                            </span>
                            {isBest && <span className="ml-2 text-[10px] uppercase text-neon-pink">Best</span>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
