import type { PlaceCandidate } from "@/src/features/places/place-provider";
import type { TripGenerationRequest } from "@/src/features/trips/contracts";

export interface RouteHint {
  fromPlaceId: string;
  toPlaceId: string;
  durationMinutes: number;
  distanceMeters: number;
}

export interface ItineraryPromptInput {
  request: TripGenerationRequest;
  places: PlaceCandidate[];
  routeHints: RouteHint[];
}

export interface ItineraryPrompt {
  system: string;
  user: string;
}

function sanitizeMembers(request: TripGenerationRequest) {
  return request.members.map((member, index) => ({
    memberIndex: index + 1,
    likes: member.likes,
    dislikes: member.dislikes,
  }));
}

export function buildItineraryPrompt(input: ItineraryPromptInput): ItineraryPrompt {
  const sanitizedRequest = {
    destination: input.request.destination,
    duration: input.request.duration,
    budgetPerPerson: input.request.budgetPerPerson,
    groupSize: input.request.groupSize,
    styles: input.request.styles,
    memberCount: input.request.members.length,
    members: sanitizeMembers(input.request),
  };

  const places = input.places.map((place) => ({
    id: place.id,
    name: place.name,
    category: place.category,
    formattedAddress: place.formattedAddress,
    coordinates: place.coordinates,
    bookingUrl: place.bookingUrl,
    estimatedCost: place.estimatedCost ?? 0,
  }));

  const routeHints = input.routeHints.map(
    (hint) =>
      `${hint.fromPlaceId} -> ${hint.toPlaceId}: ${hint.durationMinutes} minutes, ${hint.distanceMeters} meters`,
  );

  return {
    system: [
      "You are an expert group travel itinerary planner for Korean users.",
      "Optimize in this exact priority order: route efficiency, budget compliance, group preference balance.",
      "Use only the provided place candidates. Do not invent coordinates or booking URLs.",
      "Limit excessive repetition of the same category across consecutive stops.",
      "Include realistic meal stops for lunch and dinner when the duration spans those times.",
      "Include local transportation costs as route items when they materially affect the budget.",
      "Include estimated flight or long-distance transportation costs when the destination commonly requires them.",
      "Return a valid trip_generation_response structured output only.",
      "Costs in route[].estimatedCost are per-person estimates in KRW.",
    ].join(" "),
    user: JSON.stringify(
      {
        request: sanitizedRequest,
        places,
        routeHints,
      },
      null,
      2,
    ),
  };
}
