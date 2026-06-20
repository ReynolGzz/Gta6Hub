"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Zap, Gauge, ArrowRight, GitCompareArrows } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CAR_CATEGORIES } from "@/lib/entities";
import { formatMoney } from "@/lib/utils";

export interface CarRow {
  id: string;
  slug: string;
  name: string;
  summary: string;
  category: string;
  topSpeed: number;
  acceleration: number;
  braking: number;
  handling: number;
  price: number;
  realLifeInspiration: string | null;
}

const SORTS = {
  "speed-desc": { label: "Top speed (high → low)", fn: (a: CarRow, b: CarRow) => b.topSpeed - a.topSpeed },
  "speed-asc": { label: "Top speed (low → high)", fn: (a: CarRow, b: CarRow) => a.topSpeed - b.topSpeed },
  "price-desc": { label: "Price (high → low)", fn: (a: CarRow, b: CarRow) => b.price - a.price },
  "price-asc": { label: "Price (low → high)", fn: (a: CarRow, b: CarRow) => a.price - b.price },
  "accel-desc": { label: "Acceleration", fn: (a: CarRow, b: CarRow) => b.acceleration - a.acceleration },
  "handling-desc": { label: "Handling", fn: (a: CarRow, b: CarRow) => b.handling - a.handling },
} as const;

export function CarsExplorer({ cars }: { cars: CarRow[] }) {
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<keyof typeof SORTS>("speed-desc");
  const [q, setQ] = useState("");
  const [compare, setCompare] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let rows = cars;
    if (category !== "All") rows = rows.filter((c) => c.category === category);
    if (q.trim()) {
      const term = q.toLowerCase();
      rows = rows.filter(
        (c) => c.name.toLowerCase().includes(term) || c.realLifeInspiration?.toLowerCase().includes(term)
      );
    }
    return [...rows].sort(SORTS[sort].fn);
  }, [cars, category, sort, q]);

  const toggleCompare = (slug: string) => {
    setCompare((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : prev.length < 3 ? [...prev, slug] : prev
    );
  };

  return (
    <div>
      {/* Controls */}
      <div className="glass-card mb-6 flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
        <Input
          placeholder="Search cars or real-life inspiration…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="lg:max-w-xs"
        />
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="w-40">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="All">All categories</option>
              {CAR_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>
          <div className="w-56">
            <Select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)}>
              {Object.entries(SORTS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </Select>
          </div>
          <span className="ml-auto text-sm text-muted-foreground">{filtered.length} cars</span>
        </div>
      </div>

      {/* Category chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["All", ...CAR_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              category === c
                ? "border-neon-pink/50 bg-neon-pink/10 text-neon-pink"
                : "border-white/10 text-muted-foreground hover:border-white/25 hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <div key={c.id} className="group glass-card overflow-hidden p-5 transition-all hover:-translate-y-1 hover:border-neon-pink/40">
            <div className="flex items-start justify-between">
              <Badge variant="muted">{c.category}</Badge>
              <button
                onClick={() => toggleCompare(c.slug)}
                className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] transition-colors ${
                  compare.includes(c.slug)
                    ? "border-neon-blue/50 bg-neon-blue/10 text-neon-blue"
                    : "border-white/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                <GitCompareArrows className="size-3" /> Compare
              </button>
            </div>
            <Link href={`/cars/${c.slug}`}>
              <h3 className="mt-3 font-display text-xl font-bold transition-colors group-hover:text-neon-pink">{c.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.summary}</p>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5"><Zap className="size-4 text-neon-pink" />{c.topSpeed} mph</span>
                <span className="flex items-center gap-1.5"><Gauge className="size-4 text-neon-blue" />{c.acceleration}</span>
                <span className="ml-auto font-mono font-semibold text-foreground">{formatMoney(c.price)}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-12 text-center text-muted-foreground">No cars match your filters.</div>
      )}

      {/* Compare bar */}
      {compare.length > 0 && (
        <div className="fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0c0a14]/95 px-5 py-3 shadow-glass backdrop-blur-xl">
            <span className="text-sm text-muted-foreground">{compare.length} selected</span>
            <Link
              href={`/cars/compare?ids=${compare.join(",")}`}
              className="inline-flex items-center gap-2 rounded-xl bg-neon-gradient px-4 py-2 text-sm font-semibold text-white shadow-neon"
            >
              Compare <ArrowRight className="size-4" />
            </Link>
            <button onClick={() => setCompare([])} className="text-sm text-muted-foreground hover:text-foreground">Clear</button>
          </div>
        </div>
      )}
    </div>
  );
}
