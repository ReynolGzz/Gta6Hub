import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const builds = await db.build.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ builds });
}

const schema = z.object({
  type: z.enum(["collection", "route", "portfolio", "loadout"]),
  name: z.string().min(1).max(80),
  notes: z.string().max(500).optional(),
  itemIds: z.array(z.string()).default([]),
  isPublic: z.boolean().default(false),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { type, name, notes, itemIds, isPublic } = parsed.data;
  const build = await db.build.create({
    data: {
      userId: session.user.id,
      type,
      name,
      notes,
      itemIds: JSON.stringify(itemIds),
      isPublic,
    },
  });
  return NextResponse.json(build);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.build.deleteMany({ where: { id, userId: session.user.id } });
  return NextResponse.json({ ok: true });
}
