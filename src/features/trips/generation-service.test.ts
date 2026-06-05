import { describe, expect, it, vi } from "vitest";
import { mockJejuTripRequest, mockJejuTripResponse } from "./mock-trip";
import { createTripGenerationService } from "./generation-service";

function createDependencies() {
  return {
    createRequestId: () => "req_test_123",
    now: vi
      .fn()
      .mockReturnValueOnce(new Date("2026-06-05T00:00:00.000Z"))
      .mockReturnValueOnce(new Date("2026-06-05T00:00:00.125Z")),
    logger: {
      info: vi.fn(),
      error: vi.fn(),
    },
  };
}

describe("createTripGenerationService", () => {
  it("returns a validated itinerary and success timing log", async () => {
    const dependencies = createDependencies();
    const service = createTripGenerationService({
      ...dependencies,
      generate: async () => mockJejuTripResponse,
    });

    const result = await service.generate(mockJejuTripRequest);

    expect(result).toEqual({
      status: 200,
      body: mockJejuTripResponse,
    });
    expect(dependencies.logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "trip_generation_succeeded",
        requestId: "req_test_123",
        responseTimeMs: 125,
      }),
    );
  });

  it("returns 400 and does not call the generator for invalid input", async () => {
    const dependencies = createDependencies();
    const generate = vi.fn();
    const service = createTripGenerationService({
      ...dependencies,
      generate,
    });

    const result = await service.generate({
      ...mockJejuTripRequest,
      budgetPerPerson: 0,
    });

    expect(result).toEqual({
      status: 400,
      body: {
        errorCode: "INVALID_REQUEST",
        message: "입력값을 확인해주세요.",
        requestId: "req_test_123",
      },
    });
    expect(generate).not.toHaveBeenCalled();
  });

  it("returns 500 with a safe message when generation fails", async () => {
    const dependencies = createDependencies();
    const service = createTripGenerationService({
      ...dependencies,
      generate: async () => {
        throw new Error("secret provider failure");
      },
    });

    const result = await service.generate(mockJejuTripRequest);

    expect(result).toEqual({
      status: 500,
      body: {
        errorCode: "GENERATION_FAILED",
        message: "일정을 생성하지 못했습니다. 잠시 후 다시 시도해주세요.",
        requestId: "req_test_123",
      },
    });
    expect(dependencies.logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "trip_generation_failed",
        requestId: "req_test_123",
        failureCode: "GENERATION_FAILED",
      }),
    );
  });
});
