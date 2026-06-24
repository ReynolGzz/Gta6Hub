import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { liveStatus, BONUS_ENTRIES } from "@/lib/giveaways";

const schema = z.object({
  slug: z.string().min(1),
  action: z.enum(["enter", "discord", "share"]),
});

function totalEntries(joinedDiscord: boolean, shared: boolean): number {
  return (
    1 +
    (joinedDiscord ? BONUS_ENTRIES.joinedDiscord : 0) +
    (shared ? BONUS_ENTRIES.shared : 0)
  );
}

/** Enter a giveaway or claim a bonus-entry action. Idempotent per user. */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Please sign in to enter." }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { slug, action } = parsed.data;

  const giveaway = await db.giveaway.findUnique({ where: { slug } });
  if (!giveaway) return NextResponse.json({ error: "Giveaway not found." }, { status: 404 });
  if (liveStatus(giveaway) === "ENDED") {
    return NextResponse.json({ error: "This giveaway has ended." }, { status: 400 });
  }

  const existing = await db.giveawayEntry.findUnique({
    where: { giveawayId_userId: { giveawayId: giveaway.id, userId: session.user.id } },
  });

  const joinedDiscord = (existing?.bonusJoinedDiscord ?? false) || action === "discord";
  const shared = (existing?.bonusShared ?? false) || action === "share";
  const entries = totalEntries(joinedDiscord, shared);

  const entry = await db.giveawayEntry.upsert({
    where: { giveawayId_userId: { giveawayId: giveaway.id, userId: session.user.id } },
    create: {
      giveawayId: giveaway.id,
      userId: session.user.id,
      entries,
      bonusJoinedDiscord: joinedDiscord,
      bonusShared: shared,
    },
    update: { entries, bonusJoinedDiscord: joinedDiscord, bonusShared: shared },
  });

  return NextResponse.json({
    ok: true,
    entries: entry.entries,
    bonusJoinedDiscord: entry.bonusJoinedDiscord,
    bonusShared: entry.bonusShared,
  });
}
