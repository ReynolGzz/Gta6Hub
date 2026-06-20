import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Trophy, Car, Crosshair, Home, Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { BuildsManager } from "@/components/dashboard/builds-manager";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Dashboard", path: "/dashboard" });

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/dashboard");

  const [progress, builds, totalCars, totalWeapons, totalProps] = await Promise.all([
    db.progress.findMany({ where: { userId: session.user.id } }),
    db.build.findMany({ where: { userId: session.user.id }, orderBy: { updatedAt: "desc" } }),
    db.car.count(),
    db.entity.count({ where: { type: "weapon" } }),
    db.entity.count({ where: { type: "property" } }),
  ]);

  const countBy = (t: string) => progress.filter((p) => p.entityType === t).length;

  const trackers = [
    { label: "Cars collected", icon: <Car className="size-5 text-neon-pink" />, done: countBy("cars"), total: totalCars },
    { label: "Weapons unlocked", icon: <Crosshair className="size-5 text-neon-purple" />, done: countBy("weapons"), total: totalWeapons },
    { label: "Properties owned", icon: <Home className="size-5 text-neon-blue" />, done: countBy("properties"), total: totalProps },
    { label: "Achievements", icon: <Trophy className="size-5 text-neon-pink" />, done: countBy("achievements"), total: 2 },
  ];

  const overall = Math.round((progress.length / Math.max(1, totalCars + totalWeapons + totalProps + 2)) * 100);

  return (
    <>
      <PageHeader title={`Hey, ${session.user.name ?? "player"}`} icon="LayoutDashboard" accent="pink" description="Your GTA 6 progress, builds and saved content.">
        <Badge variant={session.user.plan === "PREMIUM" ? "default" : "muted"} className="gap-1.5 py-1.5">
          <Sparkles className="size-3" /> {session.user.plan === "PREMIUM" ? "Premium" : "Free plan"}
        </Badge>
      </PageHeader>

      <div className="container space-y-6 py-10">
        {/* Overall progress */}
        <div className="glass-card relative overflow-hidden p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-neon-pink/15 blur-[100px]" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall completion</p>
              <p className="font-display text-5xl font-extrabold text-gradient">{overall}%</p>
            </div>
            <div className="h-3 w-full max-w-md overflow-hidden rounded-full bg-white/5 sm:w-80">
              <div className="h-full rounded-full bg-neon-gradient" style={{ width: `${Math.max(2, overall)}%` }} />
            </div>
          </div>
        </div>

        {/* Trackers */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trackers.map((t) => {
            const pct = Math.round((t.done / Math.max(1, t.total)) * 100);
            return (
              <div key={t.label} className="glass-card p-5">
                <div className="flex items-center justify-between">
                  {t.icon}
                  <span className="font-mono text-sm text-muted-foreground">{t.done}/{t.total}</span>
                </div>
                <p className="mt-3 text-sm font-medium">{t.label}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-neon-gradient" style={{ width: `${Math.max(2, pct)}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        <BuildsManager initialBuilds={builds} />

        <div className="glass-card flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-bold">Track your progress on the map</h3>
            <p className="text-sm text-muted-foreground">Mark collectibles and secrets as you find them.</p>
          </div>
          <Link href="/map" className="rounded-xl bg-neon-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-neon">Open map</Link>
        </div>
      </div>
    </>
  );
}
