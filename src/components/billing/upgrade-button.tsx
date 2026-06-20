"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Sparkles } from "lucide-react";

export function UpgradeButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const upgrade = async () => {
    if (!session?.user) {
      router.push("/login?next=/pricing");
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.devMode) {
        setMsg(data.message);
      } else {
        setMsg(data.error ?? "Could not start checkout.");
      }
    } catch {
      setMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isPremium = session?.user?.plan === "PREMIUM";

  return (
    <div>
      <button
        onClick={upgrade}
        disabled={loading || isPremium}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-neon-gradient px-6 py-3 text-sm font-semibold text-white shadow-neon transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        {isPremium ? "You're on Premium" : "Upgrade to Premium"}
      </button>
      {msg && <p className="mt-3 rounded-lg border border-neon-blue/30 bg-neon-blue/10 p-3 text-xs text-neon-blue">{msg}</p>}
    </div>
  );
}
