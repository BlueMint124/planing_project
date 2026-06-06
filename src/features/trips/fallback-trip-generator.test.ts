import { describe, expect, it, vi } from "vitest";

import type { TripGenerationResponse } from "./contracts";
import { mockJejuTripRequest, mockJejuTripResponse } from "./mock-trip";
import { createFallbackTripGenerator } from "./fallback-trip-generator";

describe("createFallbackTripGenerator", () => {
  it("returns the primary live result when generation succeeds", async () => {
    const primary = vi.fn().mockResolvedValue({
      ...mockJejuTripResponse,
      tripId: "trip_live_001",
    });
    const fallback = vi.fn().mockReturnValue(mockJejuTripResponse);

    const generator = createFallbackTripGenerator({
      primary,
      fallback,
      logger: { warn: vi.fn() },
    });

    await expect(generator(mockJejuTripRequest)).resolves.toEqual({
      ...mockJejuTripResponse,
      tripId: "trip_live_001",
    });
    expect(fallback).not.toHaveBeenCalled();
  });

  it("returns the demo fallback result when live generation fails", async () => {
    const primary = vi.fn().mockRejectedValue(new Error("missing keys"));
    const fallback = vi.fn().mockReturnValue(mockJejuTripResponse);
    const warn = vi.fn();

    const generator = createFallbackTripGenerator({
      primary,
      fallback,
      logger: { warn },
    });

    await expect(generator(mockJejuTripRequest)).resolves.toEqual(
      mockJejuTripResponse,
    );
    expect(warn).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "trip_generation_fallback_used",
        reason: "missing keys",
      }),
    );
  });

  it("returns the demo fallback result when live generation times out", async () => {
    const primary = vi.fn(
      () => new Promise<TripGenerationResponse>(() => undefined),
    );
    const fallback = vi.fn().mockReturnValue(mockJejuTripResponse);

    const generator = createFallbackTripGenerator({
      primary,
      fallback,
      timeoutMs: 1,
      logger: { warn: vi.fn() },
    });

    await expect(generator(mockJejuTripRequest)).resolves.toEqual(
      mockJejuTripResponse,
    );
  });
});
