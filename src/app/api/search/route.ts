import { NextResponse } from "next/server";
import { instantSearch } from "@/lib/search";

/** Unified search endpoint. Uses the prebuilt index for fast, ranked results. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);
  const results = instantSearch(q, limit);
  return NextResponse.json({ query: q, count: results.length, results });
}
