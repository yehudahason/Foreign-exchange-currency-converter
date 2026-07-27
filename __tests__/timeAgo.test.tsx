import { expect, vi, it, describe, beforeEach, afterEach } from "vitest";

// timeAgo.test.ts
import { timeAgo } from "../app/utils/timeAgo";

describe("timeAgo", () => {
  const NOW = new Date("2026-07-27T12:00:00Z").getTime();

  beforeEach(() => {
    vi.spyOn(Date, "now").mockReturnValue(NOW);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns minutes when less than an hour", () => {
    const date = new Date(NOW - 15 * 60 * 1000);

    expect(timeAgo(date)).toBe("15M");
  });

  it("returns 0M when dates are equal", () => {
    const date = new Date(NOW);

    expect(timeAgo(date)).toBe("0M");
  });

  it("returns hours when exactly one hour ago", () => {
    const date = new Date(NOW - 60 * 60 * 1000);

    expect(timeAgo(date)).toBe("1H");
  });

  it("returns hours when less than one day", () => {
    const date = new Date(NOW - 5 * 60 * 60 * 1000);

    expect(timeAgo(date)).toBe("5H");
  });

  it("returns formatted date when one day or older", () => {
    const date = new Date("2026-07-20T12:00:00Z");

    expect(timeAgo(date)).toBe("20 Jul");
  });

  it("returns formatted date when exactly one day ago", () => {
    const date = new Date(NOW - 24 * 60 * 60 * 1000);

    expect(timeAgo(date)).toBe("26 Jul");
  });
});
