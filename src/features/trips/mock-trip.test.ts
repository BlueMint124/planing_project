import { describe, expect, it } from "vitest";
import {
  tripGenerationRequestSchema,
  tripGenerationResponseSchema,
} from "./contracts";
import { mockJejuTripRequest, mockJejuTripResponse } from "./mock-trip";

describe("mock trip data", () => {
  it("keeps the 제주 request aligned with the request contract", () => {
    expect(tripGenerationRequestSchema.safeParse(mockJejuTripRequest).success).toBe(
      true,
    );
  });

  it("keeps the 제주 response aligned with the response contract", () => {
    expect(
      tripGenerationResponseSchema.safeParse(mockJejuTripResponse).success,
    ).toBe(true);
  });
});
