import { describe, expect, it, vi } from "vitest";

import { mockJejuTripRequest } from "./mock-trip";
import { createLiveTripGenerator } from "./live-trip-generator";

function createJsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("createLiveTripGenerator", () => {
  it("throws when required server API keys are missing", async () => {
    const generator = createLiveTripGenerator({
      env: {},
      fetchImpl: vi.fn(),
      createOpenAIClient: vi.fn(),
      createTripId: () => "trip_live_001",
    });

    await expect(generator(mockJejuTripRequest)).rejects.toThrow(
      "Live trip generation requires OPENAI_API_KEY and GOOGLE_MAPS_API_KEY.",
    );
  });

  it("composes Google providers and OpenAI generator when live keys are configured", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(
        createJsonResponse({
          places: [
            {
              id: "place_1",
              displayName: { text: "First Place" },
              location: { latitude: 33.45, longitude: 126.93 },
              googleMapsUri: "https://maps.google.com/?q=first",
              primaryType: "nature",
            },
            {
              id: "place_2",
              displayName: { text: "Second Place" },
              location: { latitude: 33.46, longitude: 126.94 },
              googleMapsUri: "https://maps.google.com/?q=second",
              primaryType: "food",
            },
          ],
        }),
      )
      .mockResolvedValueOnce(createJsonResponse({ places: [] }))
      .mockResolvedValueOnce(createJsonResponse({ places: [] }))
      .mockResolvedValueOnce(
        createJsonResponse({
          routes: [{ duration: "600s", distanceMeters: 2_000 }],
        }),
      );
    const parse = vi.fn().mockResolvedValue({
      output_parsed: {
        tripId: "model_trip_id",
        summary: {
          totalEstimatedCost: 0,
          estimatedCostPerPerson: 0,
          budgetStatus: "within_budget",
        },
        route: [
          {
            day: 1,
            order: 1,
            time: "10:00",
            placeName: "First Place",
            category: "nature",
            estimatedCost: 10_000,
            moveMinutesFromPrevious: 0,
            bookingUrl: "https://maps.google.com/?q=first",
            coordinates: { lat: 33.45, lng: 126.93 },
          },
          {
            day: 1,
            order: 2,
            time: "12:00",
            placeName: "Second Place",
            category: "food",
            estimatedCost: 20_000,
            moveMinutesFromPrevious: 10,
            bookingUrl: null,
            coordinates: { lat: 33.46, lng: 126.94 },
          },
        ],
      },
    });

    const generator = createLiveTripGenerator({
      env: {
        OPENAI_API_KEY: "openai-key",
        GOOGLE_MAPS_API_KEY: "google-key",
        OPENAI_MODEL: "gpt-5.4-mini",
      },
      fetchImpl,
      createOpenAIClient: vi.fn().mockReturnValue({ responses: { parse } }),
      createTripId: () => "trip_live_001",
    });

    const response = await generator(mockJejuTripRequest);

    expect(response.tripId).toBe("trip_live_001");
    expect(response.summary).toEqual({
      totalEstimatedCost: 120_000,
      estimatedCostPerPerson: 30_000,
      budgetStatus: "within_budget",
    });
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://places.googleapis.com/v1/places:searchText",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Goog-Api-Key": "google-key",
        }),
      }),
    );
    expect(parse).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gpt-5.4-mini",
      }),
    );
  });
});
