"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { instantSearch, EXAMPLE_QUERIES } from "@/lib/search";
import { Icon } from "@/components/ui/icon";
import { entityByKind } from "@/lib/entities";

const accentText: Record<string, string> = {
  pink: "text-neon-pink",
  purple: "text-neon-purple",
  blue: "text-neon-blue",
};

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo(() => (query.trim() ? instantSearch(query, 6) : []), [query]);
  const showDropdown = focused && query.trim().length > 0;

  const go = (route: string) => router.push(route);
  const submit = () => {
    if (query.trim()) go(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div
        className={`group flex items-center gap-3 rounded-2xl border bg-white/[0.03] px-5 py-1 backdrop-blur-xl transition-all ${
          focused ? "border-neon-pink/50 shadow-neon" : "border-white/10"
        }`}
      >
        <Search className="size-5 text-neon-pink" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setFocused(false), 150);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Search anything in GTA 6…"
          className="h-14 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground sm:text-lg"
        />
        <button
          onClick={submit}
          className="flex size-10 items-center justify-center rounded-xl bg-neon-gradient text-white transition-transform hover:scale-105"
          aria-label="Search"
        >
          <ArrowRight className="size-5" />
        </button>
      </div>

      {showDropdown && (
        <div
          className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0c0a14]/95 p-2 text-left shadow-glass backdrop-blur-xl animate-fade-up"
          onMouseDown={() => blurTimer.current && clearTimeout(blurTimer.current)}
        >
          {results.length > 0 ? (
            <>
              {results.map((r) => {
                const cfg = entityByKind(r.type);
                return (
                  <button
                    key={`${r.type}-${r.id}`}
                    onClick={() => go(r.route)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-white/5"
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-white/5">
                      <Icon name={cfg?.icon ?? "Circle"} className={`size-4 ${accentText[cfg?.accent ?? "pink"]}`} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{r.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{r.summary}</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{r.typeLabel}</span>
                  </button>
                );
              })}
              <button
                onClick={submit}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-neon-blue hover:bg-white/5"
              >
                <ArrowRight className="size-4" /> See all results for "{query}"
              </button>
            </>
          ) : (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No instant matches — press Enter to search.</p>
          )}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {EXAMPLE_QUERIES.map((ex) => (
          <button
            key={ex}
            onClick={() => go(`/search?q=${encodeURIComponent(ex)}`)}
            className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-neon-pink/40 hover:text-foreground"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
