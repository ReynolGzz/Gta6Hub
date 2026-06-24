import { describe, it, expect } from "vitest";
import { instantSearch, SEARCH_INDEX, EXAMPLE_QUERIES } from "./search";

describe("search index", () => {
  it("is non-empty and well-formed", () => {
    expect(SEARCH_INDEX.length).toBeGreaterThan(0);
    for (const row of SEARCH_INDEX.slice(0, 5)) {
      expect(row.name).toBeTruthy();
      expect(row.route).toMatch(/^\//);
      expect(typeof row.popularity).toBe("number");
    }
  });
});

describe("instantSearch", () => {
  it("returns popularity-sorted results for an empty query", () => {
    const res = instantSearch("", 5);
    expect(res.length).toBeLessThanOrEqual(5);
    for (let i = 1; i < res.length; i++) {
      expect(res[i - 1].popularity).toBeGreaterThanOrEqual(res[i].popularity);
    }
  });

  it("respects the limit", () => {
    expect(instantSearch("a", 3).length).toBeLessThanOrEqual(3);
  });

  it("finds an entry by its exact name", () => {
    const target = SEARCH_INDEX[0];
    const res = instantSearch(target.name, 8);
    expect(res.some((r) => r.name === target.name)).toBe(true);
  });

  it("exposes example queries", () => {
    expect(EXAMPLE_QUERIES.length).toBeGreaterThan(0);
  });
});
