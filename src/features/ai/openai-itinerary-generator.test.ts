import { describe, expect, it, vi } from "vitest";

import { mockJejuTripRequest, mockJejuTripResponse } from "@/src/features/trips/mock-trip";

import { createOpenAIItineraryGenerator } from "./openai-itinerary-generator";

describe("createOpenAIItineraryGenerator", () => {
  it("calls the Responses API with a structured output request and normalizes the cost summary", async () => {
    const parse = vi.fn().mockResolvedValue({
      output_parsed: {
        ...mockJejuTripResponse,
        summary: {
          totalEstimatedCost: 0,
          estimatedCostPerPerson: 0,
          budgetStatus: "within_budget",
        },
      },
    });
    const generator = createOpenAIItineraryGenerator({
      client: { responses: { parse } },
      model: "gpt-5.4-mini",
      createTripId: () => "trip_ai_001",
    });

    const response = await generator.generate({
      request: mockJejuTripRequest,
      places: [],
      routeHints: [],
    });

    expect(parse).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gpt-5.4-mini",
        text: expect.objectContaining({
          format: expect.objectContaining({
            name: "trip_generation_response",
          }),
        }),
      }),
    );
    expect(response.tripId).toBe("trip_ai_001");
    expect(response.summary).toEqual({
      totalEstimatedCost: 380_000,
      estimatedCostPerPerson: 95_000,
      budgetStatus: "within_budget",
    });
  });

  it("throws when the model output does not match the trip response contract", async () => {
    const generator = createOpenAIItineraryGenerator({
      client: {
        responses: {
          parse: vi.fn().mockResolvedValue({ output_parsed: { route: [] } }),
        },
      },
      model: "gpt-5.4-mini",
      createTripId: () => "trip_ai_001",
    });

    await expect(
      generator.generate({
        request: mockJejuTripRequest,
        places: [],
        routeHints: [],
      }),
    ).rejects.toThrow("AI itinerary output failed schema validation.");
  });

  it("does not send unsupported URL format constraints to Structured Outputs", async () => {
    const parse = vi.fn().mockResolvedValue({
      output_parsed: mockJejuTripResponse,
    });
    const generator = createOpenAIItineraryGenerator({
      client: { responses: { parse } },
      model: "gpt-5.4-mini",
      createTripId: () => "trip_ai_001",
    });

    await generator.generate({
      request: mockJejuTripRequest,
      places: [],
      routeHints: [],
    });

    expect(JSON.stringify(parse.mock.calls[0][0])).not.toContain(
      '"format":"uri"',
    );
  });
});
