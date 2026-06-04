import {
  type TripGenerationRequest,
  type TripGenerationResponse,
  tripGenerationRequestSchema,
  tripGenerationResponseSchema,
} from "./contracts";
import { mockJejuTripResponse } from "./mock-trip";

export interface TripApiClient {
  generateTrip(request: TripGenerationRequest): Promise<TripGenerationResponse>;
}

export function createMockTripApiClient(): TripApiClient {
  return {
    async generateTrip(request) {
      tripGenerationRequestSchema.parse(request);
      return tripGenerationResponseSchema.parse(mockJejuTripResponse);
    },
  };
}
