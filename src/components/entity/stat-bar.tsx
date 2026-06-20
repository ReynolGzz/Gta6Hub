import { cn } from "@/lib/utils";

/** Horizontal stat bar (0-100) with a neon fill. */
export function StatBar({
  label,
  value,
  max = 100,
  accent = "pink",
  display,
}: {
  label: string;
  value: number;
  max?: number;
  accent?: "pink" | "purple" | "blue";
  display?: string;
}) {
  const pct = Math.max(2, Math.min(100, (value / max) * 100));
  const fill: Record<string, string> = {
    pink: "from-neon-pink to-neon-magenta",
    purple: "from-neon-purple to-neon-pink",
    blue: "from-neon-blue to-neon-cyan",
  };
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium text-foreground">{display ?? value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r", fill[accent])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
