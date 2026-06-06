import type { TripGenerationRequest, TripGenerationResponse } from "./contracts";

interface FallbackTripGeneratorLogger {
  warn(entry: Record<string, unknown>): void;
}

interface FallbackTripGeneratorOptions {
  primary(request: TripGenerationRequest): Promise<TripGenerationResponse>;
  fallback(request: TripGenerationRequest): TripGenerationResponse;
  timeoutMs?: number;
  logger: FallbackTripGeneratorLogger;
}

function createTimeout(timeoutMs: number) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return {
    promise: new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`Live trip generation timed out after ${timeoutMs}ms.`));
      }, timeoutMs);
    }),
    clear() {
      clearTimeout(timeoutId);
    },
  };
}

function getErrorReason(error: unknown) {
  return error instanceof Error ? error.message : "Unknown live generation error.";
}

export function createFallbackTripGenerator({
  primary,
  fallback,
  timeoutMs = 30_000,
  logger,
}: FallbackTripGeneratorOptions) {
  return async (
    request: TripGenerationRequest,
  ): Promise<TripGenerationResponse> => {
    const timeout = createTimeout(timeoutMs);

    try {
      return await Promise.race([primary(request), timeout.promise]);
    } catch (error) {
      logger.warn({
        event: "trip_generation_fallback_used",
        reason: getErrorReason(error),
        destination: request.destination,
      });

      return fallback(request);
    } finally {
      timeout.clear();
    }
  };
}
