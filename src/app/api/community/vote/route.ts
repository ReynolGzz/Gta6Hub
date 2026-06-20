import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const schema = z.object({
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  value: z.number().int().min(-1).max(1),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { entityType, entityId, value } = parsed.data;
  const key = { userId_entityType_entityId: { userId: session.user.id, entityType, entityId } };

  if (value === 0) {
    await db.vote.deleteMany({ where: { userId: session.user.id, entityType, entityId } });
  } else {
    await db.vote.upsert({
      where: key,
      create: { userId: session.user.id, entityType, entityId, value },
      update: { value },
    });
  }

  return NextResponse.json({ ok: true });
}
