import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const progress = await db.progress.findMany({ where: { userId: session.user.id } });
  return NextResponse.json({ progress });
}

const schema = z.object({
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  done: z.boolean(),
});

/** Toggle completion for an entity. */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { entityType, entityId, done } = parsed.data;

  if (done) {
    await db.progress.upsert({
      where: { userId_entityType_entityId: { userId: session.user.id, entityType, entityId } },
      create: { userId: session.user.id, entityType, entityId, status: "DONE" },
      update: { status: "DONE" },
    });
  } else {
    await db.progress.deleteMany({ where: { userId: session.user.id, entityType, entityId } });
  }

  return NextResponse.json({ ok: true });
}
