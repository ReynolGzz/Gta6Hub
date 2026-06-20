import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1).max(60).optional(),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }
  const { name, email, password } = parsed.data;
  const normalized = email.toLowerCase();

  const existing = await db.user.findUnique({ where: { email: normalized } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  // First-ever user becomes the admin so the admin panel is reachable out of the box.
  const isFirst = (await db.user.count()) === 0;

  await db.user.create({
    data: {
      name: name ?? normalized.split("@")[0],
      email: normalized,
      passwordHash: await hashPassword(password),
      role: isFirst ? "ADMIN" : "USER",
    },
  });

  return NextResponse.json({ ok: true, admin: isFirst });
}
