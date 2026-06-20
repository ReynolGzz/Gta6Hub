"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CAR_CATEGORIES } from "@/lib/entities";
import { formatMoney } from "@/lib/utils";

interface Car {
  id: string;
  slug: string;
  name: string;
  category: string;
  topSpeed: number;
  price: number;
}

const empty = { name: "", category: "Super", topSpeed: 180, acceleration: 80, braking: 70, handling: 80, price: 500000, summary: "" };

export function AdminCars({ initialCars }: { initialCars: Car[] }) {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof empty, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const create = async () => {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const c = await res.json();
      setCars((prev) => [c, ...prev]);
      setForm(empty);
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Failed to create.");
    }
    setSaving(false);
  };

  const remove = async (id: string) => {
    setCars((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/admin/cars?id=${id}`, { method: "DELETE" });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="glass-card h-fit p-6">
        <h3 className="mb-4 font-display text-lg font-bold">Add a car</h3>
        <div className="space-y-3">
          <Input placeholder="Name" value={form.name} onChange={(e) => set("name", e.target.value)} />
          <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
            {CAR_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-muted-foreground">Top speed
              <Input type="number" value={form.topSpeed} onChange={(e) => set("topSpeed", Number(e.target.value))} />
            </label>
            <label className="text-xs text-muted-foreground">Price
              <Input type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} />
            </label>
            <label className="text-xs text-muted-foreground">Acceleration
              <Input type="number" value={form.acceleration} onChange={(e) => set("acceleration", Number(e.target.value))} />
            </label>
            <label className="text-xs text-muted-foreground">Handling
              <Input type="number" value={form.handling} onChange={(e) => set("handling", Number(e.target.value))} />
            </label>
          </div>
          <Input placeholder="Short summary" value={form.summary} onChange={(e) => set("summary", e.target.value)} />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button onClick={create} disabled={saving || !form.name || !form.summary} className="w-full">
            <Plus className="size-4" /> Add car
          </Button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="border-b border-white/5 p-4">
          <h3 className="font-display text-lg font-bold">Cars ({cars.length})</h3>
        </div>
        <div className="max-h-[560px] divide-y divide-white/5 overflow-y-auto">
          {cars.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-4 hover:bg-white/5">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.category} · {c.topSpeed} mph · {formatMoney(c.price)}</p>
              </div>
              <button onClick={() => remove(c.id)} className="text-muted-foreground hover:text-red-400" aria-label="Delete">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
