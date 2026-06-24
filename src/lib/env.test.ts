import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// env.ts computes feature flags at import time from process.env, so we reset
// modules between cases to assert both the configured and unconfigured states.
const KEYS = ["DISCORD_CLIENT_ID", "DISCORD_CLIENT_SECRET", "OPENAI_API_KEY", "NEXT_PUBLIC_DISCORD_URL"];
let saved: Record<string, string | undefined> = {};

beforeEach(() => {
  saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));
  for (const k of KEYS) delete process.env[k];
  vi.resetModules();
});

afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

describe("feature flags", () => {
  it("default to disabled when no keys are present", async () => {
    const { features, publicFeatures } = await import("./env");
    expect(features.discordAuth).toBe(false);
    expect(features.ai).toBe(false);
    expect(publicFeatures.discord).toBe(false);
  });

  it("enable discordAuth only when both client id and secret exist", async () => {
    process.env.DISCORD_CLIENT_ID = "id";
    process.env.DISCORD_CLIENT_SECRET = "secret";
    vi.resetModules();
    const { features } = await import("./env");
    expect(features.discordAuth).toBe(true);
  });

  it("enable the public discord flag when an invite url is set", async () => {
    process.env.NEXT_PUBLIC_DISCORD_URL = "https://discord.gg/example";
    vi.resetModules();
    const { publicFeatures } = await import("./env");
    expect(publicFeatures.discord).toBe(true);
  });
});
