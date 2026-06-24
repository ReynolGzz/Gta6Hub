"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Gift, Check, Loader2, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiscordIcon } from "@/components/ui/icons";
import { BONUS_ENTRIES } from "@/lib/giveaways";

interface EnterGiveawayProps {
  slug: string;
  status: "ACTIVE" | "ENDED" | "UPCOMING";
  discordUrl?: string;
  initial: {
    entered: boolean;
    entries: number;
    joinedDiscord: boolean;
    shared: boolean;
  };
}

/**
 * Entry widget. Signed-in users enter with one click, then unlock bonus entries
 * for community actions (joining Discord, sharing) — the loop that turns a
 * giveaway into recurring traffic.
 */
export function EnterGiveaway({ slug, status, discordUrl, initial }: EnterGiveawayProps) {
  const { data: session } = useSession();
  const [state, setState] = useState(initial);
  const [loading, setLoading] = useState<null | "enter" | "discord" | "share">(null);
  const [error, setError] = useState<string | null>(null);

  const post = async (action: "enter" | "discord" | "share") => {
    setLoading(action);
    setError(null);
    try {
      const res = await fetch("/api/giveaways/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong.");
      }
      const data = await res.json();
      setState({
        entered: true,
        entries: data.entries,
        joinedDiscord: data.bonusJoinedDiscord,
        shared: data.bonusShared,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(null);
    }
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: "ViceHub Giveaway", url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      /* user dismissed the share sheet — still grant the bonus */
    }
    await post("share");
  };

  if (status === "ENDED") {
    return (
      <div className="glass-card p-6 text-center">
        <p className="font-display text-lg font-bold">This giveaway has ended</p>
        <p className="mt-1 text-sm text-muted-foreground">Check the giveaways hub for what's live now.</p>
        <Button asChild className="mt-4" variant="secondary">
          <Link href="/giveaways">See active giveaways</Link>
        </Button>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="glass-card p-6 text-center">
        <Gift className="mx-auto size-8 text-neon-pink" />
        <p className="mt-3 font-display text-lg font-bold">Sign in to enter</p>
        <p className="mt-1 text-sm text-muted-foreground">Free account, one click to enter.</p>
        <Button asChild className="mt-4 w-full">
          <Link href={`/login?next=/giveaways/${slug}`}>Sign in & enter</Link>
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          No account? <Link href={`/register`} className="text-neon-pink hover:underline">Create one free</Link>
        </p>
      </div>
    );
  }

  const upcoming = status === "UPCOMING";

  return (
    <div className="glass-card p-6">
      {state.entered ? (
        <div className="text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-400/15">
            <Check className="size-6 text-emerald-300" />
          </span>
          <p className="mt-3 font-display text-lg font-bold">You're entered!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            You have <span className="font-bold text-neon-pink">{state.entries}</span>{" "}
            {state.entries === 1 ? "entry" : "entries"}. Boost your odds below.
          </p>
        </div>
      ) : (
        <div className="text-center">
          <Sparkles className="mx-auto size-8 text-neon-pink" />
          <p className="mt-3 font-display text-lg font-bold">{upcoming ? "Starts soon" : "Enter this giveaway"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {upcoming ? "Enter now to lock in your spot the moment it opens." : "One click. Free to enter."}
          </p>
          <Button className="mt-4 w-full" onClick={() => post("enter")} disabled={loading !== null}>
            {loading === "enter" ? <Loader2 className="size-4 animate-spin" /> : <Gift className="size-4" />}
            Enter Giveaway
          </Button>
        </div>
      )}

      {state.entered && (
        <div className="mt-5 space-y-2 border-t border-white/5 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bonus entries</p>
          {discordUrl && (
            <a
              href={discordUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => !state.joinedDiscord && post("discord")}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors ${
                state.joinedDiscord
                  ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                  : "border-[#5865F2]/30 hover:bg-[#5865F2]/10"
              }`}
            >
              <span className="flex items-center gap-2">
                <DiscordIcon className="size-4" /> Join our Discord
              </span>
              <span className="font-semibold">{state.joinedDiscord ? "Claimed" : `+${BONUS_ENTRIES.joinedDiscord}`}</span>
            </a>
          )}
          <button
            type="button"
            onClick={share}
            disabled={state.shared || loading !== null}
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors ${
              state.shared
                ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                : "border-white/10 hover:bg-white/5"
            }`}
          >
            <span className="flex items-center gap-2">
              <Share2 className="size-4" /> Share the giveaway
            </span>
            <span className="font-semibold">{state.shared ? "Claimed" : `+${BONUS_ENTRIES.shared}`}</span>
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-center text-sm text-red-300">{error}</p>}
    </div>
  );
}
