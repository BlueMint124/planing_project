import { describe, expect, it, vi } from "vitest";
import { createGoogleRoutesProvider } from "./google-routes-provider";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("createGoogleRoutesProvider", () => {
  it("calls computeRoutes with an explicit field mask and parses duration", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({
        routes: [{ duration: "1234s", distanceMeters: 21000 }],
      }),
    );
    const provider = createGoogleRoutesProvider({
      apiKey: "test-key",
      fetchImpl,
    });

    const route = await provider.computeRoute({
      origin: { lat: 33.4581, lng: 126.9425 },
      destination: { lat: 33.4239, lng: 126.9294 },
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "X-Goog-Api-Key": "test-key",
          "X-Goog-FieldMask": "routes.duration,routes.distanceMeters",
        }),
        body: JSON.stringify({
          origin: { location: { latLng: { latitude: 33.4581, longitude: 126.9425 } } },
          destination: {
            location: { latLng: { latitude: 33.4239, longitude: 126.9294 } },
          },
          travelMode: "DRIVE",
          routingPreference: "TRAFFIC_AWARE",
          languageCode: "ko",
          units: "METRIC",
        }),
      }),
    );
    expect(route).toEqual({
      distanceMeters: 21000,
      durationMinutes: 21,
    });
  });

  it("throws a safe provider error when no route is returned", async () => {
    const provider = createGoogleRoutesProvider({
      apiKey: "test-key",
      fetchImpl: vi.fn().mockResolvedValue(jsonResponse({ routes: [] })),
    });

    await expect(
      provider.computeRoute({
        origin: { lat: 33.4581, lng: 126.9425 },
        destination: { lat: 33.4239, lng: 126.9294 },
      }),
    ).rejects.toThrow("Google Routes did not return a route.");
  });
});
