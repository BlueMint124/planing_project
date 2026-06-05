import { afterEach, describe, expect, it, vi } from "vitest";
import { mockJejuTripRequest, mockJejuTripResponse } from "@/src/features/trips/mock-trip";
import { POST } from "./route";

function createRequest(body: unknown) {
  return new Request("http://localhost/api/trips/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/trips/generate", () => {
  it("returns the validated 제주 itinerary in demo mode", async () => {
    vi.stubEnv("DEMO_MODE", "true");
    vi.spyOn(console, "info").mockImplementation(() => undefined);

    const response = await POST(createRequest(mockJejuTripRequest));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(mockJejuTripResponse);
  });

  it("returns 400 for invalid input", async () => {
    vi.stubEnv("DEMO_MODE", "true");
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await POST(
      createRequest({
        ...mockJejuTripRequest,
        groupSize: 1,
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        errorCode: "INVALID_REQUEST",
        message: "입력값을 확인해주세요.",
        requestId: expect.any(String),
      }),
    );
  });

  it("returns 500 when live generation is not configured", async () => {
    vi.stubEnv("DEMO_MODE", "false");
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await POST(createRequest(mockJejuTripRequest));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        errorCode: "GENERATION_FAILED",
        requestId: expect.any(String),
      }),
    );
  });
});
