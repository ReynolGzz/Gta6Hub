"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DiscordIcon } from "@/components/ui/icons";

export function LoginForm({ discordEnabled = false }: { discordEnabled?: boolean }) {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(next);
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-neon-gradient shadow-neon">
          <Sparkles className="size-6 text-white" />
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Log in to your ViceHub account.</p>
      </div>
      <form onSubmit={submit} className="glass-card space-y-4 p-8">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {error && <p className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />} Log in
        </Button>
        {discordEnabled && (
          <>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
            </div>
            <Button
              type="button"
              variant="secondary"
              className="w-full border-[#5865F2]/30 hover:bg-[#5865F2]/10"
              onClick={() => signIn("discord", { callbackUrl: next })}
            >
              <DiscordIcon className="size-4" /> Continue with Discord
            </Button>
          </>
        )}
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        No account? <Link href="/register" className="text-neon-pink hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
