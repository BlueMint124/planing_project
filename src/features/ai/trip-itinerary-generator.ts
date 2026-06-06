import type {
  PlaceCandidate,
  PlaceProvider,
} from "@/src/features/places/place-provider";
import type { RouteProvider } from "@/src/features/routes/route-provider";
import type {
  TripGenerationRequest,
  TripGenerationResponse,
} from "@/src/features/trips/contracts";

import type { GenerateItineraryInput } from "./openai-itinerary-generator";
import type { RouteHint } from "./itinerary-prompt";

interface AIItineraryGenerator {
  generate(input: GenerateItineraryInput): Promise<TripGenerationResponse>;
}

export interface TripItineraryGeneratorDependencies {
  placeProvider: PlaceProvider;
  routeProvider: RouteProvider;
  aiGenerator: AIItineraryGenerator;
  maxPlaceCandidates?: number;
}

function getAdjacentPairs<T>(items: T[]) {
  return items.slice(0, -1).map((item, index) => [item, items[index + 1]] as const);
}

async function computeRouteHint(
  dependencies: Pick<TripItineraryGeneratorDependencies, "routeProvider">,
  [from, to]: readonly [PlaceCandidate, PlaceCandidate],
): Promise<RouteHint | null> {
  try {
    const route = await dependencies.routeProvider.computeRoute({
      origin: from.coordinates,
      destination: to.coordinates,
    });

    return {
      fromPlaceId: from.id,
      toPlaceId: to.id,
      durationMinutes: route.durationMinutes,
      distanceMeters: route.distanceMeters,
    };
  } catch {
    return null;
  }
}

export function createTripItineraryGenerator(
  dependencies: TripItineraryGeneratorDependencies,
) {
  return {
    async generate(
      request: TripGenerationRequest,
    ): Promise<TripGenerationResponse> {
      const places = await dependencies.placeProvider.searchPlaces({
        destination: request.destination,
        styles: request.styles,
        maxResults: dependencies.maxPlaceCandidates ?? 12,
      });

      if (places.length < 2) {
        throw new Error("Not enough place candidates to generate an itinerary.");
      }

      const routeHints = (
        await Promise.all(
          getAdjacentPairs(places).map((pair) =>
            computeRouteHint(dependencies, pair),
          ),
        )
      ).filter((hint): hint is RouteHint => hint !== null);

      return dependencies.aiGenerator.generate({
        request,
        places,
        routeHints,
      });
    },
  };
}
