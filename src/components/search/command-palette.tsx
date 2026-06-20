"use client";

import { useEffect, useMemo, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, CornerDownLeft, ArrowRight } from "lucide-react";
import { instantSearch, EXAMPLE_QUERIES, type SearchRow } from "@/lib/search";
import { Icon } from "@/components/ui/icon";
import { entityByKind } from "@/lib/entities";

const accentText: Record<string, string> = {
  pink: "text-neon-pink",
  purple: "text-neon-purple",
  blue: "text-neon-blue",
};

const CommandPaletteContext = createContext<{ open: () => void }>({ open: () => {} });
export const useCommandPalette = () => useContext(CommandPaletteContext);

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (e.key === "/" && (e.target as HTMLElement)?.tagName === "INPUT") return;
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const results = useMemo(() => instantSearch(query, 8), [query]);

  const go = (route: string) => {
    setOpen(false);
    setQuery("");
    router.push(route);
  };

  const submitSearch = () => {
    if (!query.trim()) return;
    go(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <CommandPaletteContext.Provider value={{ open: () => setOpen(true) }}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0c0a14]/95 shadow-glass animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <Command shouldFilter={false} className="w-full">
              <div className="flex items-center gap-3 border-b border-white/10 px-4">
                <Search className="size-5 text-neon-pink" />
                <Command.Input
                  autoFocus
                  value={query}
                  onValueChange={setQuery}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && results.length === 0) submitSearch();
                  }}
                  placeholder="Search anything in GTA 6…"
                  className="h-14 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                />
                <kbd className="hidden rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-muted-foreground sm:block">
                  ESC
                </kbd>
              </div>
              <Command.List className="max-h-[50vh] overflow-y-auto p-2">
                {query.trim() === "" && (
                  <Command.Group heading="Try searching" className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {EXAMPLE_QUERIES.map((ex) => (
                      <Command.Item
                        key={ex}
                        value={ex}
                        onSelect={() => setQuery(ex)}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground aria-selected:bg-white/5"
                      >
                        <Search className="size-4 text-muted-foreground" />
                        {ex}
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {results.length > 0 && (
                  <Command.Group heading="Results" className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {results.map((r: SearchRow) => {
                      const cfg = entityByKind(r.type);
                      return (
                        <Command.Item
                          key={`${r.type}-${r.id}`}
                          value={`${r.name} ${r.typeLabel} ${r.category ?? ""}`}
                          onSelect={() => go(r.route)}
                          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 aria-selected:bg-white/5"
                        >
                          <span className="flex size-9 items-center justify-center rounded-lg bg-white/5">
                            <Icon name={cfg?.icon ?? "Circle"} className={`size-4 ${accentText[cfg?.accent ?? "pink"]}`} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-foreground">{r.name}</span>
                            <span className="block truncate text-xs text-muted-foreground">{r.summary}</span>
                          </span>
                          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{r.typeLabel}</span>
                          <ArrowRight className="size-4 text-muted-foreground" />
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                )}

                {query.trim() !== "" && (
                  <Command.Item
                    value="__full_search__"
                    onSelect={submitSearch}
                    className="mt-1 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm aria-selected:bg-white/5"
                  >
                    <CornerDownLeft className="size-4 text-neon-blue" />
                    See all results for "<span className="font-medium text-foreground">{query}</span>"
                  </Command.Item>
                )}

                {query.trim() !== "" && results.length === 0 && (
                  <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No instant matches. Press Enter for a full search.
                  </div>
                )}
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </CommandPaletteContext.Provider>
  );
}
