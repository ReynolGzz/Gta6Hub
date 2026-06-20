import { NextResponse } from "next/server";
import { z } from "zod";
import { askViceHub } from "@/lib/ai/rag";

const schema = z.object({ query: z.string().min(1).max(500) });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const result = await askViceHub(parsed.data.query);
  return NextResponse.json(result);
}
