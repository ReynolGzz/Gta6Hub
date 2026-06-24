import { describe, it, expect } from "vitest";
import { ENTITIES, ENTITY_BY_KIND, GENERIC_ENTITIES, entityByDbType, entityByKind } from "./entities";

describe("entity registry", () => {
  it("every entity has the required fields", () => {
    for (const e of ENTITIES) {
      expect(e.kind).toBeTruthy();
      expect(e.label).toBeTruthy();
      expect(e.singular).toBeTruthy();
      expect(e.route).toBe(`/${e.kind}`);
      expect(e.icon).toBeTruthy();
      expect(["pink", "purple", "blue"]).toContain(e.accent);
    }
  });

  it("kinds and routes are unique", () => {
    const kinds = ENTITIES.map((e) => e.kind);
    const routes = ENTITIES.map((e) => e.route);
    expect(new Set(kinds).size).toBe(kinds.length);
    expect(new Set(routes).size).toBe(routes.length);
  });

  it("cars and money are bespoke (null dbType); the rest are generic", () => {
    expect(entityByKind("cars")?.dbType).toBeNull();
    expect(entityByKind("money")?.dbType).toBeNull();
    expect(GENERIC_ENTITIES.every((e) => e.dbType !== null)).toBe(true);
    expect(GENERIC_ENTITIES.length).toBe(ENTITIES.length - 2);
  });

  it("lookup helpers resolve consistently", () => {
    expect(ENTITY_BY_KIND.weapons.label).toBe("Weapons");
    expect(entityByDbType("weapon")?.kind).toBe("weapons");
    expect(entityByDbType("nope")).toBeUndefined();
    expect(entityByKind("nope")).toBeUndefined();
  });
});
