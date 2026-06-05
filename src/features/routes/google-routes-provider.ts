import type { RouteProvider, RouteRequest, RouteResult } from "./route-provider";

const GOOGLE_ROUTES_COMPUTE_URL =
  "https://routes.googleapis.com/directions/v2:computeRoutes";

export const googleRoutesFieldMask = "routes.duration,routes.distanceMeters";

interface GoogleRoutesProviderOptions {
  apiKey: string;
  fetchImpl?: typeof fetch;
}

interface GoogleRoutesResponse {
  routes?: Array<{
    duration?: string;
    distanceMeters?: number;
  }>;
}

function parseDurationMinutes(duration: string) {
  const seconds = Number(duration.replace(/s$/, ""));
  if (!Number.isFinite(seconds)) {
    throw new Error("Google Routes returned an invalid duration.");
  }

  return Math.ceil(seconds / 60);
}

function toLatLng(coordinates: RouteRequest["origin"]) {
  return {
    location: {
      latLng: {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      },
    },
  };
}

export function createGoogleRoutesProvider(
  options: GoogleRoutesProviderOptions,
): RouteProvider {
  const fetchImpl = options.fetchImpl ?? fetch;

  return {
    async computeRoute(request: RouteRequest): Promise<RouteResult> {
      const response = await fetchImpl(GOOGLE_ROUTES_COMPUTE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": options.apiKey,
          "X-Goog-FieldMask": googleRoutesFieldMask,
        },
        body: JSON.stringify({
          origin: toLatLng(request.origin),
          destination: toLatLng(request.destination),
          travelMode: "DRIVE",
          routingPreference: "TRAFFIC_AWARE",
          languageCode: "ko",
          units: "METRIC",
        }),
      });

      if (!response.ok) {
        throw new Error("Google Routes request failed.");
      }

      const data = (await response.json()) as GoogleRoutesResponse;
      const route = data.routes?.[0];

      if (!route?.duration || typeof route.distanceMeters !== "number") {
        throw new Error("Google Routes did not return a route.");
      }

      return {
        distanceMeters: route.distanceMeters,
        durationMinutes: parseDurationMinutes(route.duration),
      };
    },
  };
}
