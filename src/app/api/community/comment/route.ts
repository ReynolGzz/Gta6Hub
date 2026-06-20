import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const schema = z.object({
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  body: z.string().min(1).max(1000),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const comment = await db.comment.create({
    data: { userId: session.user.id, ...parsed.data },
    include: { user: { select: { name: true, email: true } } },
  });

  return NextResponse.json(comment);
}
