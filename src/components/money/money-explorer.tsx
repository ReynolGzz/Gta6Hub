"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DollarSign, Clock, Users, TrendingUp, ArrowRight } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatMoney, formatRoi } from "@/lib/utils";

export interface MoneyRow {
  id: string;
  slug: string;
  name: string;
  summary: string;
  category: string;
  profitPerHour: number;
  difficulty: string;
  requiredInvestment: number;
  playersRequired: number;
  timeNeeded: string | null;
  riskLevel: string;
  popularity: number;
  soloFriendly: boolean;
  beginnerFriendly: boolean;
}

const difficultyRank: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };

const SORTS = {
  "profit-desc": { label: "Highest profit", fn: (a: MoneyRow, b: MoneyRow) => b.profitPerHour - a.profitPerHour },
  "effort-asc": { label: "Lowest effort", fn: (a: MoneyRow, b: MoneyRow) => (difficultyRank[a.difficulty] ?? 9) - (difficultyRank[b.difficulty] ?? 9) || b.profitPerHour - a.profitPerHour },
  "invest-asc": { label: "Lowest investment", fn: (a: MoneyRow, b: MoneyRow) => a.requiredInvestment - b.requiredInvestment },
  "popular-desc": { label: "Most popular", fn: (a: MoneyRow, b: MoneyRow) => b.popularity - a.popularity },
} as const;

const difficultyVariant: Record<string, "success" | "warning" | "danger"> = {
  Easy: "success",
  Medium: "warning",
  Hard: "danger",
};

export function MoneyExplorer({ methods }: { methods: MoneyRow[] }) {
  const [sort, setSort] = useState<keyof typeof SORTS>("profit-desc");
  const [solo, setSolo] = useState(false);
  const [beginner, setBeginner] = useState(false);

  const filtered = useMemo(() => {
    let rows = methods;
    if (solo) rows = rows.filter((m) => m.soloFriendly);
    if (beginner) rows = rows.filter((m) => m.beginnerFriendly);
    return [...rows].sort(SORTS[sort].fn);
  }, [methods, sort, solo, beginner]);

  return (
    <div>
      <div className="glass-card mb-6 flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <div className="w-56">
          <Select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)}>
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSolo((s) => !s)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${solo ? "border-neon-blue/50 bg-neon-blue/10 text-neon-blue" : "border-white/10 text-muted-foreground hover:text-foreground"}`}
          >
            Solo friendly
          </button>
          <button
            onClick={() => setBeginner((b) => !b)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${beginner ? "border-neon-pink/50 bg-neon-pink/10 text-neon-pink" : "border-white/10 text-muted-foreground hover:text-foreground"}`}
          >
            Beginner friendly
          </button>
        </div>
        <span className="sm:ml-auto text-sm text-muted-foreground">{filtered.length} methods</span>
      </div>

      <div className="space-y-4">
        {filtered.map((m, i) => (
          <Link
            key={m.id}
            href={`/money/${m.slug}`}
            className="group glass-card flex flex-col gap-4 p-6 transition-all hover:border-neon-blue/40 lg:flex-row lg:items-center"
          >
            <div className="flex items-center gap-4 lg:w-2/5">
              <span className="font-display text-2xl font-extrabold text-white/20">#{i + 1}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-xl font-bold transition-colors group-hover:text-neon-blue">{m.name}</h3>
                  <Badge variant="muted">{m.category}</Badge>
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{m.summary}</p>
              </div>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric icon={<DollarSign className="size-4 text-neon-blue" />} label="Profit/hr" value={formatMoney(m.profitPerHour)} highlight />
              <Metric icon={<TrendingUp className="size-4 text-neon-pink" />} label="ROI" value={m.requiredInvestment > 0 ? formatRoi(m.profitPerHour, m.requiredInvestment) : "Instant"} />
              <Metric icon={<Users className="size-4 text-muted-foreground" />} label="Players" value={`${m.playersRequired}`} />
              <Metric icon={<Clock className="size-4 text-muted-foreground" />} label="Time" value={m.timeNeeded ?? "—"} />
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={difficultyVariant[m.difficulty] ?? "muted"}>{m.difficulty}</Badge>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Metric({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">{icon}{label}</div>
      <p className={`mt-0.5 font-mono text-sm font-semibold ${highlight ? "text-neon-blue" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
