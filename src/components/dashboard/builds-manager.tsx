"use client";

import { useState } from "react";
import { Plus, Trash2, Layers, Route, Briefcase, Crosshair } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Build {
  id: string;
  type: string;
  name: string;
  notes: string | null;
  itemIds: string;
  isPublic: boolean;
}

const typeMeta: Record<string, { label: string; icon: React.ReactNode }> = {
  collection: { label: "Collection", icon: <Layers className="size-4 text-neon-pink" /> },
  route: { label: "Route", icon: <Route className="size-4 text-neon-blue" /> },
  portfolio: { label: "Portfolio", icon: <Briefcase className="size-4 text-neon-purple" /> },
  loadout: { label: "Loadout", icon: <Crosshair className="size-4 text-neon-pink" /> },
};

export function BuildsManager({ initialBuilds }: { initialBuilds: Build[] }) {
  const [builds, setBuilds] = useState<Build[]>(initialBuilds);
  const [name, setName] = useState("");
  const [type, setType] = useState("collection");
  const [creating, setCreating] = useState(false);

  const create = async () => {
    if (!name.trim()) return;
    setCreating(true);
    const res = await fetch("/api/builds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, name: name.trim(), itemIds: [], isPublic: false }),
    });
    if (res.ok) {
      const b = await res.json();
      setBuilds((prev) => [b, ...prev]);
      setName("");
    }
    setCreating(false);
  };

  const remove = async (id: string) => {
    setBuilds((prev) => prev.filter((b) => b.id !== id));
    await fetch(`/api/builds?id=${id}`, { method: "DELETE" });
  };

  return (
    <div className="glass-card p-6">
      <h2 className="mb-4 font-display text-xl font-bold">Your builds & loadouts</h2>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="New build name…" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && create()} className="flex-1" />
        <div className="w-40">
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="collection">Collection</option>
            <option value="route">Route</option>
            <option value="portfolio">Portfolio</option>
            <option value="loadout">Loadout</option>
          </Select>
        </div>
        <Button onClick={create} disabled={creating || !name.trim()}>
          <Plus className="size-4" /> Create
        </Button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {builds.length === 0 && <p className="text-sm text-muted-foreground">No builds yet. Create a vehicle collection, money route, business portfolio or weapon loadout.</p>}
        {builds.map((b) => {
          const meta = typeMeta[b.type] ?? typeMeta.collection;
          const count = (() => { try { return (JSON.parse(b.itemIds) as string[]).length; } catch { return 0; } })();
          return (
            <div key={b.id} className="flex items-center justify-between rounded-xl border border-white/5 p-4">
              <div className="flex items-center gap-3">
                {meta.icon}
                <div>
                  <p className="text-sm font-medium">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{meta.label} · {count} items {b.isPublic && "· public"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {b.isPublic && <Badge variant="muted">Public</Badge>}
                <button onClick={() => remove(b.id)} className="text-muted-foreground hover:text-red-400" aria-label="Delete">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
