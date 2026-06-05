import { describe, expect, it, vi } from "vitest";

import { mockJejuTripResponse } from "@/src/features/trips/mock-trip";

import { createGetSharedTripHandler } from "./route";

describe("GET /api/trips/[tripId]", () => {
  it("returns a stored shared trip result", async () => {
    const expiresAt = new Date("2026-06-12T00:00:00.000Z");
    const handler = createGetSharedTripHandler({
      store: {
        save: vi.fn(),
        findByTripId: vi.fn().mockResolvedValue({
          tripId: mockJejuTripResponse.tripId,
          trip: mockJejuTripResponse,
          createdAt: new Date("2026-06-05T00:00:00.000Z"),
          expiresAt,
        }),
      },
      now: () => new Date("2026-06-06T00:00:00.000Z"),
    });

    const response = await handler(new Request("https://arrivehae.test"), {
      params: Promise.resolve({ tripId: mockJejuTripResponse.tripId }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      trip: mockJejuTripResponse,
      expiresAt: expiresAt.toISOString(),
    });
  });

  it("returns 404 when a shared trip is missing or expired", async () => {
    const handler = createGetSharedTripHandler({
      store: { save: vi.fn(), findByTripId: vi.fn().mockResolvedValue(null) },
      now: () => new Date("2026-06-06T00:00:00.000Z"),
    });

    const response = await handler(new Request("https://arrivehae.test"), {
      params: Promise.resolve({ tripId: "missing_trip" }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      errorCode: "SHARED_TRIP_NOT_FOUND",
      message: "공유된 여행 결과를 찾을 수 없습니다.",
    });
  });
});
