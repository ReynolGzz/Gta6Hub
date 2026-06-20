"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { MapPin, Layers, Check } from "lucide-react";
import { MAP_CATEGORIES } from "@/lib/entities";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Marker {
  id: string;
  category: string;
  name: string;
  description: string | null;
  lat: number;
  lng: number;
  entityType: string | null;
  entitySlug: string | null;
}

const categoryColor: Record<string, string> = {
  cars: "#ff2d9b",
  businesses: "#22d3ff",
  weapons: "#ff3df0",
  properties: "#9b5cff",
  collectibles: "#34f5ff",
  secrets: "#ffb13d",
  missions: "#ff2d9b",
};

// Lazy-load the actual Mapbox canvas (only used when a token exists).
const MapboxCanvas = dynamic(() => import("./mapbox-canvas").then((m) => m.MapboxCanvas), { ssr: false });

export function MapView({ markers, token }: { markers: Marker[]; token: string | null }) {
  const [active, setActive] = useState<string[]>([...MAP_CATEGORIES]);
  const [completed, setCompleted] = useState<string[]>([]);

  const visible = useMemo(() => markers.filter((m) => active.includes(m.category)), [markers, active]);

  const toggleCategory = (c: string) =>
    setActive((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  const toggleDone = (id: string) =>
    setCompleted((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      {/* Map / placeholder */}
      <div className="glass-card relative h-[600px] overflow-hidden">
        {token ? (
          <MapboxCanvas token={token} markers={visible} categoryColor={categoryColor} />
        ) : (
          <div className="relative flex h-full flex-col items-center justify-center bg-neon-radial p-8 text-center">
            <div className="absolute inset-0 grid-bg opacity-40" />
            <MapPin className="size-12 text-neon-pink" />
            <h3 className="relative mt-4 font-display text-2xl font-bold">Interactive map preview</h3>
            <p className="relative mt-2 max-w-md text-sm text-muted-foreground">
              Add a <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">NEXT_PUBLIC_MAPBOX_TOKEN</code> to render the live Mapbox map.
              All {markers.length} markers are listed and fully usable below.
            </p>
            <div className="relative mt-6 grid w-full max-w-lg grid-cols-2 gap-2 sm:grid-cols-3">
              {visible.slice(0, 6).map((m) => (
                <div key={m.id} className="rounded-xl border border-white/10 bg-white/5 p-3 text-left">
                  <span className="inline-block size-2 rounded-full" style={{ background: categoryColor[m.category] }} />
                  <p className="mt-1 truncate text-xs font-medium">{m.name}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{m.lat.toFixed(2)}, {m.lng.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="glass-card p-5">
          <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
            <Layers className="size-4 text-neon-blue" /> Categories
          </h3>
          <div className="space-y-1.5">
            {MAP_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => toggleCategory(c)}
                className={cn("flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm capitalize transition-colors", active.includes(c) ? "bg-white/5" : "opacity-50 hover:opacity-100")}
              >
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ background: categoryColor[c] }} />
                  {c}
                </span>
                <span className="text-xs text-muted-foreground">{markers.filter((m) => m.category === c).length}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card max-h-[320px] overflow-y-auto p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">Locations</h3>
            <Badge variant="muted">{completed.length}/{visible.length} done</Badge>
          </div>
          <div className="space-y-1.5">
            {visible.map((m) => (
              <div key={m.id} className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-white/5">
                <button
                  onClick={() => toggleDone(m.id)}
                  className={cn("flex size-5 items-center justify-center rounded-md border transition-colors", completed.includes(m.id) ? "border-emerald-400 bg-emerald-400/20 text-emerald-400" : "border-white/20")}
                  aria-label="Mark complete"
                >
                  {completed.includes(m.id) && <Check className="size-3" />}
                </button>
                <span className="size-2 rounded-full" style={{ background: categoryColor[m.category] }} />
                <span className={cn("flex-1 truncate text-sm", completed.includes(m.id) && "text-muted-foreground line-through")}>{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
