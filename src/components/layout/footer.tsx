import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ENTITIES } from "@/lib/entities";
import { DiscordButton } from "@/components/community/discord-button";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-neon-gradient shadow-neon">
                <Sparkles className="size-4 text-white" />
              </span>
              <span className="font-display text-xl font-extrabold">
                Vice<span className="text-gradient">Hub</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The searchable GTA 6 intelligence platform. Find any answer in seconds —
              not 20-minute videos.
            </p>
            <DiscordButton className="mt-5" />
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-foreground">Database</h4>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ENTITIES.map((e) => (
                <Link
                  key={e.kind}
                  href={e.route}
                  className="text-sm text-muted-foreground transition-colors hover:text-neon-pink"
                >
                  {e.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Platform</h4>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/ai" className="text-sm text-muted-foreground hover:text-neon-pink">AI Assistant</Link>
              <Link href="/map" className="text-sm text-muted-foreground hover:text-neon-pink">Interactive Map</Link>
              <Link href="/giveaways" className="text-sm text-muted-foreground hover:text-neon-pink">Giveaways</Link>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-neon-pink">Pricing</Link>
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-neon-pink">Dashboard</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} ViceHub. A fan-made GTA 6 database. Not affiliated with Rockstar Games or Take-Two.</p>
          <p>Data is illustrative and community-sourced.</p>
        </div>
      </div>
    </footer>
  );
}
