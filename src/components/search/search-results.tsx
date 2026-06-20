"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { instantSearch, type SearchRow } from "@/lib/search";
import { ENTITIES, entityByKind } from "@/lib/entities";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";

const accentText: Record<string, string> = { pink: "text-neon-pink", purple: "text-neon-purple", blue: "text-neon-blue" };

export function SearchResults() {
  const sp = useSearchParams();
  const router = useRouter();
  const initial = sp.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => setQ(initial), [initial]);

  const results = useMemo(() => instantSearch(q, 50), [q]);
  const filtered = filter === "all" ? results : results.filter((r) => r.type === filter);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of results) c[r.type] = (c[r.type] ?? 0) + 1;
    return c;
  }, [results]);

  return (
    <div>
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 backdrop-blur-xl focus-within:border-neon-pink/50">
          <Search className="size-5 text-neon-pink" />
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              router.replace(`/search?q=${encodeURIComponent(e.target.value)}`);
            }}
            placeholder="Search anything in GTA 6…"
            className="h-14 flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-3xl">
        <p className="mb-4 text-sm text-muted-foreground">
          {q.trim() ? <>{filtered.length} result{filtered.length === 1 ? "" : "s"} for <span className="font-medium text-foreground">"{q}"</span></> : "Start typing to search the database."}
        </p>

        {results.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            <FilterChip label={`All (${results.length})`} active={filter === "all"} onClick={() => setFilter("all")} />
            {ENTITIES.filter((e) => counts[e.kind]).map((e) => (
              <FilterChip key={e.kind} label={`${e.label} (${counts[e.kind]})`} active={filter === e.kind} onClick={() => setFilter(e.kind)} />
            ))}
          </div>
        )}

        <div className="space-y-2">
          {filtered.map((r: SearchRow) => {
            const cfg = entityByKind(r.type);
            return (
              <Link key={`${r.type}-${r.id}`} href={r.route} className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-white/15 hover:bg-white/5">
                <span className="flex size-11 items-center justify-center rounded-xl bg-white/5">
                  <Icon name={cfg?.icon ?? "Circle"} className={`size-5 ${accentText[cfg?.accent ?? "pink"]}`} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-medium transition-colors group-hover:text-neon-pink">{r.name}</h3>
                    <Badge variant="muted">{r.typeLabel}</Badge>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">{r.summary}</p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            );
          })}

          {q.trim() && filtered.length === 0 && (
            <div className="glass-card p-12 text-center text-muted-foreground">
              No results found. Try a different search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${active ? "border-neon-pink/50 bg-neon-pink/10 text-neon-pink" : "border-white/10 text-muted-foreground hover:text-foreground"}`}>
      {label}
    </button>
  );
}
