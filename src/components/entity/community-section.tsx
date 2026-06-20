"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentRow {
  id: string;
  body: string;
  createdAt: string;
  user: { name: string | null; email: string | null };
}

/** Reddit-style votes + comments for any entity. */
export function CommunitySection({
  entityType,
  entityId,
  className,
}: {
  entityType: string;
  entityId: string;
  className?: string;
}) {
  const { data: session } = useSession();
  const [score, setScore] = useState(0);
  const [myVote, setMyVote] = useState(0);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch(`/api/community?entityType=${entityType}&entityId=${entityId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        setScore(d.score ?? 0);
        setMyVote(d.myVote ?? 0);
        setComments(d.comments ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      active = false;
    };
  }, [entityType, entityId]);

  const vote = async (value: number) => {
    if (!session?.user) return;
    const next = myVote === value ? 0 : value;
    setScore((s) => s - myVote + next);
    setMyVote(next);
    await fetch("/api/community/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityType, entityId, value: next }),
    });
  };

  const submit = async () => {
    if (!session?.user || !body.trim()) return;
    const res = await fetch("/api/community/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityType, entityId, body: body.trim() }),
    });
    if (res.ok) {
      const c = await res.json();
      setComments((prev) => [c, ...prev]);
      setBody("");
    }
  };

  return (
    <div className={cn("glass-card p-8", className)}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
          <MessageSquare className="size-5 text-neon-blue" /> Community
        </h2>
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => vote(1)}
            disabled={!session?.user}
            className={cn("rounded-full p-1 transition-colors disabled:opacity-40", myVote === 1 ? "text-neon-pink" : "text-muted-foreground hover:text-foreground")}
            aria-label="Upvote"
          >
            <ArrowBigUp className="size-5" />
          </button>
          <span className="min-w-6 text-center text-sm font-semibold">{score}</span>
          <button
            onClick={() => vote(-1)}
            disabled={!session?.user}
            className={cn("rounded-full p-1 transition-colors disabled:opacity-40", myVote === -1 ? "text-neon-blue" : "text-muted-foreground hover:text-foreground")}
            aria-label="Downvote"
          >
            <ArrowBigDown className="size-5" />
          </button>
        </div>
      </div>

      {session?.user ? (
        <div className="mt-6 flex gap-2">
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Share a tip or strategy…"
            className="h-11 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 text-sm outline-none focus-visible:border-neon-pink/40"
          />
          <button onClick={submit} className="flex size-11 items-center justify-center rounded-xl bg-neon-gradient text-white" aria-label="Post">
            <Send className="size-4" />
          </button>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          <Link href="/login" className="text-neon-pink hover:underline">Log in</Link> to vote and comment.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!loading && comments.length === 0 && (
          <p className="text-sm text-muted-foreground">No comments yet. Be the first to share a strategy.</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="rounded-xl border border-white/5 p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{c.user.name ?? c.user.email?.split("@")[0] ?? "Player"}</span>
              <span>·</span>
              <span>{new Date(c.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="mt-2 text-sm">{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
