import { describe, it, expect } from "vitest";
import { cn, formatMoney, slugify, parseJson, computeRoi, formatRoi } from "./utils";

describe("cn", () => {
  it("merges and dedupes tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", false && "hidden", "font-bold")).toBe("text-sm font-bold");
  });
});

describe("formatMoney", () => {
  it("formats millions and thousands", () => {
    expect(formatMoney(1_500_000)).toBe("$1.5M");
    expect(formatMoney(2_000_000)).toBe("$2M");
    expect(formatMoney(95_000)).toBe("$95K");
  });
  it("formats small amounts", () => {
    expect(formatMoney(500)).toBe("$500");
  });
});

describe("slugify", () => {
  it("produces url-safe slugs", () => {
    expect(slugify("Cheetah GT")).toBe("cheetah-gt");
    expect(slugify("  Vice  Heists!! ")).toBe("vice-heists");
  });
});

describe("parseJson", () => {
  it("parses valid json and falls back on invalid", () => {
    expect(parseJson('{"a":1}', {})).toEqual({ a: 1 });
    expect(parseJson("not json", { ok: true })).toEqual({ ok: true });
    expect(parseJson(null, [])).toEqual([]);
  });
});

describe("computeRoi / formatRoi", () => {
  it("treats zero investment as infinite ROI", () => {
    expect(computeRoi(95000, 0)).toBe(Infinity);
    expect(formatRoi(95000, 0)).toContain("no upfront cost");
  });
  it("computes break-even hours", () => {
    expect(computeRoi(100, 200)).toBe(0.5);
    expect(formatRoi(100000, 200000)).toBe("2.0h to break even");
  });
});
