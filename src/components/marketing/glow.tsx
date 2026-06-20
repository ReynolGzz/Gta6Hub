import { cn } from "@/lib/utils";

/** Decorative animated neon glow blobs for hero/section backgrounds. */
export function GlowField({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div className="absolute -left-32 top-0 size-96 rounded-full bg-neon-pink/20 blur-[120px] animate-pulse-glow" />
      <div className="absolute right-0 top-24 size-[28rem] rounded-full bg-neon-blue/15 blur-[140px] animate-pulse-glow animate-delay-300" />
      <div className="absolute bottom-0 left-1/3 size-80 rounded-full bg-neon-purple/20 blur-[120px] animate-pulse-glow animate-delay-500" />
    </div>
  );
}
