import Link from "next/link";
import { Compass } from "lucide-react";
import { GlowField } from "@/components/marketing/glow";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden text-center">
      <GlowField />
      <div className="relative">
        <Compass className="mx-auto size-12 text-neon-pink" />
        <h1 className="mt-6 font-display text-6xl font-extrabold text-gradient">404</h1>
        <p className="mt-3 text-muted-foreground">This page isn&apos;t in the ViceHub database.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="rounded-xl bg-neon-gradient px-6 py-3 text-sm font-semibold text-white shadow-neon">Go home</Link>
          <Link href="/search" className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold hover:bg-white/5">Search the database</Link>
        </div>
      </div>
    </div>
  );
}
