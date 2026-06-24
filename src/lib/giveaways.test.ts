import { describe, it, expect } from "vitest";
import { liveStatus, timeRemaining, statusBadgeVariant, BONUS_ENTRIES } from "./giveaways";

const now = new Date("2026-06-24T12:00:00Z");
const days = (n: number) => new Date(now.getTime() + n * 86400000);

describe("liveStatus", () => {
  it("returns ACTIVE between start and end", () => {
    expect(liveStatus({ status: "ACTIVE", startsAt: days(-1), endsAt: days(5) }, now)).toBe("ACTIVE");
  });
  it("returns ENDED once past endsAt, even if stored ACTIVE", () => {
    expect(liveStatus({ status: "ACTIVE", startsAt: days(-10), endsAt: days(-1) }, now)).toBe("ENDED");
  });
  it("returns UPCOMING before start", () => {
    expect(liveStatus({ status: "ACTIVE", startsAt: days(2), endsAt: days(9) }, now)).toBe("UPCOMING");
  });
});

describe("timeRemaining", () => {
  it("formats days and hours", () => {
    expect(timeRemaining(days(3), now)).toBe("3d 0h left");
  });
  it("reports ended for past dates", () => {
    expect(timeRemaining(days(-1), now)).toBe("Ended");
  });
});

describe("statusBadgeVariant", () => {
  it("maps statuses to badge variants", () => {
    expect(statusBadgeVariant("ACTIVE")).toBe("success");
    expect(statusBadgeVariant("UPCOMING")).toBe("warning");
    expect(statusBadgeVariant("ENDED")).toBe("muted");
  });
});

describe("BONUS_ENTRIES", () => {
  it("defines positive bonus weights", () => {
    expect(BONUS_ENTRIES.joinedDiscord).toBeGreaterThan(0);
    expect(BONUS_ENTRIES.shared).toBeGreaterThan(0);
  });
});
