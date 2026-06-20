import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

/** GET aggregated votes + comments for an entity, plus the caller's vote. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const entityType = searchParams.get("entityType");
  const entityId = searchParams.get("entityId");
  if (!entityType || !entityId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const session = await auth();

  const [votes, comments, myVote] = await Promise.all([
    db.vote.findMany({ where: { entityType, entityId }, select: { value: true } }),
    db.comment.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: { select: { name: true, email: true } } },
    }),
    session?.user
      ? db.vote.findUnique({
          where: { userId_entityType_entityId: { userId: session.user.id, entityType, entityId } },
          select: { value: true },
        })
      : Promise.resolve(null),
  ]);

  const score = votes.reduce((sum, v) => sum + v.value, 0);
  return NextResponse.json({ score, myVote: myVote?.value ?? 0, comments });
}
