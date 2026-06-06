import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

import type { PlaceCandidate } from "@/src/features/places/place-provider";
import {
  type TripGenerationRequest,
  type TripGenerationResponse,
  routeItemSchema,
  tripGenerationResponseSchema,
} from "@/src/features/trips/contracts";

import { calculateTripCostSummary } from "./cost-summary";
import { buildItineraryPrompt, type RouteHint } from "./itinerary-prompt";

const openAITripGenerationResponseSchema = tripGenerationResponseSchema.extend({
  route: z
    .array(
      routeItemSchema.extend({
        bookingUrl: z.string().nullable(),
      }),
    )
    .min(1),
});

interface OpenAIResponsesClient {
  responses: {
    parse(request: unknown): Promise<{ output_parsed: unknown }>;
  };
}

export interface OpenAIItineraryGeneratorDependencies {
  client: OpenAIResponsesClient;
  model: string;
  createTripId: () => string;
}

export interface GenerateItineraryInput {
  request: TripGenerationRequest;
  places: PlaceCandidate[];
  routeHints: RouteHint[];
}

export function createOpenAIItineraryGenerator(
  dependencies: OpenAIItineraryGeneratorDependencies,
) {
  return {
    async generate(input: GenerateItineraryInput): Promise<TripGenerationResponse> {
      const prompt = buildItineraryPrompt(input);
      const parsed = await dependencies.client.responses.parse({
        model: dependencies.model,
        input: [
          {
            role: "system",
            content: prompt.system,
          },
          {
            role: "user",
            content: prompt.user,
          },
        ],
        text: {
          format: zodTextFormat(
            openAITripGenerationResponseSchema,
            "trip_generation_response",
          ),
        },
      });

      const response = openAITripGenerationResponseSchema.safeParse(
        parsed.output_parsed,
      );

      if (!response.success) {
        throw new Error("AI itinerary output failed schema validation.");
      }

      return {
        ...tripGenerationResponseSchema.parse({
          ...response.data,
          route: response.data.route.map(({ bookingUrl, ...item }) => ({
            ...item,
            ...(bookingUrl === null ? {} : { bookingUrl }),
          })),
        }),
        tripId: dependencies.createTripId(),
        summary: calculateTripCostSummary({
          route: response.data.route,
          groupSize: input.request.groupSize,
          budgetPerPerson: input.request.budgetPerPerson,
        }),
      };
    },
  };
}
