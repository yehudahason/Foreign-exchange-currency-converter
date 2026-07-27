// formatBerlinTime.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatBerlinTime } from "../app/utils/formatBerlinTime";

describe("formatBerlinTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats a winter date", () => {
    const date = new Date("2026-01-15T12:30:00Z");

    const result = formatBerlinTime(date);

    expect(result).toContain("Jan");
    expect(result).toContain("15");
    expect(result).toContain("13:30");
  });

  it("formats a summer date", () => {
    const date = new Date("2026-07-15T12:30:00Z");

    const result = formatBerlinTime(date);

    expect(result).toContain("Jul");
    expect(result).toContain("15");
    expect(result).toContain("14:30");
  });

  it("uses the current date when no argument is passed", () => {
    vi.setSystemTime(new Date("2026-07-15T12:30:00Z"));

    const result = formatBerlinTime();

    expect(result).toContain("Jul");
    expect(result).toContain("15");
    expect(result).toContain("14:30");
  });

  it("returns a string", () => {
    expect(typeof formatBerlinTime(new Date())).toBe("string");
  });
});
