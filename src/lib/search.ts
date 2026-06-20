/**
 * Search layer.
 *
 * - Client/instant: a Fuse.js index built over the generated search-index.json
 *   (see prisma/seed.ts). Used by the Cmd-K palette and the homepage bar for
 *   Google-instant feel.
 * - Server/deep: querySearch() runs ranked queries across the DB tables, used
 *   by /api/search and the full results page.
 */
import Fuse from "fuse.js";
import indexData from "@/data/search-index.json";

export interface SearchRow {
  id: string;
  name: string;
  summary: string;
  type: string; // entity kind, e.g. "cars"
  typeLabel: string;
  route: string;
  category?: string | null;
  popularity: number;
}

export const SEARCH_INDEX = indexData as SearchRow[];

let fuse: Fuse<SearchRow> | null = null;

export function getFuse(): Fuse<SearchRow> {
  if (!fuse) {
    fuse = new Fuse(SEARCH_INDEX, {
      keys: [
        { name: "name", weight: 0.6 },
        { name: "category", weight: 0.2 },
        { name: "summary", weight: 0.15 },
        { name: "typeLabel", weight: 0.05 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }
  return fuse;
}

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "what", "which", "where", "how", "to", "of",
  "in", "for", "best", "way", "ways", "can", "i", "do", "does", "and", "or",
  "my", "me", "get", "find", "make", "with", "you", "your", "should",
]);

/**
 * Instant fuzzy search over the prebuilt index. Handles both short keyword
 * queries and natural-language questions (e.g. the AI assistant) by first
 * searching the full phrase, then expanding to individual significant tokens
 * and merging results — ranked by Fuse score, then popularity.
 */
export function instantSearch(query: string, limit = 8): SearchRow[] {
  const q = query.trim();
  if (!q) {
    return [...SEARCH_INDEX].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
  }

  const fuse = getFuse();
  const scoreById = new Map<string, { row: SearchRow; score: number }>();

  const ingest = (rows: { item: SearchRow; score?: number }[], penalty = 0) => {
    for (const r of rows) {
      const key = `${r.item.type}-${r.item.id}`;
      const score = (r.score ?? 0.5) + penalty;
      const existing = scoreById.get(key);
      if (!existing || score < existing.score) scoreById.set(key, { row: r.item, score });
    }
  };

  ingest(fuse.search(q, { limit: limit * 2 }));

  // Expand to per-token search so sentence-style queries still retrieve.
  const tokens = q
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
  for (const t of tokens) {
    ingest(fuse.search(t, { limit }), 0.15);
  }

  return [...scoreById.values()]
    .sort((a, b) => a.score - b.score || b.row.popularity - a.row.popularity)
    .slice(0, limit)
    .map((x) => x.row);
}

export const EXAMPLE_QUERIES = [
  "Fastest car",
  "Best money method",
  "Lucia missions",
  "Hidden weapons",
  "Businesses",
  "Highest ROI business",
];
