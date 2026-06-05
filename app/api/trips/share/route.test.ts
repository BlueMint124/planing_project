import { describe, expect, it, vi } from "vitest";

import { mockJejuTripResponse } from "@/src/features/trips/mock-trip";

import { createShareTripPostHandler } from "./route";

function createRequest(body: unknown) {
  return new Request("https://arrivehae.test/api/trips/share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/trips/share", () => {
  it("stores a generated trip result and returns a share URL", async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const handler = createShareTripPostHandler({
      store: { save, findByTripId: vi.fn() },
      now: () => new Date("2026-06-05T00:00:00.000Z"),
    });

    const response = await handler(createRequest(mockJejuTripResponse));

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      tripId: mockJejuTripResponse.tripId,
      shareUrl: "https://arrivehae.test/share/trip_demo_jeju_001",
      expiresAt: "2026-06-12T00:00:00.000Z",
    });
    expect(save).toHaveBeenCalledWith({
      tripId: mockJejuTripResponse.tripId,
      trip: mockJejuTripResponse,
      createdAt: new Date("2026-06-05T00:00:00.000Z"),
      expiresAt: new Date("2026-06-12T00:00:00.000Z"),
    });
  });

  it("returns 400 when the body is not a generated trip response", async () => {
    const handler = createShareTripPostHandler({
      store: { save: vi.fn(), findByTripId: vi.fn() },
      now: () => new Date("2026-06-05T00:00:00.000Z"),
    });

    const response = await handler(createRequest({ tripId: "" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      errorCode: "INVALID_SHARE_RESULT",
      message: "공유할 여행 결과를 확인해주세요.",
    });
  });
});
