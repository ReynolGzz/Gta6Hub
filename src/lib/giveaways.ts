/**
 * Giveaway helpers — derive a live status (a giveaway seeded ACTIVE but past
 * its endsAt should read as ENDED) and format the time remaining for the
 * countdown badges. Pure functions so they're easy to unit-test.
 */

export type GiveawayStatus = "ACTIVE" | "ENDED" | "UPCOMING";

export interface GiveawayLike {
  status: string;
  startsAt: Date | string;
  endsAt: Date | string;
}

/** Bonus entries awarded for community actions, surfaced in UI + API. */
export const BONUS_ENTRIES = {
  joinedDiscord: 2,
  shared: 1,
} as const;

export function liveStatus(g: GiveawayLike, now: Date = new Date()): GiveawayStatus {
  const start = new Date(g.startsAt).getTime();
  const end = new Date(g.endsAt).getTime();
  const t = now.getTime();
  if (t >= end) return "ENDED";
  if (t < start) return "UPCOMING";
  return "ACTIVE";
}

/** Human-friendly "time left" string, e.g. "3d 4h left" or "Ends soon". */
export function timeRemaining(endsAt: Date | string, now: Date = new Date()): string {
  const ms = new Date(endsAt).getTime() - now.getTime();
  if (ms <= 0) return "Ended";
  const mins = Math.floor(ms / 60000);
  const days = Math.floor(mins / (60 * 24));
  const hours = Math.floor((mins % (60 * 24)) / 60);
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${mins % 60}m left`;
  if (mins > 0) return `${mins}m left`;
  return "Ends soon";
}

export function statusBadgeVariant(status: GiveawayStatus): "success" | "muted" | "warning" {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "UPCOMING":
      return "warning";
    case "ENDED":
    default:
      return "muted";
  }
}
