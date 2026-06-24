import { describe, it, expect } from "vitest";
import { askViceHub } from "./rag";
import { SEARCH_INDEX } from "@/lib/search";

// These tests exercise the no-API-key fallback path (templated, grounded answers).
describe("askViceHub (fallback path)", () => {
  it("returns a grounded, cited answer without an LLM", async () => {
    const target = SEARCH_INDEX[0];
    const res = await askViceHub(target.name);
    expect(res.usedLlm).toBe(false);
    expect(res.grounded).toBe(true);
    expect(res.sources.length).toBeGreaterThan(0);
    expect(res.answer).toContain(target.name);
  });

  it("handles empty queries without retrieving", async () => {
    const res = await askViceHub("   ");
    expect(res.grounded).toBe(false);
    expect(res.sources).toEqual([]);
  });

  it("each source carries a route link", async () => {
    const res = await askViceHub("car");
    for (const s of res.sources) {
      expect(s.route).toMatch(/^\//);
      expect(s.name).toBeTruthy();
    }
  });
});
