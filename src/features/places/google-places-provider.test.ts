import { describe, expect, it, vi } from "vitest";
import { createGooglePlacesProvider } from "./google-places-provider";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("createGooglePlacesProvider", () => {
  it("calls Text Search with an explicit field mask and normalizes places", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({
        places: [
          {
            id: "place_1",
            displayName: { text: "성산일출봉" },
            formattedAddress: "제주 서귀포시 성산읍",
            location: { latitude: 33.4581, longitude: 126.9425 },
            googleMapsUri: "https://maps.google.com/?cid=1",
            primaryType: "tourist_attraction",
          },
        ],
      }),
    );
    const provider = createGooglePlacesProvider({
      apiKey: "test-key",
      fetchImpl,
    });

    const places = await provider.searchPlaces({
      destination: "제주",
      styles: ["자연"],
      maxResults: 3,
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      "https://places.googleapis.com/v1/places:searchText",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "X-Goog-Api-Key": "test-key",
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.location,places.googleMapsUri,places.primaryType",
        }),
        body: JSON.stringify({
          textQuery: "제주 자연 명소",
          languageCode: "ko",
          regionCode: "KR",
          pageSize: 3,
        }),
      }),
    );
    expect(places).toEqual([
      {
        id: "place_1",
        name: "성산일출봉",
        category: "tourist_attraction",
        formattedAddress: "제주 서귀포시 성산읍",
        coordinates: { lat: 33.4581, lng: 126.9425 },
        bookingUrl: "https://maps.google.com/?cid=1",
      },
    ]);
  });

  it("throws a safe provider error when Google returns a failure", async () => {
    const provider = createGooglePlacesProvider({
      apiKey: "test-key",
      fetchImpl: vi.fn().mockResolvedValue(jsonResponse({ error: "denied" }, 403)),
    });

    await expect(
      provider.searchPlaces({ destination: "제주", styles: ["맛집"] }),
    ).rejects.toThrow("Google Places request failed.");
  });
});
