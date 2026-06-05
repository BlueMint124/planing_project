import OpenAI from "openai";

import { createOpenAIItineraryGenerator } from "@/src/features/ai/openai-itinerary-generator";
import { createTripItineraryGenerator } from "@/src/features/ai/trip-itinerary-generator";
import { createGooglePlacesProvider } from "@/src/features/places/google-places-provider";
import { createGoogleRoutesProvider } from "@/src/features/routes/google-routes-provider";

import type { TripGenerationRequest, TripGenerationResponse } from "./contracts";

type LiveTripGeneratorEnv = Record<string, string | undefined>;

type OpenAIClient = ConstructorParameters<typeof OpenAI>[0] extends never
  ? never
  : Pick<OpenAI, "responses">;

export interface LiveTripGeneratorOptions {
  env: LiveTripGeneratorEnv;
  fetchImpl?: typeof fetch;
  createOpenAIClient?: (apiKey: string) => OpenAIClient;
  createTripId?: () => string;
}

function requireLiveKeys(env: LiveTripGeneratorEnv) {
  if (!env.OPENAI_API_KEY || !env.GOOGLE_MAPS_API_KEY) {
    throw new Error(
      "Live trip generation requires OPENAI_API_KEY and GOOGLE_MAPS_API_KEY.",
    );
  }

  return {
    openAIKey: env.OPENAI_API_KEY,
    googleMapsKey: env.GOOGLE_MAPS_API_KEY,
  };
}

function defaultCreateTripId() {
  return `trip_${crypto.randomUUID()}`;
}

export function createLiveTripGenerator(options: LiveTripGeneratorOptions) {
  return async (
    request: TripGenerationRequest,
  ): Promise<TripGenerationResponse> => {
    const keys = requireLiveKeys(options.env);
    const fetchImpl = options.fetchImpl ?? fetch;
    const createOpenAIClient =
      options.createOpenAIClient ??
      ((apiKey: string) => new OpenAI({ apiKey }));

    const itineraryGenerator = createTripItineraryGenerator({
      placeProvider: createGooglePlacesProvider({
        apiKey: keys.googleMapsKey,
        fetchImpl,
      }),
      routeProvider: createGoogleRoutesProvider({
        apiKey: keys.googleMapsKey,
        fetchImpl,
      }),
      aiGenerator: createOpenAIItineraryGenerator({
        client: createOpenAIClient(keys.openAIKey),
        model: options.env.OPENAI_MODEL ?? "gpt-5.4-mini",
        createTripId: options.createTripId ?? defaultCreateTripId,
      }),
    });

    return itineraryGenerator.generate(request);
  };
}
