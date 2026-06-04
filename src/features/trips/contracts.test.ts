import { describe, expect, it } from "vitest";
import {
  tripGenerationRequestSchema,
  tripGenerationResponseSchema,
  tripStateSchema,
} from "./contracts";

describe("tripGenerationRequestSchema", () => {
  it("accepts a valid group trip request", () => {
    const result = tripGenerationRequestSchema.safeParse({
      destination: "제주",
      duration: "2박3일",
      budgetPerPerson: 250000,
      groupSize: 4,
      styles: ["맛집", "자연", "힐링"],
      members: [
        { name: "멤버1", likes: ["카페", "사진"], dislikes: ["등산"] },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects a request with an invalid budget and group size", () => {
    const result = tripGenerationRequestSchema.safeParse({
      destination: "제주",
      duration: "1박2일",
      budgetPerPerson: 0,
      groupSize: 11,
      styles: [],
      members: [],
    });

    expect(result.success).toBe(false);
  });
});

describe("tripGenerationResponseSchema", () => {
  it("accepts a route item with coordinates and booking link", () => {
    const result = tripGenerationResponseSchema.safeParse({
      tripId: "trip_abc123",
      summary: {
        totalEstimatedCost: 920000,
        estimatedCostPerPerson: 230000,
        budgetStatus: "within_budget",
      },
      route: [
        {
          day: 1,
          order: 1,
          time: "10:00",
          placeName: "성산일출봉",
          category: "자연",
          estimatedCost: 5000,
          moveMinutesFromPrevious: 0,
          bookingUrl: "https://example.com/place",
          coordinates: { lat: 33.4581, lng: 126.9425 },
        },
      ],
    });

    expect(result.success).toBe(true);
  });
});

describe("tripStateSchema", () => {
  it.each(["draft", "validating", "generating", "generated", "failed", "shared"])(
    "accepts the %s state",
    (state) => {
      expect(tripStateSchema.parse(state)).toBe(state);
    },
  );
});
