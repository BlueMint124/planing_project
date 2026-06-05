import {
  type TripGenerationRequest,
  type TripGenerationResponse,
  tripGenerationRequestSchema,
  tripGenerationResponseSchema,
} from "./contracts";
import { mockJejuTripResponse } from "./mock-trip";
import { z } from "zod";

export const tripShareResponseSchema = z.object({
  tripId: z.string().trim().min(1),
  shareUrl: z.url(),
  expiresAt: z.string().datetime(),
});

export const sharedTripLookupResponseSchema = z.object({
  trip: tripGenerationResponseSchema,
  expiresAt: z.string().datetime(),
});

export type TripShareResponse = z.infer<typeof tripShareResponseSchema>;
export type SharedTripLookupResponse = z.infer<
  typeof sharedTripLookupResponseSchema
>;

export interface TripApiClient {
  generateTrip(request: TripGenerationRequest): Promise<TripGenerationResponse>;
  shareTrip(trip: TripGenerationResponse): Promise<TripShareResponse>;
  getSharedTrip(tripId: string): Promise<SharedTripLookupResponse>;
}

interface HttpTripApiClientOptions {
  fetchImpl?: typeof fetch;
}

async function parseJsonResponse<T>(
  response: Response,
  schema: z.ZodType<T>,
): Promise<T> {
  if (!response.ok) {
    throw new Error("요청을 처리하지 못했습니다.");
  }

  return schema.parse(await response.json());
}

export function createMockTripApiClient(): TripApiClient {
  return {
    async generateTrip(request) {
      tripGenerationRequestSchema.parse(request);
      return tripGenerationResponseSchema.parse(mockJejuTripResponse);
    },
    async shareTrip(trip) {
      const parsedTrip = tripGenerationResponseSchema.parse(trip);

      return tripShareResponseSchema.parse({
        tripId: parsedTrip.tripId,
        shareUrl: `https://example.test/share/${parsedTrip.tripId}`,
        expiresAt: "2026-06-12T00:00:00.000Z",
      });
    },
    async getSharedTrip(tripId) {
      if (!tripId.trim()) {
        throw new Error("요청을 처리하지 못했습니다.");
      }

      return sharedTripLookupResponseSchema.parse({
        trip: mockJejuTripResponse,
        expiresAt: "2026-06-12T00:00:00.000Z",
      });
    },
  };
}

export function createHttpTripApiClient({
  fetchImpl = fetch,
}: HttpTripApiClientOptions = {}): TripApiClient {
  return {
    async generateTrip(request) {
      const response = await fetchImpl("/api/trips/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(tripGenerationRequestSchema.parse(request)),
      });

      return parseJsonResponse(response, tripGenerationResponseSchema);
    },
    async shareTrip(trip) {
      const response = await fetchImpl("/api/trips/share", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(tripGenerationResponseSchema.parse(trip)),
      });

      return parseJsonResponse(response, tripShareResponseSchema);
    },
    async getSharedTrip(tripId) {
      const response = await fetchImpl(
        `/api/trips/${encodeURIComponent(tripId)}`,
      );

      return parseJsonResponse(response, sharedTripLookupResponseSchema);
    },
  };
}
