import Link from "next/link";
import { Gift, Users, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import { liveStatus, timeRemaining, statusBadgeVariant } from "@/lib/giveaways";

export interface GiveawayCardData {
  slug: string;
  title: string;
  prize: string;
  summary: string;
  status: string;
  startsAt: Date | string;
  endsAt: Date | string;
  winnerName?: string | null;
  entryCount: number;
  featured?: boolean;
}

export function GiveawayCard({ g }: { g: GiveawayCardData }) {
  const status = liveStatus(g);
  return (
    <Link
      href={`/giveaways/${g.slug}`}
      className={`group glass-card flex flex-col gap-4 p-6 transition-all hover:-translate-y-1 hover:border-neon-purple/40 ${
        g.featured ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-neon-gradient shadow-neon">
          <Gift className="size-5 text-white" />
        </span>
        <Badge variant={statusBadgeVariant(status)}>
          {status === "ACTIVE" ? timeRemaining(g.endsAt) : status === "UPCOMING" ? "Coming soon" : "Ended"}
        </Badge>
      </div>

      <div>
        <h3 className="font-display text-xl font-bold transition-colors group-hover:text-neon-pink">{g.title}</h3>
        <p className="mt-1 text-sm font-semibold text-neon-purple">🎁 {g.prize}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{g.summary}</p>
      </div>

      <div className="mt-auto flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Users className="size-3.5" /> {formatNumber(g.entryCount)} entries
        </span>
        {status === "ENDED" && g.winnerName && (
          <span className="flex items-center gap-1.5 text-amber-300">
            <Trophy className="size-3.5" /> {g.winnerName}
          </span>
        )}
      </div>
    </Link>
  );
}
