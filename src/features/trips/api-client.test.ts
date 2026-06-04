import { describe, expect, it } from "vitest";
import { createMockTripApiClient } from "./api-client";
import { mockJejuTripRequest, mockJejuTripResponse } from "./mock-trip";

describe("createMockTripApiClient", () => {
  it("returns a validated trip response for UI development", async () => {
    const client = createMockTripApiClient();

    await expect(client.generateTrip(mockJejuTripRequest)).resolves.toEqual(
      mockJejuTripResponse,
    );
  });
});
