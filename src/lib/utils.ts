import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an in-game dollar amount: 1500000 -> "$1.5M". */
export function formatMoney(n: number): string {
  if (Math.abs(n) >= 1_000_000)
    return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (Math.abs(n) >= 1_000)
    return `$${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return `$${n.toLocaleString()}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString();
}

/** Slugify a name into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Safely parse a JSON string column, returning a fallback on failure. */
export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/**
 * Return on (Return On Investment) ratio for a money method:
 * profit generated per hour relative to required upfront investment.
 * Investment of 0 is treated as "instant payback" (Infinity-safe).
 */
export function computeRoi(profitPerHour: number, investment: number): number {
  if (investment <= 0) return Infinity;
  return profitPerHour / investment;
}

export function formatRoi(profitPerHour: number, investment: number): string {
  const roi = computeRoi(profitPerHour, investment);
  if (!isFinite(roi)) return "∞ (no upfront cost)";
  // hours to break even
  const hours = investment / profitPerHour;
  return `${hours.toFixed(1)}h to break even`;
}
