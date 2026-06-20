import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Car, DollarSign, Database, Users, MessageSquare, ThumbsUp } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { AdminCars } from "@/components/admin/admin-cars";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Admin", path: "/admin" });

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/admin");
  if (session.user.role !== "ADMIN") redirect("/");

  const [carCount, moneyCount, entityCount, userCount, commentCount, voteCount, cars, recentComments] = await Promise.all([
    db.car.count(),
    db.moneyMethod.count(),
    db.entity.count(),
    db.user.count(),
    db.comment.count(),
    db.vote.count(),
    db.car.findMany({ orderBy: { createdAt: "desc" }, take: 100, select: { id: true, slug: true, name: true, category: true, topSpeed: true, price: true } }),
    db.comment.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { user: { select: { name: true, email: true } } } }),
  ]);

  const stats = [
    { label: "Cars", value: carCount, icon: <Car className="size-5 text-neon-pink" /> },
    { label: "Money methods", value: moneyCount, icon: <DollarSign className="size-5 text-neon-blue" /> },
    { label: "Other entities", value: entityCount, icon: <Database className="size-5 text-neon-purple" /> },
    { label: "Users", value: userCount, icon: <Users className="size-5 text-neon-pink" /> },
    { label: "Comments", value: commentCount, icon: <MessageSquare className="size-5 text-neon-blue" /> },
    { label: "Votes", value: voteCount, icon: <ThumbsUp className="size-5 text-neon-purple" /> },
  ];

  return (
    <>
      <PageHeader title="Admin" icon="Shield" accent="purple" description="Manage content, view analytics and moderate the community." />
      <div className="container space-y-8 py-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-5">
              {s.icon}
              <p className="mt-3 font-display text-3xl font-extrabold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <section>
          <h2 className="mb-4 font-display text-2xl font-bold">Manage cars</h2>
          <AdminCars initialCars={cars} />
        </section>

        <section>
          <h2 className="mb-4 font-display text-2xl font-bold">Recent community activity</h2>
          <div className="glass-card divide-y divide-white/5">
            {recentComments.length === 0 && <p className="p-6 text-sm text-muted-foreground">No comments yet.</p>}
            {recentComments.map((c) => (
              <div key={c.id} className="flex items-start justify-between gap-4 p-4">
                <div>
                  <p className="text-sm">{c.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {c.user.name ?? c.user.email} · {c.entityType} · {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
