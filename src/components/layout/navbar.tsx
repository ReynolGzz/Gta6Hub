"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { useCommandPalette } from "@/components/search/command-palette";
import { Button } from "@/components/ui/button";
import { ENTITIES } from "@/lib/entities";

const PRIMARY_LINKS = [
  { label: "Cars", href: "/cars" },
  { label: "Money", href: "/money" },
  { label: "Weapons", href: "/weapons" },
  { label: "Businesses", href: "/businesses" },
  { label: "Map", href: "/map" },
  { label: "AI", href: "/ai" },
];

export function Navbar() {
  const { open } = useCommandPalette();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-neon-gradient shadow-neon">
              <Sparkles className="size-4 text-white" />
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">
              Vice<span className="text-gradient">Hub</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {PRIMARY_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={open}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/10"
          >
            <Search className="size-4" />
            <span className="hidden sm:inline">Search…</span>
            <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 text-[10px] sm:inline">⌘K</kbd>
          </button>

          {session?.user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              {session.user.role === "ADMIN" && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sign out
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}

          <button
            className="lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/5 bg-background/95 px-4 py-4 lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {ENTITIES.map((e) => (
              <Link
                key={e.kind}
                href={e.route}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                {e.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            {session?.user ? (
              <>
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => signOut()}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild size="sm" className="flex-1">
                  <Link href="/register">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
