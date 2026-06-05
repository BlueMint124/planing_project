import { describe, expect, it, vi } from "vitest";
import { createHttpTripApiClient, createMockTripApiClient } from "./api-client";
import { mockJejuTripRequest, mockJejuTripResponse } from "./mock-trip";

describe("createMockTripApiClient", () => {
  it("returns a validated trip response for UI development", async () => {
    const client = createMockTripApiClient();

    await expect(client.generateTrip(mockJejuTripRequest)).resolves.toEqual(
      mockJejuTripResponse,
    );
  });
});

describe("createHttpTripApiClient", () => {
  it("generates, shares, and loads trips through the route contracts", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json(mockJejuTripResponse, { status: 200 }),
      )
      .mockResolvedValueOnce(
        Response.json(
          {
            tripId: mockJejuTripResponse.tripId,
            shareUrl: "https://example.test/share/trip_demo_jeju_001",
            expiresAt: "2026-06-12T00:00:00.000Z",
          },
          { status: 201 },
        ),
      )
      .mockResolvedValueOnce(
        Response.json(
          {
            trip: mockJejuTripResponse,
            expiresAt: "2026-06-12T00:00:00.000Z",
          },
          { status: 200 },
        ),
      );
    const client = createHttpTripApiClient({ fetchImpl });

    await expect(client.generateTrip(mockJejuTripRequest)).resolves.toEqual(
      mockJejuTripResponse,
    );
    await expect(client.shareTrip(mockJejuTripResponse)).resolves.toEqual({
      tripId: mockJejuTripResponse.tripId,
      shareUrl: "https://example.test/share/trip_demo_jeju_001",
      expiresAt: "2026-06-12T00:00:00.000Z",
    });
    await expect(
      client.getSharedTrip(mockJejuTripResponse.tripId),
    ).resolves.toEqual({
      trip: mockJejuTripResponse,
      expiresAt: "2026-06-12T00:00:00.000Z",
    });

    expect(fetchImpl).toHaveBeenNthCalledWith(
      1,
      "/api/trips/generate",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchImpl).toHaveBeenNthCalledWith(
      2,
      "/api/trips/share",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchImpl).toHaveBeenNthCalledWith(3, "/api/trips/trip_demo_jeju_001");
  });

  it("throws a user-safe error when an API response is not ok", async () => {
    const client = createHttpTripApiClient({
      fetchImpl: vi
        .fn()
        .mockResolvedValue(Response.json({ errorCode: "NOPE" }, { status: 500 })),
    });

    await expect(client.generateTrip(mockJejuTripRequest)).rejects.toThrow(
      "요청을 처리하지 못했습니다.",
    );
  });
});
