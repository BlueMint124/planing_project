import { NextResponse } from "next/server";
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
};

function createGenerator() {
  if (process.env.DEMO_MODE === "true") {
    return async () => mockJejuTripResponse;
  }

  return createLiveTripGenerator({
    env: process.env,
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
