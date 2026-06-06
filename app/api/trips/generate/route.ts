import { NextResponse } from "next/server";
import { createFallbackTripGenerator } from "@/src/features/trips/fallback-trip-generator";
import { createTripGenerationService } from "@/src/features/trips/generation-service";
import { createLiveTripGenerator } from "@/src/features/trips/live-trip-generator";
import { mockJejuTripResponse } from "@/src/features/trips/mock-trip";

function createRequestId() {
  return `req_${crypto.randomUUID()}`;
}

const logger = {
  info(entry: Record<string, unknown>) {
    console.info(entry);
  },
  error(entry: Record<string, unknown>) {
    console.error(entry);
  },
  warn(entry: Record<string, unknown>) {
    console.warn(entry);
  },
};

function getLiveGenerationTimeoutMs() {
  const timeoutMs = Number(process.env.LIVE_GENERATION_TIMEOUT_MS ?? 30_000);
  return Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 30_000;
}

function createGenerator() {
  if (process.env.DEMO_MODE === "true") {
    return async () => mockJejuTripResponse;
  }

  return createFallbackTripGenerator({
    primary: createLiveTripGenerator({
      env: process.env,
    }),
    fallback: () => mockJejuTripResponse,
    timeoutMs: getLiveGenerationTimeoutMs(),
    logger,
  });
}

export async function POST(request: Request) {
  const service = createTripGenerationService({
    generate: createGenerator(),
    createRequestId,
    now: () => new Date(),
    logger,
  });

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const result = await service.generate(body);

  return NextResponse.json(result.body, { status: result.status });
}
