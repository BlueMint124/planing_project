import { describe, expect, it, vi } from "vitest";

import { mockJejuTripRequest, mockJejuTripResponse } from "@/src/features/trips/mock-trip";

import { createTripItineraryGenerator } from "./trip-itinerary-generator";

describe("createTripItineraryGenerator", () => {
  it("collects place candidates, computes route hints, and delegates to the AI generator", async () => {
    const places = [
      {
        id: "place_1",
        name: "First Place",
        category: "nature",
        coordinates: { lat: 33.45, lng: 126.93 },
      },
      {
        id: "place_2",
        name: "Second Place",
        category: "food",
        coordinates: { lat: 33.47, lng: 126.94 },
      },
      {
        id: "place_3",
        name: "Third Place",
        category: "cafe",
        coordinates: { lat: 33.49, lng: 126.95 },
      },
    ];
    const searchPlaces = vi.fn().mockResolvedValue(places);
    const computeRoute = vi
      .fn()
      .mockResolvedValueOnce({ durationMinutes: 10, distanceMeters: 2_000 })
      .mockResolvedValueOnce({ durationMinutes: 15, distanceMeters: 3_000 });
    const generate = vi.fn().mockResolvedValue(mockJejuTripResponse);

    const generator = createTripItineraryGenerator({
      placeProvider: { searchPlaces },
      routeProvider: { computeRoute },
      aiGenerator: { generate },
      maxPlaceCandidates: 12,
    });

    const response = await generator.generate(mockJejuTripRequest);

    expect(response).toBe(mockJejuTripResponse);
    expect(searchPlaces).toHaveBeenCalledWith({
      destination: mockJejuTripRequest.destination,
      styles: mockJejuTripRequest.styles,
      maxResults: 12,
    });
    expect(computeRoute).toHaveBeenCalledTimes(2);
    expect(generate).toHaveBeenCalledWith({
      request: mockJejuTripRequest,
      places,
      routeHints: [
        {
          fromPlaceId: "place_1",
          toPlaceId: "place_2",
          durationMinutes: 10,
          distanceMeters: 2_000,
        },
        {
          fromPlaceId: "place_2",
          toPlaceId: "place_3",
          durationMinutes: 15,
          distanceMeters: 3_000,
        },
      ],
    });
  });

  it("throws when there are not enough place candidates to build an itinerary", async () => {
    const generator = createTripItineraryGenerator({
      placeProvider: { searchPlaces: vi.fn().mockResolvedValue([]) },
      routeProvider: { computeRoute: vi.fn() },
      aiGenerator: { generate: vi.fn() },
    });

    await expect(generator.generate(mockJejuTripRequest)).rejects.toThrow(
      "Not enough place candidates to generate an itinerary.",
    );
  });
});
