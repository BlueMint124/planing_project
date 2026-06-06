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

  it("includes flight, local transport, and meal costs in the demo recommendation", () => {
    const categories = mockJejuTripResponse.route.map((item) => item.category);
    const perPersonRouteCost = mockJejuTripResponse.route.reduce(
      (sum, item) => sum + item.estimatedCost,
      0,
    );

    expect(categories).toEqual(expect.arrayContaining(["항공", "교통", "식사"]));
    expect(
      mockJejuTripResponse.route.some(
        (item) => item.category === "식사" && item.estimatedCost > 0,
      ),
    ).toBe(true);
    expect(
      mockJejuTripResponse.route.some(
        (item) => item.category === "항공" && item.estimatedCost > 0,
      ),
    ).toBe(true);
    expect(
      mockJejuTripResponse.route.some(
        (item) => item.category === "교통" && item.estimatedCost > 0,
      ),
    ).toBe(true);
    expect(mockJejuTripResponse.summary.estimatedCostPerPerson).toBe(
      perPersonRouteCost,
    );
    expect(mockJejuTripResponse.summary.totalEstimatedCost).toBe(
      perPersonRouteCost * mockJejuTripRequest.groupSize,
    );
  });
});
