import { describe, expect, it } from "vitest";

import { mockJejuTripRequest } from "@/src/features/trips/mock-trip";

import { buildItineraryPrompt } from "./itinerary-prompt";

describe("buildItineraryPrompt", () => {
  it("builds a sanitized planning prompt with priorities, candidates, and route hints", () => {
    const prompt = buildItineraryPrompt({
      request: mockJejuTripRequest,
      places: [
        {
          id: "place_1",
          name: "Seongsan Sunrise Peak",
          category: "nature",
          coordinates: { lat: 33.4581, lng: 126.9425 },
          bookingUrl: "https://maps.google.com/?q=seongsan",
          estimatedCost: 5_000,
        },
        {
          id: "place_2",
          name: "Local Seafood Restaurant",
          category: "food",
          coordinates: { lat: 33.4712, lng: 126.931 },
          estimatedCost: 30_000,
        },
      ],
      routeHints: [
        {
          fromPlaceId: "place_1",
          toPlaceId: "place_2",
          durationMinutes: 12,
          distanceMeters: 2_400,
        },
      ],
    });

    expect(prompt.system).toContain("route efficiency");
    expect(prompt.system).toContain("budget compliance");
    expect(prompt.system).toContain("group preference balance");
    expect(prompt.user).toContain("Seongsan Sunrise Peak");
    expect(prompt.user).toContain("place_1 -> place_2: 12 minutes");
    expect(prompt.user).toContain("memberCount");
    expect(prompt.user).not.toContain(mockJejuTripRequest.members[0].name);
  });
});
