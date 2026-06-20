import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1).max(80),
  category: z.string().min(1),
  topSpeed: z.coerce.number().min(0).max(500),
  acceleration: z.coerce.number().min(0).max(100),
  braking: z.coerce.number().min(0).max(100),
  handling: z.coerce.number().min(0).max(100),
  price: z.coerce.number().min(0),
  summary: z.string().min(1).max(300),
  location: z.string().optional(),
  realLifeInspiration: z.string().optional(),
});

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const d = parsed.data;
  const car = await db.car.create({
    data: { ...d, slug: slugify(d.name) },
  });
  return NextResponse.json(car);
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.car.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
